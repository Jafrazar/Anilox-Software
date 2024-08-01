const express = require('express');
const path = require('path');
const mysql = require('mysql');
const db = mysql.createPool({
    host: 'database-1.crkw6qaew4si.sa-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '104-55Fppl2',
    database: 'ANDERS'
});

db.getConnection((err) => {
    if (err) throw err;
    console.log('Conexión exitosa a MySQL');
});

const app = express();
let volData = [], eolDates = [];

function calcularRectaTendencia(eolDates, volData) {
    // Convertir fechas a valores numéricos (timestamp)
    const x = eolDates.map(date => new Date(date).getTime());
    const y = volData;
  
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;
  
    // Calcular los puntos de la recta de tendencia
    const tendencia = x.map(xi => ({
      x: new Date(xi).toISOString().split('T')[0], // Convertir de nuevo a formato de fecha
      y: m * xi + b
    }));
  
    return { tendencia, m, b };
}

function extenderFechas(eolDates, numPuntos) {
    const fechasExtendidas = [...eolDates];
    let ultimaFecha = new Date(eolDates[eolDates.length - 1]);
  
    for (let i = eolDates.length; i < numPuntos; i++) {
      ultimaFecha.setMonth(ultimaFecha.getMonth() + 6);
      fechasExtendidas.push(ultimaFecha.toISOString().split('T')[0]);
    }
  
    return fechasExtendidas;
}

sql = 'SELECT * FROM anilox_history WHERE anilox = ?'
db.query(sql, ["AA0000001"], (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
        volData[i] = result[i].volume;
        result.forEach(row => {
            if(row.date) {
              let date = new Date(row.date);
              row.date = date.toISOString().split('T')[0]; // Esto devolverá la fecha en formato 'YYYY-MM-DD'
            }
        });
        eolDates[i] = result[i].date;
    }
    console.log("Datos de volumen: " + volData);
    console.log("Fechas de EOL: " + eolDates);
    const numPuntos = 2 * volData.length + 1; // 19 en este caso
    const fechasExtendidas = extenderFechas(eolDates, numPuntos);
    const { m, b } = calcularRectaTendencia(eolDates, volData);

    // Calcular los puntos de tendencia para las fechas extendidas
    const puntosTendenciaExtendida = fechasExtendidas.map(fecha => {
        const xi = new Date(fecha).getTime();
        return {
            x: fecha,
            y: (m * xi + b).toFixed(3)
        };
    });
    // const puntosTendencia = calcularRectaTendencia(eolDates, volData);
    console.log(puntosTendenciaExtendida);
});
// Ejemplo de uso
// const eolDates = ['2023-01-01', '2023-02-01', '2023-03-01'];
// const volData = [10, 20, 30];


app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});