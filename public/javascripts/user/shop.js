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
            toastr.success('Product added to cart successfully!');
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
    