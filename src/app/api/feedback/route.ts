import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, message, page } = await req.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.FEEDBACK_TO;

    if (!host || !user || !pass || !to) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 200 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"FootballHub Feedback" <${user}>`,
      to,
      replyTo: email,
      subject: `FootballHub Feedback from ${email}`,
      text: `From: ${email}\nPage: ${page || "Unknown"}\n\nMessage:\n${message}`,
      html: `<p><strong>From:</strong> ${email}</p>
<p><strong>Page:</strong> ${page || "Unknown"}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, "<br/>")}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to send: ${msg}` },
      { status: 200 }
    );
  }
}
