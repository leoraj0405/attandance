var nodemailer = require('nodemailer');
var randomstring = require("randomstring");

const randomString =  randomstring.generate({
    length: 6
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'leo006401@gmail.com',
        pass: 'howg wzcj zrtz ijyw'
    }
});

var mailOptions = {
  from: 'leo006401@gmail.com',
  to: 'leoraj04065@gmail.com',
  subject: 'Send By SH Team',
  html: `<h1>SH Team</h1><p>Your new password is <b>${randomString}</b></p>`,
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