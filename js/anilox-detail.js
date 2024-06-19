Chart.register(ChartDataLabels);

const $aniloxId = d.getElementById("anilox-id"),
      aniloxId = ss.getItem("aniloxId");

const $dataTop = d.querySelector(".data-top"),
      $dataMid = d.querySelector(".data-middle"),
      $dataBot = d.querySelector(".data-bottom");

const $dataBrand = d.getElementById("data-brand"),
      $dataType = d.getElementById("data-type"),
      $dataPurchase = d.getElementById("data-purchase"),
      $dataVolume = d.getElementById("data-volume"),
      $dataDepth = d.getElementById("data-depth"),
      $dataOpening = d.getElementById("data-opening"),
      $dataWall = d.getElementById("data-wall"),
      $dataScreen = d.getElementById("data-screen"),
      $dataAngle = d.getElementById("data-angle"),
      $dataLast = d.getElementById("data-last"),
      $dataNext = d.getElementById("data-next");

const $viewMore = d.getElementById("ver-mas"),
      $closeModalDataAnilox = d.getElementById("close-modal-data-anilox"),
      $modalDataAnilox = d.getElementById("modal-data-anilox");

const $moreBrand = d.getElementById("more-brand"),
      $moreType = d.getElementById("more-type"),
      $morePurchase = d.getElementById("more-purchase"),
      $moreRecorrido = d.getElementById("more-recorrido"),
      $moreVolume = d.getElementById("more-volume"),
      $moreDepth = d.getElementById("more-depth"),
      $moreOpening = d.getElementById("more-opening"),
      $moreWall = d.getElementById("more-wall"),
      $moreScreen = d.getElementById("more-screen"),
      $moreAngle = d.getElementById("more-angle"),
      $moreLast = d.getElementById("more-last"),
      $moreNext = d.getElementById("more-next");

const $cleanGraph = d.getElementById("clean-graph"),
      $damagedGraph = d.getElementById("damaged-graph"),
      $wearGraph = d.getElementById("wear-graph"),
      $bcmChart = d.getElementById("bcm-graph"),
      $imagePatron = d.getElementById("patron-image"),
      $imageLast = d.getElementById("last-image"),
      $dataStatus = d.getElementById("data-status"),
      $dataDiag = d.getElementById("data-diag"),
      $dataAct = d.getElementById("data-act");

Chart.defaults.font.family = 'Rajdhani';

const getAnilox = async()=>{
  try {
    $aniloxId.textContent = aniloxId;

    let res1 = await fetch('api/listado', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: aniloxId})
    }),
        json1 = await res1.json();
        
    let res2 = await fetch('api/analysis', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: aniloxId})
    }),
        json2 = await res2.json();

    if(!res1.ok) throw{status: res1.status, statusText: res1.statusText};
    if(!res2.ok) throw{status: res2.status, statusText: res2.statusText};

    json1 = json1.result;
    json2 = json2.result;

    let brand = json1[0].brand;
    let type = json1[0].type;
    let purchase = json1[0].purchase;
    let recorrido = json1[0].recorrido;
    let volume = json1[0].volume;
    let depth = json1[0].depth;
    let opening = json1[0].opening;
    let wall = json1[0].wall;
    let screen = json1[0].screen;
    let angle = json1[0].angle;
    let last = json1[0].last;
    let next = json2[0].next;

    $dataBrand.textContent = brand;
    $dataType.textContent = type;
    $dataPurchase.textContent = purchase;
    $dataVolume.textContent = volume;
    $dataScreen.textContent = screen;
    $dataLast.textContent = last;
    $dataNext.textContent = next;

    $moreBrand.textContent = brand;
    $moreType.textContent = type;
    $morePurchase.textContent = purchase;
    $moreRecorrido.textContent = recorrido;
    $moreVolume.textContent = volume;
    $moreDepth.textContent = depth;
    $moreOpening.textContent = opening;
    $moreWall.textContent = wall;
    $moreScreen.textContent = screen;
    $moreAngle.textContent = angle;
    $moreLast.textContent = last;
    $moreNext.textContent = next;

    let tapadas = parseFloat(json2[0].tapadas),
        limpias = 100 - tapadas,
        danadas = parseFloat(json2[0].danadas),
        sinDano = 100 - danadas,
        desgastadas = parseFloat(json2[0].desgastadas),
        sinDesgaste = 100 - desgastadas;

    const dataCleanStat = {
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

    const dataDamagedStat = {
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

    const dataWearStat = {
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

    new Chart($cleanGraph, {
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
              weight: 500,
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
            formatter: function(value, context){
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
    });
    
    new Chart($damagedGraph, {
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
            formatter: function(value, context){
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
    });

    new Chart($wearGraph, {
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
            formatter: function(value, context){
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
    });
    $imagePatron.src = json1[0].patron;
    $imageLast.src = json1[0].revision;
    $dataStatus.textContent = `${json2[0].estado}%`;
    $dataDiag.textContent = json2[0].diagnostico;
    $dataAct.textContent = json2[0].recomendacion;
  } catch (err) {
    let errorCode = err.status || "2316",
        errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
    $dataTop.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }

  try {
    let res = await fetch('/api/anilox-history', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: aniloxId})
    }),
        json = await res.json();
        json = json.result;

    if(!res.ok) throw{status: res.status, statusText: res.statusText};

    let volLabels = [],
        volData = [],
        diag = [];
  
    for(let i = 0; i < json.length; i++){
     volLabels[i] = json[i].date;
     volData[i] = json[i].volume;
     diag[i] = json[i].diagnostico;
    }

    const dataBcmStat = {
      labels: volLabels,
      datasets: [{
        label: 'Volumen (cm3/m2)',
        data: volData,
        info: diag,
        fill: false,
        borderColor: 'rgba(0, 0, 255, 0.35)',
        tension: 0.1,
      }]
    };

    new Chart($bcmChart, {
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
              size: 22,
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
                size: 14,
              },
              padding: 15,
              boxWidth: 30,
            },
            reverse: true,
          },
          datalabels:{
            color: '#363949',
            align: 'top',
            font: {
              size: 16,
              weight: 500,
            },
            clip: true,
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
            footerFont: {
              size: 16,
              weight: 300,
            },
            callbacks: {  
              label: function(context){
                let data = context.parsed.y;

                return 'Volumen: ' + data + ' cm3/m2';
              },
              footer: function(tooltipItems){
                let diag = tooltipItems[0].dataset.info[tooltipItems[0].dataIndex];
                return 'Diagnostico:' + '\n' + diag;
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
                size: 14,
              }
            },
          },
          y: {
            ticks: {
              stepSize: 0.1,
              font: {
                weight: 500,
                size: 14,
              }
            },
          },
        },
      }
    });
  } catch (err) {
    let errorCode = err.status || "2316",
        errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
        $bcmChart.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }
}

const viewMore = (e)=>{
  if(e.target === $viewMore){
    $modalDataAnilox.style.display = "block";
  }
  if(e.target === $closeModalDataAnilox){
    $modalDataAnilox.style.display = "none"
  }
}

d.addEventListener("click",viewMore);
d.addEventListener("DOMContentLoaded",getAnilox);