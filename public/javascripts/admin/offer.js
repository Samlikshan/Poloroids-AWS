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

  const dataScript = document.getElementById("data-template").textContent;
  const data = JSON.parse(dataScript);

  const products = data.products;
  const brands = data.brands;

  const offerTypeDropdown = document.getElementById("offerType");
  const typeDropdown = document.getElementById("typeId");

  // Function to populate the typeId dropdown
  function populatetypeDropdown(options) {
    typeDropdown.innerHTML = ""; // Clear existing options

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select an option";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    typeDropdown.appendChild(placeholderOption);

    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option._id;
      optionElement.textContent = option.name;
      typeDropdown.appendChild(optionElement);
    });
  }

  offerTypeDropdown.addEventListener("change", function (event) {
    const selectedValue = event.target.value;

    if (selectedValue === "product") {
      populatetypeDropdown(products);
    } else if (selectedValue === "brand") {
      populatetypeDropdown(brands);
    } else {
      populatetypeDropdown([]); // Clear options if 'none' is selected
    }
  });

  const editModal = document.getElementById("edit-offer-modal");
  const editCloseBtn = document.getElementById("edit-close");

  document.querySelectorAll(".openEditOfferModal").forEach((link) => {
    link.addEventListener("click", async function (event) {
      event.preventDefault();
      const offerId = this.getAttribute("data-id");

      try {
        const response = await fetch(`/admin/offers/edit/${offerId}`);
        const offer = await response.json();
        console.log(offer);

        document.getElementById("editOfferId").value = offer._id;
        document.getElementById("editOfferType").value = offer.offerType;

        const typeDropdown = document.getElementById("editTypeId");
        const options = offer.offerType === "product" ? products : brands;
        populateTypeDropdown(typeDropdown, options, offer.typeId);

        document.getElementById("editDiscountPercentage").value = offer.discountPercentage;

        function formatDate(isoDateString) {
          const date = new Date(isoDateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }

        document.getElementById("editValidFrom").value = formatDate(offer.validFrom);
        document.getElementById("editValidTo").value = formatDate(offer.validTo);
        const statusDropdown = document.getElementById("editStatus");
        statusDropdown.value = offer.status ? "active" : "inactive";
        editModal.style.display = "flex";

        document.getElementById("editOfferForm").setAttribute("data-id", offerId);
      } catch (error) {
        console.error("Error fetching offer details:", error);
      }
    });
  });

  editCloseBtn.onclick = function () {
    editModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === editModal) {
      editModal.style.display = "none";
    }
  };

  function populateTypeDropdown(dropdown, options, selectedValue) {
    dropdown.innerHTML = ""; // Clear existing options

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select an option";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    dropdown.appendChild(placeholderOption);

    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option._id;
      optionElement.textContent = option.name;
      if (option._id === selectedValue) {
        optionElement.selected = true;
      }
      dropdown.appendChild(optionElement);
    });
  }

  // Form submission for adding offers
  const form = document.getElementById("offerForm");
  const validFromInput = document.getElementById("validFrom");
  const validToInput = document.getElementById("validTo");

  // Set minimum date for Valid From to today
  const today = new Date().toISOString().split("T")[0];
  validFromInput.setAttribute("min", today);

  // Validate Valid To based on Valid From
  validFromInput.addEventListener("change", function () {
    const validFromDate = new Date(validFromInput.value);
    validToInput.setAttribute("min", validFromInput.value);
    if (validToInput.value && new Date(validToInput.value) < validFromDate) {
      validToInput.value = validFromInput.value; // Reset Valid To to Valid From
    }
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    const response = await fetch("/admin/offers/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    if (response.ok) {
      return (window.location.href = "/admin/offers");
    }
    if (!response.ok) {
      const errorData = await response.json();
      toastr.warning(errorData.message);
    }
  });

  // Form submission for editing offers
  const editForm = document.getElementById("editOfferForm");
  const editValidFromInput = document.getElementById("editValidFrom");
  const editValidToInput = document.getElementById("editValidTo");

  editValidFromInput.setAttribute("min", today);

  editValidFromInput.addEventListener("change", function () {
    const editValidFromDate = new Date(editValidFromInput.value);
    editValidToInput.setAttribute("min", editValidFromInput.value);
    if (editValidToInput.value && new Date(editValidToInput.value) < editValidFromDate) {
      editValidToInput.value = editValidFromInput.value; // Reset Valid To to Valid From
    }
  });

  editForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(editForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    const response = await fetch("/admin/offers/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    if (response.ok) {
      window.location.href = "/admin/offers";
    }
  });

  // Function to delete offers
  const deleteOffer = async (offerId, element) => {
    Swal.fire({
      title: "Do you want to delete this offer?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        element.remove();
        const response = await fetch("/admin/offers/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ offerId }),
        });
      }
    });
  };
});
