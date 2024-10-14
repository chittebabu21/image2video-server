document.getElementById('reset-password-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageElem = document.getElementById('message');

    if (newPassword !== confirmPassword) {
        messageElem.textContent = 'Passwords do not match...';
        messageElem.style.color = 'red';

        document.getElementById('email').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        return;
    }

    fetch('/api/users/update_password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email_address: email, password_hash: newPassword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Email address not found.');
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data.success) {
            messageElem.textContent = 'Password updated successfully!';
            messageElem.style.color = 'green';

            document.getElementById('email').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
            return;
        } else {
            messageElem.textContent = 'Failed to update password: ' + data.message;
            messageElem.style.color = 'red';

            document.getElementById('email').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
            return;
        }
    })
    .catch(error => {
        messageElem.textContent = 'An error occurred: ' + error.message;
        messageElem.style.color = 'red';

        document.getElementById('email').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        return;
    });
});