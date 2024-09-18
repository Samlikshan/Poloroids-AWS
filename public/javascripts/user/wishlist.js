const removeItem = async (productId, wishlistId, element) => {
  Swal.fire({
    title: "Do you want to remove this item from wishlist?",
    showCancelButton: true,
    confirmButtonText: "Yes",
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      const response = await fetch("/remove-wishlsit", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, wishlistId }),
      });

      if (response.ok) {
        // Remove the item from the DOM
        element.remove();
      } else {
        console.error("Failed to remove item");
      }
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
};
