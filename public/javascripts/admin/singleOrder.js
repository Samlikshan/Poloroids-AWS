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

      // Call the corresponding function based on new status
      if (newStatus === "pending") {
        pending(orderId, userId);
      } else if (newStatus === "canceled") {
        canceled(orderId, userId);
      } else if (newStatus === "delivered") {
        delivered(orderId, userId);
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
