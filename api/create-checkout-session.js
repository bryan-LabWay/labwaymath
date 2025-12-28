// api/create-checkout-session.js
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { priceId } = req.body || {};

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
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({
      message: err?.raw?.message || err?.message || "Stripe server error",
      type: err?.type,
      code: err?.code,
    });
  }
};
