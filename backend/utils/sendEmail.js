import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s/g, '') : '';
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: pass,
      },
    });
  }
  return transporter;
};

export const sendOtpEmail = async (to, otp, name) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'Xpensify <noreply@xpensify.com>',
    to,
    subject: 'Your Xpensify Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #10B981; text-align: center; margin-bottom: 24px;">Xpensify</h2>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hello ${name || 'User'},</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          We received a request to reset your password. Use the OTP below to proceed:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10B981; background: #f0fdf4; padding: 16px 32px; border-radius: 8px; border: 2px dashed #10B981;">
            ${otp}
          </span>
        </div>
        <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
          This OTP will expire in <strong>1 minute</strong>. If you did not request a password reset, please ignore this email.
        </p>
        <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          Xpensify &mdash; Personal Expense Tracker
        </p>
      </div>
    `,
    text: `Hello ${name || 'User'},\n\nYour Xpensify password reset OTP is: ${otp}\n\nThis OTP will expire in 1 minute. If you did not request a password reset, please ignore this email.\n\nXpensify - Personal Expense Tracker`,
  };

  await getTransporter().sendMail(mailOptions);
};


