import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite", ...etc
  }),

  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

      const info = await transporter.sendMail({
        from: '"Prisma Blog" <prisma.blog@ph.com>',
        to: user.email,
        subject: "Verify Your Email - Prisma Blog",
        text: `
Hi ${user.email},

Welcome to Prisma Blog!

Please verify your email address by visiting this link:
${verificationUrl}

If you didn't create an account, you can safely ignore this email.

Thanks,
The Prisma Blog Team
  `,
        html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Arial,Helvetica,sans-serif; color:#333333;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f7; padding:40px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden;">
                <tr>
                  <td align="center" style="background-color:#4f46e5; padding:28px 20px;">
                    <h1 style="margin:0; color:#ffffff; font-size:26px;">Prisma Blog</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 30px;">
                    <h2 style="margin:0 0 16px; font-size:22px; color:#111827;">
                      Verify your email address
                    </h2>

                    <p style="margin:0 0 16px; font-size:15px; line-height:1.7;">
                      Hi there,
                    </p>

                    <p style="margin:0 0 24px; font-size:15px; line-height:1.7;">
                      Thanks for joining Prisma Blog! Please confirm your email address to complete your registration.
                    </p>

                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 24px;">
                      <tr>
                        <td align="center" bgcolor="#4f46e5" style="border-radius:8px;">
                          <a
                            href="${verificationUrl}"
                            target="_blank"
                            style="display:inline-block; padding:14px 28px; color:#ffffff; text-decoration:none; font-size:15px; font-weight:bold; border-radius:8px;"
                          >
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 10px; font-size:13px; line-height:1.6; color:#6b7280;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>

                    <p style="margin:0 0 24px; font-size:13px; line-height:1.6; overflow-wrap:anywhere;">
                      <a href="${verificationUrl}" style="color:#4f46e5; word-break:break-all;">
                        ${verificationUrl}
                      </a>
                    </p>

                    <p style="margin:0 0 12px; font-size:14px; line-height:1.7; color:#4b5563;">
                      If you didn't create a Prisma Blog account, you can safely ignore this email.
                    </p>

                    <p style="margin:24px 0 0; font-size:14px; line-height:1.7;">
                      Best regards,<br />
                      <strong>The Prisma Blog Team</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:18px 20px; background-color:#f9fafb; border-top:1px solid #e5e7eb;">
                    <p style="margin:0; font-size:12px; color:#9ca3af;">
                      &copy; ${new Date().getFullYear()} Prisma Blog. All rights reserved.
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
      });

      console.log("Message sent: %s", info.messageId);
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
