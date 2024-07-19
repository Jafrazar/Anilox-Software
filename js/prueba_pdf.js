const { Chart } = require('chart.js/auto');
const ChartDataLabels = require('chartjs-plugin-datalabels');
Chart.register(ChartDataLabels);
const { createCanvas } = require('canvas');
const { PDFNet } = require("@pdftron/pdfnet-node");// Asegúrate de inicializar PDFNet en algún lugar al inicio de tu aplicación
const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const mysql = require('mysql');
const exp = require('constants');

const db = mysql.createPool({
    host: 'database-1.crkw6qaew4si.sa-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '104-55Fppl2',
    database: 'ANDERS'
});

const app = express();
const pdfPath = "./modelo_reporte_final.pdf";

async function obtenerDatosAnilox(anilox) {
    return new Promise((resolve, reject) => {
        const sql2 = 'SELECT * FROM anilox_list WHERE id=?';
        db.query(sql2, [anilox], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function procesarAnilox(anilox) {
    try {
        const rows2 = await obtenerDatosAnilox(anilox);
        let fabricante = rows2[0].brand;
        let revision = rows2[0].revision.replace('data:image/jpeg;base64,', '');
        let tapadas_img = generarGrafico(cleanGraphConfig).replace('data:image/jpeg;base64,', '');
        let danadas_img = generarGrafico(damagedGraphConfig).replace('data:image/jpeg;base64,', '');
        let desgastadas_img = generarGrafico(wearGraphConfig).replace('data:image/jpeg;base64,', '');
        return revision;
        // Continuar con el procesamiento de los datos aquí
    } catch (err) {
        throw err;
    }
}

async function addBase64ImageToPDF(base64Image, options) {    
    await PDFNet.initialize("demo:1720195871717:7f8468a2030000000072c68a051f8b60b73e2b966862266ca0be4eacb7");
    // Cargar el documento PDF una vez y modificarlo en llamadas sucesivas
    const pdfDoc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
    await pdfDoc.initSecurityHandler();
    const page = await pdfDoc.getPage(1);
    const pageSet = await PDFNet.PageSet.createRange(1, 1);
    console.log(pageSet);

    // Convertir la cadena base64 a buffer y escribirlo en un archivo temporal
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const tempImagePath = path.join(os.tmpdir(), 'tempImage.jpg'); // Asegúrate de usar la extensión correcta
    fs.writeFileSync(tempImagePath, imageBuffer);

    // Cargar la imagen desde el archivo temporal
    const pdfImage = await PDFNet.Image.createFromFile(pdfDoc, tempImagePath);

    // Definir la posición y el tamaño de la imagen
    const rect = await PDFNet.Rect.init(options.x, options.y, options.x + options.width, options.y + options.height);

    // Usar PDFNet.Stamper para colocar la imagen en el documento PDF
    const stamper = await PDFNet.Stamper.create(PDFNet.Stamper.SizeType.e_absolute_size, options.width, options.height);
    stamper.setAlignment(PDFNet.Stamper.HorizontalAlignment.e_horizontal_left, PDFNet.Stamper.VerticalAlignment.e_vertical_top);
    stamper.setPosition(options.x, options.y);
    await stamper.stampImage(pdfDoc, pdfImage, pageSet);

    // Guardar el documento PDF modificado después de todas las modificaciones
    const outputPath = 'output.pdf';
    pdfDoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
    // Opcional: Eliminar el archivo temporal de la imagen
    fs.unlinkSync(tempImagePath);
}

const coord_revision = {
    x: 240,     y: 210,     // 270 y 300
    width: 120, height: 120 // 100 y 100
};

const coord_tapadas = {
    x: 100,     y: 300,
    width: 120, height: 120
};

const coord_danadas = {
    x: 230,     y: 300,
    width: 120, height: 120   
};

const coord_desgastadas = {
    x: 360,     y: 300,
    width: 120, height: 120
};


// Llamar a addBase64ImageToPDF según sea necesario
console.log(procesarAnilox('AS183209'));
addBase64ImageToPDF(procesarAnilox('AS183209'), coord_revision);
//await addBase64ImageToPDF(pdfDoc, base64Image2, options2);

app.get("/generarReporte", async (req, res) => {
    res.sendFile(path.join(__dirname, 'output.pdf'));
});