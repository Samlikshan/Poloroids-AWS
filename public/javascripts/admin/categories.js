function openModal(categoryType, subCategories) {
    document.getElementById('modalTitle').textContent = 'Add Sub-Category to ' + categoryType;

    const keyFields = document.getElementById('keyFields');
    keyFields.innerHTML = '';

    try {
        const parsedSubCategories = JSON.parse(subCategories);

        parsedSubCategories.forEach(subCategory => {
            addField(subCategory);
        });
    } catch (e) {
        console.error('Error parsing subcategories:', e);
    }

    document.getElementById('categoryModal').style.display = 'block';
}

function addField(value = '') {
    const keyFields = document.getElementById('keyFields');
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'form-group';

    fieldDiv.innerHTML = `
        <input type="text" name="field[]" value="${value}" placeholder="Enter value" />
        <button type="button" class="remove-btn" onclick="removeField(this)">x</button>
    `;

    keyFields.appendChild(fieldDiv);
}

function removeField(button) {
    button.parentNode.remove();
}

function closeModal() {
    document.getElementById('categoryModal').style.display = 'none';
}
function saveCategories(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const categoryType = document.getElementById('categoryType').value;
    const fields = document.querySelectorAll('input[name="categoryName"]');
    const categories = Array.from(fields).map(field => ({ categoryName: field.value }));

    fetch('/admin/add-category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryType, categories })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            // Show error message in the modal
            const errorMessage = document.createElement('p');
            errorMessage.textContent = data.message;
            errorMessage.className = 'error-message'; // Style this as needed
            document.getElementById('keyFields').appendChild(errorMessage);
        } else {
            // Close the modal and possibly update UI
            closeModal();
            // Optionally, refresh the categories list
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'An error occurred while saving the category.';
        errorMessage.className = 'error-message';
        document.getElementById('keyFields').appendChild(errorMessage);
    });
}
