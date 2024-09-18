const addToCart = async (productId) => {
    // event.preventDefault()
    
    try {
        const data = {
            productId: productId
        };
        
        console.log('Sending data:', data);
        const productResponse = await fetch(`/product/${productId}`)
        const product = await productResponse.json();
        console.log(product,product.product.stock)
        if (!product.product.stock) {
            toastr.error('Product is out of stock!');
            return;
        }

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
const addToWishlist = async (productId,element) => {
    try {
        // Make a POST request to add the product to the wishlist
        const response = await fetch('/add-to-wishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });

        // Check if the request was successful
        if (!response.ok) {
            if (response.status === 401) {
                toastr.error('User not logged in!');
                window.location.href = '/auth/login'; // Redirect to login page if unauthorized
            } else {
                // Handle other errors
                toastr.error('Failed to add product to wishlist!');
            }
            return; // Exit the function on error
        }

        // If the request was successful
        toastr.success('Product added to wishlist!');

        // Optionally, update the icon state here
        // For example:
        if (element) {
            const img = element.querySelector('img');
            img.src = "/images/icons/wishlist-active.svg";
            img.classList.add('filled');
            element.classList.add('wishlist-item-included'); // Make the element non-clickable
            element.removeAttribute('onclick'); //
        }


    } catch (error) {
        // Log any errors that occur during the fetch
        console.error('Error adding to wishlist:', error);
        toastr.error('An error occurred while adding to the wishlist.');
    }
};

    document.addEventListener('DOMContentLoaded', function() {
        var button = document.querySelector('.sort-button');
        var options = document.querySelector('.sort-options');

        button.addEventListener('click', function() {
            options.style.display = options.style.display === 'block' ? 'none' : 'block';
        });

        // Optional: Close the dropdown if clicking outside
        document.addEventListener('click', function(event) {
            if (!button.contains(event.target) && !options.contains(event.target)) {
                options.style.display = 'none';
            }
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const filterOptions = document.querySelectorAll('.filter-option');
        const productList = document.querySelectorAll('.card');
    
        filterOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
    
                // Get filter type and value from clicked option
                const filterType = option.dataset.filter;
                const filterValue = option.dataset.value;
    
                // Apply filters
                applyFilters(filterType, filterValue);
            });
        });
    
        function applyFilters(filterType, filterValue) {
            productList.forEach(product => {
                // Check if the product matches the filter
                const productFilterValue = product.dataset[filterType];
                if (filterValue === 'all' || productFilterValue === filterValue) {
                    product.style.display = 'block'; // Show product
                } else {
                    product.style.display = 'none'; // Hide product
                }
            });
        }
    });
    

    document.getElementById('searchInput').addEventListener('keyup', function() {
        const query = this.value.toLowerCase();
        const productCards = document.querySelectorAll('.card'); // Assuming each product has the class 'card'
      
        productCards.forEach((card) => {
          const productName = card.querySelector('h2').textContent.toLowerCase(); // Product name inside the <h2> tag
          
          if (productName.includes(query)) {
            card.style.display = '';  // Show the product if it matches the query
          } else {
            card.style.display = 'none';  // Hide the product if it doesn't match
          }
        });
      });

      
    //   Advanced Searching
    //   document.getElementById('searchInput').addEventListener('keyup', function() {
    //     const query = this.value.toLowerCase();
    //     const productCards = document.querySelectorAll('.card'); // Assuming each product has the class 'card'
      
    //     productCards.forEach((card) => {
    //       const productName = card.querySelector('h2').textContent.toLowerCase(); // Product name inside the <h2> tag
    //       const brandName = card.getAttribute('data-brand').toLowerCase(); // Brand name from the data-brand attribute
    //       const typeName = card.getAttribute('data-type').toLowerCase(); // Type from data-type attribute
    //       const gearName = card.getAttribute('data-gear').toLowerCase(); // Gear from data-gear attribute
      
    //       if (productName.includes(query) || brandName.includes(query) || typeName.includes(query) || gearName.includes(query)) {
    //         card.style.display = '';  // Show the product if it matches the query
    //       } else {
    //         card.style.display = 'none';  // Hide the product if it doesn't match
    //       }
    //     });
    //   });
      