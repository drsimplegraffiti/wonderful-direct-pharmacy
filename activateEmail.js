const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
require('dotenv').config()


//msg
const mg = mailGun({ apiKey: 'ab47c691c59cf8952d4980970d193c29-c4d287b4-161b700c', domain: 'sandbox6c0d58061e6b42558bd962ef8b54d896.mailgun.org' });




module.exports = mg;