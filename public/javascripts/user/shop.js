
document.addEventListener('DOMContentLoaded', function() {
    const filterToggle = document.getElementById('filter-toggle');
    const sidebar = document.querySelector('.sidebar');

    filterToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        filterToggle.textContent = sidebar.classList.contains('active') ? 'Hide Filters' : 'Show Filters';
    });
});


const addToCart = async (productId) => {
    try {
        // Fetch product details to check stock
        const productResponse = await fetch(`/product/${productId}`);
        const product = await productResponse.json();
        // Check if product is in stock
        if (!product.product.stock) {
            toastr.error('Product is out of stock!');
            return;
        }

        // Check existing quantity in cart
        const cartResponse = await fetch('/cart/response');
	if(!cartResponse.ok){
            if(cartResponse.status == 403){
                return window.location = '/auth/login'
            }
        }
        const cart = await cartResponse.json();
        console.log(cart,'cart')
        if(cart){
            const existingItem = cart.items.find(item => item.productId === productId);
        console.log(existingItem,'exitem')
        // Define max quantity limit
        const MAX_QUANTITY = 10; // Adjust this value as needed

        // Calculate new quantity
        let newQuantity = existingItem ? existingItem.quantity + 1 : 1;

        // Check against max quantity limit and available stock
        if (newQuantity > MAX_QUANTITY) {
            toastr.info('Max limit reached for per product');
            return;
        }
        if (newQuantity > product.product.stock) {
            toastr.info('Reached the limit of the stock');
            return;
        }
        }

        // If checks pass, proceed to add item to cart
        const data = { productId: productId };
        const response = await fetch('/cart/add-to-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            toastr.success('Product added to cart!');
        } else {
            if (response.status === 401) {
                toastr.error('Error adding to cart. Please try again!');
                window.location.href = '/auth/login'; // or another redirect URL
            }

            const errorText = await response.text();
            console.error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
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
      
