// 6634//Navbar

// document.addEventListener("DOMContentLoaded", () => {
//     const navLinks = document.querySelectorAll(".nav-links a");

//     navLinks.forEach(link => {
//         link.addEventListener("click", () => {
//             // Remove the active class from all links
//             navLinks.forEach(link => link.classList.remove("active"));
            
//             // Add the active class to the clicked link
//             link.classList.add("active");
//         });
//     });
// });

//Banner
// script.js


// document.addEventListener('DOMContentLoaded', function () {
//     const hamburger = document.querySelector('.hamburger');
//     const navbarMenu = document.querySelector('.navbar-menu');

//     hamburger.addEventListener('click', function () {
//         navbarMenu.classList.toggle('active');
//     });
// });

// script.js

document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    function showSlide(index) {
        const slideWidth = slides[0].clientWidth;
        document.querySelector('.banner-slides').style.transform = `translateX(-${index * slideWidth}px)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', function () {
            const index = parseInt(dot.getAttribute('data-slide'));
            showSlide(index);
            currentIndex = index;
        });
    });

    showSlide(currentIndex);
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
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