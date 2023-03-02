import express from "express";
import AuthController from "./auth.controller";
import passportConfig from "../configs/passport.config";
import { checkLoggedIn } from "../middleware/auth.middleware";
const authRouter = express.Router();
const authController = new AuthController();
authRouter.use((req, res, next) => {
  res.statusCode = 200;
  next();
});



authRouter.get("/login/page", authController.httpLoginPage);
authRouter.get("/registration/page", authController.httpRegistrationPage);


authRouter.post("/login", passportConfig.authenticate('local',
  { failureRedirect: '/auth/login/page', session: true, failureFlash: true }), (req, res) => {
    const isAdmin = req.session.passport.user.profile.isAdmin
    if (isAdmin) {
      return res.redirect('/admin/dashboard');
    }
    return res.redirect('/')
  })
authRouter.post("/registration", authController.httpRegistration);
authRouter.get("/logout", authController.httpLogout);



authRouter.get("/google", passportConfig.authenticate('google', {
  scope: ['profile', 'email'], accessType: 'offline'

}))
authRouter.get("/google/callback", passportConfig.authenticate('google', {
  failureRedirect: '/failure', session: true
}), (req, res) => {
  const isAdmin = req.session.passport.user.profile.isAdmin
  if (isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  return res.redirect('/')
})



authRouter.use(checkLoggedIn)

authRouter.get('/profile/page', authController.httpProfilePage);

authRouter.put('/profile', authController.httpUpdateProfile);

authRouter.put('/changePassword', authController.httpChangePassword);


authRouter.get('/failure', (req, res) => {
  return res.send('Failed to log in!');
});

export default authRouter;
