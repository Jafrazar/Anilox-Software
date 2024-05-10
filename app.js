const express = require("express");
const session = require('express-session');
const nodemailer = require('nodemailer');
const mysql = require('mysql');
const { anilloxAnalysis } = require("./utils/anillox-analysis");
const { anilloxHistory } = require("./utils/anillox-history");
const { clientInfo } = require("./utils/client-info");
const { anilloxList } = require("./utils/anillox-list");

const path = require('path');
const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'database-1.cspwdfignp82.sa-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '104#55Fppl2',
  database: 'ANILOX'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conexión exitosa a MySQL');
});

// Parse URL-encoded bodies
//app.use(express.urlencoded({ extended: true }));

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Middleware para permitir solicitudes desde cualquier dominio
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/index', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/', express.static(path.join(__dirname, '')));

// Ruta para registrar un usuario
app.post('/registro', (req, res) => {
  const { username, password, email, license } = req.body;
  const licenciaSql = 'SELECT * FROM licencias WHERE licenseNumber = ?';
  db.query(licenciaSql, [license], (err, result) => {
    if (err) throw err;
    if(result.length == 0){
      res.json('Licencia no válida');
    } else {
      const checkSql = 'SELECT * FROM login WHERE user_l = ? OR mail = ?';
      db.query(checkSql, [username, email], (err, result) => {
          if (err) throw err;
          if (result.length > 0) {
              res.json('El usuario ingresado ya existe');
              return;
              // res.json('El usuario ingresado ya existe');
              // return;
          } else {
              const sql = 'INSERT INTO login (user_l, pass_l, mail) VALUES (?, ?, ?)';
              db.query(sql, [username, password, email], (err, result) => {
                  if (err) throw err;
                  if (result.affectedRows === 0) {
                      res.json('Error al registrar el usuario');
                      return;
                  } else {
                      console.log('Usuario registrado nuevo:', result.insertId);
                      res.redirect('/');
                      return;
                  }
              });
          }
      });
    }
  });
  console.log('El registro antes de la ruta...:', username);
  res.redirect('/login.html');
  return;
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM login WHERE user_l = ? AND pass_l = ?';
  db.query(sql, [username, password], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      console.log('queso');
      res.redirect('./index.html');
      return;
    } else {
      res.json('Usuario o contraseña incorrectos');
    }
  });
});

app.post('/password', async (req, res) => {
  let { email } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: 'franco.delalcazar@qanders.com',
      pass: '104-55Fppl2'
    }
  });

  let mailOptions = {
    from: 'franco.delalcazar@qanders.com',
    to: email,
    subject: 'Recuperación de contraseña',
    text: 'Por favor, haz clic en el enlace para restablecer tu contraseña.'
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'No se pudo enviar el correo electrónico.' });
  }
});

app.get("/anillox-analysis", (req, res) => {
  res.send(anilloxAnalysis);
});

app.get("/anillox-analysis/:Anilox", (req, res) => {
  const Anilox = req.params.Anilox;
  const anilox = anilloxAnalysis[Anilox];

  if (anilox) {
    res.send(anilox);
  } else {
    res
      .status(404)
      .send({ error: "No se encontró anilox para el ID proporcionado." });
  }
});

app.get("/anillox-analysis/anilox/:numero", (req, res) => {
  const algo = req.params.numero;
  let contador = 0;

  for (let i = 0; i < anilloxAnalysis.anilox.length; i++) {
    if (anilloxAnalysis["anilox"][i].id == algo) {
      contador++;
      res.send(anilloxAnalysis["anilox"][i]);      
    }    
  }
  if(contador == 0){
    res.status(404).send({ error: "No se encontró anilox para el ID proporcionado." });
  }
});

app.get("/anillox-list", (req, res) => {
  res.send(anilloxList);
});

app.get("/anillox-list/:Anilox", (req, res) => {
  const Anilox = req.params.Anilox;
  const anilox = anilloxList[Anilox];

  if (anilox) {
    res.send(anilox);
  } else {
    res
      .status(404)
      .send({ error: "No se encontró anilox para el ID proporcionado." });
  }
});

app.get("/anillox-list/anilox/:numero", (req, res) => {
  const list = req.params.numero;
  let contador = 0;

  for (let i = 0; i < anilloxList.anilox.length; i++) {
    if (anilloxAnalysis["anilox"][i].id == list) {
      contador++;
      res.send(anilloxList["anilox"][i]);      
    }    
  }
  if(contador == 0){
    res.status(404).send({ error: "No se encontró anilox para el ID proporcionado." });
  }
});

app.get("/anillox-history", (req, res) => {
  res.send(anilloxHistory);
});

app.get("/anillox-history/:numeroAnilox", (req, res) => {
  const numeroAnilox = req.params.numeroAnilox;
  const history = anilloxHistory[numeroAnilox];

  if (history) {
    res.send(history);
  } else {
    res
      .status(404)
      .send({ error: "No se encontró historial para el ID proporcionado." });
  }
});

app.get("/anillox-history/:numeroAnilox/:id", (req, res) => {
  const numeroAnilox = req.params.numeroAnilox;
  const Anilox = anilloxHistory[numeroAnilox];
  const hist = req.params.id;
  const history = anilloxHistory[numeroAnilox][hist-1];

  if (Anilox) {
    if (history) {
        res.send(history);
    } else {
      res
        .status(404)
        .send({ error: "No se encontró muestra para el Anilox proporcionado." });
    }
  } else {
    res
      .status(404)
      .send({ error: "No se encontró historial para el ID proporcionado." });
  }
});

app.get("/client-info", (req, res) => {
  res.send(clientInfo);
});

app.get("/client-info/user", (req, res) => {
  if (clientInfo.user) {
    res.send(clientInfo.user);
  } else {
    res.status(404).send({ error: "No se encontró la propiedad 'user' en la información del cliente." });
  }
});

app.get("/client-info/license", (req, res) => {
  if (clientInfo.license) {
    res.send(clientInfo.license);
  } else {
    res.status(404).send({ error: "No se encontró la propiedad 'license' en la información del cliente." });
  }
});

app.get("/client-info/client", (req, res) => {
  if (clientInfo.client) {
    res.send(clientInfo.client);
  } else {
    res.status(404).send({ error: "No se encontró la propiedad 'client' en la información del cliente." });
  }
});

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
