const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const mailgun = require("mailgun-js");
require('dotenv').config()

const auth = {
    auth: {
        api_key: process.env.API_KEY,
        domain: process.env.DOMAIN
    }
};


const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email, password) => {
    const mailOptions = {
        from: email,
        to: 'drsimplegraffiti@gmail.com',
        subject: 'A new User Just Signed Up into Precious pharmacy Db',
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