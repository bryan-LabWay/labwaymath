// /api/create-checkout-session.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Use CommonJS require for runtime compatibility on Vercel Node functions
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { priceId } = (req.body ?? {}) as { priceId?: string };

    if (!priceId) {
      return res.status(400).json({ message: "Missing priceId" });
    }

    const siteUrl = process.env.SITE_URL;
    if (!siteUrl) {
      return res.status(500).json({ message: "SITE_URL is not configured" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err);

    return res.status(500).json({
      message: err?.raw?.message || err?.message || "Stripe server error",
      type: err?.type,
      code: err?.code,
    });
  }
}
