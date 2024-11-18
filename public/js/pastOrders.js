// Fetch past orders from the Flask API
async function fetchPastOrders() {
    try {
        const response = await fetch('/pastOrders');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.past_orders || {};
    } catch (error) {
        console.error("Error fetching past orders:", error);
        return {};
    }
}

// Display past orders dynamically
function displayPastOrders(orders) {
    const ordersContainer = document.getElementById("orders-container");
    ordersContainer.innerHTML = ""; 

    if (Object.keys(orders).length === 0) {
        ordersContainer.innerHTML = "<p>No past orders found.</p>";
        return;
    }

    Object.keys(orders).forEach(orderId => {
        const order = orders[orderId];
        const orderElement = document.createElement("div");
        orderElement.className = "order-item";

        orderElement.innerHTML = `
            <h3>Order ID: ${orderId}</h3>
            <p>Restaurant: ${order.restaurant || "Unknown"}</p>
            <p>Date: ${order.date || "N/A"}</p>
            <ul>
                ${order.items.map(item => `<li>${item.name} (x${item.quantity})</li>`).join("")}
            </ul>
            <button onclick="reorder('${orderId}', ${JSON.stringify(order.items)})">Order Again</button>
        `;

        ordersContainer.appendChild(orderElement);
    });
}

// Handle "Order Again" functionality
function reorder(orderId, items) {
    localStorage.setItem("cart", JSON.stringify(items));
    alert(`Order ${orderId} has been added to your cart!`);
    window.location.href = "/cart";
}

// Fetch and display orders on page load
document.addEventListener("DOMContentLoaded", async () => {
    const orders = await fetchPastOrders();
    displayPastOrders(orders);
});
