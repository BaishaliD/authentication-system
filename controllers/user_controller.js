const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//render profile page
module.exports.profile = function (req, res) {

    return res.render('profile', {
        title: "Profile",
    })
}

//render the Sign up page
module.exports.signUp = function (req, res) {

    //if a user is authenticated(logged in), sign up page cannot be accessed
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    }

    return res.render('user_sign_up', {
        title: "Sign up"
    })
};

//render the Sign in page
module.exports.signIn = function (req, res) {

    console.log("SIGN IN", req.cookies);

    //if a user is authenticated(logged in), sign in page cannot be accessed
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    }

    return res.render('user_sign_in', {
        title: "Sign in"
    })
};

//get the sign up data
module.exports.createUser = function (req, res) {


    //if Password and Confirm Password doesn't match redirect to Sign up page
    if (req.body.password != req.body.confirm_password) {

        return res.redirect('back');
    }

    //if Password and Confirm Password doesn't matches, check if email id already exists in DB

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log(`Error in finding user during Sign up: ${err}`);
            return;
        }

        //If email doesn't exist in DB, create a new user and redirect to Sign in page
        if (!user) {

            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    // Store hash in your password DB.


                    User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    }, function (err, user) {
                        if (err) {
                            console.log(`Error in creating user during Sign up: ${err}`);
                            return;
                        }
                        return res.redirect('/sign-in');
                    })

                });
            });


            // User.create(req.body, function(err,user){
            //     if(err){
            //         console.log(`Error in creating user during Sign up: ${err}`);
            //         return;
            //     }
            //     return res.redirect('/sign-in');
            // })


        }

        //If email already exists in DB, redirect to Sign up page
        else {
            return res.redirect('back');
        }
    })
};

//get the sign in data
module.exports.createSession = function (req, res) {

    return res.redirect('/profile');
};


//sign out user
module.exports.signOut = function (req, res) {

    req.logout();
    req.flash('success', 'Logged out');
    return res.redirect('/sign-in');

};

//reset password

module.exports.resetPassword = function (req, res) {

    let token = crypto.randomBytes(20).toString('hex');

    return res.render('reset');
};

module.exports.updateDB = function (req, res) {

    console.log("wooohoooo", req.user);

    let hash = req.user.password;
    let myPlaintextPassword = req.body.old_password;

    bcrypt.compare(myPlaintextPassword, hash, function (err, result) {

        console.log(result);

        if (!result) {
            req.flash('error', 'Incorrect password');
            return;
        }

        else if (req.body.new_password != req.body.confirm_password) {
            console.log(2);
            req.flash('error', 'Incorrect password');
            return;
        }

        else {
            // User.update(
            //     {email: req.user.email},
            //     {$set: {password : req.body.new_password}},function(err){
            //         return res.redirect('/sign-out');
            //     });


            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.new_password, salt, function (err, hash) {

                    // Store hash in your password DB.

                    User.update(
                        { email: req.user.email },
                        { $set: { password: hash } }, function (err) {
                            return res.redirect('/sign-out');
                        });

                });
            });













        }

    });




    // if(req.body.old_password != req.user.password){
    //     console.log(1);
    //     req.flash('error', 'Incorrect password');
    //     return;
    // }
    // else if(req.body.new_password != req.body.confirm_password){
    //     console.log(2);
    //     req.flash('error', 'Incorrect password');
    //     return;
    // }

    // console.log(req.user.email);
    // console.log(3);

    // User.update(
    //     {email: req.user.email},
    //     {$set: {password : req.body.new_password}},function(err){
    //         return res.redirect('/sign-out');
    //     });

};