import type { VercelRequest, VercelResponse } from "@vercel/node";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type RecaptchaV2Response = {
  success?: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

function getClientIp(req: VercelRequest): string | undefined {
  const xff = req.headers["x-forwarded-for"];
  const raw = Array.isArray(xff) ? xff[0] : xff;
  if (!raw) return undefined;
  return raw.split(",")[0].trim();
}

async function verifyRecaptchaV2(
  token: string,
  req: VercelRequest
): Promise<{ ok: boolean; details?: RecaptchaV2Response }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { ok: false, details: { "error-codes": ["missing-input-secret"] } };
  }

  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("response", token);

  // Optional: pass client IP (safe parsing)
  const ip = getClientIp(req);
  if (ip) params.set("remoteip", ip);

  const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = (await r.json()) as RecaptchaV2Response;

  if (data.success === true) return { ok: true, details: data };
  return { ok: false, details: data };
}

module.exports = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name, email, message, website, recaptchaToken } = (req.body ?? {}) as {
      name?: string;
      email?: string;
      message?: string;
      website?: string;
      recaptchaToken?: string; // ✅ new
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

    // ✅ reCAPTCHA required
    if (!recaptchaToken) {
      return res.status(400).json({ message: "reCAPTCHA verification is required." });
    }

    const clientIp = getClientIp(req);
    // IMPORTANT: must match your frontend grecaptcha.execute(..., { action: "contact" })
    const expectedAction = "contact";

    const result = await verifyRecaptchaV2(recaptchaToken, req);

    if (!result.ok) {
      return res.status(400).json({
        message: "reCAPTCHA failed. Please try again.",
        recaptcha: {
          hostname: result.details?.hostname,
          errorCodes: result.details?.["error-codes"],
        },
      });
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
