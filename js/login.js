const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async(event) => {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    const passwordPattern = /^[a-zA-Z0-9@#\-_]*$/;
    if (!passwordPattern.test(password)) {
      alert('Contraseña incorrecta');
      return; // Detener la ejecución del código si la contraseña contiene caracteres no permitidos
    }

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    if(!res.ok) return mensajeError.classList.toggle("escondido", false);
    const resJson = await res.json();
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});