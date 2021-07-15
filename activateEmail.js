const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
require('dotenv').config()

//msg
const mg = mailGun({ apiKey: process.env.API_KEY, domain: process.env.DOMAIN });

module.exports = mg;