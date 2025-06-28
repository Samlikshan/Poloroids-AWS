document.addEventListener("DOMContentLoaded", function () {
  const statusButtons = document.querySelectorAll(
    ".status-container .status-btn"
  );

  statusButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const statusOptions = this.nextElementSibling;
      const currentStatus = this.textContent.trim();

      // Prevent dropdown from opening if canceled
      if (currentStatus === "canceled") {
        toastr.warning("This order has been canceled and cannot be updated.");
        return;
      }

      // Close all other dropdowns
      document.querySelectorAll(".status-options").forEach((option) => {
        if (option !== statusOptions) {
          option.style.display = "none";
        }
      });

      // Toggle current dropdown
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
      const currentStatus = statusBtn.textContent.trim();

      if (currentStatus === "canceled") {
        toastr.warning("This order has been canceled and cannot be updated.");
        return;
      }
      if (currentStatus === "returned") {
        toastr.warning("This order has been returned and cannot be updated.");
        return;
      }

      if (currentStatus === "delivered" && newStatus === "pending") {
        toastr.warning(
          "This order has been delivered and cannot be changed back to pending."
        );
        return;
      }

      if (currentStatus === "canceled" && newStatus === "delivered") {
        toastr.warning(
          "This order has been canceled and cannot be marked as delivered."
        );
        return;
      }

      // Update button UI
      statusBtn.textContent = newStatus;
      statusBtn.className = `status-btn ${newStatus}`;
      this.closest(".status-options").style.display = "none";

      // Get IDs
      const orderId = this.getAttribute("data-order-id");
      const userId = this.getAttribute("data-user-id");
      const itemId = this.getAttribute("data-order-itemId");
      // Trigger server update
      if (newStatus === "pending") {
        updateStatus(orderId, userId, "pending", itemId);
      } else if (newStatus === "canceled") {
        updateStatus(orderId, userId, "canceled", itemId);
      } else if (newStatus === "delivered") {
        updateStatus(orderId, userId, "delivered", itemId);
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener("click", function (event) {
    if (!event.target.matches(".status-btn")) {
      document.querySelectorAll(".status-options").forEach((options) => {
        options.style.display = "none";
      });
    }
  });
});

const pending = async (orderId, userId, itemId) => {
  console.log("requesting...");
  await fetch("/admin/update-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, userId, action: "pending" }),
  });
};

const canceled = async (orderId, userId, itemId) => {
  console.log("requesting...");
  await fetch("/admin/update-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, userId, action: "canceled" }),
  });
};

const delivered = async (orderId, userId, itemId) => {
  console.log("requesting...");
  await fetch("/admin/update-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, userId, action: "delivered" }),
  });
};

const updateStatus = async (orderId, userId, action, itemId) => {
  console.log("requesting...");
  await fetch("/admin/update-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, userId, action, itemId }),
  });
};
