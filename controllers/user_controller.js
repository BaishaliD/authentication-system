const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const resetPasswordMailer = require('../mailers/password-reset');
const Token = require('../models/token');

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


    //if Password and Confirm Password doesn't matches, check if email id already exists in DB

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log(`Error in finding user during Sign up: ${err}`);
            return;
        }

        //If email doesn't exist in DB, create a new user and redirect to Sign in page
        if (!user) {



            if (req.body.password != req.body.confirm_password) {

                req.flash('error', "Passwords don't match. Try again.");
                return res.redirect('back');
            }



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

                        req.flash('success', 'New account created.');
                        return res.redirect('/sign-in');
                    })

                });
            });

        }

        //If email already exists in DB, redirect to Sign in page
        else {
            req.flash('error', 'Email already exists. Sign up using another email or go to Sign in page.');
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

//sign out user after changing password
module.exports.passwordChanged = function (req, res) {

    req.logout();
    req.flash('success', 'Password changed. Please log in again with the new password.');
    return res.redirect('/sign-in');

};

//reset password

module.exports.resetPassword = function (req, res) {

    return res.render('reset');
};

module.exports.updateDB = function (req, res) {


    let hash = req.user.password;
    let myPlaintextPassword = req.body.old_password;

    bcrypt.compare(myPlaintextPassword, hash, function (err, result) {


        if (!result) {

            req.flash('error', 'Old password is incorrect.');
            return res.redirect('back');
        }

        else if (req.body.new_password != req.body.confirm_password) {

            req.flash('error', 'Please confirm new password again.');
            return res.redirect('back');
        }

        else {


            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.new_password, salt, function (err, hash) {

                    // Store hash in your password DB.

                    User.updateOne(
                        { email: req.user.email },
                        { $set: { password: hash } }, function (err) {
                            console.log("password changed");                            
                            return res.redirect('/password-changed');
                        });

                });
            });

        }

    });

};



module.exports.forgotPassword = function (req, res) {

    return res.render('reset');
}

module.exports.resetPassword = function (req, res) {
    

    User.findOne({email: req.body.email},function(err,user){
        
        if(!user){
            req.flash('error','You have not registered yet.');
            return res.redirect('back');
        }

        resetPasswordMailer.passwordReset(req.body);
        req.flash('success','Recovery mail sent.');
        return res.redirect('/sign-in');

    })  

    

}

module.exports.renderResetPage = function (req, res) {

    res.render('reset_page');
}

module.exports.forgotPasswordReset = function (req, res) {

    if (req.body.new_password != req.body.confirm_password) {
        req.flash('error', 'Password mismatch. Please try again.');
        return res.redirect('back');
    }

    Token.findOne({ access_token: req.body.token }, function (err, data) {

        if(!data){
            req.flash('error','Token expired');
            return res.redirect('back');
        }

        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(req.body.new_password, salt, function (err, hash) {

                // Store hash in your password DB.

                
                User.updateOne(
                    { email: data.emailId },
                    { $set: { password: hash } }, function (err) {
                        
                        if(err){
                            console.log('error in deleting token');
                            return;
                        }
                        
                        Token.deleteOne({access_token: req.body.token}, function(err){
                            return res.redirect('/password-changed');
                        });

                        
                    });

            });
        });


    })



}