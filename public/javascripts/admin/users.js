document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-input");

  // Debounced server-side search
  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchUsers(searchInput.value.trim());
    }, 300);
  });

  // Fetch users based on search query
  async function fetchUsers(query) {
    try {
      const res = await fetch(`/admin/users?q=${encodeURIComponent(query)}`, {
        headers: {
          "X-Requested-With": "fetch",
        },
      });
      const data = await res.json();
      updateTable(data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  // Update table rows with new user data
  function updateTable(users) {
    const tbody = document.querySelector(".user-table tbody");
    tbody.innerHTML = "";

    users.forEach((user) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-username", user.username);
      tr.setAttribute("data-email", user.email);

      tr.innerHTML = `
        <td><a href="/admin/users/${user._id}">${user._id}</a></td>
        <td><a href="/admin/users/${user._id}">${user.username}</a></td>
        <td><a href="mailto:${user.email}">${user.email}</a></td>
        <td class="status-text">${user.isActive ? "Active" : "Inactive"}</td>
        <td>
          <button class="status-btn" data-id="${user._id}" data-status="${
        user.isActive
      }">
            ${user.isActive ? "Deactivate" : "Activate"}
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    attachStatusListeners(); // Re-attach button events
  }

  // Handle status toggle
  function attachStatusListeners() {
    document.querySelectorAll(".status-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const userId = button.dataset.id;
        const currentStatus = button.dataset.status === "true";

        try {
          const res = await fetch(`/admin/users/${userId}/toggle`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !currentStatus }),
          });

          if (res.ok) {
            button.dataset.status = (!currentStatus).toString();
            button.textContent = currentStatus ? "Activate" : "Deactivate";
            const statusCell = button
              .closest("tr")
              .querySelector(".status-text");
            statusCell.textContent = currentStatus ? "Inactive" : "Active";
          }
        } catch (err) {
          console.error("Error toggling status:", err);
        }
      });
    });
  }

  attachStatusListeners(); // Attach on page load
});
