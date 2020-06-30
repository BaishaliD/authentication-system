const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use Google strategy
passport.use(new googleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},

    function (accessToken, refreshToken, profile, done) {

        User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
            if (err) {
                console.log('Error in google strategy passport', err);
                return;
            }


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