document.addEventListener('DOMContentLoaded', () => {
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    const userId = new URLSearchParams(window.location.search).get('userId');

    yesButton.addEventListener('click', () => {
        window.location.href = `/game?userId=${userId}`;
    });

    noButton.addEventListener('click', () => {
        document.body.innerHTML = '<p>Thank you for your time.</p>';
    });
});
