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
  
    let formattedTotal = totalAmount.toLocaleString("en-IN", { // Changed to INR currency format
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
      let unitPrice = parseFloat(priceElement.dataset.unitPrice);
  
      let quantityElement = item.querySelector(".item-quantity");
      let quantity = parseInt(quantityElement.textContent);
  
      if (quantity < 0) quantity = 0;
  
      let totalPrice = unitPrice * quantity;
      priceElement.textContent = `₹${totalPrice.toFixed(2)}`;
    });
  };
  


  document.querySelector('.confirm-order').addEventListener('click', async function() {
    // Check if a payment method is selected
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethod) {
        alert('Please select a payment method.');
        return;
    }

    // Check if an address is selected
    const selectedAddress = document.querySelector('input[name="address-select"]:checked');
    let addressData = null;
    
    if (selectedAddress) {
        // Retrieve the complete address details from the selected address
        const addressLabel = selectedAddress.closest('.address-option');
        
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
            pincode: addressLabel.dataset.pincode
        };
    } else {
        // If no address is selected, check if the form fields are filled out
        const firstName = document.querySelector('.first-name').value;
        const lastName = document.querySelector('.last-name').value;
        const company = document.querySelector('.company').value;
        const address = document.querySelector('.address').value;
        const city = document.querySelector('.city').value;
        const state = document.querySelector('.state-select').value;
        const phoneNumber = document.querySelector('.phone-number').value;
        const pincode = document.querySelector('.pincode').value;
        // const email = document.querySelector('.email').value;

        // Check if all required fields are filled out
        if (firstName && lastName && address && city && state && phoneNumber && pincode) {
            addressData = {
                firstName,
                lastName,
                company,
                address,
                city,
                state,
                phoneNumber,
                // email,
                pincode
            };
        } else {
            alert('Please fill out all required fields.');
            return;
        }
    }

    // Collect product details
    const products = [];
    let totalAmount = 0;

    document.querySelectorAll('.cart-item').forEach(item => {
        const productId = item.dataset.productId; // Ensure to include data-product-id in HTML
        const productName = item.querySelector('.product-name').textContent
        const quantity = parseInt(item.querySelector('.item-quantity').textContent);
        const unitPrice = parseFloat(item.querySelector('.item-price').dataset.unitPrice);
        const totalPrice = unitPrice * quantity;

        totalAmount += totalPrice;

        products.push({
            productId,
            productName,
            unitPrice,
            quantity,
            totalPrice
        });
    });

    // Format total amount
    const formattedTotal = totalAmount.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR'
    });

    // Gather data
    const data = {
        address: addressData,
        items: products,
        totalAmount: formattedTotal,
        paymentMethod: paymentMethod.value
    };

    try{
      const response = await fetch('/chekout',{
          method:'POST',
          headers:{
              'Content-Type':'application/json'
          },
          body:JSON.stringify(data)
      })
      if(response.ok){
          const data = await response.json()
          // localStorage.setItem('Token',data.token)
          window.location.href= '/success'
      }else{
          const errorData = await response.json()
          errorDisplay(errorData.message)
          
      }
  }catch(err){
      console.log('error',err);
      
  }
});
