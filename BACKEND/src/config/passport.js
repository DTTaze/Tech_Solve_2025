const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userService = require("../service/userService");
// const path = require("path");
// const envPath = path.resolve(__dirname, "../../../.env");
require("dotenv").config();

console.log("\x1b[33m%s\x1b[0m","config/passport.js");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(accessToken);
        const user = await userService.findOrCreateUser(profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userService.getUserByID(id);
  done(null, user);
});

module.exports = passport;
