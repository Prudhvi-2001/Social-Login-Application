import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Create user object
  const user = {
    id: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    picture: profile.photos[0].value,
    provider: 'google',
    token: accessToken // In production, generate a JWT token instead
  };
  return done(null, user);
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Create user object
  const user = {
    id: profile.id,
    name: profile.displayName || profile.username,
    email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
    picture: profile.photos?.[0]?.value || `https://github.com/${profile.username}.png`,
    username: profile.username,
    provider: 'github',
    token: accessToken // In production, generate a JWT token instead
  };
  return done(null, user);
}));

