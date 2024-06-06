const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("registro-form").addEventListener("submit", async(event) => {
    event.preventDefault();
    const username_su = document.getElementById('username-supervisor').value;
    const email_su = document.getElementById('email-supervisor').value;
    const password_su = document.getElementById('password-supervisor').value;
    const password2_su = document.getElementById('psw-repeat-supervisor').value;

    const username_op = document.getElementById('username-operario').value;
    const email_op = document.getElementById('email-operario').value;
    const password_op = document.getElementById('password-operario').value;
    const password2_op = document.getElementById('psw-repeat-operario').value;

    const passwordPattern = /^[a-zA-Z0-9@#\-_]*$/;

    if (password_su !== password2_su) {
        alert('Las contraseñas del supervisor no coinciden');
        return;
    }

    if (!passwordPattern.test(password_su)) {
        alert('La contraseña del supervisor contiene caracteres no permitidos');
        return; 
    }

    if (password_op !== password2_op) {
        alert('Las contraseñas del operario no coinciden');
        return; 
    }

    if (!passwordPattern.test(password_op)) {
        alert('La contraseña del operario contiene caracteres no permitidos');
        return; 
    }
    
    const res = await fetch('/api/registro_licencia', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username_su, email_su, password_su, username_op, email_op, password_op }),
    });

    console.log(mensajeError);
    if(!res.ok) return mensajeError.classList.toggle("escondido", false);
    const resJson = await res.json();
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});