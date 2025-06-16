const stripe = Stripe('pk_test_51RaAHB2fUfWsCA0BGMXyAaR9UAN0AmOFfNZmq365PSZ2eLMX3jKCIGm3urDtNdxBaagVXnVTv9eAf2T2pxF9WcS000mmnmcHry'); // Cambia por tu clave pública Stripe

let cart = [];

const cartItemsElem = document.getElementById('cart-items');
const totalElem = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

document.querySelectorAll('.product button').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    addToCart(name, price);
  });
});

function addToCart(name, price) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
}

function renderCart() {
  cartItemsElem.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.textContent = `${item.name} x ${item.qty} - $${(item.price * item.qty).toFixed(2)} USD`;
    cartItemsElem.appendChild(li);
  });
  totalElem.textContent = total.toFixed(2);
  checkoutBtn.disabled = cart.length === 0;
}

checkoutBtn.addEventListener('click', async () => {
  if (cart.length === 0) return;

  const lineItems = cart.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.qty,
  }));

  try {
    const res = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineItems }),
    });
    const data = await res.json();
    if (data.sessionId) {
      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (result.error) alert(result.error.message);
    } else {
      alert('Error al crear sesión de pago');
    }
  } catch (err) {
    alert('Error en el proceso de pago');
  }
});
