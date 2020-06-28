const nodeMailer = require('../config/nodemailer');
const User = require('../models/user');
const Token = require('../models/token');
const crypto = require('crypto');
const token = require('../models/token');

exports.passwordReset = (user) => {

    let acc_token = crypto.randomBytes(20).toString('hex');
    let url = 'http://localhost:8000/reset?token='+acc_token;

    Token.create({
        emailId: user.email,
        access_token: acc_token
    }, function (err) {
        if (err) {
            console.log(`Error in populating token schema: ${err}`);
            return;
        }

        let htmlString = nodeMailer.renderTemplate({user:user,acc_token: url},'/password_reset.ejs');
        
        nodeMailer.transporter.sendMail({
            from: 'tin.sept20@gmail.com',
            to: user.email,
            subject: "Get new password",
            html: htmlString
        }, (err, info) => {
            if (err) {
                console.log('error in sending mail', err);
            }

            console.log('mail delivered', info);
            return;
        })

        
      });


    }