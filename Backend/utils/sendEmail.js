import nodemailer from "nodemailer";

// NOTE: transporter is created inside the function (not at module level)
// so that process.env vars are read AFTER dotenv has loaded them.
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendVerificationEmail = async (to, token) => {
  const transporter = createTransporter();
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Food Munch 🍔" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your Food Munch account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="background:linear-gradient(135deg,#ff6b35,#f7931e);padding:40px 30px;">
                      <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:800;letter-spacing:-0.5px;">🍔 Food Munch</h1>
                      <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">Delicious food, delivered fast</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:48px 40px 32px;">
                      <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:24px;font-weight:700;">Verify your email address</h2>
                      <p style="margin:0 0 24px;color:#555555;font-size:16px;line-height:1.6;">
                        Thanks for signing up! Click the button below to verify your email address and activate your account.
                      </p>
                      <div style="text-align:center;margin:32px 0;">
                        <a href="${verifyUrl}"
                           style="background:linear-gradient(135deg,#ff6b35,#f7931e);
                                  color:#ffffff;
                                  text-decoration:none;
                                  padding:16px 40px;
                                  border-radius:50px;
                                  font-size:17px;
                                  font-weight:700;
                                  display:inline-block;
                                  letter-spacing:0.3px;
                                  box-shadow:0 4px 15px rgba(255,107,53,0.4);">
                          ✓ Verify My Email
                        </a>
                      </div>
                      <p style="margin:24px 0 0;color:#888888;font-size:14px;line-height:1.6;">
                        If the button doesn't work, copy and paste this link into your browser:<br/>
                        <a href="${verifyUrl}" style="color:#ff6b35;word-break:break-all;">${verifyUrl}</a>
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #eeeeee;">
                      <p style="margin:0;color:#aaaaaa;font-size:13px;line-height:1.6;text-align:center;">
                        This link expires in <strong>24 hours</strong>. If you didn't create a Food Munch account, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (to, order, pdfBuffer) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Food Munch 🍔" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmation - #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="background:linear-gradient(135deg,#ff6b35,#f7931e);padding:40px 30px;">
                      <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:800;letter-spacing:-0.5px;">🍔 Food Munch</h1>
                      <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">Order Confirmed!</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:48px 40px 32px;">
                      <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:24px;font-weight:700;">Thank you for your order!</h2>
                      <p style="margin:0 0 24px;color:#555555;font-size:16px;line-height:1.6;">
                        We have received your order and are currently processing it. Please find your detailed invoice attached to this email.
                      </p>
                      <p style="margin:0 0 12px;color:#1a1a1a;font-size:16px;font-weight:600;">
                        Order Details:
                      </p>
                      <ul style="margin:0 0 24px;padding-left:20px;color:#555555;font-size:15px;line-height:1.6;">
                        <li><strong>Order ID:</strong> ${order._id}</li>
                        <li><strong>Total Amount:</strong> ₹${order.amount.toFixed(2)}</li>
                        <li><strong>Delivery Address:</strong> ${order.address.street}, ${order.address.city}</li>
                      </ul>
                      <p style="margin:0;color:#555555;font-size:16px;line-height:1.6;">
                        If you have any questions, feel free to reply to this email.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #eeeeee;">
                      <p style="margin:0;color:#aaaaaa;font-size:13px;line-height:1.6;text-align:center;">
                        © ${new Date().getFullYear()} Food Munch. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    attachments: [
      {
        filename: `Invoice_${order._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
