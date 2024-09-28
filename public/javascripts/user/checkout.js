document.addEventListener("DOMContentLoaded", async () => {
  updatePriceDisplay();
  updateCartSummary(); // Update the cart summary on page load
});

// Update Cart Summary
const updateCartSummary = () => {
  let cartItems = document.querySelectorAll(".cart-item");
  let itemCount = cartItems.length;
  let totalAmount = 0;

  let itemsCountElement = document.querySelector(".items-count");
  if (itemsCountElement) {
    itemsCountElement.textContent = `${itemCount} Items`;
  }

  let priceElements = document.querySelectorAll(".item-price");
  priceElements.forEach((priceElement) => {
    let priceText = priceElement.textContent;
    let priceNumber = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
    if (!isNaN(priceNumber)) {
      totalAmount += priceNumber;
    }
  });

  let formattedTotal = totalAmount.toLocaleString("en-IN", {
    // Changed to INR currency format
    style: "currency",
    currency: "INR",
  });
  let totalAmountElement = document.querySelector(".amount");
  if (totalAmountElement) {
    totalAmountElement.textContent = formattedTotal;
    updateTotalAmount(formattedTotal);
  }
};

const updatePriceDisplay = () => {
  let cartItems = document.querySelectorAll(".cart-item");

  cartItems.forEach((item) => {
    let priceElement = item.querySelector(".item-price");
    let unitPrice = parseFloat(priceElement.dataset.unitPrice);

    let quantityElement = item.querySelector(".item-quantity");
    let quantity = parseInt(quantityElement.textContent);

    if (quantity < 0) quantity = 0;

    let totalPrice = unitPrice * quantity;
    priceElement.textContent = `₹${totalPrice.toFixed(2)}`;
  });
};

// const applyCoupon = async () => {
//   const couponCode = document.getElementById("couponCode").value;
//   const couponMessage = document.getElementById("couponMessage");
//   const couponElement = document.querySelector(".coupon-total");
//   const discountElement = document.querySelector(".coupon-discount");
//   const couponSpan = document.getElementById("coupon-code");
//   const discountSpan = document.getElementById("discount");

//   // Reset message
//   couponMessage.innerHTML = "";

//   let subtotalAmount = document.getElementById("subtotalAmount").textContent;
//   subtotalAmount = parseInt(subtotalAmount.replace(/[^\d.]/g, ""));

//   if (!couponCode) {
//     return toaster.error("please Enter a code ");
//   }

//   try {
//     const response = await fetch("/apply-coupon", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ couponCode, subtotalAmount }),
//     });
//     if (!response.ok) {
//       const errorData = await response.json();
//       couponElement.style.display = "none";
//       return (couponMessage.innerHTML = errorData.error);
//     }
//     const data = await response.json();
//     const discountValue = data.coupon.discountValue;
//     const discountAmount = (subtotalAmount * discountValue) / 100;
//     const newTotalAmount = subtotalAmount - discountAmount;

//     // Update coupon display
//     couponElement.style.display = "flex";
//     couponSpan.textContent = data.coupon.couponCode;
//     couponMessage.innerHTML = "Coupon applied";

//     discountElement.style.display = 'flex'
//     discountSpan.textContent = -discountAmount + '.00'
//     // Update the total amount display
//     updateTotalAmount(newTotalAmount);
//   } catch (error) {
//     console.log(error);
//   }
// };

const applyCoupon = async () => {
  const couponCode = document.getElementById("couponCode").value;
  const couponMessage = document.getElementById("couponMessage");
  const couponElement = document.querySelector(".coupon-total");
  const discountElement = document.querySelector(".coupon-discount");
  const couponSpan = document.getElementById("coupon-code");
  const discountSpan = document.getElementById("discount");

  // Reset message
  couponMessage.innerHTML = "";

  let subtotalAmount = document.getElementById("subtotalAmount").textContent;
  subtotalAmount = parseInt(subtotalAmount.replace(/[^\d.]/g, ""));

  if (!couponCode) {
    return toastr.error("Please enter a code");
  }

  try {
    const response = await fetch("/apply-coupon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ couponCode, subtotalAmount }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      couponElement.style.display = "none";
      return (couponMessage.innerHTML = errorData.error);
    }
    const data = await response.json();
    const discountValue = data.coupon.discountValue;
    const discountAmount = (subtotalAmount * discountValue) / 100;
    const newTotalAmount = subtotalAmount - discountAmount;

    // Update coupon display
    couponElement.style.display = "flex";
    couponSpan.textContent = data.coupon.couponCode;
    couponMessage.innerHTML = "Coupon applied";

    discountElement.style.display = "flex";
    discountSpan.textContent = `-₹${discountAmount.toFixed(2)}`;

    // Update the total amount display
    updateTotalAmount(newTotalAmount);
  } catch (error) {
    console.log(error);
  }
};

const updateTotalAmount = (totalAmount) => {
  const formattedTotal = totalAmount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
  const totalAmountElement = document.getElementById("totalAmount");
  if (totalAmountElement) {
    totalAmountElement.textContent = formattedTotal;
  }
};


async function checkAddressAvailability(addressId) {
  try {
    const response = await fetch(`/check-address/${addressId}`); // Replace with your API endpoint
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.exists; // Assuming the API returns an object with an 'exists' property
  } catch (error) {
    console.error("Error checking address availability:", error);
    toastr.error("There was a problem checking the address. Please try again.");
    return false;
  }
}

const checkStockBeforeConfirm = async () => {
  try {
    // Fetch current cart items
    const cartResponse = await fetch("/cart/response");
    const cart = await cartResponse.json();

    // Check each item in the cart for stock
    for (const item of cart.items) {
      const productResponse = await fetch(`/product/${item.productId}`);
      const product = await productResponse.json();
      console.log(product);
      // If current quantity exceeds available stock, alert user
      if (item.quantity > product.product.stock) {
        toastr.info(
          `The quantity of ${product.product.productName} exceeds the available stock.`
        );
        return false; // Insufficient stock found
      }
    }

    return true; // All stock levels are sufficient
  } catch (error) {
    console.error("Error checking stock:", error);
    toastr.error("An error occurred while checking stock. Please try again.");
    return false; // Stock check failed
  }
};

document
  .querySelector(".confirm-order")
  .addEventListener("click", async function () {
    // Check if a payment method is selected

    const isStockAvailable = await checkStockBeforeConfirm();
    if (!isStockAvailable) {
      return; // Stop further execution if stock is insufficient
    }
    const paymentMethod = document.querySelector(
      'input[name="payment-method"]:checked'
    );
    if (!paymentMethod) {
      toastr.error("Please select a payment method.");
      return;
    }

    // Check if an address is selected
    const selectedAddress = document.querySelector(
      'input[name="address-select"]:checked'
    );
    let addressData = null;

    if (selectedAddress) {

      // Retrieve the complete address details from the selected address
      const addressLabel = selectedAddress.closest(".address-option");
      const addressId = addressLabel.dataset.addressId;
      
      const isAddressAvailable = await checkAddressAvailability(addressId);
      if (!isAddressAvailable) {
        toastr.error("The selected address is no longer available. Please choose a different address.");
        return; // Stop further execution
      }

      addressData = {
        addressId: addressLabel.dataset.addressId,
        firstName: addressLabel.dataset.firstName,
        lastName: addressLabel.dataset.lastName,
        company: addressLabel.dataset.company,
        address: addressLabel.dataset.address,
        city: addressLabel.dataset.city,
        state: addressLabel.dataset.state,
        phoneNumber: addressLabel.dataset.phone,
        email: addressLabel.dataset.email,
        pincode: addressLabel.dataset.pincode,
      };
    } else {
      // If no address is selected, check if the form fields are filled out
      const firstName = document.querySelector(".first-name").value;
      const lastName = document.querySelector(".last-name").value;
      const company = document.querySelector(".company").value;
      const address = document.querySelector(".address").value;
      const city = document.querySelector(".city").value;
      const state = document.querySelector(".state-select").value;
      const phoneNumber = document.querySelector(".phone-number").value;
      const pincode = document.querySelector(".pincode").value;
      // const email = document.querySelector('.email').value;

      // Check if all required fields are filled out
      if (
        firstName &&
        lastName &&
        address &&
        city &&
        state &&
        phoneNumber &&
        pincode
      ) {
        addressData = {
          firstName,
          lastName,
          company,
          address,
          city,
          state,
          phoneNumber,
          // email,
          pincode,
        };
      } else {
        toastr.error("Please fill out all required fields.");
        return;
      }
    }

    // Collect product details
    const products = [];
    let totalAmount = 0;

    document.querySelectorAll(".cart-item").forEach((item) => {
      const productId = item.dataset.productId; // Ensure to include data-product-id in HTML
      const productName = item.querySelector(".product-name").textContent;
      const quantity = parseInt(
        item.querySelector(".item-quantity").textContent
      );
      const unitPrice = parseFloat(
        item.querySelector(".item-price").dataset.unitPrice
      );
      const totalPrice = unitPrice * quantity;

      totalAmount += totalPrice;
      products.push({
        productId,
        productName,
        unitPrice,
        quantity,
        totalPrice,
      });
    });
    let finalPrice = document.getElementById("totalAmount");
    finalPrice = finalPrice.textContent.replace(/[^\d.]/g, "");
    // Format total amount

    if (paymentMethod.value == "razorpay") {
      const response = await fetch("/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalAmount,
          finalPrice,
          currency: "INR",
          receipt: "receipt#1",
          notes: {},
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return toastr.warning(errorData.message);
      }
      const order = await response.json();
      const options = {
        key: "rzp_test_XCHGauJ6DVoH7U", // Replace with your Razorpay key_id
        amount: order.amount,
        currency: order.currency,
        name: "Polaroids",
        description: "Transaction",
        order_id: order.id, // This is the order_id created in the backend
        callback_url: "http://localhost:3000/payment-success", // Your success URL
        prefill: {
          name: "samlik",
          email: "samlikshan123@gmail.com",
          contact: "9072175739",
        },
        theme: {
          color: "#F37254",
        },
        handler: function (response) {
          fetch("/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status === "ok") {
                // window.location.href = '/success';
                placeorder("paid");
              } else {
                toastr.error("Payment verification failed");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              toastr.error("Payment verification failed");
            });
        },
      };

      const rzp = new Razorpay(options);

      rzp.on("payment.failed", async function (response) {
        failedPayment();
      });
      rzp.open();
      return;
    } else if (paymentMethod.value == "cod") {
      if (finalPrice > 1000) {
        return toastr.warning(`COD can't be used over 1000`);
      }
      placeorder("pending");
    } else if (paymentMethod.value == "wallet") {
      const response = await fetch("/order-wallet", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ finalPrice }),
      });
      if (response.ok) {
        return placeorder("paid");
      }
      if (!response.ok) {
        const errorData = await response.json();
        return toastr.warning(errorData.message);
      }
    }

    async function placeorder(paymentStatus) {
      // Gather data
      const data = {
        address: addressData,
        items: products,
        totalAmount: totalAmount,
        finalPrice: finalPrice,
        paymentStatus: paymentStatus,
        paymentMethod: paymentMethod.value,
      };

      try {
        const response = await fetch("/chekout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const data = await response.json();
          // localStorage.setItem('Token',data.token)
          window.location.href = "/success";
        } else {
          const errorData = await response.json();
          // errorDisplay(errorData.message);
          return toastr.error(errorData.message);
        }
      } catch (err) {
        console.log("error", err);
      }
    }

    async function failedPayment() {
      const data = {
        address: addressData,
        items: products,
        totalAmount: totalAmount,
        finalPrice: finalPrice,
        paymentStatus: "failed ",
        paymentMethod: paymentMethod.value,
      };
      try {
        const response = await fetch("/failed-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log(response);
        if (response.ok) {
          console.log("req");
          const data = await response.json();
          // localStorage.setItem('Token',data.token)
          window.location.href = "/success";
        } else {
          console.log("else in failed");
          const errorData = await response.json();
          window.location.href = "/failed";
        }
      } catch (err) {
        console.log("error", err);
      }
    }
  });

const removeCoupon = () => {
  const couponElement = document.querySelector(".coupon-total");
  const discountElement = document.querySelector(".coupon-discount");
  const discountSpan = document.getElementById("discount");
  const couponMessage = document.getElementById("couponMessage");

  // Reset the coupon details
  couponElement.style.display = "none"; // Hide coupon section
  discountElement.style.display = "none"; // Hide discount section
  discountSpan.textContent = ""; // Clear discount text
  couponMessage.innerHTML = ""; // Clear any coupon messages

  // Get the original subtotal amount
  let subtotalAmount = document.getElementById("subtotalAmount").textContent;
  subtotalAmount = parseInt(subtotalAmount.replace(/[^\d.]/g, ""));

  // Update the total amount back to the original subtotal
  updateTotalAmount(subtotalAmount);

  // Optionally, you can send a request to the server to remove the coupon or clear it from the session.
};
