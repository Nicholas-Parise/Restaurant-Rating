require("dotenv").config();

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY
});

const sendEmail = async (to, subject, text, html = null) => {

  const data = {
    from: "TBD Support Team <support@mail.TBD.ca>",
    to,
    subject,
    html: html || text,
  };

  //console.log(data);
  const res = await mg.messages().create(process.env.MAILGUN_DOMAIN, data);

  console.log(res);

  // if it doesn't send it will throw error
  /*
  console.log(data); // logs response data
} catch (error) {
  console.log(error); //logs any error
}
  */
};
module.exports = sendEmail;