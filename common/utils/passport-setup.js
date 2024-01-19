// passport-setup.js
const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const config = require("../config/configuration");
// const User = require("../../modules/users/Model/user.model");
// const { toAuthJSON } = require("../../modules/users/helpers/utils");
// const { userTypes } = require("../../modules/users/helpers/constants");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: config.GOOGLE_CLIENT_ID,
//       clientSecret: config.GOOGLE_CLIENT_SECRET,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       // let user = await User.findOne({ googleId: profile.id });

//       console.log("profile", profile);
//       // if (!user) {
//       //   user = await User.create({
//       //     googleId: profile.id,
//       //     userName: profile.displayName,
//       //     profileImage: profile.photos[0].value,
//       //     role: userTypes.USER,
//       //   });
//       // }

//       // const dataToken = toAuthJSON(user);
//       // const userData = await User.findOne({
//       //   googleId: profile.id,
//       // }).select("_id, userName , role");
//       // const data = { user: userData, token: dataToken.token };

//       // done(null, data);
//     }
//   )
// );

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: config.FACEBOOK_APP_ID,
//       clientSecret: config.FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       let user = await User.findOne({ facebookId: profile.id });

//       if (!user) {
//         user = await User.create({
//           facebookId: profile.id,
//           userName: profile.displayName,
//           profileImage: profile.photos[0].value,
//           role: userTypes.USER,
//         });
//       }

//       const dataToken = toAuthJSON(user);
//       const userData = await User.findOne({
//         googleId: profile.id,
//       }).select("_id, userName , role");
//       const data = { user: userData, token: dataToken.token };

//       done(null, data);
//     }
//   )
// );

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});