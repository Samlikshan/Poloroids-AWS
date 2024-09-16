const removeItem = async (productId,wishlistId,element) => {
    const response = await fetch('/remove-wishlsit', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({productId,wishlistId})
    });
 
        if (response.ok) {
            // Remove the item from the DOM
            element.remove();
        } else {
            console.error('Failed to remove item');
        }
    
}