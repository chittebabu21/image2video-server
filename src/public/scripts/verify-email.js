const pathSegments = window.location.pathname.split('/');
const token = pathSegments[pathSegments.length - 1];
const messageElem = document.getElementById('message');
const confirmButton = document.getElementById('confirm-button');

confirmButton.addEventListener('click', () => {
    fetch(`/api/users/verify_user/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok...');
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data.success) {
            messageElem.textContent = 'Email verified successfully!';
            messageElem.style.color = 'green';
        } else {
            messageElem.textContent = 'Failed to verify email: ' + data.message;
            messageElem.style.color = 'red';
        }
    })
    .catch(error => {
        messageElem.textContent = 'An error occurred: ' + error.message;
        messageElem.style.color = 'red';
    });
});