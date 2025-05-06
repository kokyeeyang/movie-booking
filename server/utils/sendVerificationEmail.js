const transporter = require("./sendEmail");

const sendVerificationEmail = async ({
  name, 
  email,
  verificationToken,
  origin
}) => {
  const verifyEmail = `${origin}/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link <a href="${verifyEmail}">Verify email now!</a></p>`;

  const info = await transporter.sendMail({
    from: "Best cinema ever <noreply@cinema.com>",
    to: email,
    subject: `Hello ${name} please verify your email address`,
    html: message,
  });

  console.log("Message sent : %s", info.messageId);
}

module.exports = sendVerificationEmail;