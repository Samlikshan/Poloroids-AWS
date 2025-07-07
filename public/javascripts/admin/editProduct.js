const editForm = document.querySelector(".product-form");

editForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get input values
  const productName = document.getElementById("productName").value.trim();
  const productDescription = document
    .getElementById("description")
    .value.trim();
  const price = parseFloat(document.querySelector('input[name="price"]').value);

  // Category selections
  const brandSelected =
    document.querySelector('select[name="Brand"]').value !== "None";
  const typeSelected =
    document.querySelector('select[name="Type"]').value !== "None";
  const gearSelected =
    document.querySelector('select[name="Gear"]').value !== "None";

  // Stock and image uploads
  const stock = parseInt(document.querySelector('input[name="stock"]').value);

  // Regular expression to check for at least one alphabetic character
  const containsAlphabet = (str) => /[a-zA-Z]/.test(str);

  // Validate inputs
  if (!productName || !containsAlphabet(productName)) {
    toastr.warning(
      "Product name cannot be empty and must contain at least one alphabetic character."
    ); // Alert for product name
  } else if (
    !productDescription ||
    productDescription.length < 350 ||
    !containsAlphabet(productDescription)
  ) {
    toastr.warning(
      "Product description must be at least 350 characters long and contain at least one alphabetic character."
    ); // Alert for product description
  } else if (!brandSelected) {
    toastr.warning("Please select a brand."); // Alert for brand selection
  } else if (!typeSelected) {
    toastr.warning("Please select a type."); // Alert for type selection
  } else if (!gearSelected) {
    toastr.warning("Please select a gear."); // Alert for gear selection
  } else if (!price) {
    toastr.warning("Please fill in the price field.");
  } else if (isNaN(price) || price < 0) {
    toastr.warning("Price must be a non-negative number."); // Alert for price
  } else if (isNaN(stock) || stock < 0) {
    toastr.warning("Stock must be a non-negative number."); // Alert for stock
  } else {
    editForm.submit(); // Programmatically submit the form if validation passes
  }
});

// const editForm = document.querySelector(".product-form");

editForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  const productName = document.getElementById("productName").value.trim();
  const productDescription = document
    .getElementById("description")
    .value.trim();
  const price = parseFloat(document.querySelector('input[name="price"]').value);
  const brandSelected =
    document.querySelector('select[name="Brand"]').value !== "None";
  const typeSelected =
    document.querySelector('select[name="Type"]').value !== "None";
  const gearSelected =
    document.querySelector('select[name="Gear"]').value !== "None";
  const stock = parseInt(document.querySelector('input[name="stock"]').value);

  const containsAlphabet = (str) => /[a-zA-Z]/.test(str);

  if (!productName || !containsAlphabet(productName)) {
    toastr.warning(
      "Product name cannot be empty and must contain at least one alphabetic character."
    );
  } else if (
    !productDescription ||
    productDescription.length < 350 ||
    !containsAlphabet(productDescription)
  ) {
    toastr.warning(
      "Product description must be at least 350 characters long and contain at least one alphabetic character."
    );
  } else if (!brandSelected) {
    toastr.warning("Please select a brand.");
  } else if (!typeSelected) {
    toastr.warning("Please select a type.");
  } else if (!gearSelected) {
    toastr.warning("Please select a gear.");
  } else if (!price) {
    toastr.warning("Please fill in the price field.");
  } else if (isNaN(price) || price < 0) {
    toastr.warning("Price must be a non-negative number.");
  } else if (isNaN(stock) || stock < 0) {
    toastr.warning("Stock must be a non-negative number.");
  } else {
    editForm.submit();
  }
});

// ========= 🔍 Image Preview Logic ==========

// Preview for main image
document
  .getElementById("imageUpload1")
  ?.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById("mainImagePreview");
    if (file && preview) {
      preview.src = URL.createObjectURL(file);
    }
  });

// Preview for additional replacement images
document.querySelectorAll(".replace-image").forEach((input) => {
  input.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const index = this.dataset.index;
    const preview = document.querySelector(
      `.additional-preview[data-index="${index}"]`
    );
    if (file && preview) {
      preview.src = URL.createObjectURL(file);
    }
  });
});
