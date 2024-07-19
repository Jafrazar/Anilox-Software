const { Chart } = require('chart.js/auto');
const ChartDataLabels = require('chartjs-plugin-datalabels');
Chart.register(ChartDataLabels);
const { createCanvas } = require('canvas');
const fs = require('fs');
const mysql = require('mysql');
const db = mysql.createPool({
    host: 'database-1.crkw6qaew4si.sa-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '104-55Fppl2',
    database: 'ANDERS'
});

let cleanGraph, cleanGraphConfig, damagedGraph, damagedGraphConfig, wearGraph,
    wearGraphConfig, bcmChart, eolGraph, cleanGraph2, damagedGraph2, wearGraph2;
Chart.defaults.font.family = 'Rajdhani';
let tapadas, limpias, danadas, sinDano, desgastadas, sinDesgaste;
let dataCleanStat = ""; let dataDamagedStat=""; let dataWearStat="";

try {
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
                            weight: 600,
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
                            weight: 600,
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
                            weight: 600,
                        },
                        formatter: function(value){
                            return value + '%';
                        }
                    },
                    tooltip: {
                        enabled: true,
                        titleFont: {
                            size: 16,
                            weight: 600,
                        },
                        bodyFont: {
                            size: 14,
                            weight: 600,
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
                            weight: 500,
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
                                weight: 500,
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
                            weight: 500,
                        },
                        formatter: function(value){
                            return value + '%';
                        }
                    },
                    tooltip: {
                        enabled: true,
                        titleFont: {
                            size: 16,
                            weight: 600,
                        },
                        bodyFont: {
                            size: 14,
                            weight: 500,
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
                            weight: 500,
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
                                weight: 500,
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
                            weight: 500,
                        },
                        formatter: function(value){
                            return value + '%';
                        }
                    },
                    tooltip: {
                        enabled: true,
                        titleFont: {
                            size: 16,
                            weight: 600,
                        },
                        bodyFont: {
                            size: 14,
                            weight: 500,
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
        function generarGrafico() {
            const width = 220; // Ancho del canvas
            const height = 300; // Alto del canvas
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
          
            // Renderizar el gráfico en el canvas
            new Chart(ctx, cleanGraphConfig);
          
            // Utilizar un retraso antes de guardar el canvas como una imagen PNG
            const buffer = canvas.toBuffer('image/png'); // Guardar el canvas como una imagen PNG
            fs.writeFileSync('grafico.png', buffer);
            return console.log("fin");
        }
        
        generarGrafico();
        process.exit(0);
    });

} catch {
    console.log(err);
    process.exit(1);
}

