const { Chart } = require('chart.js/auto');
const ChartDataLabels = require('chartjs-plugin-datalabels');
Chart.register(ChartDataLabels);
const { createCanvas } = require('canvas');
const { PDFNet } = require("@pdftron/pdfnet-node");
const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
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
let anilox = 'AS183209'; let fecha; let fabricante=""; let revision="";
let danadas; let desgastadas; let tapadas;
let tapadas_img; let danadas_img; let desgastadas_img;
const pdfPath = "./modelo_reporte_final2.pdf";

async function addBase64ImageToPDF(doc, pSet, base64Image, options) {    
    const imageBuffer = Buffer.from(base64Image, 'base64'); // Convertir la cadena base64 a buffer 
    const tempImagePath = path.join(os.tmpdir(), 'tempImage.jpg'); 
    fs.writeFileSync(tempImagePath, imageBuffer); // Escribir la cadena en un archivo temporal 

    const pdfImage = await PDFNet.Image.createFromFile(doc, tempImagePath); // Cargar la imagen desde el archivo temporal

    // Usar PDFNet.Stamper para colocar la imagen en el documento PDF
    const stamper = await PDFNet.Stamper.create(PDFNet.Stamper.SizeType.e_absolute_size, options.width, options.height);
    stamper.setAlignment(PDFNet.Stamper.HorizontalAlignment.e_horizontal_left, PDFNet.Stamper.VerticalAlignment.e_vertical_top);
    stamper.setPosition(options.x, options.y);
    try {
        await stamper.stampImage(doc, pdfImage, pSet);
    } catch (error) {
        console.error('Error al estampar la imagen:', error);
    }
    fs.unlinkSync(tempImagePath); // Opcional: Eliminar el archivo temporal de la imagen 
}

sql = 'SELECT * FROM anilox_analysis WHERE id = ?'
db.query(sql, ['AS183209'], (err, rows) => {
    if (err) throw err;
    tapadas = parseFloat(rows[0].tapadas),
    limpias = 100 - tapadas,
    danadas = parseFloat(rows[0].danadas),
    sinDano = 100 - danadas,
    desgastadas = parseFloat(rows[0].desgastadas),
    sinDesgaste = 100 - desgastadas;
    console.log(tapadas, limpias, danadas, sinDano, desgastadas, sinDesgaste);

    dataCleanStat = {
        labels: [
            'Limpias',
            'Tapadas',
        ],
        datasets: [{
            data: [limpias, tapadas],
            backgroundColor: [
            'rgba(231,255,23,0.35)',
            'rgba(255,76,163,0.35)',
            ],
            hoverOffset: 4,
        }],
    };
    
    dataDamagedStat = {
        labels: [
            'Sin Daño',
            'Dañadas',
        ],
        datasets: [{
            data: [sinDano, danadas],
            backgroundColor: [
            'rgba(231,255,23,0.35)',
            'rgba(255,76,163,0.35)',
            ],
            hoverOffset: 4,
        }]
    };
    
    dataWearStat = {
        labels: [
            'Sin Desgaste',
            'Desgastadas',
        ],
        datasets: [{
            data: [sinDesgaste, desgastadas],
            backgroundColor: [
            'rgba(231,255,23,0.35)',
            'rgba(255,76,163,0.35)',
            ],
            hoverOffset: 4,
        }]
    };
    
    cleanGraphConfig = {
        type: "doughnut",
        data: dataCleanStat,
        options: {
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            plugins: {
                title: {
                    display: true,
                    align: "center",
                    color: "#363949",
                    font: {
                        weight: 550,
                        size: 22,
                    },
                    padding: {
                        top: 10,
                        bottom: 10,
                    },
                    text: '% Celdas Tapadas'
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        font: {
                            weight: 550,
                            size: 14,
                        },
                        padding: 15,
                        boxWidth: 35,
                    },
                    reverse: true,
                },
                datalabels:{
                    color: '#363949',
                    anchor: 'center',
                    font: {
                        size: 16,
                        weight: 550,
                    },
                    formatter: function(value){
                        return value + '%';
                    }
                },
                tooltip: {
                    enabled: true,
                    titleFont: {
                        size: 16,
                        weight: 550,
                    },
                    bodyFont: {
                        size: 14,
                        weight: 550,
                    },
                    callbacks: {  
                        label: function(context){
                            let data = context.parsed;    
                            return ' ' + data + '%';
                        },
                    },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    };
    //cleanGraph = new Chart($cleanGraph, cleanGraphConfig);
    
    damagedGraphConfig = {
        type: "doughnut",
        data: dataDamagedStat,
        options: {
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            plugins: {
                title: {
                    display: true,
                    align: "center",
                    color: "#363949",
                    font: {
                        weight: 550,
                        size: 22,
                    },
                    padding: {
                        top: 10,
                        bottom: 10,
                    },
                    text: '% Celdas Dañadas'
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        font: {
                            weight: 550,
                            size: 14,
                        },
                        padding: 15,
                        boxWidth: 35,
                    },
                    reverse: true,
                },
                datalabels:{
                    color: '#363949',
                    anchor: 'center',
                    font: {
                        size: 16,
                        weight: 550,
                    },
                    formatter: function(value){
                        return value + '%';
                    }
                },
                tooltip: {
                    enabled: true,
                    titleFont: {
                        size: 16,
                        weight: 550,
                    },
                    bodyFont: {
                        size: 14,
                        weight: 550,
                    },
                    callbacks: {  
                        label: function(context){
                            let data = context.parsed;            
                            return ' ' + data + '%';
                        },
                    },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    };
    //damagedGraph = new Chart($damagedGraph, damagedGraphConfig);
    
    wearGraphConfig = {
        type: "doughnut",
        data: dataWearStat,
        options: {
            layout: {
            padding: {
                left: 20,
                right: 20,
            },
            },
            plugins: {
                title: {
                    display: true,
                    align: "center",
                    color: "#363949",
                    font: {
                        weight: 700,
                        size: 22,
                    },
                    padding: {
                        top: 10,
                        bottom: 10,
                    },
                    text: '% Celdas Desgastadas'
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        font: {            
                            weight: 550,
                            size: 14,
                        },
                        padding: 15,
                        boxWidth: 35,
                    },
                    reverse: true,
                },
                datalabels:{
                    color: '#363949',
                    anchor: 'center',
                    font: {
                        size: 16,
                        weight: 550,
                    },
                    formatter: function(value){
                        return value + '%';
                    }
                },
                tooltip: {
                    enabled: true,
                    titleFont: {
                        size: 16,
                        weight: 550,
                    },
                    bodyFont: {
                        size: 14,
                        weight: 550,
                    },
                    callbacks: {  
                        label: function(context){
                            let data = context.parsed;
                            return ' ' + data + '%';
                        },
                    },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    };
    //wearGraph = new Chart($wearGraph, wearGraphConfig);
    function generarGrafico(grafico) {
        const width = 220; // Ancho del canvas
        const height = 300; // Alto del canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
                
        new Chart(ctx, grafico); // Renderizar el gráfico en el canvas
        
        const buffer = canvas.toBuffer('image/png'); // Guardar el canvas como una imagen PNG
        const buffer64 = buffer.toString('base64');
        return buffer64;
    }
    //-----------Codigo PDF----------------//
    const sql2 = 'SELECT * FROM anilox_list WHERE id=?';
    db.query(sql2,[anilox], (err2, rows2) => {
        if (err2) throw err2;
        fabricante = rows2[0].brand;
        revision = rows2[0].revision;
        revision = revision.replace('data:image/jpeg;base64,', '');
        tapadas_img = generarGrafico(cleanGraphConfig).replace('data:image/jpeg;base64,', '');
        danadas_img = generarGrafico(damagedGraphConfig).replace('data:image/jpeg;base64,', '');
        desgastadas_img = generarGrafico(wearGraphConfig).replace('data:image/jpeg;base64,', '');
        console.log('Terminó el query');
    });    
});

const coord_revision = {
    x: 235,     y: 650,     // 270 y 300
    width: 130, height: 130 // 100 y 100
};

const coord_tapadas = {
    x: 45,     y: 375,
    width: 160, height: 205
};

const coord_danadas = {
    x: 230,     y: 375,
    width: 160, height: 205
};

const coord_desgastadas = {
    x: 410,     y: 375,
    width: 155, height: 205
};

app.get('/generarReporte', (req, res) => {
    const outputPath = path.join(__dirname, '/output_with_image.pdf');
    const replaceText = async () => {
        const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(pdfPath); // Crea un archivo PDFdoc desde un archivo PDF existente
        await pdfdoc.initSecurityHandler(); // Habilita el security Handler para poder realizar cambios en el PDF
        const replacer = await PDFNet.ContentReplacer.create(); // Crea un objeto ContentReplacer para reemplazar texto en el PDF
        const page = await pdfdoc.getPage(1); // Se obtiene la primera página del PDF        
        const pageSet = await PDFNet.PageSet.createRange(1, 1);
        await replacer.addString('ANILOX', anilox);
        await replacer.addString('date', '2024-06-16');
        await replacer.addString('fabricante', fabricante);
        await replacer.addString('revision', revision);
        await replacer.addString('tapadas', '');
        await replacer.addString('danadas', '');
        await replacer.addString('desgastadas', '');

        await addBase64ImageToPDF(pdfdoc, pageSet, revision, coord_revision);
        await addBase64ImageToPDF(pdfdoc, pageSet, tapadas_img, coord_tapadas);
        await addBase64ImageToPDF(pdfdoc, pageSet, danadas_img, coord_danadas);
        await addBase64ImageToPDF(pdfdoc, pageSet, desgastadas_img, coord_desgastadas)
            .then(() => {                 
                replacer.process(page);               
                pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
                console.log('Imágenes añadidas al PDF con éxito');
                fs.readFile(outputPath, (err, data) => {
                    if (err) {
                        console.error('Error al leer el archivo PDF:', err);
                        res.status(500).send('Error al procesar el archivo PDF');
                        return;
                    }
                    const base64PDF = data.toString('base64');
                    // const sql2 = 'INSERT INTO anilox_history (id_anilox, fecha, pdf) VALUES (?,?,?)';
                    // db.query(sql2,[anilox, new Date(), base64PDF], (err, rows) => {
                    //     if (err) throw err;
                    //     console.log('PDF convertido a Base64 y almacenado con éxito');
                    // });
                    // res.send('PDF convertido a Base64 y almacenado con éxito');
                });
            })
            .catch((error) => {
                console.error('Error al añadir imagen al PDF:', error);
                res.status(500).send('Error al añadir imagen al PDF');
            });
    }

    PDFNet.runWithCleanup(replaceText, "demo:1720195871717:7f8468a2030000000072c68a051f8b60b73e2b966862266ca0be4eacb7").then(() => {
        fs.readFile(outputPath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.send(err);
            } else {
                res.setHeader('Content-Type', 'application/pdf');
                res.send(data);
            }
        })
    }).catch(err => {
        res.statusCode = 500;
        res.send(err);
    });
});

app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});