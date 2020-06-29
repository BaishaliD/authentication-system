const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({

    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'katlyn62@ethereal.email',
        pass: 'WT8vCAMHZgJcrmHfsh'
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
