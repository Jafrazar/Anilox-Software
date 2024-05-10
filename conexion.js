// server.js
const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Configura la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'tu_usuario',
    password: 'tu_contrasena',
    database: 'nombre_de_tu_base_de_datos'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conexión exitosa a MySQL');
});

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Ruta para registrar un usuario
app.post('/registro', (req, res) => {
    const { username, email, password } = req.body;
    const sql = 'INSERT INTO usuarios (nombre_de_usuario, correo_electronico, contrasena) VALUES (?, ?, ?)';
    db.query(sql, [username, email, password], (err, result) => {
        if (err) throw err;
        console.log('Usuario registrado:', result.insertId);
        res.send('Usuario registrado correctamente');
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});