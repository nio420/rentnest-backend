import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../../config";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google_client_id,
      clientSecret: config.google_client_secret,
      callbackURL: config.google_callback_url,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          profilePhoto: profile.photos?.[0]?.value,
        };

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    },
  ),
);

export default passport;
