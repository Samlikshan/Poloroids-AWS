document.addEventListener("DOMContentLoaded", async () => {
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