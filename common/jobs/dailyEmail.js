var cron = require("node-cron");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail", // true for 465, false for other ports
  auth: {
    user: "routeacademycairo3@gmail.com", // generated ethereal user
    pass: "Routeegypt20110100", // generated ethereal password
  },
});
const dailyEmail =  () => {
  cron.schedule("* */2 * * * *",async () => {
    let info = await transporter.sendMail({
      from: '"Node project 👻" <foo@example.com>', // sender address
      to: "ahmed.moustafa9663@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<div>Generate Pdf</div>`,
      attachments: [
        {
          filename: "report.pdf",
          path: "invoice.pdf",
          contentType: "application/pdf",
        },
      ],
    });
    console.log("running a task every two second");
  });
};

module.exports = dailyEmail;
