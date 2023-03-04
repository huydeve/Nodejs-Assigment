import { Request, Response } from "express";
import { verifyPassword } from "../configs/bcrypt.config";
import { IUser } from "../models/user.mongo";
import { default as UsersDAO, default as UsersService } from "../services/users.service";

class AuthController {
  async httpLoginPage(req: Request, res: Response) {
    try {
      const errorMessage = req.flash('error');
      res.render("login", {
        title: "Login",
        errorMessage
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
      const errorMessage = req.flash('error');

      res.render("registration", { title: 'Registration page', errorMessage });
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
        req.flash('error', 'That email already exisits!');
        return res.redirect('/auth/registration/page');

      }
    } catch (error) {
      if (error instanceof Error)
        req.flash('error', error.message);
        return res.redirect('/auth/registration/page');

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
          throw new Error(`Password is not correct!`)
        }
      }

      if(oldPassword === newPassword ) {  
        throw new Error(`Pls Enter New Password different with Old Password!`)

      }


      await userService.updateUserPassword(req.session.passport.user.profile._id, newPassword)

      req.session.destroy(() => { return res.redirect('/auth/page/login'); });
    } catch (err) {
      if (err instanceof Error) {
        req.flash('error', err.message);
        return res.redirect('/auth/profile/page')

      }
    }
  }

  async httpProfilePage(req: Request, res: Response) {
    const userId = req.session.passport;
    const userService = new UsersService()
    const user: IUser | null = await userService.getUser(req.session.passport.user.profile.email);
    if (!user) throw new Error('User not found')
    let havePassword = user.password.length > 0
    const errorMessage = req.flash('error')
    return res.render('profile', { userId: userId.user.profile._id, title: "Profile Page", havePassword, errorMessage });
  }
  async httpUpdateProfile(req: Request, res: Response) {
    try {

      await new UsersService().updateUserById(req.body.userId.id, req.body)
      req.session.passport.user.profile.yob = req.body.yob
      req.session.passport.user.profile.name = req.body.name
      req.session.passport.user.profile.email = req.body.email


    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('dup key')) {
          req.flash('error', "Email is already in use")
        }

      }
    } finally {
      return res.redirect("/auth/profile/page")

    }

  }

}

export default AuthController;
