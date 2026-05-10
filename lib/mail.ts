import nodemailer from "nodemailer";

export const sendResetEmail = async (email: string, resetUrl: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "mmi.revival@gmail.com",
      pass: process.env.EMAIL_PASS, // User must provide App Password in .env.local
    },
  });

  const mailOptions = {
    from: '"Newsroom" <mmi.revival@gmail.com>',
    to: email,
    subject: "Password Reset Request - Newsroom",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; color: #1f2937;">
        <h2 style="color: #111827;">Password Reset</h2>
        <p>You requested a password reset for your Newsroom account.</p>
        <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #111827; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 10px;">Reset Password</a>
        <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 12px; color: #9ca3af;">Newsroom Platform &copy; ${new Date().getFullYear()}</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
