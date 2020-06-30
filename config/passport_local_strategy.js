const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const fetch = require('node-fetch');

//local authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
    //function (req, email, password, done) {
    async function (req, email, password, done) {

        // Verify captcha

        var secret_key = process.env.SECRET_KEY;
        var captcha = req.body['g-recaptcha-response'];
        const captchaVerified = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${captcha}`, {
            method: 'POST'
        }).then(res => res.json());

        //If captcha verification is unsuccessful...
        if (!captchaVerified.success) {
            req.flash('error', 'Captcha not verified.');
            return done(null, false);
        }

        //If captcha verification is successful...
        else {
            //find a user and establish the identity
            User.findOne({ email: email }, function (err, user) {
                if (err) {

                    req.flash('error', err);
                    console.log(`Error in finding user: Passport: ${err}`);
                    return done(err);
                }

                //if user is not found/ password doesn't match
                if (!user) {

                    req.flash('error', 'Incorrect username/password.');
                    return done(null, false);
                }


                //compare hashed password

                let hash = user.password;
                let myPlaintextPassword = req.body.password;
                bcrypt.compare(myPlaintextPassword, hash, function (err, result) {


                    if (!result) {

                        req.flash('error', 'Incorrect username/password');
                        return done(null, false);
                    }

                    return done(null, user);

                });
                
            });

        }

    }
));

//serialize the user to decide which key should be kept in the cookie
passport.serializeUser(function (user, done) {
    //store user's id in encrypted format in the cookie
    done(null, user.id);
});

//deserialize the user from the key in the cookie
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {
            console.log("Error in deserializing");
            return done(err);
        }

        return done(null, user);
    })
});

//check if user is authenticated
passport.checkAuthentication = function (req, res, next) {

    //if user is signed in, pass on the request to the next function
    if (req.isAuthenticated()) {
        return next();
    }

    //if user is not signed in, redirect to sign in page
    return res.redirect('/sign-in');
}

passport.setAuthenticatedUser = function (req, res, next) {

    //if user is authenticated, send the user information to the locals so that it can be displayed in views

    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;