Chart.register(ChartDataLabels);

const $table = d.querySelector(".anilox-table"),
      $tableBody = d.querySelector(".table-body"),
      $template = d.getElementById("anilox-template").content,
      $fragment = d.createDocumentFragment();

const $grafico = d.getElementById("grafico");

const $statId = d.getElementById("stat-id"),
      $cleanStat = d.getElementById("clean-stat"),
      $damagedStat = d.getElementById("damaged-stat"),
      $wearStat = d.getElementById("wear-stat"),
      $bcmStat = d.getElementById("bcm-stat"),
      $stats = d.querySelector(".stats");

let $tableFirstElement,
    cleanStatChart,
    damagedStatChart,
    wearStatChart,
    bcmStatChart,
    semaforoChart;

Chart.defaults.font.family = 'Rajdhani';

const getData = (json, id)=>{
  return json.filter(el => el.id === id);
}

const drawIndex = async()=>{
  try {
    //Fetch call listado de anilox
    let res1 = await fetch("/anillox-list/anilox"),
        json1 = await res1.json();

    //Fetch call server-response para el listado de anilox
    let res2 = await fetch("/anillox-analysis/anilox"),
        json2 = await res2.json();

    if(!res1.ok) throw{status: res1.status, statusText: res1.statusText};
    if(!res2.ok) throw{status: res2.status, statusText: res2.statusText};

    //draw Semaforo
    let numBuenos = 0,
        numMedios = 0,
        numMalos = 0;

    
    json2.forEach(el =>{
      estado = parseFloat(el.estado);
      if(estado >= 80 && estado <= 100){numBuenos++}
      if(estado >= 25 && estado < 80){numMedios++}
      if(estado >= 0 && estado < 25){numMalos++}
    });

    const labels = ["Estado"];
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Buen Estado',
          data: [numBuenos],
          backgroundColor: "rgba(170,187,17,0.35)",
        },
        {
          label: 'Estado Aceptable',
          data: [numMedios],
          backgroundColor: "rgba(255,186,38,0.35)",
        },
        {
          label: 'Mal Estado',
          data: [numMalos],
          backgroundColor: "rgba(255,24,24,0.35)",
        },
      ],
    };

    semaforoChart = new Chart($grafico, {
      type: "bar",
      data: data,
      plugins: [titleClick],
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
              top: 1,
              bottom: 15,
            },
            text: "Estado General de Ánilox"
          },
          subtitle: {
            display: false,
            align: "center",
            color: "#363949",
            font: {
              weight: 500,
              size: 18,
            },
            padding: {
              top: 1,
              bottom: 5,
            },
            text: `${ss.getItem('client')}`,
          },
          legend: {
            display: false,
            position: "bottom",
            align: 'start',
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
          datalabels: {
            color: "#363949",
            anchor: "center",
            font: {
              size: 18,
              weight: 500,
            },
            formatter: function(value, context){
              return value + ' AX';
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
                let label = context.dataset.label;
                let data = context.dataset.data;

                return label + ': ' + data + ' Rodillos';
              },
            },
          },
        },
        responsive: true,
        scales:{
          x: {
            stacked: true,
            display: false,
          },
          y: {
            stacked: true,
            display: false,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    //sort lista de anilox por proxima fecha de revision
    json2.sort((a,b)=>Date.parse(a.next) - Date.parse(b.next));

    //maximo de items en lista 5
    let lim = 6;
    if(json1.length < lim){lim = json1.length}

    //draw tabla
    let tableData = Array.from(Array(lim), ()=>({
      id: '',
      brand: '',
      type: '',
      purchase: '',
      volume: '',
      last: '',
      next: '',
      estado: '',
    }));

    for (i = 0; i < lim; i++){
      let data = getData(json1, json2[i].id);
      tableData[i].id = data[0].id;
      tableData[i].brand = data[0].brand;
      tableData[i].type = data[0].type;
      tableData[i].purchase = data[0].purchase;
      tableData[i].volume = data[0].volume;
      tableData[i].last = data[0].last;
      tableData[i].next = json2[i].next;
      tableData[i].estado = json2[i].estado;
    }

    tableData.forEach(el=>{
      $template.querySelector(".id").textContent = el.id;
      $template.querySelector(".brand").textContent = el.brand;
      $template.querySelector(".type").textContent = el.type;
      $template.querySelector(".purchase-date").textContent = el.purchase;
      $template.querySelector(".volume").textContent = el.volume;
      $template.querySelector(".last-date").textContent = el.last;
      $template.querySelector(".next-date").textContent = el.next;
      
      if((Date.now() - Date.parse(String(el.next))) >= 0 && (Date.now() - Date.parse(String(el.next))) <= 15778800000){
        $template.querySelector(".next-date").classList.add("warning");
        $template.querySelector(".next-date").classList.remove("danger");
      }
      else if((Date.now() - Date.parse(String(el.next))) > 15778800000){
        $template.querySelector(".next-date").classList.add("danger");
        $template.querySelector(".next-date").classList.remove("warning");
      }
      else{
        $template.querySelector(".next-date").classList.remove("danger");
        $template.querySelector(".next-date").classList.remove("warning");
      }

      let barra = $template.getElementById("barra");
      barra.style.width = `${el.estado}%`;
      barra.textContent = `${el.estado}%`;

      if(el.estado >= 80 && el.estado <= 100){
        barra.style.backgroundColor = "rgba(170,187,17,0.35)";
      }
      if(el.estado >= 25 && el.estado < 80){
        barra.style.backgroundColor = "rgba(255,186,38,0.35)";
      }
      if(el.estado >= 0 && el.estado < 25){
        barra.style.backgroundColor = "rgba(255,24,24,0.35)";
      }

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });
    $table.querySelector("tbody").appendChild($fragment);
    
    //get primer item de la tabla
    $tableFirstElement = json2[0].id;
    $statId.textContent = $tableFirstElement;

    //draw doughnut stats
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

    cleanStatChart = new Chart($cleanStat, {
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
              top: 1,
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
    
    damagedStatChart = new Chart($damagedStat, {
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
              top: 1,
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

    wearStatChart = new Chart($wearStat, {
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
              top: 1,
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
  } catch (err) {
    let errorCode = err.status || "2316",
        errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
    $table.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
    $grafico.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
    $stats.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }
  
  try {
      //draw line stat
      let res = await fetch(`./anillox-history/${$tableFirstElement}`),
      json = await res.json();

      if(!res.ok) throw{status: res.status, statusText: res.statusText};

      let lim = 6;
      if(json.length < lim){lim = json.length}

      let volLabels = [],
          volData = [];

      for(let i = json.length - 1; i >= json.length - lim; i--){
        volLabels[i - (json.length - lim)] = json[i].date;
        volData[i - (json.length - lim)] = json[i].volume;
      }

      const dataBcmStat = {
        labels: volLabels,
        datasets: [{
          label: 'Volumen (cm3/m2)',
          data: volData,
          fill: false,
          borderColor: 'rgba(0, 0, 255, 0.35)',
          tension: 0.1,
        }]
      };
      
      bcmStatChart = new Chart($bcmStat, {
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
                top: 1,
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
              callbacks: {  
                label: function(context){
                  let data = context.parsed.y;
  
                  return 'Volumen: ' + data + ' cm3/m2';
                },
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: {
                display: false,
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
        $bcmStat.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }
};

const drawStats = async(e)=>{
  if(e.target.matches(".id")){
    try {
      $statId.textContent = e.target.textContent;

      //draw doughnut stats
      let res = await fetch(`./anillox-analysis/anilox/${e.target.textContent}`),
          json = await res.json();

      let tapadas = parseFloat(json.tapadas),
          limpias = 100 - tapadas,
          danadas = parseFloat(json.danadas),
          sinDano = 100 - danadas,
          desgastadas = parseFloat(json.desgastadas),
          sinDesgaste = 100 - desgastadas;

      cleanStatChart.data.datasets[0].data[0] = limpias;
      cleanStatChart.data.datasets[0].data[1] = tapadas;
      cleanStatChart.update('active');

      damagedStatChart.data.datasets[0].data[0] = sinDano;
      damagedStatChart.data.datasets[0].data[1] = danadas;
      damagedStatChart.update('active');

      wearStatChart.data.datasets[0].data[0] = sinDesgaste;
      wearStatChart.data.datasets[0].data[1] = desgastadas;
      wearStatChart.update('active');
    } catch (err) {
      let errorCode = err.status || "2316",
          errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
          message1 = "Error " + errorCode + ": ",
          message2 = errorStatus;
      $stats.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
      setTimeout(()=>{
        $stats.nextElementSibling.remove()
      }, 2000);
    }

    try {
      //draw line stat
      let res = await fetch(`./anillox-history/${e.target.textContent}`),
      json = await res.json();

      if(!res.ok) throw{status: res.status, statusText: res.statusText};

      let lim = 6;
      if(json.length < lim){lim = json.length}

      bcmStatChart.data.labels.length = 0;
      bcmStatChart.data.datasets[0].data.length = 0;

      for(let i = json.length - 1; i >= json.length - lim; i--){
        bcmStatChart.data.labels[i - (json.length - lim)] = json[i].date;
        bcmStatChart.data.datasets[0].data[i - (json.length - lim)] = json[i].volume;
      }
      bcmStatChart.update('active');
    } catch (err) {
      let errorCode = err.status || "2316",
          errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
          message1 = "Error " + errorCode + ": ",
          message2 = errorStatus;
      $bcmStat.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
      setTimeout(()=>{
        $bcmStat.nextElementSibling.remove()
      }, 2000);
    }
  }
};

const updateTable = async(mode)=>{
  try {
    $tableBody.innerHTML = '';

    //Fetch call listado de anilox
    let res1 = await fetch("/anillox-list/anilox"),
        json1 = await res1.json();

    //Fetch call server-response para el listado de anilox
    let res2 = await fetch("/anillox-analysis/anilox"),
        json2 = await res2.json();

    if(!res1.ok) throw{status: res1.status, statusText: res1.statusText};
    if(!res2.ok) throw{status: res2.status, statusText: res2.statusText};

    let validData = [];

    json2.forEach(el=>{
      let estado = parseFloat(el.estado);
      switch (mode) {
        case 0:
          if(estado >= 80 && estado <= 100){
            validData.push(el);
          }
          break;
        case 1:
          if(estado >= 25 && estado < 80){
            validData.push(el);
          }
          break;
        case 2:
          if(estado >= 0 && estado < 25){
            validData.push(el);
          }
          break;
        default:
          validData.push(el);
          break;
      }
    });

    validData.sort((a,b)=>Date.parse(a.next) - Date.parse(b.next));

    //maximo de items en lista 6
    let lim = 6;
    if(validData.length < lim){lim = validData.length}

    //draw tabla
    let tableData = Array.from(Array(lim), ()=>({
      id: '',
      brand: '',
      purchase: '',
      volume: '',
      last: '',
      next: '',
      estado: '',
    }));

    for (i = 0; i < lim; i++){
    let data = getData(json1, validData[i].id);
        tableData[i].id = data[0].id;
        tableData[i].brand = data[0].brand;
        tableData[i].purchase = data[0].purchase;
        tableData[i].volume = data[0].volume;
        tableData[i].last = data[0].last;
        tableData[i].next = validData[i].next;
        tableData[i].estado = validData[i].estado;
    }

    tableData.forEach(el=>{
      $template.querySelector(".id").textContent = el.id;
      $template.querySelector(".brand").textContent = el.brand;
      $template.querySelector(".purchase-date").textContent = el.purchase;
      $template.querySelector(".volume").textContent = el.volume;
      $template.querySelector(".last-date").textContent = el.last;
      $template.querySelector(".next-date").textContent = el.next;
      
      if((Date.now() - Date.parse(String(el.next))) >= 0 && (Date.now() - Date.parse(String(el.next))) <= 15778800000){
        $template.querySelector(".next-date").classList.add("warning");
        $template.querySelector(".next-date").classList.remove("danger");
      }
      else if((Date.now() - Date.parse(String(el.next))) > 15778800000){
        $template.querySelector(".next-date").classList.add("danger");
        $template.querySelector(".next-date").classList.remove("warning");
      }
      else{
        $template.querySelector(".next-date").classList.remove("danger");
        $template.querySelector(".next-date").classList.remove("warning");
      }

      let barra = $template.getElementById("barra");
      barra.style.width = `${el.estado}%`;
      barra.textContent = `${el.estado}%`;

      if(el.estado >= 80 && el.estado <= 100){
        barra.style.backgroundColor = "rgba(170,187,17,0.35)";
      }
      if(el.estado >= 25 && el.estado < 80){
        barra.style.backgroundColor = "rgba(255,186,38,0.35)";
      }
      if(el.estado >= 0 && el.estado < 25){
        barra.style.backgroundColor = "rgba(255,24,24,0.35)";
      }

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });
    $table.querySelector("tbody").appendChild($fragment);
  } catch (err) {
    let errorCode = err.status || "2316",
        errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
    $table.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }
};

const titleClick = {
  afterEvent: (chart, e) =>{
    const {
      event: {
        type,
        x,
        y
      }
    } = e;

    if(type != 'click'){
      return;
    }

    const {
      titleBlock: {
        top,
        right,
        bottom,
        left,
      }
    } = chart;

    if(left <= x && x <= right && bottom >= y && y >=top){updateTable()}
  }
}

$grafico.addEventListener("click", (e)=>{
  const res = semaforoChart.getElementsAtEventForMode(e,'nearest',{intersect: true}, true);
  if(res.length === 0){
    return;
  }
  updateTable(res[0].datasetIndex);
});

d.addEventListener("DOMContentLoaded",drawIndex);
d.addEventListener("click",drawStats);