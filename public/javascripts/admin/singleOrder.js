document.addEventListener("DOMContentLoaded", function () {
  const statusButtons = document.querySelectorAll(
    ".status-container .status-btn"
  );

  statusButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const statusOptions = this.nextElementSibling;

      // Close all other status options
      document.querySelectorAll(".status-options").forEach((option) => {
        if (option !== statusOptions) {
          option.style.display = "none";
        }
      });

      statusOptions.style.display =
        statusOptions.style.display === "block" ? "none" : "block";
    });
  });

  const statusOptionsLinks = document.querySelectorAll(".status-options a");

  statusOptionsLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const newStatus = this.getAttribute("data-status");
      const statusBtn =
        this.closest(".status-container").querySelector(".status-btn");
      const currentStatus = statusBtn.textContent.trim(); // Get the current status

      // Prevent changing status if already canceled
      // Prevent changing status if already canceled
      if (currentStatus === "canceled") {
        toastr.warning("This order has been canceled and cannot be updated.");
        return; // Exit the function to prevent further actions
      }

      // Prevent changing status back to pending if already delivered
      if (currentStatus === "delivered" && newStatus === "pending") {
        toastr.warning(
          "This order has been delivered and cannot be changed back to pending."
        );
        return; // Exit the function to prevent further actions
      }

      // Update the status display
      statusBtn.textContent = newStatus;
      statusBtn.className = `status-btn ${newStatus}`;
      this.closest(".status-options").style.display = "none";

      // Get orderId and userId from data attributes
      const orderId = this.getAttribute("data-order-id");
      const userId = this.getAttribute("data-user-id");
      const itemId = this.getAttribute("data-order-itemId");

      // Call the corresponding function based on new status
      // if (newStatus === "pending") {
      //   pending(orderId, userId);
      // } else if (newStatus === "canceled") {
      //   canceled(orderId, userId);
      // } else if (newStatus === "delivered") {
      //   delivered(orderId, userId);
      // }
      if (newStatus === "pending") {
        updateStatus(orderId, userId, "pending", itemId);
      } else if (newStatus === "canceled") {
        updateStatus(orderId, userId, "canceled", itemId);
      } else if (newStatus === "delivered") {
        updateStatus(orderId, userId, "delivered", itemId);
      }
    });
  });

  // Close the dropdown if clicked outside
  document.addEventListener("click", function (event) {
    if (!event.target.matches(".status-btn")) {
      const statusOptions = document.querySelectorAll(".status-options");
      statusOptions.forEach((options) => (options.style.display = "none"));
    }
  });

  document.querySelectorAll(".return-action-btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const orderId = btn.dataset.orderId;
      const itemId = btn.dataset.itemId;
      const action = btn.dataset.action;

      const result = await Swal.fire({
        title: `Are you sure you want to ${action} this return?`,
        showCancelButton: true,
        confirmButtonText: "Yes",
      });

      if (!result.isConfirmed) return;

      const res = await fetch("/admin/order/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, itemId, action }),
      });

      const data = await res.json();
      if (data.success) {
        Swal.fire(`Return ${action} successfully`, "", "success");
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        toastr.error(data.message || "Error processing request");
      }
    });
  });
});

const pending = async (orderId, userId) => {
  await fetch("/admin/update-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, userId, action: "pending" }),
  });
};

const canceled = async (orderId, userId) => {
  await fetch("/admin/update-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, userId, action: "canceled" }),
  });
};

const delivered = async (orderId, userId) => {
  await fetch("/admin/update-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, userId, action: "delivered" }),
  });
};

const updateStatus = async (orderId, userId, action, itemId) => {
  console.log("requesting...");
  const response = await fetch("/admin/update-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, userId, action, itemId }),
  });

  if (response.ok) {
    // Update the status button (already done)
    const statusBtn = document.querySelector(
      `.status-btn[data-order-id="${orderId}"]`
    );
    if (statusBtn) {
      statusBtn.textContent = action;
      statusBtn.className = `status-btn ${action}`;
    }

    // Update the product item status in the product section
    const itemStatusEl = document.querySelector(
      `.item-status[data-item-id="${itemId}"]`
    );
    if (itemStatusEl) {
      itemStatusEl.innerHTML = `<span>Status :</span> ${action}`;
    }

    // Hide all status dropdowns
    document.querySelectorAll(".status-options").forEach((el) => {
      el.style.display = "none";
    });

    toastr.success("Order status updated successfully.");
  }
};
