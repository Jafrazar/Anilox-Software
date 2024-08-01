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
const canvas_bcm = createCanvas(800, 185);
const bcm_ctx = canvas_bcm.getContext('2d');
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
let danadas; let desgastadas; let tapadas; let volLabels = [], volData = [], diag = [];
let tapadas_img; let danadas_img; let desgastadas_img; let nomVol, nomData = [];let bcmChart;
const pdfPath = "./modelo_reporte_final3.pdf";

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
                        size: 20,
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
                        size: 20,
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
                        size: 20,
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
        let buffer, buffer64;
        if (grafico == bcmChart) {
            buffer = canvas_bcm.toBuffer('image/png'); // Guardar el canvas como una imagen PNG
            buffer64 = buffer.toString('base64');
            return buffer64;
        }
        else {                    
            let width = 220; // Ancho del canvas
            let height = 300; // Alto del canvas    
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');                    
            new Chart(ctx, grafico); // Renderizar el gráfico en el canvas
            buffer = canvas.toBuffer('image/png'); // Guardar el canvas como una imagen PNG
            buffer64 = buffer.toString('base64');
            return buffer64;
        }  
    }

    tapadas_img = generarGrafico(cleanGraphConfig).replace('data:image/jpeg;base64,', '');
    danadas_img = generarGrafico(damagedGraphConfig).replace('data:image/jpeg;base64,', '');
    desgastadas_img = generarGrafico(wearGraphConfig).replace('data:image/jpeg;base64,', '');    
    //-----------Codigo PDF----------------//
    const sql2 = 'SELECT * FROM anilox_list WHERE id=?';
    db.query(sql2,[anilox], (err2, rows2) => {
        if (err2) throw err2;
        fabricante = rows2[0].brand;
        revision = rows2[0].revision;
        revision = revision.replace('data:image/jpeg;base64,', '');
        nomVol = rows2[0].nomvol;
        const sql3 = 'SELECT * FROM anilox_history WHERE anilox=?';
        db.query(sql3,[anilox], (err3, rows3) => {
            if (err3) throw err3;
            for(let i = 0; i < rows3.length; i++){
                let date = new Date(rows3[i].date);
                volLabels[i] = date.toISOString().split('T')[0];
                volData[i] = Math.round(((rows3[i].volume)/1.55) * 10) / 10; // VOLUMEN EN BCM
                diag[i] = rows3[i].diagnostico;
                nomData[i] = Math.round((nomVol/1.55) * 10) / 10;
            }
            const dataBcmStat = {
                labels: volLabels,
                datasets: [{
                  label: 'Volumen medido (BCM)',
                  data: volData,
                  info: diag,
                  fill: false,
                  borderColor: 'rgba(0, 0, 255, 0.35)',
                  tension: 0.1,
                },
                {
                  label: 'Volumen Nominal (BCM)',
                  data: nomData,
                  fill: false,
                  borderColor: 'rgba(255, 0, 0, 0.35)',
                  tension: 0.1,
                  pointRadius: 0,
                  datalabels: {
                    display: false, // Desactiva etiquetas
                  },
                }]
            };
            bcmChart = new Chart(bcm_ctx, {
                type: "line",
                data: dataBcmStat,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            align: "center",
                            color: "#363949",
                            font: {
                            weight: 500,
                            size: 14,
                            },
                            padding: {
                            top: 10,
                            bottom: 10,
                            },
                            text: 'Historial de Volumen de Celda'
                        },
                        legend: {
                            display: true,
                            position: "bottom",
                            labels: {
                                font: {
                                    weight: 500,
                                    size: 11,
                                },
                                padding: 15,
                                boxWidth: 30,
                            },
                            reverse: true,
                        },
                        datalabels:{
                            color: '#363949',
                            align: -45,
                            font: {
                                size: 11,
                                weight: 500,
                            },
                            clip: false,
                        },
                        tooltip: {
                            enabled: true,
                            titleFont: {
                                size: 11,
                                weight: 600,
                            },
                            bodyFont: {
                                size: 11,
                                weight: 500,
                            },
                            footerFont: {
                                size: 13,
                                weight: 300,
                            },
                            callbacks: {  
                                label: function(tooltipItem){
                                    if(tooltipItem.datasetIndex == 0){
                                        let data = tooltipItem.parsed.y;
                                        return 'Volumen: ' + data + ' BCM'; 
                                    }
                                    else{return ""}
                                },
                                footer: function(tooltipItem){
                                    if(tooltipItem[0].datasetIndex == 0){
                                        let diag = tooltipItem[0].dataset.info[tooltipItem[0].dataIndex];
                                        return 'Diagnostico:' + '\n' + diag;
                                    }
                                }
                            },
                        },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            ticks: {
                                display: true,
                                font: {
                                    weight: 500,
                                    size: 11,
                                }
                            },
                        },
                        y: {
                            grace: 0.15,
                            ticks: {
                                stepSize: 0.05,
                                font: {
                                    weight: 500,
                                    size: 11,
                                }
                            },
                        },
                    },
                }
            });
            historial_img = generarGrafico(bcmChart).replace('data:image/jpeg;base64,', '');
            console.log("terminamos el query");
        });
    });
})

const coord_revision = {
    x: 215,     y: 685,     // 270 y 300
    width: 205, height: 120 // 100 y 100
};

const coord_tapadas = {
    x: 45,     y: 325,
    width: 160, height: 193
};

const coord_danadas = {
    x: 225,     y: 325,
    width: 160, height: 193
};

const coord_desgastadas = {
    x: 405,     y: 325,
    width: 165, height: 193
};

const coord_historial = {
    x: 23,     y: 535,
    width: 555, height: 185
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
        await replacer.addString('revision', "");
        await replacer.addString('tapadas', '');
        await replacer.addString('danadas', '');
        await replacer.addString('desgastadas', '');
        await replacer.addString('historial_volumen', '');

        await addBase64ImageToPDF(pdfdoc, pageSet, revision, coord_revision);
        await addBase64ImageToPDF(pdfdoc, pageSet, tapadas_img, coord_tapadas);
        await addBase64ImageToPDF(pdfdoc, pageSet, danadas_img, coord_danadas);
        await addBase64ImageToPDF(pdfdoc, pageSet, desgastadas_img, coord_desgastadas);
        await addBase64ImageToPDF(pdfdoc, pageSet, historial_img, coord_historial)

        // const page2 = await pdfdoc.getPage(2);
        // const pageSet2 = await PDFNet.PageSet.createRange(2, 2);
        // await addBase64ImageToPDF(pdfdoc, pageSet2, historial, coord_historial);

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

