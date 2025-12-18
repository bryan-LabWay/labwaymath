import type { VercelRequest, VercelResponse } from "@vercel/node";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name, email, message, website } = (req.body ?? {}) as {
      name?: string;
      email?: string;
      message?: string;
      website?: string; // honeypot
    };

    if (website) return res.status(200).json({ ok: true });

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }
    if (message.length > 5000) {
      return res.status(400).json({ message: "Message too long." });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
    const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
      return res.status(500).json({ message: "Server is not configured." });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
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
};
