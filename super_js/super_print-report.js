const $clientsTable = d.querySelector(".clients-table"),
      $aniloxTable = d.querySelector(".anilox-table"),
      $reportTable = d.querySelector(".report-table"),
      $clientsTemplate = d.getElementById("clients-template").content,
      $aniloxTemplate = d.getElementById("anilox-template").content,
      $reportTemplate = d.getElementById("report-template").content,
      $clientsFragment = d.createDocumentFragment(),
      $aniloxFragment = d.createDocumentFragment(),
      $reportFragment = d.createDocumentFragment(),
      $listaClientes = d.querySelector(".lista-clientes"),
      $listaAnilox = d.querySelector(".lista-anilox"),
      $listaReportes = d.querySelector(".lista-reportes"),
      $pdf = d.querySelector(".pdf"),
      $aniloxTableBody = d.querySelector(".anilox-table-body"),
      $reportTableBody = d.querySelector(".report-table-body"),
      $reportTitle = d.getElementById("report-title"),
      $reportPdf = d.getElementById("report-pdf"),
      $descargaPdf = d.getElementById("descarga-pdf"),
      $searchReportBtn = d.getElementById("search-report-btn"),
      $closeSearchReport = d.getElementById("close-search-report-anilox"),
      $modalSearchReport = d.getElementById("modal-search-report-anilox"),
      $searchReportId = d.getElementById("search-report-id"),
      $searchReport = d.getElementById("search-report");

let aniloxReportClient, aniloxReportId, aniloxReportDate;
let aniloxList = [];

const getClientList = async()=>{
  try {
    let res = await fetch("http://anx-suite:3000/clients"),
        json = await res.json();
    if(!res.ok) throw{status: res.status, statusText: res.statusText};
    let clientList = Object.values(json[0]);
    clientList.forEach(el => {
      $clientsTemplate.querySelector(".client").textContent = el.toUpperCase();
      let $clone = d.importNode($clientsTemplate, true);
      $clientsFragment.appendChild($clone);
    });
    $clientsTable.querySelector("tbody").appendChild($clientsFragment);
    $listaClientes.style.display = "flex";
  } catch (err) {
    errorMessage(err);
  }
}

const getAniloxList = async(e)=>{
  if(e.target.matches(".client")){
    try {
      for(let i = 0; i < e.target.parentElement.parentElement.children.length; i++){
        e.target.parentElement.parentElement.children[i].children[0].classList.remove("selected");
      }
      e.target.classList.add("selected");
      $aniloxTableBody.innerHTML = "";
      $reportTableBody.innerHTML = "";
      $pdf.style.display = "none";
      $listaReportes.style.display = "none";
      aniloxReportClient = e.target.textContent;
      let res = await fetch(`http://anx-suite:3000/${e.target.textContent}/`),
      json = await res.json();
      if(!res.ok) throw{status: res.status, statusText: res.statusText};
      json.forEach(el =>{
        $aniloxTemplate.querySelector(".id").textContent = el.id;
        let $clone = d.importNode($aniloxTemplate, true);
        $aniloxFragment.appendChild($clone);
      });
      $aniloxTable.querySelector("tbody").appendChild($aniloxFragment);
      $listaAnilox.style.display = "flex";
    } catch (err) {
      errorMessage(err);
    }
  }
}

const getReportList = async(e)=>{
  if(e.target.matches(".id")){
    try {
      for(let i = 0; i < e.target.parentElement.parentElement.children.length; i++){
        e.target.parentElement.parentElement.children[i].children[0].classList.remove("selected");
      }
      e.target.classList.add("selected");
      $reportTableBody.innerHTML = "";
      $pdf.style.display = "none";
      aniloxReportId = e.target.textContent;
      let res = await fetch(`http://anx-suite:3002/${aniloxReportClient}/${aniloxReportId}`),
      json = await res.json();
      if(!res.ok) throw{status: res.status, statusText: res.statusText};
      json.history.reverse();
      json.history.forEach(el => {
        $reportTemplate.querySelector(".date").textContent = el.date;
        let $clone = d.importNode($reportTemplate, true);
        $reportFragment.appendChild($clone);
      });
      $reportTable.querySelector("tbody").appendChild($reportFragment);
      $listaReportes.style.display = "flex";
    } catch (err) {
      errorMessage(err);
    }
  }
}

const getReport = async(e)=>{
  if(e.target.matches(".date")){
    try {
      for(let i = 0; i < e.target.parentElement.parentElement.children.length; i++){
        e.target.parentElement.parentElement.children[i].children[0].classList.remove("selected");
      }
      e.target.classList.add("selected");
      aniloxReportDate = e.target.textContent;
      $reportTitle.textContent = `${aniloxReportId}_${aniloxReportDate}`
      let res = await fetch(`http://anx-suite:3002/${aniloxReportClient}/${aniloxReportId}`),
      json = await res.json();
      if(!res.ok) throw{status: res.status, statusText: res.statusText};
      let reportURL;
      json.history.forEach(el =>{
        if(el.date === aniloxReportDate){
          reportURL = el.report;
        }
      });
      $reportPdf.setAttribute("data", reportURL);
      $descargaPdf.setAttribute("href", reportURL);
      $pdf.style.display = "flex";
    } catch (err) {
      errorMessage(err);
    }
  }
}

const searchSpecific = async(e)=>{
  if(e.target === $searchReportBtn){
    $modalSearchReport.style.display = "block";
  }
  if(e.target === $closeSearchReport){
    $modalSearchReport.style.display = "none"
  }
  if(e.target === $searchReport){
    for(let i = 0; i < $aniloxTable.children[0].children.length; i++){
      aniloxList[i] = $aniloxTable.children[0].children[i].children[0].textContent;
    }
    if(aniloxList.includes($searchReportId.value.toUpperCase())){
      aniloxReportId = $searchReportId.value.toUpperCase();
      $modalSearchReport.style.display = "none";
      $searchReportId.value = "";
      try {
        for(let i = 0; i < $aniloxTable.children[0].children.length; i++){
          $aniloxTable.children[0].children[i].children[0].classList.remove("selected");
        }
        $aniloxTable.children[0].children[aniloxList.indexOf(aniloxReportId)].children[0].classList.add("selected");
        $reportTableBody.innerHTML = "";
        $pdf.style.display = "none";
        let res = await fetch(`http://anx-suite:3002/${aniloxReportClient}/${aniloxReportId}`),
        json = await res.json();
        if(!res.ok) throw{status: res.status, statusText: res.statusText};
        json.history.reverse();
        json.history.forEach(el =>{
          $reportTemplate.querySelector(".date").textContent = el.date;
          let $clone = d.importNode($reportTemplate, true);
          $reportFragment.appendChild($clone);
        });
        $reportTable.querySelector("tbody").appendChild($reportFragment);
        $listaReportes.style.display = "flex";
      } catch (err) {
        errorMessage(err);
      }
    }
    else if($searchReportId.value === ""){
      $modalSearchReport.style.display = "none";
      $searchReportId.value = "";
      $alertContent.textContent = "Debe ingresar un ID para buscar el anilox en su lista.";
      $modalAlertBox.style.display = "block";
    }
    else{
      $modalSearchReport.style.display = "none";
      $searchReportId.value = "";
      $alertContent.textContent = "No se encontró el ID ingresado en su lista de anilox.";
      $modalAlertBox.style.display = "block";
    }
  }
}

d.addEventListener("DOMContentLoaded", getClientList);
d.addEventListener("click", getAniloxList);
d.addEventListener("click", getReportList);
d.addEventListener("click", getReport);
d.addEventListener("click", searchSpecific);