document.getElementById("registro-form").addEventListener("submit", function(event) {
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('psw-repeat').value;
    const license = document.getElementById('license').value;

    const passwordPattern = /^[a-zA-Z0-9@#\-_]*$/;

    if (password !== password2) {
        alert('Las contraseñas no coinciden');
        return; // Detener la ejecución del código si las contraseñas no coinciden
    }

    if (!passwordPattern.test(password)) {
        alert('La contraseña contiene caracteres no permitidos');
        return; // Detener la ejecución del código si la contraseña contiene caracteres no permitidos
    }

    // fetch('/registro', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ username, email, password, license }),
    // })
    // .then(response => {
    //     if (response.validated) {
    //         console.log('Redirecting to login page');
    //         window.location.href = './login.html';
    //     } else {
    //         console.log('Response:', response);
    //         return response.json();
    //     }
    // })
    // .then(data => {
    //     if (response.validated) {
    //         console.log('Redirecting after data');
    //         window.location.href = './login.html';
    //     } else {
    //         console.log('Response after data not validated:', response);
    //         return response.json();
    //     }
    // })
    // .catch((error) => {
    //     console.error('Error:', error);
    // });
});