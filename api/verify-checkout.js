// api/verify-checkout.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  const sessionId = req.query.session_id;
  if (!sessionId) return res.status(400).json({ message: "Missing session_id" });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid = session.payment_status === "paid" && session.status === "complete";
    return res.status(200).json({
      paid,
      payment_status: session.payment_status,
      status: session.status,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  } catch (err) {
    console.error("verify-checkout error:", err);
    return res.status(500).json({ message: err?.message || "Stripe error" });
  }
};
