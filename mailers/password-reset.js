const nodeMailer = require('../config/nodemailer');
const User = require('../models/user');
const Token = require('../models/token');
const crypto = require('crypto');

//Generate password recovery email
exports.passwordReset = (user) => {

    console.log("passwordReset ",user);

    //Generate a random token and attach it to the reset password link as a query
    let acc_token = crypto.randomBytes(20).toString('hex');
    let url = 'http://localhost:8000/reset?token='+acc_token;

    //Create a new document in the Token schema with the rnadom token and the email id of the user who requested for a password reset. This document auto-expires after 10 minutes.

    Token.updateOne({emailId: user.email},{$set: {access_token: acc_token}},{upsert: true}, function (err) {
        if (err) {
            console.log(`Error in populating token schema: ${err}`);
            return;
        }

        //render the template of the reset password email
        let htmlString = nodeMailer.renderTemplate({user:user,reset_url: url},'/password_reset.ejs');
        
        nodeMailer.transporter.sendMail({
            from: 'katlyn62@ethereal.email',
            to: user.email,
            subject: "Reset password",
            html: htmlString
        }, (err, info) => {
            if (err) {
                console.log('error in sending mail', err);
            }

            console.log('Mail delivered', info);
            return;
        })

        
      });


    }