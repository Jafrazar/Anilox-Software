const $table = d.querySelector("table"),
      $tableBody = d.querySelector("tbody"),
      $template = d.getElementById("table-template").content,
      $fragment = d.createDocumentFragment();

const $clientSelector = d.getElementById("client-selector");

const $modalPdf = d.getElementById("modal-pdf"),
      $masterPdf = d.getElementById("master-pdf"),
      $closeModalPdf = d.getElementById("close-modal-pdf");

const $modalQuoteBox = d.getElementById("modal-quote-box"),
      $modalQuoteBoxBody = d.getElementById("modal-quote-box-body"),
      $closeQuoteBox = d.getElementById("close-quote-box"),
      $sendQuote = d.getElementById("send-quote"),
      $quoteType = d.getElementById("quote-type"),
      $quoteAngle = d.getElementById("quote-angle"),
      $quoteVol = d.getElementById("quote-vol"),
      $quoteScreen = d.getElementById("quote-screen");

const $modalDeleteBox = d.getElementById("modal-delete-box"),
      $modalDeleteBody = d.getElementById("modal-delete-body"),
      $closeDeleteBox = d.getElementById("close-delete-box"),
      $acceptDelete = d.getElementById("accept-delete"),
      $deleteId = d.getElementById("delete-id");

let quoteId, quoteType, quoteNomVol, quoteScreen, quoteAngle, quoteClient;
let deleteId;

const drawTable = (list)=>{
  list.forEach(el=>{
    $template.querySelector(".client").textContent = el.client.toUpperCase();
    $template.querySelector(".code").textContent = el.id;
    $template.querySelector(".brand").textContent = el.brand;
    $template.querySelector(".type").textContent = el.type;
    $template.querySelector(".purchase").textContent = el.purchase;
    $template.querySelector(".volume").textContent = el.volume;
    $template.querySelector(".last").textContent = el.last;
    $template.querySelector(".next").textContent = el.next;
    $template.querySelector(".master").dataset.base64 = el.master;
    $template.querySelector(".quote").dataset.id = el.id;
    $template.querySelector(".delete").dataset.id = el.id;
    if((Date.now() - Date.parse(String(el.next))) >= 0 && (Date.now() - Date.parse(String(el.next))) <= 15778800000){
      $template.querySelector(".next").classList.add("warning");
      $template.querySelector(".next").classList.remove("danger");
    }
    else if((Date.now() - Date.parse(String(el.next))) > 15778800000){
      $template.querySelector(".next").classList.add("danger");
      $template.querySelector(".next").classList.remove("warning");
    }
    else{
      $template.querySelector(".next").classList.remove("danger");
      $template.querySelector(".next").classList.remove("warning");
    }
    let barra = $template.getElementById("barra");
    barra.style.width = `${el.estado}%`;
    barra.textContent = `${el.estado}%`;
    if(el.estado >= 80 && el.estado <= 100){
      barra.style.backgroundColor = "rgba(170,187,17,0.35)"
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
}

const populateSelector = async(selectedClient)=>{
  try {
    let res = await fetch("http://anx-suite:3000/clients"),
        json = await res.json();
    if(!res.ok) throw{status: res.status, statusText: res.statusText};
    let clientList = Object.values(json[0]);
    for(let i = 0; i < clientList.length; i++){
      let option = d.createElement("option");
       option.value = clientList[i];
       option.textContent = clientList[i].toUpperCase();
       $clientSelector.appendChild(option);
    }
    for(let i = 0; i < $clientSelector.children.length; i++){
      if($clientSelector.children[i].value === selectedClient){
        $clientSelector.selectedIndex = i;
        break;
      }
    }
  } catch (err) {
    errorMessage(err);
  }
}

const drawAll = async()=>{
  $tableBody.innerHTML = "";
  try {
    let res = await fetch("http://anx-suite:3000/clients"),
        json = await res.json();
    if(!res.ok) throw{status: res.status, statusText: res.statusText};
    let clientList = Object.values(json[0]);
    let aniloxList = [];
    let analysisList = [];
    let completeList = [];
    let item = {
      client: '',
      id: '',
      brand: '',
      type: '',
      purchase: '',
      volume: '',
      last: '',
      master: '',
      next: '',
      estado: '',
    };
    for(let i = 0; i < clientList.length; i++){
      try {
        let res = await fetch(`http://anx-suite:3000/${clientList[i]}`),
            json = await res.json();
        if(!res.ok) throw{status: res.status, statusText: res.statusText};
        aniloxList.push(json);
      } catch (err) {
        errorMessage(err);  
      }
    }
    for(let i = 0; i < clientList.length; i++){
      try {
        let res = await fetch(`http://anx-suite:3003/${clientList[i]}`),
            json = await res.json();
        if(!res.ok) throw{status: res.status, statusText: res.statusText};
        analysisList.push(json);
      } catch (err) {
        errorMessage(err);
      }
    }
    for(let i = 0; i < clientList.length; i++){
      for(let j = 0; j < aniloxList[i].length; j++){
        if(aniloxList[i][j].id === analysisList[i][j].id){
          let newItem = {...item};
          newItem.client = clientList[i];
          newItem.id = aniloxList[i][j].id;
          newItem.brand = aniloxList[i][j].brand;
          newItem.type = aniloxList[i][j].type;
          newItem.purchase = aniloxList[i][j].purchase;
          newItem.volume = aniloxList[i][j].volume;
          newItem.last = aniloxList[i][j].last;
          newItem.master = aniloxList[i][j].master;
          newItem.next = analysisList[i][j].next;
          newItem.estado = analysisList[i][j].estado;
          completeList.push(newItem);
        }
      }
    }
    drawTable(completeList);
  } catch (err) {
    errorMessage(err);
  }
}

const drawSpecificClient = async(selectedClient)=>{
  $tableBody.innerHTML = "";
  let aniloxList = [];
  let analysisList = [];
  let completeList = [];
  let item = {
    client: '',
    id: '',
    brand: '',
    type: '',
    purchase: '',
    volume: '',
    last: '',
    master: '',
    next: '',
    estado: '',
  };
  try {
    let res = await fetch(`http://anx-suite:3000/${selectedClient}`),
        json = await res.json();
    if(!res.ok) throw{status: res.status, statusText: res.statusText};
    aniloxList.push(json);
  } catch (err) {
    errorMessage(err);  
  }
  try {
    let res = await fetch(`http://anx-suite:3003/${selectedClient}`),
        json = await res.json();
    if(!res.ok) throw{status: res.status, statusText: res.statusText};
    analysisList.push(json);
  } catch (err) {
    errorMessage(err);
  }
  for(let i = 0; i < aniloxList[0].length; i++){
    if(aniloxList[0][i].id === analysisList[0][i].id){
      let newItem = {...item};
      newItem.client = selectedClient;
      newItem.id = aniloxList[0][i].id;
      newItem.brand = aniloxList[0][i].brand;
      newItem.type = aniloxList[0][i].type;
      newItem.purchase = aniloxList[0][i].purchase;
      newItem.volume = aniloxList[0][i].volume;
      newItem.last = aniloxList[0][i].last;
      newItem.master = aniloxList[0][i].master;
      newItem.next = analysisList[0][i].next;
      newItem.estado = analysisList[0][i].estado;
      completeList.push(newItem);
    }
  }
  drawTable(completeList);
}

const drawOnLoad = async()=>{
  if(ss.getItem("client-list") === "none"){
    populateSelector("none");
    drawAll();
  }
  if(ss.getItem("client-list") !== "none"){
    let selectedClient = ss.getItem("client-list");
    populateSelector(selectedClient);
    drawSpecificClient(selectedClient);
  }
  ss.setItem("client-list","none");
}

const drawOnChange = async(e)=>{
  if(e.target === $clientSelector){
    let selectedClient = e.target.value;
    if(selectedClient === "none"){
      drawAll();
    }
    if(selectedClient !== "none"){
      drawSpecificClient(selectedClient);
    }
  }
}

const doOnClick = async(e)=>{
  //show master pdf
  if(e.target.matches(".master")){
    const base64 = e.target.dataset.base64;
    $masterPdf.setAttribute("data", base64);
    $modalPdf.style.display = "block";
  }
  if(e.target === $closeModalPdf){
    $modalPdf.style.display = "none";
  }
  //delete anilox
  if(e.target.matches(".delete")){
    deleteId = e.target.dataset.id;
    deleteClient = e.target.parentElement.parentElement.children[0].textContent.toLowerCase();
    $deleteId.textContent = deleteId;
    $modalDeleteBox.style.display = "block";
  }
  if(e.target === $acceptDelete){
    try {
      $modalDeleteBox.style.display = "none";
      let options = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      };
      try {
        let res = await fetch(`http://anx-suite:3002/${deleteClient}/${deleteId}`, options);
        if(!res.ok) throw{status: res.status, statusText: res.statusText};
      } catch (err) {
        errorMessage(err);
      }
      try {
        let res = await fetch(`http://anx-suite:3000/${deleteClient}/${deleteId}`, options);
        if(!res.ok) throw{status: res.status, statusText: res.statusText};
      } catch (err) {
        errorMessage(err);
      }
      try {
        let res = await fetch(`http://anx-suite:3003/${deleteClient}/${deleteId}`, options);
        if(!res.ok) throw{status: res.status, statusText: res.statusText};
      } catch (err) {
        errorMessage(err);
      }
      let res = await fetch(`http://anx-suite:3000/${deleteClient}/${deleteId}`);
      deleteId = undefined;
      if(res.ok){
        $alertContent.textContent = `Ocurrio un problema al eliminar el rodillo.`;
        $modalAlertBox.style.display = "block";
      }
      if(!res.ok) throw{status: res.status, statusText: res.statusText};
    } catch (err) {
      if(err.status === 404){
        $alertContent.textContent = `Rodillo eliminado exitosamente. Se refrescará automáticamente el portal en 5 segundos para mostrar los cambios.`;
        $modalAlertBox.style.display = "block";
        setTimeout(()=>{
          location.reload();
        }, 5000);
      }
    }
  }
  if(e.target === $closeDeleteBox){
    $modalDeleteBox.style.display = "none";
    deleteId = undefined;
  }
  //quote
  if(e.target.matches(".quote")){
    try {
      quoteId = e.target.dataset.id;
      quoteClient = e.target.parentElement.parentElement.children[0].textContent.toLowerCase();
      let res = await fetch(`http://anx-suite:3000/${quoteClient}/${quoteId}`),
          json = await res.json();
      if(!res.ok) throw{status: res.status, statusText: res.statusText};
      quoteType = json.type;
      quoteNomVol = json.nomvol;
      quoteScreen = json.screen;
      quoteAngle = json.angle;
      $quoteType.textContent = quoteType;
      $quoteAngle.textContent = quoteAngle;
      $quoteVol.textContent = quoteNomVol;
      $quoteScreen.textContent = quoteScreen;
      $modalQuoteBox.style.display = "block";
    } catch (err) {
      let errorCode = err.status || "2316",
          errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
          message1 = "Error " + errorCode + ": ",
          message2 = errorStatus;
      $modalQuoteBoxBody.insertAdjacentHTML("afterend",`<p><b>${message1}</b>${message2}</p>`);
      setTimeout(()=>{
        $modalQuoteBoxBody.nextElementSibling.remove();
      }, 2000);
    }
  }
  if(e.target === $sendQuote){
    try {
      let options = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          type: quoteType,
          nomvol: quoteNomVol,
          screen: quoteScreen,
          angle: quoteAngle,
          client: quoteClient,
          reqDate: (new Date(Date.now()).toJSON()).slice(0,10),
        }),
      },
          res = await fetch("http://anx-suite:3004/single", options);
          if(res.ok){
            $modalQuoteBox.style.display = "none";
            quoteId = undefined;
            quoteType = undefined;
            quoteNomVol = undefined;
            quoteScreen = undefined;
            quoteAngle = undefined;
            quoteClient = undefined;
            $alertContent.textContent = `Solicitud registrada exitosamente.`;
            $modalAlertBox.style.display = "block";
          }
          if(!res.ok) throw{status: res.status, statusText: res.statusText};
    } catch (err) {
      let errorCode = err.status || "2316",
          errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
          message1 = "Error " + errorCode + ": ",
          message2 = errorStatus;
      $modalQuoteBoxBody.insertAdjacentHTML("afterend",`<p><b>${message1}</b>${message2}</p>`);
      setTimeout(()=>{
        $modalQuoteBoxBody.nextElementSibling.remove();
      }, 2000);
    }
  }
  if(e.target === $closeQuoteBox){
    $modalQuoteBox.style.display = "none";
    quoteNomVol = undefined;
    quoteType = undefined;
    quoteNomVol = undefined;
    quoteScreen = undefined;
    quoteAngle = undefined;
    quoteClient = undefined;
  }
  //load
  if(e.target.matches(".code")){
    let loadId = e.target.textContent;
    let loadBrand = e.target.nextElementSibling.textContent;
    let loadClient = e.target.previousElementSibling.textContent;
    ss.setItem("aniloxId", loadId);
    ss.setItem("aniloxBrand", loadBrand);
    ss.setItem("aniloxClient", loadClient);
    window.location.href = 'anilox-detail.html';
  }
}

d.addEventListener("DOMContentLoaded", drawOnLoad);
d.addEventListener("change", drawOnChange);
d.addEventListener("click", doOnClick);