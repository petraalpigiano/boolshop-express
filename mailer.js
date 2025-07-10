import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function sendOrderEmail({
  to,
  subject,
  text,
  name,
  orderId,
  total,
  shipping_cost,
  cart,
}) {
  const productsTable = cart
    .map((item) => {
      const price = item.finalPrice ?? item.price;
      const itemTotal = (item.price * item.quantity).toFixed(2);
      return `
        <tr>
          <td>${item.name}</td>
          <td>${item.size}</td>
          <td>${item.quantity}</td>
          <td>${item.price} €</td>
          <td>${itemTotal} €</td>
        </tr>
      `;
    })
    .join("");

  const htmlContent = `
  <h2>Hi ${name}!</h2>
  <p>Thanks for your order. Your order number is: <strong>#${orderId}</strong>.</p>

  <h3>Order details:</h3>
  <ul>
    ${cart
      .map((item) => {
        const price = item.finalPrice ?? item.price;
        const itemTotal = (price * item.quantity).toFixed(2);
        return `
        <li>
          <strong>${item.name}</strong> - Size: ${item.size}, Quantity: ${item.quantity}, Single price: ${price}€, Total: ${itemTotal}€
        </li>`;
      })
      .join("")}
  </ul>

  <p><strong>Total price:</strong> ${total} €</p>
  <p>Thank you for purchasing from Boolshop! Hope to see you soon!</p>
`;

  const mailOptions = {
    from: `"Boolshop" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html: htmlContent,
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
