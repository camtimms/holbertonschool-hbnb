async function handleRegister(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');

    // Hide previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Validate password confirmation
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.style.display = 'block';
        return;
    }

    // Validate password length
    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters long';
        errorDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('/api/v1/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Registration successful
            successDiv.textContent = 'Account created successfully! Redirecting to login...';
            successDiv.style.display = 'block';

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            // Show error message
            errorDiv.textContent = data.error || 'Registration failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.style.display = 'block';
    }
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/v1/auth/protected', {
            credentials: 'include'
        });

        if (response.ok) {
            // Already logged in, redirect to home
            window.location.href = '/';
        }
    } catch (error) {
        // Not logged in, stay on registration page
    }
});

// Real-time password confirmation validation
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirmPassword').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        const confirmPassword = this.value;

        if (confirmPassword && password !== confirmPassword) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#5B692C';
        }
    });
});