document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            // Remove the active class from all links
            navLinks.forEach(link => link.classList.remove("active"));
            
            // Add the active class to the clicked link
            link.classList.add("active");
        });
    });
});

// Select all thumbnail images and the main image
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('main-image');

// Add a click event listener to each thumbnail
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        // Swap the main image src with the clicked thumbnail's src
        const tempSrc = mainImage.src;
        mainImage.src = thumbnail.src;
        thumbnail.src = tempSrc;
    });
});


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