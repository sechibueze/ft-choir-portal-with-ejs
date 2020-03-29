const nodemailer = require("nodemailer");
const user = {
  email: ''
}
const option = {
  email: '',
  password: '',
  message: '',
  subject: ''
}
async function sendEmail(user, option) {


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: option.email, // generated ethereal user
      pass: option.password // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: option.email, // sender address
    to: user.email, // list of receivers
    subject: option.subject, // Subject line
    // text: "Hello world?", // plain text body
    html: option.message // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}


sendEmail(user, option)