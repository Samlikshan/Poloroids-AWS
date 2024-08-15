document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentPath = window.location.pathname;

    // Function to set the active class based on the current path
    function setActiveLink() {
        navLinks.forEach(link => {
            if (link.getAttribute("href") === currentPath) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    // Set the active link when the page loads
    setActiveLink();

    // Add event listener to update the active link on click
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            // Remove the active class from all links
            navLinks.forEach(link => link.classList.remove("active"));
            
            // Add the active class to the clicked link
            link.classList.add("active");
        });
    });
});
