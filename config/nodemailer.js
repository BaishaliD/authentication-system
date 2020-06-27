const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'godfrey.nolan37@ethereal.email',
        pass: 'dBfy4mYqpK28xqBBfn'
    }
});
