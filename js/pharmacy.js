// Select the relevant DOM elements
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartTableBody = document.querySelector('#cart-table tbody');
const grandTotalElement = document.querySelector('#grand-total');

// Initialize cart as an empty array
let cart = [];

// Load favorite orders from local storage
const favouriteOrder = JSON.parse(localStorage.getItem("favouriteOrder")) || [];

// Function to update cart display
function updateCart() {
    // Clear the existing cart table
    cartTableBody.innerHTML = '';

    let grandTotal = 0;

    // Loop through the cart array and update table rows
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-from-cart" data-index="${index}">Remove</button></td>
        `;
        cartTableBody.appendChild(row);

        // Add to grand total
        grandTotal += item.price * item.quantity;
    });

    // Update grand total display
    grandTotalElement.textContent = grandTotal.toFixed(2);

    // Save the updated cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to add item to the cart
function addToCart(event) {
    const medicineItem = event.target.closest('.medicine-item');
    const name = medicineItem.querySelector('.medicine-name').textContent;
    const price = parseFloat(medicineItem.querySelector('.medicine-price').getAttribute('data-price'));
    const quantity = parseInt(medicineItem.querySelector('.medicine-quantity').value);

    // Validate price and quantity to avoid $NaN issues
    if (isNaN(price) || isNaN(quantity) || quantity <= 0) {
        alert('Invalid input: Please enter a valid price and quantity greater than 0.');
        return; // Exit the function if inputs are invalid
    }

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, quantity });
    }

    updateCart();
}

// Function to remove item from the cart
function removeFromCart(event) {
    const index = event.target.getAttribute('data-index');
    cart.splice(index, 1);
    updateCart();
}

// Attach event listeners to all "Add to Cart" buttons
addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

// Attach event listener to cart table for dynamic "Remove" buttons
cartTableBody.addEventListener('click', event => {
    if (event.target.classList.contains('remove-from-cart')) {
        removeFromCart(event);
    }
});

// Select the "Buy Now" button
const buyNowButton = document.querySelector('#buy-now');

// Add click event to navigate to the buy page
buyNowButton.addEventListener('click', () => {
    window.location.href = 'buy.html'; // Replace 'buy.html' with the URL of your buy page
});

// Function to save the current cart table as a favorite
function saveToFavourite() {
  if (cart.length === 0) {
      alert("The cart is empty. Add items to the cart before saving as favorite.");
      return;
  }

  // Save the cart array to localStorage as "favouriteOrder"
  localStorage.setItem("favouriteOrder", JSON.stringify(cart));
  alert("Your current order has been saved as your favorite.");
}

// Function to apply the favorite order to the cart table
function applyFavourite() {
  const favouriteOrder = JSON.parse(localStorage.getItem("favouriteOrder"));

  if (!favouriteOrder || favouriteOrder.length === 0) {
      alert("No favorite order found. Save an order as your favorite first.");
      return;
  }

  // Update the cart array with the favorite order
  cart = [...favouriteOrder];

  // Update the cart display
  updateCart();

  alert("Favorite order has been applied to the cart.");
}

// Add event listeners to the buttons
document.getElementById("add-to-favorites").addEventListener("click", saveToFavourite);
document.getElementById("apply-favorites").addEventListener("click", applyFavourite);

// Optional: Clear cart when page reloads, but keep favorites saved
// This ensures the cart starts empty every time the page is loaded.
cart = []; // Clear cart on page load

// Update the display after page load
updateCart();
