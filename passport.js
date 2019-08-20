var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
var Account = require('./models/account')
const bcrypt = require('bcryptjs')
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
var jwtSecret = require('./jwtConfig')


// module.exports = () => {
//   passport.use(
//     new LocalStrategy(
//       (username, password, done) => {
//         Account.findOne({ username: username }, (err, user) => {
//           if (err) {
//             return done(err)
//           }
//           if (!user) {
//             return done(null, false, { message: 'Incorrect username.' })
//           }
//           bcrypt.compare(password, user.password, (err, isMatch) => {
//             if (err) {
//               throw err
//             }
//             if (isMatch) {
//               return done(null, user)
//             } else {
//               return done(null, false, { message: 'Incorrect password.' })
//             }
//           })
//         })
//       }
//     ))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    (username, password, done) => {
      var check = []
      try {
        Account.findOne({
          username: username,
        }).then(user => {
          if (user === null) {
            check.push('username')
            done(null, false, { message: 'username' })
          }
          bcrypt.compare(password, user.password)
            .then(response => {
              if (response !== true) {
                check.push('password')
                done(null, false, { message: 'password' })
              }
              return done(null, user);
            })
        })
      } catch (err) {
        done(err);
      }
    },
  ),
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: jwtSecret.secret
};

passport.use(
  'jwt',
  new JWTStrategy(opts, (jwt_payload, done) => {
    try {
      Account.findOne({
        where: {
          id: jwt_payload._id,
        },
      }).then(user => {
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      });
    } catch (err) {
      done(err);
    }
  }),
);