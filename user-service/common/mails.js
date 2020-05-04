'use strict';

var DOMAIN = 'musicfesti.com';
var api_key = '86af5b9dce9aa6a82b7f02d1044166e4-9ce9335e-89a7cb26';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});


const mailOptions={
    
    from: "info@musicfesti.com",
    headers: {
        "X-Laziness-level": 1000,
        "charset" : 'UTF-8'
    }
}

const sendOTPMail = (otp,mail) => {
    
        mailOptions.subject = "Welcome to Music Fez",
        mailOptions.html = "Welcome to Music Fez. Your OTP is " +otp+ " to register an account. Thanks!";
        mailOptions.to = mail,
        mailgun.messages().send(mailOptions, function (error, body) {
            console.log(body);
        }); 
}

const forgotPassOTPMail = (otp,mail) => {
    console.log(otp);
    mailOptions.subject = "Reset yout Password",
    mailOptions.html = "Your OTP is " +otp+ " to recover your account. Thanks!";
    mailOptions.to = mail,
    mailgun.messages().send(mailOptions, function (error, body) {
        console.log(body);
    });
    
}

const sendInvitationMail = (mail,url) => {
    mailOptions.subject = "Accept invitation!",
    mailOptions.html = "Please click on this link to acccept invitation and set ypur password " +url;
    mailOptions.to = mail,
    mailgun.messages().send(mailOptions, function (error, body) {
        console.log(body);
    });
    
}

module.exports = {
    sendOTPMail,
    forgotPassOTPMail,
    sendInvitationMail
};
