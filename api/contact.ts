import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

function isValidEmail(email: string): boolean {
  // simple validation (good enough for contact form)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name, email, message } = (req.body ?? {}) as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }
    if (message.length > 5000) {
      return res.status(400).json({ message: "Message is too long." });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
    const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
      return res.status(500).json({ message: "Server is not configured." });
    }

    const resend = new Resend(RESEND_API_KEY);

    // NOTE: `reply_to` is supported by Resend’s API payload. :contentReference[oaicite:2]{index=2}
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL, // e.g. "LABWay Math <no-reply@labwaymath.com>"
      to: CONTACT_TO_EMAIL,     // e.g. "hello@labwaymath.com"
      subject: `Contact Us: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      return res.status(502).json({ message: "Email provider error.", details: error });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: "Unexpected server error." });
  }
}
