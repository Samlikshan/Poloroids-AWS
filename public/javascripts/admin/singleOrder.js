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
  
        statusBtn.textContent = newStatus;
        statusBtn.className = `status-btn ${newStatus}`;
        this.closest(".status-options").style.display = "none";
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
  
  const pending = async (orderId,userId) => {
    const response = await fetch("/admin/update-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, userId, action: "pending" }),
    });
  };
  const canceled = async (orderId,userId) => {
    const response = await fetch("/admin/update-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, userId, action: "canceled" }),
    });
  };
  const delivered = async (orderId,userId) => {
    const response = await fetch("/admin/update-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, userId, action: "delivered" }),
    });
  };
  