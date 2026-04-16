require("dotenv").config();
const { convert } = require('html-to-text');
const db = require('../utils/db');


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

  to = to.toLowerCase().trim();

  if(!(await canSend(to))){
    throw new Error("Email could not be sent");
  }

  await transporter.sendMail({
    from: "Deglazd Support Team <support@mail.deglazd.com>",
    to,
    subject,
    text: finalText,
    html,
  });

};


async function canSend(to){

  const result = await db.query('SELECT email, status, retry_count, updated FROM email_suppression WHERE email = $1;', [to]);

  if(result.rows.length === 0){
    return true;
  }

  const { status, retry_count, updated } = result.rows[0];

  if (status === 'complained') return false;
  if (status === 'bounced') return false;

  const WAIT_TIME = 10*60*1000; // 10 mins
  const cooldownPassed  = (Date.now() - new Date(updated)) > WAIT_TIME;  //boolean

  if(status === 'temporary' && retry_count < 4 && cooldownPassed ){
      return true;
  }

  return false;
}


module.exports = sendEmail;