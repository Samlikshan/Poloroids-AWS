document.querySelectorAll('.status-btn').forEach(button => {
    button.addEventListener('click', function() {
        let statusCell = this.parentNode.previousElementSibling; // Gets the status cell
        if (this.textContent === 'Deactivate') {
            this.textContent = 'Activate';
            statusCell.textContent = 'Inactive';
        } else {
            this.textContent = 'Deactivate';
            statusCell.textContent = 'Active';
        }
    });
});
