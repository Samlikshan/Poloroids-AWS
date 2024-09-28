// Function to handle adding a new address
function addAddress() {
  const form = document.getElementById("addAddressForm");

  // Get input values
  const phoneNumber = form.querySelector('input[type="number"]').value.trim();
  const addressType = form.querySelector('input[name="addressType"]:checked');
  const country = form.querySelector("select").value;
  const firstName = form.querySelector('input[placeholder="First name"]').value.trim();
  const lastName = form.querySelector('input[placeholder="Last name"]').value.trim();
  const company = form.querySelector('input[placeholder="Company (optional)"]').value.trim();
  const address = form.querySelector('input[placeholder="Address"]').value.trim();
  const city = form.querySelector('input[placeholder="City/District/Town"]').value.trim();
  const state = form.querySelector('input[placeholder="State"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const pincode = form.querySelector('input[placeholder="Pincode"]').value.trim();
  // Validate inputs
  if (!phoneNumber || phoneNumber.length < 10) {
    toastr.warning('Please enter a valid phone number (at least 10 digits).');
    return;
  }
  if (!addressType) {
    toastr.warning('Please select an address type.');
    return;
  }
  if (!firstName) {
    toastr.warning('First name cannot be empty.');
    return;
  }
  if (!lastName) {
    toastr.warning('Last name cannot be empty.');
    return;
  }
  if (!country || country === 'None') {
    toastr.warning('Please select a country.');
    return;
  }
  if (!address) {
    toastr.warning('Address cannot be empty.');
    return;
  }
  if (!city) {
    toastr.warning('City cannot be empty.');
    return;
  }
  if (!state) {
    toastr.warning('State cannot be empty.');
    return;
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    toastr.warning('Please enter a valid email address.');
    return;
  }
  if (!pincode || !/^\d{5,6}$/.test(pincode)) {
    toastr.warning('Pincode must be a 5 or 6 digit number.');
    return;
  }

  const formData = {
    phoneNumber,
    addressType: addressType.value,
    country,
    firstName,
    lastName,
    company,
    address,
    city,
    state,
    email,
    pincode,
  };

  fetch("/account/add-address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      document.getElementById("addAddressModal").style.display = "none";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Attach event listener to form submit
document.getElementById("addAddressForm").addEventListener(
  "submit",
  function (event) {
    console.log("Form submitted");
    event.preventDefault(); // Prevent default form submission
    addAddress();
  }
);

// Function to handle editing an existing address
function editAddress() {
  const form = document.getElementById("editAddressForm");

  // Get input values
  const contact = form.querySelector("#editPhone").value.trim();
  const addressType = form.querySelector('input[name="editAddressType"]:checked');
  const country = form.querySelector("#editCountry").value;
  const firstName = form.querySelector("#editFirstName").value.trim();
  const lastName = form.querySelector("#editLastName").value.trim();
  const company = form.querySelector("#editCompany").value.trim();
  const address = form.querySelector("#editAddress").value.trim();
  const city = form.querySelector("#editCity").value.trim();
  const state = form.querySelector("#editState").value.trim();
  const email = form.querySelector("#editEmail").value.trim();
  const pincode = form.querySelector("#editPincode").value.trim();

  // Validate inputs
  if (!contact || contact.length < 10) {
    toastr.warning('Please enter a valid phone number (at least 10 digits).');
    return;
  }
  if (!addressType) {
    toastr.warning('Please select an address type.');
    return;
  }
  if (!firstName) {
    toastr.warning('First name cannot be empty.');
    return;
  }
  if (!lastName) {
    toastr.warning('Last name cannot be empty.');
    return;
  }
  if (!country || country === 'None') {
    toastr.warning('Please select a country.');
    return;
  }
  if (!address) {
    toastr.warning('Address cannot be empty.');
    return;
  }
  if (!city) {
    toastr.warning('City cannot be empty.');
    return;
  }
  if (!state) {
    toastr.warning('State cannot be empty.');
    return;
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    toastr.warning('Please enter a valid email address.');
    return;
  }
  if (!pincode || !/^\d{5,6}$/.test(pincode)) {
    toastr.warning('Pincode must be a 5 or 6 digit number.');
    return;
  }

  const formData = {
    id: form.querySelector("#editId").value,
    contact,
    addressType: addressType.value,
    country,
    firstName,
    lastName,
    company,
    address,
    city,
    state,
    email,
    pincode,
  };
  fetch(`/account/update-address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
  .then((response) => response.json())
  .then((data) => {
      console.log('rq')

      console.log("Success:", data);
      document.getElementById("editAddressModal").style.display = "none";
      toastr.success(data.message)
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Attach event listener to form submit
document.getElementById("editAddressForm").addEventListener(
  "submit",
  function (event) {
    event.preventDefault(); // Prevent default form submission
    editAddress();
  }
);

async function deleteAdd(addressId, element) {
  try {
    Swal.fire({
      title: "Do you want to delete this address?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const response = await fetch("/account/address/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ addressId }),
        });

        if (response.ok) {
          console.log("Address deleted");
          const data = await response.json();
          // Remove the address card from the DOM
          const addressCard = element.closest(".address-card");
          if (addressCard) {
            addressCard.remove();
          }
        } else {
          const errorData = await response.json();
          toastr.warning(errorData.message)
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  } catch (err) {
    console.error("Error:", err);
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
    document.getElementById("editId").value = btn.getAttribute("data-id");
    document.getElementById("editEmail").value = btn.getAttribute("data-email");
    document.getElementById("editFirstName").value = btn.getAttribute("data-firstname");
    document.getElementById("editLastName").value = btn.getAttribute("data-lastname");
    document.getElementById("editCompany").value = btn.getAttribute("data-company");
    document.getElementById("editAddress").value = btn.getAttribute("data-address");
    document.getElementById("editCity").value = btn.getAttribute("data-city");
    document.getElementById("editPhone").value = btn.getAttribute("data-phone");
    document.getElementById("editPincode").value = btn.getAttribute("data-pincode");
    document.getElementById("editCountry").value = btn.getAttribute("data-country");
    document.getElementById("editState").value = btn.getAttribute("data-state"); // Set state input
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
