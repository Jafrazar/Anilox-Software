// Common constants

const d = document,
      ls = localStorage,
      ss = sessionStorage;

const $modalAlertBox = d.getElementById("modal-alert-box"),
      $closeAlertBox = d.getElementById("close-alert-box"),
      $alertContent = d.getElementById("alert-content");

// Service Worker

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js')
  .catch(err => console.warn(err));
}

//Topbar

const $user = d.getElementById("user-name"),
      $level = d.getElementById("user-level");

d.addEventListener("DOMContentLoaded",async()=>{
  try {
    if(ss.getItem("user") === null){
      let res = await fetch("http://anx-suite:3001/user"),
          json = await res.json();
      if(!res.ok) throw{status: res.status, statusText: res.statusText};
      ss.setItem("user",json[0].user);
      ss.setItem("level",json[0].level);
    }
    $user.textContent = ss.getItem("user");
  } catch (err) {
    console.log(err);
    let errorCode = err.status || "2316",
        errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
    $level.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }
})

// Level Check

d.addEventListener("DOMContentLoaded", ()=>{
  let level = ss.getItem("level");
  // if(level !== "4"){
  //   alert("No se encuentra autorizado para realizar esta operación");
  //   window.location.href = "index.html";
  // }
});

// Dropdown

const $dropArchivo = d.getElementById("drop-archivo"),
      $dropVer = d.getElementById("drop-ver"),
      $dropOpciones = d.getElementById("drop-opciones"),
      $sideMenu = d.querySelector(".left-content"),
      $logo = d.querySelector(".logo"),
      $ocultarMenu = d.getElementById("ocultar-menu"),
      $modalSearchAnilox = d.getElementById("modal-search-anilox"),
      $buscarAnilox = d.getElementById("buscar-anilox"),
      $closeModalSearchAnilox = d.getElementById("close-search-anilox");

d.addEventListener("click",e=>{
  if(e.target.matches(".dropbtn")){
    let drop = e.target.nextElementSibling;
    if(drop.id == "drop-archivo"){
      $dropArchivo.classList.add("show");
      $dropVer.classList.remove("show");
      $dropOpciones.classList.remove("show");
    }
    else if(drop.id == "drop-ver"){
      $dropArchivo.classList.remove("show");
      $dropVer.classList.add("show");
      $dropOpciones.classList.remove("show");
    }
    else if(drop.id == "drop-opciones"){
      $dropArchivo.classList.remove("show");
      $dropVer.classList.remove("show");
      $dropOpciones.classList.add("show");
    }
    else if(drop.id == "drop-ayuda"){
      $dropArchivo.classList.remove("show");
      $dropVer.classList.remove("show");
      $dropOpciones.classList.remove("show");
    }
  }
  if(!e.target.matches(".dropbtn")){
    $dropArchivo.classList.remove("show");
    $dropVer.classList.remove("show");
    $dropOpciones.classList.remove("show");
  }
  if(e.target == $ocultarMenu){
    $sideMenu.classList.toggle("hide");
    $logo.classList.toggle("hide");
    if(ls.getItem("sidebar") == "show"){
      ls.setItem("sidebar","hide");
    }
    else if(ls.getItem("sidebar") == "hide"){
      ls.setItem("sidebar","show");
    }
  }
  if(e.target === $buscarAnilox){
    $modalSearchAnilox.style.display = "block";
  }
  if(e.target === $closeModalSearchAnilox){
    $modalSearchAnilox.style.display = "none";
  }
});

d.addEventListener("DOMContentLoaded",()=>{
  if(ls.getItem("sidebar") === null){
    ls.setItem("sidebar","show");
  }
  if(ls.getItem("sidebar") === "show"){
    $sideMenu.classList.remove("hide");
    $logo.classList.remove("hide");
  }
  if(ls.getItem("sidebar") === "hide"){
    $sideMenu.classList.add("hide");
    $logo.classList.add("hide");
  }
});

//Sidebar

const $logOut = d.getElementById("log-out"),
      $searchAnilox = d.getElementById("search-anilox"),
      $listado = d.getElementById("listado");

const logOut = e=>{
  ss.clear();
  e.stopPropagation();
}

const showSearchAnilox = e=>{
  e.stopPropagation();
  $modalSearchAnilox.style.display = "block";
}

const listado = e=>{
  e.stopPropagation();
  ss.setItem("client-list", "none")
}

$logOut.addEventListener("click",logOut);
$searchAnilox.addEventListener("click",showSearchAnilox);
$listado.addEventListener("click",listado);

// Alert Box

d.addEventListener("click", (e)=>{
  if(e.target === $closeAlertBox){
    $modalAlertBox.style.display = "none";
  }
});

//Error Message

const errorMessage = (error)=>{
  console.log(error);
  let errorCode = error.status || "2316",
      errorStatus = error.statusText || "No se pudo establecer contacto con el servidor",
      message1 = "Error " + errorCode + ": ",
      message2 = errorStatus;
  $alertContent.textContent = `${message1}: ${message2}`;
  $modalAlertBox.style.display = "block";
}

// Search Anilox

const $formSearch = d.querySelector(".form-search"),
      $searchId = d.getElementById("search-id");

d.addEventListener("submit",async(e)=>{
  if(e.target === $formSearch){
    e.preventDefault();
    let searchId = $searchId.value.toUpperCase();
    let clientsList, aniloxClient, aniloxBrand;
    let foundFlag;
    try {
      let res = await fetch(`http://anx-suite:3000/clients`),
          json = await res.json();
      if(!res.ok) throw{status: res.status, statusText: res.statusText};
      clientsList = Object.values(json[0]);
    } catch (err) {
      console.log(err);
      let errorCode = err.status || "2316",
          errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
          message1 = "Error " + errorCode + ": ",
          message2 = errorStatus;
      $formSearch.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
      setTimeout(()=>{
        $formSearch.nextElementSibling.remove()
      }, 2000);
    }
    for(let i = 0; i < clientsList.length; i++){
      try {
        let res = await fetch(`http://anx-suite:3000/${clientsList[i]}`),
            json = await res.json();
        if(!res.ok) throw{status: res.status, statusText: res.statusText};
        json.forEach(el => {
          if(el.id === searchId){
            foundFlag = 1;
            aniloxBrand = el.brand;
            aniloxClient = clientsList[i].toUpperCase();
          }
        });
      } catch (err) {
        console.log(err);
        let errorCode = err.status || "2316",
            errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
            message1 = "Error " + errorCode + ": ",
            message2 = errorStatus;
        $formSearch.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
        setTimeout(()=>{
          $formSearch.nextElementSibling.remove()
        }, 2000);
      }
    }
    if(foundFlag === 1){
      ss.setItem("aniloxId", searchId);
      ss.setItem("aniloxBrand", aniloxBrand);
      ss.setItem("aniloxClient", aniloxClient);
      window.location.href = 'anilox-detail.html';
    }
    if(foundFlag !== 1){
      $alertContent.textContent = `No se encontro ánilox con el código ingresado en su base de datos.`;
      $modalAlertBox.style.display = "block";
    }
    $searchId.value = "";
  }
});