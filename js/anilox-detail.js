Chart.register(ChartDataLabels);

const $aniloxId = d.getElementById("anilox-id"),
      aniloxId = ss.getItem("aniloxId");
      aniloxBrand = ss.getItem("aniloxBrand");

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
      $dataStatusTransfer = d.getElementById("data-status-transfer"),
      $dataDiag = d.getElementById("data-diag"),
      $dataAct = d.getElementById("data-act");

const $eolGraph = d.getElementById("eol-graph"),
      $eolGraphContainer = d.getElementById("eol-graph-container"),
      $estimarVida = d.getElementById("estimar-vida"),
      $closeModalEOLAnilox = d.getElementById("close-modal-eol-anilox"),
      $modalEOLAnilox = d.getElementById("modal-eol-anilox"),
      $eolDescription = d.getElementById("eol-description");

const $cleanGraph2 = d.getElementById("clean-graph-2"),
      $damagedGraph2 = d.getElementById("damaged-graph-2"),
      $wearGraph2 = d.getElementById("wear-graph-2");

let cleanGraph, cleanGraphConfig, damagedGraph, damagedGraphConfig, wearGraph, wearGraphConfig, bcmChart, eolGraph, cleanGraph2, damagedGraph2, wearGraph2;

const $table = d.querySelector(".eol-table"),
      $tableContainer = d.getElementById("tabla-porcentajes"),
      $tableBody = d.querySelector(".table-body"),
      $template = d.getElementById("eol-table-template").content,
      $fragment = d.createDocumentFragment();

const $prevAnilox = d.getElementById("prev-anilox"),
      $nextAnilox = d.getElementById("next-anilox");

Chart.defaults.font.family = 'Rajdhani';

const getCompleteList = async() =>{
  let completeList = [];
  let currentIndex;
  let item = {
    id: '',
    brand: '',
  };
  try {
    let res = await fetch("api/listado", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }),
        json = await res.json();
        json = json.result;
    if(!res.ok) throw{status: res.status, statusText: res.statusText};
    for(let i = 0; i < json.length; i++){
      let newItem = {...item};
      newItem.id = json[i].id;
      newItem.brand = json[i].brand;
      if(newItem.id === aniloxId){
        currentIndex = i;
      }
      completeList.push(newItem);
    }
  } catch (err) {
    console.log(err);
    let errorCode = error.status || "2316",
        errorStatus = error.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
    $alertContent.textContent = `${message1}: ${message2}`;
    $modalAlertBox.style.display = "block";
  }
  if(currentIndex > 0){
    $prevAnilox.dataset.load = `${completeList[currentIndex - 1].id},${completeList[currentIndex - 1].brand}`;
    $prevAnilox.title = completeList[currentIndex - 1].id;
    $prevAnilox.style.cursor = "pointer";
  }
  if(currentIndex < completeList.length - 1){
    $nextAnilox.dataset.load = `${completeList[currentIndex + 1].id},${completeList[currentIndex + 1].brand}`;
    $nextAnilox.title = completeList[currentIndex + 1].id;
    $nextAnilox.style.cursor = "pointer";
  }
  if($prevAnilox.dataset.load == ''){
    $prevAnilox.style.cursor = "not-allowed";
  }
  if($nextAnilox.dataset.load == ''){
    $nextAnilox.style.cursor = "not-allowed";
  }
}

const getAnilox = async()=>{
  try {
    $aniloxId.textContent = `${aniloxBrand} - ${aniloxId}`;

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
    let volume = (json1[0].volume*volMulti)/1.55;
    let nomVol = Math.round(json1[0].nomvol*volMulti/1.55 * 10) / 10;
    let depth = json1[0].depth;
    let opening = json1[0].opening;
    let wall = json1[0].wall;
    let screen = Math.round(json1[0].screen*screenMulti * 10) / 10;
    let angle = json1[0].angle;
    let last = json1[0].last;
    let next = json2[0].next;

    $dataBrand.textContent = brand;
    $dataType.textContent = type;
    $dataPurchase.textContent = purchase;
    $dataVolume.textContent = Math.round(volume * 10) / 10;
    $dataScreen.textContent = screen;
    $dataLast.textContent = last;
    $dataNext.textContent = next;

    $moreBrand.textContent = brand;
    $moreType.textContent = type;
    $morePurchase.textContent = purchase;
    $moreRecorrido.textContent = recorrido;
    $moreVolume.textContent = Math.round(volume * 10) / 10;
    $moreDepth.textContent = depth;
    $moreOpening.textContent = opening;
    $moreWall.textContent = wall;
    $moreScreen.textContent = screen;
    $moreAngle.textContent = angle;
    $moreLast.textContent = last;
    $moreNext.textContent = next;

    let statusTransfer = Math.round((((volume / nomVol) * 100) + Number.EPSILON) * 10) / 10;
    
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
    cleanGraph = new Chart($cleanGraph, cleanGraphConfig);

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
    damagedGraph = new Chart($damagedGraph, damagedGraphConfig);

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
    wearGraph = new Chart($wearGraph, wearGraphConfig);
    
    $imagePatron.src = json1[0].patron;
    if(json1[0].hasOwnProperty("revision")){
      $imageLast.src = json1[0].revision;
    }
    $dataStatus.textContent = `${json2[0].estado}%`;
    $dataStatusTransfer.textContent = `${statusTransfer}%`;
    $dataDiag.textContent = json2[0].diagnostico;
    $dataAct.textContent = json2[0].recomendacion;
  } catch (err) {
    console.log(err);
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

    let res2 = await fetch('api/listado', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: aniloxId})
    }),
        json2 = await res2.json();
        json2 = json2.result

    if(!res.ok) throw{status: res.status, statusText: res.statusText};

    let volLabels = [],
        volData = [],
        diag = [];

    for(let i = 0; i < json.length; i++){
     volLabels[i] = json[i].date;
     volData[i] = Math.round(((json[i].volume*volMulti)/1.55) * 10) / 10; // VOLUMEN EN BCM
     diag[i] = json[i].diagnostico;
    }

    let nomVol = json2[0].nomvol;
    let nomData = [];

    for(let i = 0; i < json.length; i++){
      nomData[i] = nomVol;
    }

    const dataBcmStat = {
      labels: volLabels,
      datasets: [{
        label: `Volumen medido (${ls.getItem("volumeUnit")})`, // Verificar
        data: volData,
        info: diag,
        fill: false,
        borderColor: 'rgba(0, 0, 255, 0.35)',
        tension: 0.1,
      },
      {
        label:`Volumen nominal (${ls.getItem("volumeUnit")})`,
        data: nomData,
        fill: false,
        borderColor: 'rgba(255, 0, 0, 0.35)',
        tension: 0.1,
        pointStyle: false,
        datalabels: {
          // display: function(context){
          //   return context.dataIndex === 0;
          // }
          display: false, // Desactiva etiquetas
        },
      }]
    };

    bcmChart = new Chart($bcmChart, {
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
            align: -45,
            font: {
              size: 14,
              weight: 500,
            },
            clip: false,
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
              label: function(tooltipItem){
                if(tooltipItem.datasetIndex == 0){
                  let data = tooltipItem.parsed.y;
                  return 'Volumen: ' + data + ' ' + ls.getItem("volumeUnit"); 
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
                size: 14,
              }
            },
          },
          y: {
            grace: 0.15,
            ticks: {
              stepSize: 0.05,
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
    console.log(err);
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

function encontrarValoresCercanosMenores(arr, objetivos) {
  return objetivos.map(objetivo => {
    return arr.reduce((prev, curr) => {
      if (curr <= objetivo && (prev >= objetivo || Math.abs(curr - objetivo) < Math.abs(prev - objetivo))) {
        return curr;
      }
      return prev;
    }, Number.MAX_VALUE);
  });
}

function generarRectaTendencia(eolDates, volData, limite) {
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

  // Calcular los puntos de la recta de tendencia en las fechas originales
  const tendencia = x.map(xi => ({
    x: new Date(xi).toISOString().split('T')[0], // Convertir de nuevo a formato de fecha
    y: m * xi + b
  }));

  // Generar puntos en fechas futuras hasta que el valor sea menor o igual al límite
  let ultimaFecha = new Date(eolDates[eolDates.length - 1]);
  let ultimoValor = tendencia[tendencia.length - 1].y;
  let b2 = b > 200 ? 2 : b > 100 ? 3 : 6; // Si b es mayor a 200 elabora una pendiente de 2 meses, si es mayor a 100 de 3 meses, de lo contrario de 6 meses

  if(m < -0.000000000005 ){
    while (ultimoValor > limite) {
      ultimaFecha.setMonth(ultimaFecha.getMonth() + b2); // Incrementar la fecha en 6 meses o 3 meses dependiendo de la intersección
      const nuevaFecha = ultimaFecha.getTime();
      ultimoValor = m * nuevaFecha + b;
      tendencia.push({
        x: ultimaFecha.toISOString().split('T')[0],
        y: ultimoValor
      });
    }
  }

  return { tendencia, m, b };
}

function encontrarPosiciones(arr, valoresCercanos) {
  return valoresCercanos.map(valorCercano => {
    const index = arr.indexOf(valorCercano);
    return index !== -1 ? index + 1 : -1; // Sumar 1 para que la posición sea 1-indexada
  });
}

const estimarVida = async(e)=>{
  if(e.target === $estimarVida){ 
    $modalEOLAnilox.style.display = "block";
    try {
      let res1 = await fetch('api/analysis', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: aniloxId})
      }),
          json1 = await res1.json();
          
      let res2 = await fetch('api/listado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: aniloxId})
      }),
          json2 = await res2.json();
      let res3, json3;
        json1 = json1.result; // analysis
        json2 = json2.result; // listado
  
      if(!res1.ok) throw{status: res1.status, statusText: res1.statusText};
      if(!res2.ok) throw{status: res2.status, statusText: res2.statusText};
      
      
      let eolData=[], nomVol = Math.round((json2[0].nomvol*volMulti)*100/100); // nomVol en cm3/m2;
      for(let i = 0; i < JSON.parse(json1[0].eol).length; i++){
        eolData[i] = JSON.parse(json1[0].eol)[i]*volMulti;
      }

      console.log("eolData: ", eolData);
      let msg;

      console.log("eolData[0] = ",eolData[0]);
      if(eolData[0] == 1000 || eolData[0] == 1550){msg = `El volumen de celda ya se encuentra por debajo del 60% del volumen nominal (${(nomVol/1.55 * 0.9).toFixed(3)}).`;} // FALTA UPDATEAR
      else if (eolData[0] == 2000 || eolData[0] == 3100){msg = `No se cuenta suficientes datos para realizar una estimación.`;} // CUANDO ES MENOR A 3 actualizar eolData a 2000
      else {
        res3 = await fetch('/api/anilox-history', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({id: aniloxId})
        }),
            json3 = await res3.json();
            json3 = json3.result; // history

        if(!res3.ok) throw{status: res3.status, statusText: res3.statusText};

        $eolGraphContainer.style.display = "flex";
        $tableContainer.style.display = "flex";

        let eolDates = [],
            volData = [],
            percentVol = [],
            percentDates = JSON.parse(json1[0].percent).dates;
        for(let i = 0; i < json3.length; i++){
          eolData[i] = json3[i].volume*volMulti;
          eolDates[i] = json3[i].date;
          volData[i] = json3[i].volume*volMulti;
        }
        
        for(let i = 0; i < json3.length; i++){
          percentVol[i] = Math.round(((JSON.parse(json1[0].percent).values[i]*volMulti)*1000)/1000);
        }

        console.log("eolDates", eolDates);
        console.log("volData: ", volData);
        console.log("percentVol: ", percentVol);
        console.log("percentDates: ", percentDates);

        const { m, b } = generarRectaTendencia(eolDates, volData, 0.6*nomVol*volMulti);
        console.log("m: " + m);
        console.log("b: " + b);
        if(m >= -0.000000000005) {
          eolData = 2000;
          msg = `No se cuenta con suficientes datos para realizar una estimación.`;
          pdfPath = path.join(__dirname, '/modelo_reporte_final_alt.pdf');
          percentVol = "";
          percentDates = "";
        }
        else{
          eolData = generarRectaTendencia(eolDates, volData, 0.6*nomVol*volMulti).tendencia.map(point => parseFloat(point.y.toFixed(3)));                    
          newDates = generarRectaTendencia(eolDates, volData, 0.6*nomVol*volMulti).tendencia.map(point => point.x);
          percentVol = encontrarValoresCercanosMenores(eolData, [0.9*nomVol*volMulti, 0.8*nomVol*volMulti, 0.7*nomVol*volMulti, 0.6*nomVol*volMulti]);
          percentDates = encontrarPosiciones(eolData, percentVol);
          actualDates = percentDates.map(pos => newDates[pos-1]);
          ultimaFecha = new Date(eolDates[eolDates.length - 1]);
          diferenciasEnAnios = actualDates.map(dateStr => {
            const actualDate = new Date(dateStr);
            const diferenciaEnMilisegundos = actualDate - ultimaFecha;
            const diferenciaEnAnios = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24 * 365.25); // 365.25 para considerar los años bisiestos
            return diferenciaEnAnios;
          });
        }

        for(let i = 0; i < JSON.parse(json1[0].eol).length - json3.length; i++){
          let last = `${eolDates[json3.length - 1 + i]} 00:00:00`;
          last = new Date(last);

          let next = new Date(last.setMonth(last.getMonth() + 6)),
              year = String(next.getFullYear()),
              month = String(next.getMonth() + 1),
              day = String(next.getDate());

          month.length < 2 ? month = `0${month}` : month = month;
          day.length < 2 ? day = `0${day}` : day = day;

          next = [year, month, day].join('-');
          eolDates[json3.length + i] = next;
        }
        
        const dataEOLGraph = {
          labels: eolDates,
          datasets: [{
            type: 'line',
            label: `Volumen estimado (${ls.getItem("volumeUnit")})`,
            data: eolData.map(dato => Math.round((dato/1.55) * 10) / 10),
            fill: false,
            borderColor: 'rgba(255, 0, 0, 0.35)',
            tension: 0.1,
            datalabels: {
              display: true,
              align: 'top',
            },
          }, {
            type: 'scatter',
            label: `Volumen medido (${ls.getItem("volumeUnit")})`,
            data: volData.map(dato => Math.round((dato/1.55) * 10) / 10),
            fill: false,
            borderColor: 'rgba(0, 0, 255, 0.6)',
            datalabels: {
              display: true,
            },
          }]
        };
        
        eolGraph = new Chart($eolGraph, {
          data: dataEOLGraph,
          options: {
            plugins: {
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
                align: 'right', 
                padding: {
                  right: 7,
                },
                font: {
                  size: 13,
                  weight: 500,
                },
                clip: false,
                formatter: function(value, context){
                  if(context.dataset.type === 'line'){
                    if((value == Math.round((percentVol[0]/1.55) * 10) / 10 && ((percentDates[0] - json3.length) / 2) > 0) || (value == Math.round((percentVol[1]/1.55) * 10) / 10 && ((percentDates[1] - json3.length) / 2) > 0) || (value == Math.round((percentVol[2]/1.55) * 10) / 10 && ((percentDates[2] - json3.length) / 2) > 0) || (value == Math.round((percentVol[3]/1.55) * 10) / 10 && ((percentDates[3] - json3.length) / 2) > 0)) {
                      return value
                    }
                    else {
                      return ''
                    }
                  }
                },
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
                    return 'Volumen: ' + data + ' ' + ls.getItem("volumeUnit");
                  },
                  footer: function(tooltipItems){
                    let vol = tooltipItems[0].dataset.data[tooltipItems[0].dataIndex];
                    if(vol == Math.round((percentVol[0]/1.55) * 10) / 10 && ((percentDates[0] - json3.length) / 2) > 0){return `Volumen de celda aprox. 90% del nominal (${(nomVol/1.55 * 0.9).toFixed(3)})`}
                    if(vol == Math.round((percentVol[1]/1.55) * 10) / 10 && ((percentDates[1] - json3.length) / 2) > 0){return `Volumen de celda aprox. 80% del nominal (${(nomVol/1.55 * 0.8).toFixed(3)})`}
                    if(vol == Math.round((percentVol[2]/1.55) * 10) / 10 && ((percentDates[2] - json3.length) / 2) > 0){return `Volumen de celda aprox. 70% del nominal (${(nomVol/1.55 * 0.7).toFixed(3)})`}
                    if(vol == Math.round((percentVol[3]/1.55) * 10) / 10 && ((percentDates[3] - json3.length) / 2) > 0){return `Volumen de celda aprox. 60% del nominal (${(nomVol/1.55 * 0.6).toFixed(3)})`}
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
        msg = '';

        let tableData = Array.from(Array(percentVol.length), ()=>({
          volumePercent: '',
          volumeEstimated: '',
          timeRemainingEstimated: '',
        }));

        for (i = 0; i < percentVol.length; i++){
          if(((percentDates[i] - json3.length) / 2) <= 0){
            tableData[i].volumePercent = null;
            tableData[i].volumeEstimated = null;
            tableData[i].timeRemainingEstimated = null;
          }
          else {
            tableData[i].volumePercent = (90 - (i * 10));
            tableData[i].volumeEstimated = (percentVol[i]).toFixed(3);
            tableData[i].timeRemainingEstimated = ((percentDates[i] - json3.length) / 2);
          }
        }

        tableData.forEach(el=>{
          if(el.volumePercent != null && el.volumeEstimated !== null && el.timeRemainingEstimated != null){
            $template.querySelector(".volume-percent").textContent = `${el.volumePercent}%`;
            $template.querySelector(".volume-estimated").textContent = el.volumeEstimated;
            $template.querySelector(".time-remaining-estimated").textContent = `${el.timeRemainingEstimated} años`;

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
          }
        });
        $table.querySelector(".table-body").appendChild($fragment);
      }

      cleanGraph2 = new Chart($cleanGraph2, cleanGraphConfig);
      damagedGraph2 = new Chart($damagedGraph2, damagedGraphConfig);
      wearGraph2 = new Chart($wearGraph2, wearGraphConfig);

      $eolDescription.textContent = msg;
    } catch (err) {
      console.log(err);
      let errorCode = err.status || "2316",
          errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
          message1 = "Error " + errorCode + ": ",
          message2 = errorStatus;
      $tableContainer.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
    }
  }

  if(e.target === $closeModalEOLAnilox){
    $modalEOLAnilox.style.display = "none"
    if(typeof eolGraph !== 'undefined'){eolGraph.destroy()}
    if(typeof cleanGraph2 !== 'undefined'){cleanGraph2.destroy()}
    if(typeof damagedGraph2 !== 'undefined'){damagedGraph2.destroy()}
    if(typeof wearGraph2 !== 'undefined'){wearGraph2.destroy()}
    $tableBody.innerHTML = '';
  }
}

const load = (e)=>{
  if(e.target.matches(".arrow")){
    if(e.target.dataset.load !== ""){
      let data = e.target.dataset.load.split(",");
      ss.setItem("aniloxId", data[0]);
      ss.setItem("aniloxBrand", data[1]);
      window.location.reload();
    }
  }
}

d.addEventListener("DOMContentLoaded",getAnilox);
d.addEventListener("DOMContentLoaded",getCompleteList);
d.addEventListener("click",viewMore);
d.addEventListener("click",estimarVida);
d.addEventListener("click",load);
