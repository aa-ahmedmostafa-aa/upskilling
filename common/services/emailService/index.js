const logger = require("../../../common/config/logger");
const sgMail = require("@sendgrid/mail");
const config = require("../../config/configuration");
sgMail.setApiKey(config.sendgrid.apikey);
const nodemailer = require("nodemailer");

const createTransport = async () => {
  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false,
    auth: {
      user: config.SMTP_USER_NAME,
      pass: config.SMTP_PASSWORD,
    },
  });
};

const _sendEmail = async (email, subject, text) => {
  const msg = {
    from: `${config.SMTP_SENDER}`,
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text,
  };
  const transporter = createTransport();
  await transporter.sendMail(msg).then(
    (result) => {
      logger.info(JSON.stringify(result, null, 2));
    },
    (error) => {
      if (error.response) {
        logger.error(JSON.stringify(error.response.body));
        throw new Error(JSON.stringify(error.response.body));
      }
    }
  );
};

const _sendHtmlEmail = async (email, subject) => {
  const msg = {
    to: 'a.moustafa@aydi.com',
    from: `${config.SMTP_SENDER}`,
    subject: subject,
    html: "<h1>Hello</h1>",
  };

  const transporter = await createTransport();

  transporter
    .sendMail(msg)
    .then((info) => console.log(info))
    .catch((error) => console.log(error));

  // .then((info) => {
  //   logger.info(JSON.stringify(info));
  //   console.log("Message sent: %s", info.messageId);
  //   // Preview only available when sending through an Ethereal account
  //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // })
  // .catch((error) => {
  //   logger.error(JSON.stringify(error.message));
  //   throw new Error(JSON.stringify(error.message));
  // });
};

const sendVerificationEmail = async (token, name, email) => {
  const subject = "The Eng Verification";
  const verificationLink = `http://localhost:3000/home/Verification/${token}`;
  const html = require("./templates/verifyEmail")(verificationLink);
  return _sendHtmlEmail(email, subject, html);
};

const sendPasswordResetEmail = async (token, name, email) => {
  const subject = "Booking  Password Reset";
  const resetLink = `http://localhost:3000/home/NewPassword/${token}`;
  const html = require("./templates/resetPassword")(resetLink, name);
  return _sendHtmlEmail(email, subject, html);
};

const sendHireDeveloperEmail = async (fromEmail, body, user) => {
  const { firstName, lastName, country } = user;
  const subject = "Hire a developer request";
  const text = `
  First Name: ${firstName},
  Last Name: ${lastName},
  Country: ${country},
  Email: ${fromEmail},
  Message: 
  ${body}
  `;
  return _sendEmail("hire@th3eng.com", subject, text);
};

const sendContactUsEmail = async (fromEmail, body, firstName, lastName) => {
  const subject = `Contact us email from ${firstName} ${lastName}`;
  const text = `Thi request is from ${fromEmail}.
  ${body}
  `;
  return _sendEmail("contact-us@th3eng.com", subject, text);
};

// async..await is not allowed in global scope, must use a wrapper

// send mail with defined transport object

// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//
// NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
//       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
//       <https://github.com/forwardemail/preview-email>
//

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendHireDeveloperEmail,
  sendContactUsEmail,
};
