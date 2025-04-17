let cart = [];
let totalPrice = 0;

function addToCart(item, price) {
  cart.push({ item, price });
  totalPrice += price;
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');
  cartItems.innerHTML = '';
  cart.forEach(({ item, price }) => {
    const li = document.createElement('li');
    li.textContent = `${item} - KSH ${price}`;
    cartItems.appendChild(li);
  });
  totalPriceEl.textContent = totalPrice;
}

document.getElementById('checkout-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const deliveryDate = document.getElementById('delivery-date').value;
  sendOrderEmail(deliveryDate);
  alert('Order placed successfully!');
});

function sendOrderEmail(deliveryDate) {
  emailjs.send('service_le4lkf5', 'template_of6il3c', {
    cart: JSON.stringify(cart),
    totalPrice,
    deliveryDate,
  }).then(() => {
    console.log('Email sent successfully');
  }).catch(err => console.error('Email sending failed', err));
}
