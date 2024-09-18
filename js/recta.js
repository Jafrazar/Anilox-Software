const express = require('express');
const path = require('path');
const mysql = require('mysql');
const db = mysql.createPool({
    host: 'anxsuite.crkw6qaew4si.sa-east-1.rds.amazonaws.com',
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

function calcularRectaTendencia(eolDates, volData, limite) {
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

    // Generar puntos en fechas futuras hasta que el valor sea menor o igual al límite
    let ultimaFecha = new Date(eolDates[eolDates.length - 1]);
    let ultimoValor = tendencia[tendencia.length - 1].y;
    let b2 = b > 200 ? 2 : b > 100 ? 3 : 6;

    if ( m < -0.000000000005 ) {
        while (ultimoValor > limite) {
            ultimaFecha.setMonth(ultimaFecha.getMonth() + b2); // Incrementar la fecha en 6 meses o 3 meses dependiendo de la intersección
            const nuevaFecha = ultimaFecha.getTime();
            ultimoValor = m * nuevaFecha + b;
            console.log("ultimoValor: ", ultimoValor);
            tendencia.push({
                x: ultimaFecha.toISOString().split('T')[0],
                y: ultimoValor
            });
        }
    }
  
    return { tendencia, m, b };
}

function extenderFechas(eolDates, numPuntos) {
    const fechasExtendidas = [...eolDates];
    let ultimaFecha = new Date(eolDates[eolDates.length - 1]);
    console.log("ultimaFecha: ", ultimaFecha);
    for (let i = eolDates.length; i < numPuntos; i++) {
      ultimaFecha.setMonth(ultimaFecha.getMonth() + 6);
      fechasExtendidas.push(ultimaFecha.toISOString().split('T')[0]);
    }
  
    return fechasExtendidas;
}

// sql = 'SELECT * FROM anilox_history WHERE anilox = ?'
// db.query(sql, ["AA0000001"], (err, result) => {
//     if (err) throw err;
//     for (let i = 0; i < result.length; i++) {
//         volData[i] = result[i].volume;
//         result.forEach(row => {
//             if(row.date) {
//               let date = new Date(row.date);
//               row.date = date.toISOString().split('T')[0]; // Esto devolverá la fecha en formato 'YYYY-MM-DD'
//             }
//         });
//         eolDates[i] = result[i].date;
//     }
//     console.log("Datos de volumen: " + volData);
//     console.log("Fechas de EOL: " + eolDates);
//     const numPuntos = 2 * volData.length + 1; // 19 en este caso
//     const fechasExtendidas = extenderFechas(eolDates, numPuntos);
//     const { m, b } = calcularRectaTendencia(eolDates, volData);

//     // Calcular los puntos de tendencia para las fechas extendidas
//     const puntosTendenciaExtendida = fechasExtendidas.map(fecha => {
//         const xi = new Date(fecha).getTime();
//         return {
//             x: fecha,
//             y: (m * xi + b).toFixed(3)
//         };
//     });
//     // const puntosTendencia = calcularRectaTendencia(eolDates, volData);
//     console.log(puntosTendenciaExtendida);
// });
// Ejemplo de uso
// const eolDates = ['2023-01-01', '2023-02-01', '2023-03-01'];
// const volData = [10, 20, 30];

app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});

const Dates = ["2024-05-16", "2024-05-17", "2024-05-23", "2024-08-28"];

let Data = [8.4, 8.7, 8.5, 6.8];
Data = Data.map(Number => parseFloat(Number/1.55));
console.log(Data);
const limite = 0.6*6;

const resultado = calcularRectaTendencia(Dates, Data, limite);
console.log(resultado);
