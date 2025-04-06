import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface ApiResponse {
  message: string;
}

const setCORSHeaders = (res: NextApiResponse<ApiResponse>) => {
  res.setHeader("Access-Control-Allow-Origin", "https://md-portfolio-inky.vercel.app/contact");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  setCORSHeaders(res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { name, email, message } = req.body as ContactForm;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: "New Contact Form Submission",
      text: `
        You have a new message from your portfolio website:

        Name: ${name}
        Email: ${email}
        Message: ${message}
        Submitted: ${new Date().toLocaleString()}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p><small>This email was sent from your portfolio website.</small></p>
      `,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return res.status(500).json({ message: `Error: ${errorMessage}` });
  }
}