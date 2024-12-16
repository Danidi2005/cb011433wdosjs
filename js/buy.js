// Retrieve order data from local storage
function loadOrderSummary() {
    const orderSummaryTableBody = document.querySelector("#order-summary tbody");
    const orderData = JSON.parse(localStorage.getItem("cart")) || []; // Get cart from local storage or default to empty array

    let grandTotal = 0;

    // Clear the table before populating
    orderSummaryTableBody.innerHTML = "";

    // Populate the table with order data
    orderData.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
        `;
        orderSummaryTableBody.appendChild(row);

        // Calculate grand total
        grandTotal += item.price * item.quantity;
    });

    // Update grand total
    document.getElementById("grand-total").textContent = grandTotal.toFixed(2);
}

// Add event listener for payment button
document.getElementById("pay-button").addEventListener("click", function () {
    // Get form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const postalCode = document.getElementById("postal-code").value;
    const cardName = document.getElementById("card-name").value;
    const cardNumber = document.getElementById("card-number").value;
    const expDate = document.getElementById("exp-date").value;

    // Validate that all fields are filled
    if (
        name && email && phone && address && city && postalCode &&
        cardName && cardNumber && expDate
    ) {
        // Calculate delivery date (3 days from today)
        const today = new Date();
        const deliveryDate = new Date(today.setDate(today.getDate() + 3));
        const formattedDate = deliveryDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

        // Show Thank You Message
        document.getElementById("checkout-form").style.display = "none";
        document.getElementById("thank-you-message").style.display = "block";
        document.getElementById("delivery-date").innerText = formattedDate;

        // Clear local storage after purchase is complete
        localStorage.removeItem("cart");
    } else {
        alert("Please fill out all fields correctly.");
    }
});

// Load the order summary when the page loads
document.addEventListener("DOMContentLoaded", loadOrderSummary);
