// Mailing options
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "practicejsinvite@gmail.com",
        pass: "practice2017"
    }
});

module.exports = {
    mailOptions:{
        from: 'practicejsinvite@gmail.com',
        subject: 'Invite to event'
    },
    mailer: transporter
}