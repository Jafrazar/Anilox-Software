const path = require('path');
require('dotenv').config();
module.exports = { path };

const express = require("express");
const { login, registro, registro_licencia, password_recovery, soloAdmin, soloPublico, tablaAniloxAnalysis, tablaAniloxList, cotizaciones,
        tablaUsuarios, tablaClientes, tablaLicencias, tablaAniloxHistory, borrarAnilox, generarPdf } = require("./controllers/autenticacion");

const app = express();
const port = 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json({limit: '50mb'}));

// Middleware para permitir solicitudes desde cualquier dominio
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Configuración
app.get('/index', soloAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', soloAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/', soloPublico, (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login', soloPublico, function(req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login.html', soloPublico, function(req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/registro', soloPublico, (req, res) => {
  res.sendFile(path.join(__dirname, 'registro.html'));
});

app.get('/registro.html', soloPublico, (req, res) => {
  res.sendFile(path.join(__dirname, 'registro.html'));
});

app.get('/registro_licencia', soloPublico, (req, res) => {
  res.sendFile(path.join(__dirname, 'registro_licencia.html'));
});

app.get('/registro_licencia.html', soloPublico, (req, res) => {
  res.sendFile(path.join(__dirname, 'registro_licencia.html'));
});

app.get('rcvpass', soloPublico, function(req, res) {
  res.sendFile(path.join(__dirname, 'rcvpass.html'));
});

app.get('/rcvpass.html', soloPublico, function(req, res) {
  res.sendFile(path.join(__dirname, 'rcvpass.html'));
});

app.get('/anilox-detail', soloAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'anilox-detail.html'));
});

app.get('/anilox-detail.html', soloAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'anilox-detail.html'));
});

app.get('/ayuda', soloAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'ayuda.html'));
});

app.get('/ayuda.html', soloAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'ayuda.html'));
});

app.get('/export-data', soloAdmin, function(req, res) {
  res.sendFile(path.join(__dirname, 'export-data.html'));
});

app.get('/export-data.html', soloAdmin, function(req, res) {
  res.sendFile(path.join(__dirname, 'export-data.html'));
});

app.get('/listado', soloAdmin, function(req, res) {
  res.sendFile(path.join(__dirname, 'listado.html'));
});

app.get('/listado.html', soloAdmin, function(req, res) {
  res.sendFile(path.join(__dirname, 'listado.html'));
});

app.get('/print-report', soloAdmin, function(req, res) {
  res.sendFile(path.join(__dirname, 'print-report.html'));
});

app.get('/print-report.html', soloAdmin, function(req, res) {
  res.sendFile(path.join(__dirname, 'print-report.html'));
});

app.get('/upload-file', soloAdmin, function(req, res) {
  res.sendFile(path.join(__dirname, 'upload-file.html'));
});

app.get('/upload-file.html', soloAdmin, function(req, res) {
  res.sendFile(path.join(__dirname, 'upload-file.html'));
});

app.get('/req-quotes', soloAdmin, function(req, res) {
  res.sendFile(path.join(__dirname, 'req-quotes.html'));
});

app.get('/req-quotes.html', soloAdmin, function(req, res) {
  res.sendFile(path.join(__dirname, 'req-quotes.html'));
});

// Rutas
app.use('/', express.static(path.join(__dirname, '')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));

// app.get('/admin', soloAdmin, (req, res) => {
//   res.send('Bienvenido a la página de administrador');
// });
app.post('/api/login', login);
app.post('/api/registro', registro);
app.post('/api/registro_licencia', registro_licencia);
app.post('/api/analysis', tablaAniloxAnalysis);
app.post('/api/listado', tablaAniloxList);
app.post('/api/anilox-history', tablaAniloxHistory);
app.post('/api/request-quotes', cotizaciones);
app.post('/api/borrar-anilox', borrarAnilox);
app.post('/api/usuarios', tablaUsuarios);
app.post('/api/clientes', tablaClientes);
app.post('/api/licencias', tablaLicencias);
app.post('/api/pdf', generarPdf);
app.post('/api/recover', password_recovery);

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});

