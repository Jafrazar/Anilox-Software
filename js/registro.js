const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("registro-form").addEventListener("submit", async(event) => {
    event.preventDefault();    
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
    
    const res = await fetch('/api/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, license }),
    });

    console.log(mensajeError);
    if(!res.ok) return mensajeError.classList.toggle("escondido", false);
    const resJson = await res.json();
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});