const $table = d.querySelector(".anilox-table"),
      $template = d.getElementById("anilox-template").content,
      $fragment = d.createDocumentFragment();

const $modalPdf = d.getElementById("modal-pdf"),
      $masterPdf = d.getElementById("master-pdf"),
      $closeModalPdf = d.getElementById("close-modal-pdf");

const getData = (json, id)=>{
  return json.filter(el => el.id === id);
}

const getAll = async ()=>{
  try {
    let res1 = await fetch("/anillox-list/anilox"),
        json1 = await res1.json();
        
    let res2 = await fetch("/anillox-analysis/anilox"),
        json2 = await res2.json();
        
    if(!res1.ok) throw{status: res1.status, statusText: res1.statusText};
    if(!res2.ok) throw{status: res2.status, statusText: res2.statusText};
    
    let tableData = Array.from(Array(json2.length), ()=>({
      id: '',
      brand: '',
      type: '',
      purchase: '',
      volume: '',
      last: '',
      master: '',
      next: '',
      estado: '',
    }));

    for (i = 0; i < json1.length; i++){
      let data = getData(json1, json2[i].id);
      tableData[i].id = data[0].id;
      tableData[i].brand = data[0].brand;
      tableData[i].type = data[0].type;
      tableData[i].purchase = data[0].purchase;
      tableData[i].volume = data[0].volume;
      tableData[i].last = data[0].last;
      tableData[i].master = data[0].master;
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
      $template.querySelector(".master").dataset.base64 = el.master;
      $template.querySelector(".next-date").textContent = el.next;
      $template.querySelector(".delete").dataset.id = el.id;
      
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

  } catch (err) {
    let errorCode = err.status || "2316",
        errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
    $table.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }
}

const load = e=>{
  if(e.target.matches(".id")){
    let loadId = e.target.textContent;
    ss.setItem("aniloxId", loadId);
    window.location.href = 'anilox-detail.html';
  }
  if(e.target.matches(".master")){
    const base64 = e.target.dataset.base64;
    $masterPdf.setAttribute("data", base64);
  }
}

const showModalPdf = e=>{
  if(e.target.matches(".master")){
    $modalPdf.style.display = "block";
  }
  if(e.target === $closeModalPdf){
    $modalPdf.style.display = "none";
  }
}

const deleteAnilox = async(e)=>{
  if(e.target.matches(".delete")){
    let level = ss.getItem("level");
    if(level !== "3"){
      alert("No se encuentra autorizado para realizar esta operación");
      return;
    }
    let isDelete = confirm(`¿Está seguro que desea eliminar el ánilox de código ${e.target.dataset.id}?`);
    if(isDelete){
      try {
        let deleteID = e.target.dataset.id;
        let options = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
        };

        let res1 = await fetch(`./anillox-history/${deleteID}`),
            json = await res1.json();

        if(!res1.ok) throw{status: res1.status, statusText: res1.statusText};
        
        json.forEach(async(el) =>{
          let res = await fetch(`./anillox-history/${deleteID}/${el.id}`, options);
          if(!res.ok) throw{status: res.status, statusText: res.statusText};
        });

        let res2 = await fetch(`./anillox-list/anilox/${deleteID}`, options),
            res3 = await fetch(`./anillox-analysis/anilox/${deleteID}`, options);

        if(!res2.ok) throw{status: res2.status, statusText: res2.statusText};
        if(!res3.ok) throw{status: res3.status, statusText: res3.statusText};
        location.reload();
      } catch (err) {
        let errorCode = err.status || "2316",
            errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
            message1 = "Error " + errorCode + ": ",
            message2 = errorStatus;
        alert(`${message1}: ${message2}`);
      }
    }
  }
}

d.addEventListener("DOMContentLoaded",getAll);
d.addEventListener("click", showModalPdf);
d.addEventListener("click",load);
d.addEventListener("click",deleteAnilox);