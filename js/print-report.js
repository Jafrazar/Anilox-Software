const $aniloxTable = d.querySelector(".anilox-table"),
      $reportTable = d.querySelector(".report-table"),
      $aniloxTemplate = d.getElementById("anilox-template").content,
      $reportTemplate = d.getElementById("report-template").content,
      $aniloxFragment = d.createDocumentFragment(),
      $reportFragment = d.createDocumentFragment(),
      $listaAnilox = d.querySelector(".lista-anilox"),
      $listaReportes = d.querySelector(".lista-reportes"),
      $pdf = d.querySelector(".pdf"),
      $reportTableBody = d.querySelector(".report-table-body"),
      $reportTitle = d.getElementById("report-title"),
      $reportPdf = d.getElementById("report-pdf"),
      $descargaPdf = d.getElementById("descarga-pdf");

let aniloxReportId, aniloxReportDate;

const getAniloxList = async ()=>{
  try {
    $listaAnilox.style.display = "block";
    let res = await fetch("/api/listado", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      }
    }),
        json = await res.json();
        json = json.result;

    if(!res.ok) throw{status: res.status, statusText: res.statusText};
    
    json.forEach(el => {
      $aniloxTemplate.querySelector(".id").textContent = el.id;
      let $clone = d.importNode($aniloxTemplate, true);
      $aniloxFragment.appendChild($clone);
    });
    $aniloxTable.querySelector("tbody").appendChild($aniloxFragment);
  } catch (err) {
    let errorCode = err.status || "2316",
        errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
    $aniloxTable.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }
}

const getReportList = async(e)=>{
  if(e.target.matches(".id")){
    try {
      $reportTableBody.innerHTML = "";
      $listaReportes.style.display = "block";
      aniloxReportId = e.target.textContent;
      let res = await fetch('/api/anilox-history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({aniloxReportId: aniloxReportId})
      }),
          json = await res.json();
          json = json.result;

      if(!res.ok) throw{status: res.status, statusText: res.statusText};
      json.reverse();

      json.forEach(el =>{
        $reportTemplate.querySelector(".date").textContent = el.date;
        let $clone = d.importNode($reportTemplate, true);
        $reportFragment.appendChild($clone);
      });
      $reportTable.querySelector("tbody").appendChild($reportFragment);
    } catch (err) {
      let errorCode = err.status || "2316",
          errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
          message1 = "Error " + errorCode + ": ",
          message2 = errorStatus;
      $reportTable.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
    }
  }
}

const getReport = async(e)=>{
  if(e.target.matches(".date")){
    try {
      $pdf.style.display = "block";
      aniloxReportDate = e.target.textContent;
      $reportTitle.textContent = `${aniloxReportId}_${aniloxReportDate}`
      let res = await fetch('/api/anilox-history', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ aniloxReportId: aniloxReportId })
    }),
          json = await res.json();
          json = json.result;

      if(!res.ok) throw{status: res.status, statusText: res.statusText};

      let reportURL;

      json.forEach(el =>{
        if(el.date === aniloxReportDate){
          reportURL = el.report;
        }
      });

      $reportPdf.setAttribute("data", reportURL);
      $descargaPdf.setAttribute("href", reportURL);
    } catch (err) {
      let errorCode = err.status || "2316",
          errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
         message1 = "Error " + errorCode + ": ",
         message2 = errorStatus;
      $reportPdf.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
    }
  }
}

const levelCheck = ()=>{
  let level = ss.getItem("level")
  if(level === "1"){
    alert("No se encuentra autorizado para realizar esta operación");
    window.location.href = "index.html";
  }
}

d.addEventListener("DOMContentLoaded",levelCheck);
d.addEventListener("DOMContentLoaded",getAniloxList);
d.addEventListener("click", getReportList);
d.addEventListener("click", getReport);