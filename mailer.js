import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function sendOrderEmail({ to, subject, text, name, orderId, total }) {
  const mailOptions = {
    from: `"Boolshop" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html: `
      <h2>Ciao ${name}!</h2>
      <p>Grazie per il tuo ordine. Il tuo numero ordine è <strong>#${orderId}</strong>.</p>
      <p>Totale ordine: <strong>${total}€</strong></p>
    `,
  };

  return transporter
    .sendMail(mailOptions)
    .then((info) => {
      return info;
    })
    .catch((err) => {
      throw err;
    });
}

export default sendOrderEmail;
