import { Request, Response } from "express";
import { verifyPassword } from "../configs/bcrypt.config";
import { UserToken } from "../configs/session.config";
import { IUser } from "../models/user.mongo";
import { default as UsersDAO, default as UsersService } from "../services/users.service";

class AuthController {
  async httpLoginPage(req: Request, res: Response) {
    try {
      res.render("login", {
        title: "Login",
      });
    } catch (error) {
      return res.send("error");
    }
  }



  public async httpLogout(req: Request, res: Response) {
    req.session.destroy(() => { res.redirect('/auth/login/page'); });
  }

  async httpRegistrationPage(req: Request, res: Response) {
    try {
      res.render("registration", { title: 'Registration page' });
    } catch (error) {
      return res.send("error");
    }
  }
  async httpRegistration(req: Request, res: Response) {
    // const errors = validationResult(req);
    const userDAO = new UsersDAO();
    const param = req.body as IUser;

    try {
      const user = await userDAO.getUser(param.email);

      if (!user) {
        await new UsersDAO().createUser(param)
        return res.redirect('/auth/login/page');
      } else {
        return res.status(400).send('That email already exisits!');
      }
    } catch (error) {
      return res.send(error as Error);
    }
  }

  async httpChangePassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body
      const userService = new UsersService()

      const user: IUser | null = await userService.getUser(req.session.passport.user.profile.email);
      if (!user) throw new Error(`User ${user}`)

      const havePassword = user.password.length > 0

      if (havePassword) {
        const isMatch = await verifyPassword(oldPassword, user.password)


        if (!isMatch) {
          throw new Error(`invalid password`)
        }
      }



      await userService.updateUserPassword(req.session.passport.user.profile._id, newPassword)

      req.session.destroy(() => { return res.redirect('/auth/page/login'); });
    } catch (err) {
      if (err instanceof Error)
        return res.send(err.message)
    }
  }

  async httpProfilePage(req: Request, res: Response) {
    const userId = req.session.passport;
    const userService = new UsersService()
    const user: IUser | null = await userService.getUser(req.session.passport.user.profile.email);
    if (!user) throw new Error('User not found')
    let havePassword = user.password.length > 0

    res.render('profile', { userId: userId.user.profile._id, title: "Profile Page", havePassword, });
  }
  async httpUpdateProfile(req: Request, res: Response) {
    try {

      await new UsersService().updateUserById(req.body.userId.id, req.body)
      req.session.passport.user.profile.yob = req.body.yob
      req.session.passport.user.profile.name = req.body.name
      req.session.passport.user.profile.email = req.body.email

      res.redirect("/auth/profile/page")

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('dup key')) {
          return res.send("Email is already in use")

        }
      }
    }

  }

}

export default AuthController;
