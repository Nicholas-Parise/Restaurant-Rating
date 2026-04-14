require("dotenv").config();
const { convert } = require('html-to-text');

const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

const sesClient = new SESv2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  SES: { sesClient, SendEmailCommand },
});


const sendEmail = async (to, subject, text, html) => {

  const finalText = text || convert(html);

  await transporter.sendMail({
    from: "Deglazd Support Team <support@mail.deglazd.com>",
    to,
    subject,
    text: finalText,
    html,
  });

};
module.exports = sendEmail;