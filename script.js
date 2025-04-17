// Initialize EmailJS
(function () {
    emailjs.init("R6nKBqsMuWHeU-dCl"); // Replace with your EmailJS Public Key
})();

// Cart Data
let cart = [];

// Add to Cart Functionality
document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
        const itemName = this.dataset.name;
        const itemPrice = parseFloat(this.dataset.price);
        addToCart(itemName, itemPrice);
        updateCartUI();
    });
});

// Add Item to Cart
function addToCart(name, price) {
    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
        cart.push({ name, price, quantity: 1, subtotal: price });
    }
}

// Update Cart UI
function updateCartUI() {
    const cartItems = document.querySelector("#cart-items tbody");
    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>Ksh ${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>Ksh ${item.subtotal.toFixed(2)}</td>
            <td><button class="remove-item" data-index="${index}">Remove</button></td>
        `;
        cartItems.appendChild(row);
    });

    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
    document.getElementById("cart-total").textContent = total.toFixed(2);

    document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", function () {
            const index = parseInt(this.dataset.index, 10);
            cart.splice(index, 1);
            updateCartUI();
        });
    });
}

// Checkout Functionality
document.getElementById("checkout-button").addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const orderDetails = cart
        .map((item) => `${item.quantity}x ${item.name} - Ksh ${item.subtotal.toFixed(2)}`)
        .join("\n");

    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

    const templateParams = {
        user_name: "Customer",
        user_email: "customer@example.com", // Replace with dynamic email if needed
        user_order: orderDetails,
        delivery_date: "N/A",
        total_amount: total.toFixed(2),
    };

    console.log("Sending email with the following details:", templateParams);

    emailjs
        .send("service_le4lkf5", "template_of6il3c", templateParams)
        .then((response) => {
            alert("Order placed successfully!");
            console.log("SUCCESS!", response.status, response.text);
            cart = []; // Clear the cart
            updateCartUI();
        })
        .catch((error) => {
            alert("There was an error processing your order. Please try again.");
            console.error("FAILED...", error);
        });
});

// Order Form Submission
document.getElementById("orderForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const order = document.getElementById("order").value;
    const deliveryDate = document.getElementById("deliveryDate").value;

    const templateParams = {
        user_name: name,
        user_email: email,
        user_order: order,
        delivery_date: deliveryDate,
    };

    console.log("Sending email with the following details:", templateParams);

    emailjs
        .send("service_le4lkf5", "template_of6il3c", templateParams)
        .then((response) => {
            alert("Order placed successfully! We'll notify the baker.");
            console.log("SUCCESS!", response.status, response.text);
            document.getElementById("orderForm").reset();
        })
        .catch((error) => {
            alert("There was an error placing your order. Please try again.");
            console.error("FAILED...", error);
        });
});
