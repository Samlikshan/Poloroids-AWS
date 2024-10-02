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
