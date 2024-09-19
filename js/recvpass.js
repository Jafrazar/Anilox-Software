document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('recover-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        console.log('email: ', email);
        recoverPassword(email);
    });
});

async function recoverPassword(email) {
    await fetch('/api/recover', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Se envió un correo para recuperar su contraseña. Revise su bandeja de entrada');
            window.location.href = '/login.html';
        } else {
            alert('Hubo un error al intentar recuperar la contraseña.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al intentar recuperar la contraseña.');
    });
}