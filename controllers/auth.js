const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = "net ninja secret";
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const mailgun = require("mailgun-js");
require('dotenv').config();
JWT_SECRET = 'net ninja secret';




exports.forgotPassword = (req, res) => {
    const { googleId } = req.body;

    User.findOne({ googleId }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "User with this email already exists" })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '20m' });
        const data = {
            from: 'noreply@wonderfuldirect.com',
            to: googleId,
            subject: 'Forgot password Link',
            html: `
                <h2>Please click on this link to reset your password</h2>
                <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
            `
        };
        return user.updateOne({ resetLink: token }, function(err, success) {
            if (err) {
                return res.status(400).json({ error: "reset password link error" })
            } else {
                mg.messages().send(data, function(error, body) {
                    if (error) {
                        return res.json({
                            error: err.message
                        })
                    }
                    return res.json({ message: 'Reset email has been sent, kindly follow instruction' });
                });
            }
        })
    })
}