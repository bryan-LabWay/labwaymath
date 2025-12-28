// api/stripe-webhook.js
const Stripe = require("stripe");

// IMPORTANT: disable body parsing so we can verify the webhook signature using the raw body
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).send("STRIPE_WEBHOOK_SECRET not configured");
  }

  let event;

  try {
    const rawBody = await readRawBody(req);
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // TODO: mark the user as "paid" in your DB,
    // or log payment for now.
    // Useful fields:
    // session.id
    // session.amount_total
    // session.currency
    // session.customer_details?.email
    // session.payment_status
  }

  return res.json({ received: true });
};
