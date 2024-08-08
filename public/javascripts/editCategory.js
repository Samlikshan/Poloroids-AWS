function addField() {
    const dynamicKeyFields = document.getElementById('dynamicKeyFields');
    const newField = document.createElement('div');
    newField.className = 'key-field';
    newField.innerHTML = `
        <input type="text" name="subCategories" placeholder="Category">
        <button type="button" class="delete-btn" onclick="removeField(this)">&#10006;</button>
    `;
    dynamicKeyFields.appendChild(newField);
}

function removeField(button) {
    // This now checks if the parent div has other elements, if not, it removes the parent div itself.
    const parentDiv = button.parentNode.parentNode;
    parentDiv.removeChild(button.parentNode);
    if (parentDiv.children.length === 0 && parentDiv.id === 'dynamicKeyFields') {
        parentDiv.parentNode.removeChild(parentDiv); // This ensures no empty divs are left in the DOM.
    }
}


document.getElementById('categoryForm').onsubmit = function(event) {
    const inputFields = document.querySelectorAll('input[name="subCategories"]');
    for (let input of inputFields) {
        if (input.value.trim() === '') { // Check if the input is empty (ignoring whitespace)
            alert('Please fill in all subcategory fields or remove empty ones.');
            event.preventDefault(); // Prevent form submission
            return false; // Stop the function
        }
    }
};

