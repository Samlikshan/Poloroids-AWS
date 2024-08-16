document.getElementById('newPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate form data
    if (password !== confirmPassword) {
        errorDisplay("Passwords do not match");
        return;
    }

    try {
        const response = await fetch('/admin/new-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        if (response.ok) {
            window.location.href = '/admin';
        } else {
            const errorData = await response.json();
            errorDisplay(errorData.message);
        }
    } catch (err) {
        console.log('error', err);
        errorDisplay('An unexpected error occurred.');
    }
});

// Function to display error messages
function errorDisplay(message) {
    const errorElement = document.querySelector('.error');
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        const newErrorElement = document.createElement('p');
        newErrorElement.classList.add('error');
        newErrorElement.textContent = message;
        document.querySelector('.New-password-container').prepend(newErrorElement);
    }
}
