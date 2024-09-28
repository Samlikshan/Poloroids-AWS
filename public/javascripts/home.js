//Navbar

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

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');

    hamburger.addEventListener('click', function () {
        navbarMenu.classList.toggle('active');
    });
});

// script.js

document.addEventListener('DOMContentLoaded', function () {
    console.log('req')
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
