const passport =require("passport")
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const googleAuth = (req,res) => {
    passport.serializeUser(function (user, done){
        done(null, user)
    })
    
    passport.deserializeUser(function(user,done){
        done(null, user)
    })
    
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        // This is where you would find or create a user in your database
        // For simplicity, we are using the profile object
        return done(null, profile);
      }
    ));
}

module.exports = googleAuth