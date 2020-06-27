const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use Google strategy
passport.use(new googleStrategy({
    clientID: '426537625128-dlka14d99jutfdl13msmb3p22a6bngh1.apps.googleusercontent.com',
    clientSecret: 'mKgIlhYaqJOuQ-nJ1EgZ9tTr',
    callbackURL: 'http://localhost:8000/auth/google/callback'
},

    function (accessToken, refreshToken, profile, done) {

        User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
            if (err) {
                console.log('Error in google strategy passport', err);
                return;
            }

            console.log(profile);

            if (user) {
                //if user is found, set this user as req.user
                return done(null, user);
            }
            else {

                //if user not found, create the user and set this user as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function (err, user) {
                    if (err) {
                        console.log('Error in creating user via google strategy passport', err);
                        return;
                    }

                    return done(null, user);
                })
            }
        })
    }
));


module.exports = passport;