document.addEventListener("DOMContentLoaded", function () {
    
    //changing the format
    function formatDateToDDMMYYYY(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
        const dateElements = document.querySelectorAll('.expiryDate');
        
        dateElements.forEach(element => {
            const dateString = element.textContent.trim();
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) { // Check if the date is valid
                const formattedDate = formatDateToDDMMYYYY(date);
                element.textContent = formattedDate;
            } else {
                console.error('Invalid date:', dateString);
            }
        });
    


    
    const modal = document.getElementById("coupon-modal");

    const date = document.getElementById('expiryDate')
    date.setAttribute('min',new Date().toISOString().split('T')[0])
    
    
    // Get the button that opens the modal
    const btn = document.querySelector(".open-modal-btn");

    // Get the <span> element that closes the modal
    const closeBtn = document.querySelector(".close");

    // When the user clicks on the button, open the modal
    btn.onclick = function () {
        modal.style.display = "flex";
    };

    // When the user clicks on <span> (x), close the modal
    closeBtn.onclick = function () {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

});