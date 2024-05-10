document.getElementById("login-form").addEventListener("submit", function(event) {
  
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    const passwordPattern = /^[a-zA-Z0-9@#\-_]*$/;
    console.log("algo");
    if (!passwordPattern.test(password)) {
      alert('Contraseña incorrecta');
      return; // Detener la ejecución del código si la contraseña contiene caracteres no permitidos
    }

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch((error) => {
        console.error('Error:', error);
    });
});