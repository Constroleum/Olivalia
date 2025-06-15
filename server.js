const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51RaAHB2fUfWsCA0BMckDZknKheJiG08ZCDdbHCJLgQQODLW8rCVKz7AMZfc7eFPZAmdR4MbQtLiurBluJggrhXCu0049N6gKgp'); // Tu clave secreta Stripe aquí
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { lineItems } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: 'http://localhost:3000/success.html',
      cancel_url: 'http://localhost:3000/cancel.html',
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
