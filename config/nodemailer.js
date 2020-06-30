const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({

    host: process.env.MAILER_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILER_EMAIL_ID,
        pass: process.env.MAILER_PASSWORD
    }
});

//render reset password email
let renderTemplate = (data,relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('error in rendering template');
                return;
            }

            mailHTML = template;
        }
    )


    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}
