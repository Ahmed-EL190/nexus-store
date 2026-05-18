import express from 'express';
import Stripe from 'stripe';
import { db } from '../config/db.js';

const router = express.Router();

// ─── STRIPE (Visa / MasterCard) ───────────────────────────────────────────────
router.post('/stripe/create-intent', async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, currency = 'egp', orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // piastres
      currency,
      metadata: { orderId },
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stripe Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'payment_intent.succeeded') {
      const { orderId } = event.data.object.metadata;
      const idx = db.orders.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        db.orders[idx].paymentStatus = 'paid';
        db.orders[idx].status = 'processing';
      }
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ─── PAYMOB (InstaPay / Vodafone Cash / Card) ─────────────────────────────────
// Step 1: Auth token
async function getPaymobToken() {
  const r = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY })
  });
  const data = await r.json();
  return data.token;
}

// Step 2: Create order
async function createPaymobOrder(token, amountCents, items) {
  const r = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: token,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: 'EGP',
      items
    })
  });
  const data = await r.json();
  return data.id;
}

// Step 3: Payment key
async function getPaymobPaymentKey(token, orderId, amountCents, integrationId, billingData) {
  const r = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: token,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderId,
      billing_data: billingData,
      currency: 'EGP',
      integration_id: integrationId
    })
  });
  const data = await r.json();
  return data.token;
}

// Paymob Pay endpoint
router.post('/paymob/pay', async (req, res) => {
  try {
    const { amount, method, orderId, customer, items } = req.body;
    const amountCents = Math.round(amount * 100);

    const integrationMap = {
      card: process.env.PAYMOB_INTEGRATION_ID_CARD,
      vodafone: process.env.PAYMOB_INTEGRATION_ID_VODAFONE,
      instapay: process.env.PAYMOB_INTEGRATION_ID_INSTAPAY
    };
    const integrationId = integrationMap[method];
    if (!integrationId) return res.status(400).json({ error: 'Invalid payment method' });

    const billingData = {
      apartment: 'NA', email: customer.email || 'na@na.com',
      floor: 'NA', first_name: customer.firstName || customer.name?.split(' ')[0] || 'Customer',
      street: customer.address || 'NA', building: 'NA',
      phone_number: customer.phone || '+201000000000',
      shipping_method: 'NA', postal_code: 'NA',
      city: customer.city || 'Cairo', country: 'EG',
      last_name: customer.lastName || customer.name?.split(' ')[1] || 'User',
      state: 'NA'
    };

    const token = await getPaymobToken();
    const paymobOrderId = await createPaymobOrder(token, amountCents, items || []);
    const paymentKey = await getPaymobPaymentKey(token, paymobOrderId, amountCents, integrationId, billingData);

    // For card: return iframe URL
    // For Vodafone/InstaPay: return redirect URL
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
    const walletUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

    res.json({
      paymentKey,
      iframeUrl: method === 'card' ? iframeUrl : walletUrl,
      method
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Paymob callback
router.get('/paymob/callback', (req, res) => {
  const { success, order } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  if (success === 'true') {
    res.redirect(`${frontendUrl}/order-success?paymob=true`);
  } else {
    res.redirect(`${frontendUrl}/checkout?payment=failed`);
  }
});

export default router;
