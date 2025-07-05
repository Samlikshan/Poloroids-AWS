document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-input");

  // Debounced search
  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchProducts(searchInput.value.trim());
    }, 300);
  });

  async function fetchProducts(query) {
    try {
      const res = await fetch(
        `/admin/products?q=${encodeURIComponent(query)}`,
        { headers: { "X-Requested-With": "fetch" } }
      );
      const data = await res.json();
      updateProductList(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  function updateProductList(products) {
    const container = document.querySelector(".products-list");
    container.innerHTML = "";

    products.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="/images/products/${
          product.mainImage
        }" alt="Product Image" class="product-image">
        <div class="product-info">
            <h2>${product.productName}</h2>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Type:</strong> ${product.type}</p>
            <p><strong>Gear:</strong> ${product.gear}</p>
            <p><strong>Quantity:</strong> ${product.stock}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Availability:</strong><span class="availability"> ${
              product.availability ? "Active" : "Inactive"
            }</span></p>
            <div class="product-actions">
                <a href="/admin/edit-product/${product._id}">
                    <button class="edit-btn">Edit</button>
                </a>
                <button class="status-btn" data-id="${
                  product._id
                }" data-status="${product.availability}">
                    ${product.availability ? "Deactivate" : "Activate"}
                </button>
            </div>
        </div>
      `;

      container.appendChild(card);
    });

    attachToggleListeners();
  }

  function attachToggleListeners() {
    document.querySelectorAll(".status-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
        const currentStatus = button.dataset.status === "true";

        try {
          const res = await fetch(`/admin/products/${id}/toggle`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ availability: !currentStatus }),
          });

          if (res.ok) {
            button.dataset.status = (!currentStatus).toString();
            button.textContent = currentStatus ? "Activate" : "Deactivate";

            const availabilityText = button
              .closest(".product-info")
              .querySelector(".availability");

            availabilityText.textContent = currentStatus
              ? "Inactive"
              : "Active";
          }
        } catch (err) {
          console.error("Failed to toggle product availability", err);
        }
      });
    });
  }

  attachToggleListeners(); // Attach on initial load
});
