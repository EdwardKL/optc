import nodemailer from 'nodemailer';

// Sends an email with the given mail options.
export function mail(mailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending mail: ', error);
      return false;
    }
    return true;
  });
}
