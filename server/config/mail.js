var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'mail.cs.karelia.ru',
    port: 25
});

module.exports = {
    mailOptions:{
        from: 'chernyae@cs.karelia.ru',
        subject: 'Invite to event'
    },
    mailer: transporter
}