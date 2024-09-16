document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("offer-modal");
    const btn = document.querySelector(".open-modal-btn");
    const closeBtn = document.querySelector(".close");

    btn.onclick = function () {
        modal.style.display = "flex";
    };

    closeBtn.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };


    const dataScript = document.getElementById('data-template').textContent;
    const data = JSON.parse(dataScript);

    const products = data.products;
    const brands = data.brands;

    const offerTypeDropdown = document.getElementById('offerType');
    const typeDropdown = document.getElementById('typeId');

    // Function to populate the typeId dropdown
    function populatetypeDropdown(options) {
        typeDropdown.innerHTML = ''; // Clear existing options

        // Add a default placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Select an option';
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        typeDropdown.appendChild(placeholderOption);

        // Add new options
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option._id;
            optionElement.textContent = option.name;
            typeDropdown.appendChild(optionElement);
        });
    }

    // Event listener for the offerType dropdown
    offerTypeDropdown.addEventListener('change', function(event) {
        const selectedValue = event.target.value;

        if (selectedValue === 'product') {
            populatetypeDropdown(products);
        } else if (selectedValue === 'brand') {
            populatetypeDropdown(brands);
        } else {
            populatetypeDropdown([]); // Clear options if 'none' is selected
        }
    });

    const editModal = document.getElementById("edit-offer-modal");
    const editCloseBtn = document.getElementById("edit-close");

    // Show the edit modal and populate data
    document.querySelectorAll(".openEditOfferModal").forEach(link => {
        link.addEventListener("click", async function(event) {
            event.preventDefault();
            const offerId = this.getAttribute("data-id");

            // Fetch offer details
            try {
                const response = await fetch(`/admin/offers/edit/${offerId}`);
                const offer = await response.json();
                console.log(offer)

                // Populate form fields
                document.getElementById('editOfferId').value = offer._id;
                document.getElementById('editOfferType').value = offer.offerType;

                // Populate the typeId dropdown based on offerType
                const typeDropdown = document.getElementById('editTypeId');
                const options = offer.offerType === 'product' ? products : brands;
                populateTypeDropdown(typeDropdown, options, offer.typeId);

                document.getElementById('editDiscountPercentage').value = offer.discountPercentage;
                function formatDate(isoDateString) {
                    const date = new Date(isoDateString);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
                
                // Assuming offer.validFrom and offer.validTo are ISO date strings
                document.getElementById('editValidFrom').value = formatDate(offer.validFrom);
                document.getElementById('editValidTo').value = formatDate(offer.validTo);
                const statusDropdown = document.getElementById('editStatus');
                statusDropdown.value = offer.status ? 'active' : 'inactive';
                // Show the modal
                editModal.style.display = "flex";

                // Store the offer ID in the form or global variable if needed
                document.getElementById("editOfferForm").setAttribute("data-id", offerId);

            } catch (error) {
                console.error('Error fetching offer details:', error);
            }
        });
    });

    // Hide the edit modal
    editCloseBtn.onclick = function () {
        editModal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === editModal) {
            editModal.style.display = "none";
        }
    };

    // Function to populate the typeId dropdown
    function populateTypeDropdown(dropdown, options, selectedValue) {
        dropdown.innerHTML = ''; // Clear existing options

        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Select an option';
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        dropdown.appendChild(placeholderOption);

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option._id;
            optionElement.textContent = option.name;
            if (option._id === selectedValue) {
                optionElement.selected = true;
            }
            dropdown.appendChild(optionElement);
        });
    }

})

//form subbmission
const form = document.getElementById('offerForm')

form.addEventListener('submit',async function(event) {
    // Prevent the form from submitting the traditional way
    event.preventDefault();
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    const response = await fetch('/admin/offers/add',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
    })
    if(response.ok){
        window.location.href = '/admin/offers'
    }
    
    
});


const editForm = document.getElementById('editOfferForm')
editForm.addEventListener('submit',async function(event) {
    event.preventDefault();
    const formData = new FormData(editForm);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    console.log('req')
    const response = await fetch('/admin/offers/edit',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
    })
    if(response.ok){
        window.location.href = '/admin/offers'
    }
})


const deleteOffer = async (offerId) => {
    const response =  await fetch('/admin/offers/delete',{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({offerId})
    })
}

