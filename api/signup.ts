import type { VercelRequest, VercelResponse } from "@vercel/node";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function verifyRecaptcha(token: string, remoteip?: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;

  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("response", token);
  if (remoteip) params.set("remoteip", remoteip);

  const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = (await r.json()) as { success?: boolean; score?: number; action?: string };
  return data.success === true;
}

module.exports = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { fullName, email, phone, website, recaptchaToken } = (req.body ?? {}) as {
      fullName?: string;
      email?: string;
      phone?: string;
      website?: string; // honeypot
      recaptchaToken?: string;
    };

    // honeypot
    if (website) return res.status(200).json({ ok: true });

    if (!fullName || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }
    if (fullName.length > 120) {
      return res.status(400).json({ message: "Full name too long." });
    }
    if (phone.length > 30) {
      return res.status(400).json({ message: "Phone too long." });
    }

    // reCAPTCHA required (same pattern as contact)
    if (!recaptchaToken) {
      return res.status(400).json({ message: "reCAPTCHA verification is required." });
    }
    const isHuman = await verifyRecaptcha(recaptchaToken, req.headers["x-forwarded-for"]?.toString());
    if (!isHuman) {
      return res.status(400).json({ message: "reCAPTCHA failed. Please try again." });
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
      subject: `New Sign-up Lead: ${fullName}`,
      text:
        `A user clicked Pay Now (lead captured before payment).\n\n` +
        `Full Name: ${fullName}\n` +
        `Preferred Email: ${email}\n` +
        `Preferred Contact Number: ${phone}\n`,
    });

    if (error) {
      return res.status(502).json({ message: "Email provider error.", details: error });
    }

    return res.status(200).json({ ok: true });
  } catch (_err) {
    return res.status(500).json({ message: "Unexpected server error." });
  }
};
