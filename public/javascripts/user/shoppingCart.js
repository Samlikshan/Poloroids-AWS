document.addEventListener("DOMContentLoaded", () => {
  updatePriceDisplay();
  updateCartSummary(); // Update the cart summary on page load
});

// Update Cart Summary
const updateCartSummary = () => {
  let cartItems = document.querySelectorAll(".cart-item");
  let itemCount = cartItems.length;
  let totalAmount = 0;

  let itemsCountElement = document.querySelector(".items-count");
  // if (itemsCountElement) {
  itemsCountElement.textContent = `${itemCount} Items`;
  // }

  let priceElements = document.querySelectorAll(".item-price");
  priceElements.forEach((priceElement) => {
    let priceText = priceElement.textContent;
    let priceNumber = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
    if (!isNaN(priceNumber)) {
      totalAmount += priceNumber;
    }
  });

  let formattedTotal = totalAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
  });
  let totalAmountElement = document.querySelector(".amount");
  if (totalAmountElement) {
    totalAmountElement.textContent = formattedTotal;
  }
};

const updatePriceDisplay = () => {
  let cartItems = document.querySelectorAll(".cart-item");

  cartItems.forEach((item) => {
    let priceElement = item.querySelector(".item-price");
    // Retrieve unit price from data attribute
    let unitPrice = parseFloat(priceElement.dataset.unitPrice);

    let quantityElement = item.querySelector(".item-quantity");
    let quantity = parseInt(quantityElement.textContent);

    // Ensure quantity is non-negative
    if (quantity < 0) quantity = 0;

    // Calculate total price based on unit price and quantity
    let totalPrice = unitPrice * quantity;
    priceElement.textContent = `₹${totalPrice.toFixed(2)}`;
  });
};

const MAX_QUANTITY = 10;

// Update Button State
const updateButtonState = (productId) => {
  const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
  const quantityElement = cartItem.querySelector('.item-quantity');
  const decButton = cartItem.querySelector('.quantity-control button:first-of-type');
  const currentQuantity = parseInt(quantityElement.textContent);

  // Disable the decrement button if quantity is 1
  decButton.disabled = currentQuantity <= 1;
};

// Increment Quantity
const quantityInc = async (productId) => {
  try {
    const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
    const quantityElement = cartItem.querySelector('.item-quantity');
    const stockElement = cartItem.querySelector('.item-stock'); // Query for stock element in the same item
    let currentQuantity = parseInt(quantityElement.textContent);
    let stockQuantity = parseInt(stockElement.textContent);
    
    if (currentQuantity >= MAX_QUANTITY) {
      toastr.info('Max limit reached for per product');
      return;
    }
    if (currentQuantity >= stockQuantity) {
      toastr.info('Reached the limit of the stock');
      return;
    }

    const response = await fetch("/cart/updateItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, action: "inc" }),
    });

    if (response.ok) {
      const data = await response.json(); // Assuming server returns new quantity and stock
      updateQuantityDisplay(productId, data.newQuantity);
      updatePriceDisplay();
      updateCartSummary(); // Update summary after increment
    } else {
      console.error("Failed to update quantity");
    }
  } catch (error) {
    console.error(error);
  }
};

// Decrement Quantity
const quantityDec = async (productId) => {
  try {
    const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
    const quantityElement = cartItem.querySelector('.item-quantity');
    let currentQuantity = parseInt(quantityElement.textContent);

    if (currentQuantity <= 1) {
      return; // Prevent decrement if quantity is 1
    }

    const response = await fetch("/cart/updateItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, action: "dec" }),
    });

    if (response.ok) {
      const data = await response.json(); // Assuming server returns new quantity
      updateQuantityDisplay(productId, data.newQuantity);
      updatePriceDisplay();
      updateCartSummary(); // Update summary after decrement
    } else {
      console.error("Failed to update quantity");
    }
  } catch (error) {
    console.error(error);
  }
};

// Remove Item
const removeItem = async (productId) => {
  try {
    Swal.fire({
      title: "Do you want to remove this item",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const response = await fetch("/cart/updateItem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, action: "remove" }),
        });
        if (response.ok) {
          // Remove the item from the cart display
          const itemElement = document.querySelector(`.cart-item[data-id="${productId}"]`);
          if (itemElement) {
            itemElement.remove();
          }
          updateCartSummary(); // Optionally update the cart summary
        } else {
          console.error("Failed to remove item");
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });

  } catch (error) {
    console.error(error);
  }
};


// Update Quantity Display
const updateQuantityDisplay = (productId, newQuantity) => {
  const quantityElement = document.querySelector(`.cart-item[data-id="${productId}"] .item-quantity`);
  if (quantityElement) {
    quantityElement.textContent = newQuantity;
    updateButtonState(productId); // Ensure button state is updated after quantity change
  }
};