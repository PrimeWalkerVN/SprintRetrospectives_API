const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt_secret = require('./config');

const User = require('../models/User');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        process.nextTick(() => {
          User.findOne({ username: username }, (err, user) => {
            if (err) return done(err);

            if (user) {
              return done(
                null,
                false,
                'That email or username is already exists.'
              );
            } else {
              let newUser = new User();
              newUser.username = username;
              newUser.email = req.body.email;
              newUser.password = password;
              newUser.fullName = req.body.fullName;
              newUser.save((err) => {
                if (err) return done(null, false, err);
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
          if (err) return done(err);

          if (!user) return done(null, false, 'Incorrect username.');

          if (!user.validPassword(password))
            return done(null, false, 'Incorrect password.');

          return done(null, user);
        });
      }
    )
  );

  // Passport JWT Strategy
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_secret.secret,
      },
      (jwt_payload, done) => {
        User.findOne({ username: jwt_payload.username }, (err, user) => {
          if (err) return done(err);

          if (user) {
            return done(null, user, {
              message: 'A user was found thanks to the jwt token',
            });
          } else {
            return done(null, false, {
              message: 'No user was found thanks to the jwt token',
            });
          }
        });
      }
    )
  );

  // Passport Facebook Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'emails', 'name'],
      },
      (token, refreshToken, profile, done) => {
        // asynchronous
        process.nextTick(() => {
          User.findOne({ facebookId: profile.id }, (err, user) => {
            if (err) return done(err);

            if (user) {
              return done(null, user);
            } else {
              let newUser = new User();

              newUser.facebookId = profile.id;
              newUser.username = profile.id;
              newUser.token = token;
              newUser.fullName =
                profile.name.givenName +
                ' ' +
                profile.name.middleName +
                ' ' +
                profile.name.familyName;
              newUser.email = profile.emails[0].value;

              newUser.save((err) => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  // Passport Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      (token, refreshToken, profile, done) => {
        process.nextTick(() => {
          User.findOne({ googleId: profile.id }, (err, user) => {
            if (err) return done(err);

            if (user) {
              return done(null, user);
            } else {
              let newUser = new User();

              newUser.googleId = profile.id;
              newUser.username = profile.id;
              newUser.token = token;
              newUser.fullName = profile.displayName;
              newUser.email = profile.emails[0].value;

              newUser.save((err) => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );
};
