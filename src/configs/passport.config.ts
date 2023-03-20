import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import Users, { IUser } from '../models/user.mongo';
import { ENV_CONFIG } from './env.config';
import { generateToken } from './jwt.config';
import { verifyPassword } from './bcrypt.config';
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const passportConfig = passport
passportConfig.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    async (email, password, done) => {
      try {

        const user: IUser | null = await Users.findOne({ email: email });

        if (!user) {
          return done(null, false, { message: 'Invalid username or password' });
        }

        const isMatch = await verifyPassword(password, user.password)

        if (!isMatch) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        const jwtToken = generateToken(user);

        return done(null, { jwtToken, profile: user });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passportConfig.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: ENV_CONFIG.GOOGLE_CLIENT_SECRET || 'default_secret',
    },
    async (jwtPayload, done) => {
      try {
        const user: IUser | null = await Users.findById(jwtPayload.sub);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passportConfig.use(
  new GoogleStrategy(
    {
      clientID: ENV_CONFIG.GOOGLE_CLIENT_ID || '',
      clientSecret: ENV_CONFIG.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {

      try {
        const email = profile.emails && profile.emails[0].value;


        if (!email) {
          return done(null, false, { message: 'Email not found in Google profile' });
        }

        let user: IUser | null = await Users.findOne({ email });

        if (!user) {
          user = await Users.create({
            name: profile.displayName,
            yob: '',
            email,
            password: '',
            isAdmin: false,
          });
        }

        const jwtToken = generateToken(user);

        return done(null, { jwtToken, profile: user });
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

// Save the session to the cookie
passportConfig.serializeUser((user: any, done) => {

  done(null, user);
});

// Read the session from the cookie
passportConfig.deserializeUser(function (user: any, done) {
  // User.findById(id).then(user => {
  //   done(null, user);
  // });
  return done(null, user);
});
export default passportConfig;
