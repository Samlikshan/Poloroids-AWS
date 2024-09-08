// Function to handle adding a new address
function addAddress() {
    const form = document.getElementById('addAddressForm');
    if (!form.checkValidity()) {
        console.log('Form is not valid');
        return;
    }

    const formData = {
        phoneNumber: form.querySelector('input[type="number"]').value,
        addressType: form.querySelector('input[name="addressType"]:checked').value,
        country: form.querySelector('select').value,
        firstName: form.querySelector('input[placeholder="First name"]').value,
        lastName: form.querySelector('input[placeholder="Last name"]').value,
        company: form.querySelector('input[placeholder="Company (optional)"]').value,
        address: form.querySelector('input[placeholder="Address"]').value,
        city: form.querySelector('input[placeholder="City/District/Town"]').value,
        state: form.querySelector('input[placeholder="State"]').value,
        email: form.querySelector('input[type="email"]').value,
        pincode: form.querySelector('input[placeholder="Pincode"]').value
    };
    fetch('/account/add-address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        document.getElementById('addAddressModal').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Attach event listener to form submit
document.getElementById('addAddressForm').addEventListener('submit', function (event) {
    console.log('Form submitted');
    event.preventDefault(); // Prevent default form submission
    addAddress();
},{once:true});

// Function to handle editing an existing address
function editAddress() {
    const form = document.getElementById('editAddressForm');

    if (!form.checkValidity()) {
        console.log('Form is not valid');
        return;
    }

    const formData = {
        id: form.querySelector('#editEmail').dataset.id,
        contact: form.querySelector('#editPhone').value,
        addressType: form.querySelector('input[name="editAddressType"]:checked').value,
        country: form.querySelector('#editCountry').value,
        firstName: form.querySelector('#editFirstName').value,
        lastName: form.querySelector('#editLastName').value,
        company: form.querySelector('#editCompany').value,
        address: form.querySelector('#editAddress').value,
        city: form.querySelector('#editCity').value,
        state: form.querySelector('#editState').value,
        email: form.querySelector('#editEmail').value,
        pincode: form.querySelector('#editPincode').value
    };

    fetch(`/api/address/${formData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        document.getElementById('editAddressModal').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Attach event listener to form submit
document.getElementById('editAddressForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
    editAddress();
},{once:true});

async function deleteAdd(addressId, element) {
    try {
        const response = await fetch('/account/address/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ addressId })
        });

        if (response.ok) {
            console.log('Address deleted');
            const data = await response.json();
            // Remove the address card from the DOM
            const addressCard = element.closest('.address-card');
            if (addressCard) {
                addressCard.remove();
            }
        } else {
            const errorData = await response.json();
            errorDisplay(errorData.message);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}


document.querySelectorAll(".options-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const dropdown = this.nextElementSibling;
    dropdown.classList.toggle("show");
  });
});

window.addEventListener("click", function (e) {
  if (!e.target.matches(".options-btn")) {
    document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
      dropdown.classList.remove("show");
    });
  }
});

const addAddressModal = document.getElementById("addAddressModal");
const editAddressModal = document.getElementById("editAddressModal");

const addBtn = document.querySelector(".add-address-btn");
const editBtns = document.querySelectorAll(".dropdown-item.edit");

addBtn.onclick = function () {
  addAddressModal.style.display = "block";
};

// Open Edit Modal and populate data
editBtns.forEach((btn) => {
  btn.onclick = function () {
    document.getElementById("editEmail").value = btn.getAttribute("data-email");
    document.getElementById("editFirstName").value =
      btn.getAttribute("data-firstname");
    document.getElementById("editLastName").value =
      btn.getAttribute("data-lastname");
    document.getElementById("editAddress").value =
      btn.getAttribute("data-address");
    document.getElementById("editCity").value = btn.getAttribute("data-city");
    document.getElementById("editPhone").value = btn.getAttribute("data-phone");
    document.getElementById("editPincode").value =
      btn.getAttribute("data-pincode");
    document.getElementById("editCountry").value =
      btn.getAttribute("data-country");
    document.getElementById("editState").value = btn.getAttribute("data-state");
    const addressType = btn.getAttribute("data-addresstype");
    if (addressType === "home") {
      document.getElementById("editHome").checked = true;
    } else if (addressType === "work") {
      document.getElementById("editWork").checked = true;
    }
    editAddressModal.style.display = "block";
  };
});

// Close modal when clicking outside of it
window.onclick = function (event) {
  if (event.target == addAddressModal) {
    addAddressModal.style.display = "none";
  }
  if (event.target == editAddressModal) {
    editAddressModal.style.display = "none";
  }
};
