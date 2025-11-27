import crypto from "crypto";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const hmacHeader = req.headers["x-shopify-hmac-sha256"];
    const body = JSON.stringify(req.body);
    const hash = crypto
      .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET)
      .update(body)
      .digest("base64");

    if (hash !== hmacHeader) {
      return res.status(401).json({ error: "Invalid HMAC" });
    }

    console.log("Webhook Received:", req.body);

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
