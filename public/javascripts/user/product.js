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
