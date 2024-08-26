const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link <a href="${verifyEmail}">Verify email now!</a></p>`;

  return sendEmail({
    to: email,
    subject: "Email confirmation",
    html: `<h4>Hello there  ${name} ${message}</h4>`,
  });
};

module.exports = sendVerificationEmail;
