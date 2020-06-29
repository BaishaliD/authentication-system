const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const resetPasswordMailer = require('../mailers/password-reset');
const Token = require('../models/token');

//render profile page
module.exports.profile = function (req, res) {

    return res.render('profile', {
        title: "Authentication | Profile",
    })
}

//render the Sign up page
module.exports.signUp = function (req, res) {

    //if a user is authenticated(logged in), sign up page cannot be accessed
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    }

    return res.render('user_sign_up', {
        title: "Authentication | Sign Up"
    })
};

//render the Sign in page
module.exports.signIn = function (req, res) {

    //if a user is authenticated(logged in), sign in page cannot be accessed
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    }

    return res.render('user_sign_in', {
        title: "Authentication | Sign In"
    })
};

//Get the sign up data for creating a new account

module.exports.createUser = function (req, res) {


    //Check if email id of user already exists in DB

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log(`Error in finding user during Sign up: ${err}`);
            return;
        }

        //If email doesn't exist in DB :

        if (!user) {

            //Check if Password and Confirm Password fields entered by user matches. In case of mismatch, send a flash message and redirect back
            if (req.body.password != req.body.confirm_password) {

                req.flash('error', "Passwords don't match. Try again.");
                return res.redirect('back');
            }

            //If Password and Confirm password matches, create a new user and store the user's information in the DB
            //Use the bcrypt package to hash the password entered by the user before storing it in DB

            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {

                    // Create a new document in the User collection with the name, email and hashed password of the user

                    User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    }, function (err, user) {
                        if (err) {
                            console.log(`Error in creating user during Sign up: ${err}`);
                            return;
                        }

                        //Generate a flash message to confirm account creation, and redirect to the sign in page
                        req.flash('success', 'New account created.');
                        return res.redirect('/sign-in');
                    })

                });
            });

        }

        //If email already exists in DB, generate a flash message and redirect to Sign in page
        else {
            req.flash('error', 'Email already exists. Sign up using another email or go to Sign in page.');
            return res.redirect('back');
        }
    })
};

//get the sign in data and open the profile page for the user
module.exports.createSession = function (req, res) {

    return res.redirect('/profile');
};


//Sign out user, display a flash message for successful log out, and redirect to the Sign in page

module.exports.signOut = function (req, res) {

    req.logout();
    req.flash('success', 'Logged out');
    return res.redirect('/sign-in');

};



//Update password in database when user changes it from profile

module.exports.updatePasswordProfile = function (req, res) {

    //To change the password from the profile (without using a recovery email), the user must enter the old password as well. Use bcrypt to check if the old password entered by the user is correct. 

    let hash = req.user.password;
    let myPlaintextPassword = req.body.old_password;

    bcrypt.compare(myPlaintextPassword, hash, function (err, result) {

        //If the old password entered by user doesn't match with the existing password in the DB, generate an error message and redirect back to Profile page

        if (!result) {

            req.flash('error', 'Old password is incorrect.');
            return res.redirect('back');
        }

        //If the old password is correct, but 'New password' and 'Confirm new password' doesn't match, generate an error message and redirect back to Profile page

        else if (req.body.new_password != req.body.confirm_password) {

            req.flash('error', 'Please confirm new password again.');
            return res.redirect('back');
        }

        //If all the passwords are correct, hash the new password and update the password field in the DB with the new password. Generate a success message, and Sign out the user.

        else {


            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.new_password, salt, function (err, hash) {

                    // Update hashed password in the DB

                    User.updateOne(
                        { email: req.user.email },
                        { $set: { password: hash } }, function (err) {                          
                            return res.redirect('/password-changed');
                        });

                });
            });

        }

    });

};


//Sign out user after he changes his password, display a flash message for successful change of password, and redirect to the Sign in page

module.exports.passwordChanged = function (req, res) {

    req.logout();
    req.flash('success', 'Password changed. Please log in again with the new password.');
    return res.redirect('/sign-in');

};




// PASSWORD RECOVERY



//Render the page that sends the recover password email
module.exports.recoverPassword = function (req, res) {

    return res.render('send_recovery_mail',{
        title: "Authentication | Recovery"
    });
}



//Send a password recovery mail to the email address of the user
module.exports.sendRecoveryMail = function (req, res) {    

    //Check if the user exists in the db. If not, generate an error message.
    User.findOne({email: req.body.email},function(err,user){
         console.log('User  ',user);
        if(!user){
            req.flash('error','You have not registered yet.');
            return res.redirect('back');
        }

        //If the user exists in the DB, use nodemailer to send an email,and generate a success message when email is sent. Then redirect to Sign in page

        resetPasswordMailer.passwordReset(user);
        //resetPasswordMailer.passwordReset(req.body);
        req.flash('success','Recovery mail sent.');
        return res.redirect('/sign-in');

    })  
    

};





//Update password in database when user changes it using the recovery email
module.exports.updatePasswordRecovery = function (req, res) {

    // Generate error message if 'new password' and 'confirm password' inputs are don't match
    if (req.body.new_password != req.body.confirm_password) {
        req.flash('error', 'Password mismatch. Please try again.');
        return res.redirect('back');
    }

    //Check if the token generated for password recovery still exists in the DB. If not, generate an error message.
    Token.findOne({ access_token: req.body.token }, function (err, data) {

        if(!data){
            req.flash('error','Token expired');
            return res.redirect('back');
        }

        //If the token has not expired, hash the new password and update it the the DB

        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(req.body.new_password, salt, function (err, hash) {

                User.updateOne(
                    { email: data.emailId },
                    { $set: { password: hash } }, function (err) {
                        
                        if(err){
                            console.log('error in deleting token');
                            return;
                        }
                        
                        //Once a token has been used to change the password, destroy it from the DB even if it's not expired

                        Token.deleteOne({access_token: req.body.token}, function(err){
                            return res.redirect('/password-changed');
                        });

                        
                    });

            });
        });


    });

};


//Render the page to set a new password
module.exports.renderResetPage = function (req, res) {

    
    res.render('set_new_password',{
        title: 'Authentication | Set New Password'
    });
}




