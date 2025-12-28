// /api/create-checkout-session.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { priceId } = req.body as { priceId?: string };

    if (!priceId) {
      res.status(400).json({ message: "Missing priceId" });
      return;
    }

    const siteUrl = process.env.SITE_URL;
    if (!siteUrl) {
      res.status(500).json({ message: "SITE_URL is not configured" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
      // Optional: helps you map checkout to your app user
      // client_reference_id: "yourUserId",
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);

    return res.status(500).json({
      message: err?.raw?.message || err?.message || 'Stripe server error',
      type: err?.type,
      code: err?.code,
    });
  }
}
