import { Request, Response } from "express";
import { verifyPassword } from "../configs/bcrypt.config";
import { IUser } from "../models/user.mongo";
import UsersService from "../services/users.service";
import { delResponse, getResponse, setResponse } from "../services/redis.service";
import { otp } from "../utils/otpGenerator";
import { sendToEmail } from "../services/email.service";
import { checkOtpPhone, sendToPhone } from "../services/phone.service";
import { secretToken, verifySecretToken } from "../configs/jwt.config";
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
    const userDAO = new UsersService();
    const param = req.body as IUser;

    try {
      const user = await userDAO.getUser(param.email);

      if (!user) {
        await new UsersService().createUser(param)
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
      const { oldPassword, newPassword, confirmPassword } = req.body
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

      if (oldPassword === newPassword) {
        throw new Error(`Pls Enter New Password different with Old Password!`)
      }

      if (newPassword !== confirmPassword) {
        throw new Error(`New Password and Confirm Password not match!`)

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


  async httpForgotPasswordPage(req: Request, res: Response) {
    try {
      const errorMessage = req.flash('error');

      res.render("forgot-password",
        { title: 'Forgot password', errorMessage });

    } catch (error) {
      if (error instanceof Error)
        return res.send(error.message)

    }
  }
  async httpOTPPage(req: Request, res: Response) {
    try {
      const errorMessage = req.flash('error');

      res.render("enter-otp",
        { title: 'OTP', errorMessage });

    } catch (error) {
      if (error instanceof Error)
        return res.send(error.message)

    }
  }

  async httpResetPasswordPage(req: Request, res: Response) {
    try {
      const errorMessage = req.flash('error');

      res.render("enter-new-password",
        { title: 'Reset Password', errorMessage });

    } catch (error) {
      if (error instanceof Error)
        return res.send(error.message)

    }
  }


  async httpSendOTP(req: Request, res: Response) {
    let email = req.body.email;
    let phone = req.body.phone;
    const notRender = req.body.notRender;
    const array: string[] = []
    const userService = new UsersService()
    let token = null
    const tokenCookie = req.cookies.token
    try {
      if (tokenCookie && !email && !phone) {
        const decode = verifySecretToken(tokenCookie)
        if (decode?.strategy.includes("@")) {
          email = decode.strategy
        } else {
          phone = decode?.strategy

        }
      }
      //email or phone was registration 
      const user = await userService.getUser(email || phone)



      if (user) {
        if (email && !phone) {
          const otpService = otp()
          await sendToEmail(email, otpService)
          token = secretToken(email, '')
          array.push(otpService);
          await delResponse(email)
        }

        if (phone && !email) {
          const x = (await sendToPhone(phone)).serviceSid
          token = secretToken(phone, '')
          array.push(x);
          await delResponse(phone)

        }
        if (token) {
          array.push(token);
          await setResponse(email || phone, array)
        }
      }

      if (!notRender)
        return res.cookie("token", token, {
          httpOnly: true,
        }).redirect('/auth/forgot-password/otp/page');

      return res.status(200)
        .cookie("token", token, {
          httpOnly: true,
        }).send({ token })


    } catch (error) {
      if (error instanceof Error) {
        req.flash('error', error.message);
        return res.redirect('/auth/forgot-password/page')
      }
    }

  }



  async httpVerifyOtp(req: Request, res: Response) {
    const { otp } = req.body
    const token = req.cookies.token;
    let secretKey = null;
    try {

      const decoded = verifySecretToken(token)
      if (!decoded) throw new Error('Decode failed')
      const rawToken = await getResponse(decoded.strategy)

      if (!rawToken) throw new Error('Cant not parse Token')
      const redisToken = JSON.parse(rawToken)
      if (token !== redisToken[1]) throw new Error('Invalid Token')

      if (decoded.strategy.includes('@')) {
        if (!(redisToken[0] === otp))
          throw new Error('Invalid OTP')
        else
          secretKey = secretToken(decoded.strategy, otp)

      } else if (decoded.strategy.includes('+')) {
        console.log(decoded.strategy);
        
        const checkOtp = await checkOtpPhone(otp, decoded.strategy)
        if (!(checkOtp.status === 'approved'))
          throw new Error('Invalid OTP')
        else
          secretKey = secretToken(decoded.strategy, checkOtp.accountSid)
      } else {
        throw new Error('Invalid Strategy')
      }


      //store the secret to redis
      const queryToken = [...redisToken]
      queryToken[1] = secretKey
      await delResponse(decoded.strategy)
      await setResponse(decoded.strategy, queryToken)
      return res.cookie("token", secretKey, {
        httpOnly: true,
      }).redirect('/auth/forgot-password/reset-password/page')
    } catch (error) {
      if (error instanceof Error) {
        req.flash('error', error.message);
        return res.redirect('/auth/forgot-password/otp/page')
      }
    }

  }

  async httpNewPassword(req: Request, res: Response) {
    const { newPassword } = req.body
    const token = req.cookies.token;

    const userService = new UsersService()
    try {
      const decoded = verifySecretToken(token)
      if (!decoded) throw new Error('Decode failed')
      const rawToken = await getResponse(decoded.strategy)

      if (!rawToken) throw new Error('Cant not parse Token')
      const redisToken = JSON.parse(rawToken)
      console.log(redisToken[1] == token);

      if (token !== redisToken[1]) throw new Error('Invalid Token')

      if (decoded.strategy)
        await userService.updateUserPasswordByOr(decoded.strategy, newPassword)

      await delResponse(decoded.strategy)
      return res.clearCookie("token").redirect('/auth/login/page')

    } catch (error) {
      if (error instanceof Error) {
        req.flash('error', error.message);
        return res.redirect('/auth/forgot-password/reset-password/page')
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
      req.session.passport.user.profile.phone = req.body.phone


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
