var nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')

const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'leo006401@gmail.com',
        pass: 'brvp easj ulag yjum'
    }
});

var mailOptions = {
  from: 'leo006401@gmail.com',
  to: 'leoraj04065@gmail.com',
  subject: 'Send By SH Team',
  html: `<h1>SH Team</h1><p>Your new otp is <b>${otp}</b></p>`,
  attachments: [
    {
      filename: 'demo.txt', 
      path: './demo.txt'
    },
  ]
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});