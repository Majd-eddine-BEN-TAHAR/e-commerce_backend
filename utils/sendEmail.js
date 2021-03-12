const nodemailer = require("nodemailer");

/*eslint-env node*/
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailDetails = (token, email) => {
  return {
    from: "e-commerce",
    to: email,
    subject: "Password reset link",
    html: `
    <div>
        <p style="font-size:20px;font-weight:700">hello sir, this is the link to reset your password, it's available only for 1 hour</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
    </div>
    `,
  };
};

const sendEmail = (token, email) => {
  transporter.sendMail(mailDetails(token, email), (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
  });
};
module.exports = { sendEmail };
