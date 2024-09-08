document.addEventListener("DOMContentLoaded", function () {
    let timerElement = document.getElementById("timer");
    let resendLink = document.getElementById("resendLink");
    let countdown;

    function startTimer(duration) {
        let timeLeft = duration;

        // Disable the link by adding a class and preventing the default behavior
        resendLink.classList.add('disabled');
        resendLink.style.pointerEvents = 'none'; // Disable clicks on the link

        countdown = setInterval(function () {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;

            // Format time as mm:ss
            timerElement.textContent = `00:${seconds < 10 ? "0" : ""}${seconds}`;

            // Check if time has run out
            if (--timeLeft < 0) {
                clearInterval(countdown);
                resendLink.classList.remove('disabled');
                resendLink.style.pointerEvents = 'auto'; // Re-enable clicks on the link
            }
        }, 1000);
    }

    // Start the timer when the page loads
    startTimer(30); // Start the 30-second timer

    resendLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default link behavior
        clearInterval(countdown); // Clear any existing timer
        startTimer(30); // Start the timer again
    });
});



document.getElementById('otpForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Collect form values
    // Collect OTP values from input fields
    const otp1 = document.getElementById('otp1').value;
    const otp2 = document.getElementById('otp2').value;
    const otp3 = document.getElementById('otp3').value;
    const otp4 = document.getElementById('otp4').value;

    const otp = otp1 + otp2 + otp3 + otp4;

    try {
        const response = await fetch('/auth/forgotVerify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp })
        });

        if (response.ok) {
            console.log('hai')
            window.location.href= '/auth/resetPassword'
        } else {
            console.log('error')
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
        document.querySelector('.verify-container').prepend(newErrorElement);
    }
}
