// utils/mailer.js
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Load the HTML template
const loadTemplate = (name, email, password) => {
  const templatePath = path.join(
    __dirname,
    "../mails",
    "registrationEmailTemplate.html"
  );
  let template = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders with actual values
  template = template.replace("{{name}}", name);
  template = template.replace("{{email}}", email);
  template = template.replace("{{password}}", password);

  return template;
};

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST_NAME,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, name, email, password) => {
  const htmlTemplate = loadTemplate(name, email, password);

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: "Treko Registration",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
