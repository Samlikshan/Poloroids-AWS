function addField() {
    const keyFields = document.getElementById('keyFields');
    const newField = document.createElement('div');
    newField.className = 'key-field';
    newField.innerHTML = `
        <input type="text" name="subCategories" placeholder="Category">
        <button type="button" class="delete-btn" onclick="removeField(this)">&#10006;</button>
    `;
    keyFields.appendChild(newField);
}

function removeField(button) {
    const keyFields = document.getElementById('keyFields');
    keyFields.removeChild(button.parentElement);
}
