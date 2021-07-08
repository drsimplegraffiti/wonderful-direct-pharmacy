const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');


const auth = {
    auth: {
        api_key: '692a747d805c302fb35852a6a5bbd123-c4d287b4-5c290972',
        domain: 'sandboxe8f8aaf65b2241f69398f1eb9a3887bc.mailgun.org'
    }
};


const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email, password) => {
    const mailOptions = {
        from: email,
        to: 'abayomiogunnusi@gmail.com',
        subject: 'New User Just Signed Up into Precious pharmacy',
        text: password
    }


    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log('Error occurs')
        } else {
            console.log('message sent')
        }
    });
}

module.exports = sendMail;