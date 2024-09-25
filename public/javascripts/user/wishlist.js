const removeItem = async (productId, wishlistId, element) => {
  Swal.fire({
    title: "Do you want to remove this item from wishlist?",
    showCancelButton: true,
    confirmButtonText: "Yes",
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      const response = await fetch("/remove-wishlsit", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, wishlistId }),
      });

      if (response.ok) {
        // Remove the item from the DOM
        element.remove();
      } else {
        console.error("Failed to remove item");
      }
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
};


const addToCart = async (productId) => {
  // event.preventDefault()
  
  try {
      const data = {
          productId: productId
      };
      
      // console.log('Sending data:', data);
      // const productResponse = await fetch(`/product/${productId}`)
      // const product = await productResponse.json();
      // console.log(product)
      // if (!product.product.stock) {
      //     toastr.error('Product is out of stock!');
      //     return;
      // }

      const response = await fetch('/cart/add-to-cart', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      console.log(response)
      if(response.ok){
          toastr.success('Product added to cart!');
      }
      // Check if response is OK
      if (!response.ok) {
          if (response.status === 401) {
              toastr.error('Error adding to cart Try again!');
              window.location.href = '/auth/login'; // or another redirect URL
          }
          
          // Attempt to get detailed error message
          const errorText = await response.text();  // Get error details if available
          console.error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse and handle JSON response if needed
      const result = await response.json();
      console.log('Response data:', result);
  
  } catch (error) {
      // Log detailed error information
      console.error('Fetch error:', error);
  }
  
}