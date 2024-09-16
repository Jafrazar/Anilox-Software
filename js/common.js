// Common Constants

const d = document,
      ls = localStorage,
      ss = sessionStorage;

const $modalAlertBox = d.getElementById("modal-alert-box"),
      $closeAlertBox = d.getElementById("close-alert-box"),
      $alertContent = d.getElementById("alert-content");
      
// Service Worker

// if('serviceWorker' in navigator){
//   navigator.serviceWorker.register('./sw.js')
//   .catch(err => console.warn(err));
// }

// Dropdown

const dropArchivo = d.getElementById("drop-archivo"),
      dropVer = d.getElementById("drop-ver"),
      dropOpciones = d.getElementById("drop-opciones"),
      dropAyuda = d.getElementById("drop-ayuda"),

      sideMenu = d.querySelector(".left-content"),
      logo = d.querySelector(".logo");
      ocultarMenu = d.getElementById("ocultar-menu"),

      modalEditDash = d.getElementById("modal-edit-dash"),
      editarDashboard = d.getElementById("editar-dashboard"),
      closeModalEditDash = d.getElementById("close-edit-dash"),

      modalSearchAnilox = d.getElementById("modal-search-anilox"),
      buscarAnilox = d.getElementById("buscar-anilox"),
      closeModalSearchAnilox = d.getElementById("close-search-anilox"),

      showStats = d.getElementById("show-stats"),
      showAnilox = d.getElementById("show-anilox"),
      showDetails = d.getElementById("show-details"),
      rightMenu = d.querySelector(".right-content"),
      centerMenu = d.querySelector(".center-content"),
      bottomMenu = d.querySelector(".bottom-content"),

      indexContent = d.querySelector(".index-content"),
      topFirst = d.getElementById("top-first"),
      bottomFirst = d.getElementById("bottom-first");

d.addEventListener("click",e=>{
  if(e.target.matches(".dropbtn")){
    let drop = e.target.nextElementSibling;
    if(drop.id == "drop-archivo"){
      dropArchivo.classList.add("show");
      dropVer.classList.remove("show");
      dropOpciones.classList.remove("show");
      dropAyuda.classList.remove("show");
    }
    else if(drop.id == "drop-ver"){
      dropArchivo.classList.remove("show");
      dropVer.classList.add("show");
      dropOpciones.classList.remove("show");
      dropAyuda.classList.remove("show");
    }
    else if(drop.id == "drop-opciones"){
      dropArchivo.classList.remove("show");
      dropVer.classList.remove("show");
      dropOpciones.classList.add("show");
      dropAyuda.classList.remove("show");
    }
    else if(drop.id == "drop-ayuda"){
      dropArchivo.classList.remove("show");
      dropVer.classList.remove("show");
      dropOpciones.classList.remove("show");
      dropAyuda.classList.add("show");
    }
  }

  if(!e.target.matches(".dropbtn")){
    dropArchivo.classList.remove("show");
    dropVer.classList.remove("show");
    dropOpciones.classList.remove("show");
    dropAyuda.classList.remove("show");
  }

  if(e.target == ocultarMenu){
    sideMenu.classList.toggle("hide");
    logo.classList.toggle("hide");
    if(ls.getItem("sidebar") == "show"){
      ls.setItem("sidebar","hide");
    }
    else if(ls.getItem("sidebar") == "hide"){
      ls.setItem("sidebar","show");
    }
  }

  if(e.target == editarDashboard){
    modalEditDash.style.display = "block";
    if(ls.getItem("anilox") === "show"){
      showAnilox.checked = true;
    }
    if(ls.getItem("anilox") === "hide"){
      showAnilox.checked = false;
    }
    if(ls.getItem("stats") === "show"){
      showStats.checked = true;
    }
    if(ls.getItem("stats") === "hide"){
      showStats.checked = false;
    }
    if(ls.getItem("details") === "show"){
      showDetails.checked = true;
    }
    if(ls.getItem("details") === "hide"){
      showDetails.checked = false;
    }
    if(ls.getItem("direction") === "normal"){
      topFirst.checked = true;
      bottomFirst.checked = false;
    }
    if(ls.getItem("direction") === "reverse"){
      topFirst.checked = false;
      bottomFirst.checked = true;
    }
  }

  if (e.target.matches("#cerrar-sesion")) {
    // Borrar todas las cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }

  if(e.target == closeModalEditDash){
    modalEditDash.style.display = "none";
  }

  if(e.target === showAnilox){
    if(showAnilox.checked === true){
      rightMenu.classList.remove("hide");
      ls.setItem("anilox", "show");
    }
    if(showAnilox.checked === false){
      rightMenu.classList.add("hide");
      ls.setItem("anilox","hide");
    }
  }

  if(e.target === showStats){
    if(showStats.checked === true){
      centerMenu.classList.remove("hide");
      ls.setItem("stats", "show");
    }
    if(showStats.checked == false){
      centerMenu.classList.add("hide");
      ls.setItem("stats", "hide");
    }
  }

  if(e.target === showDetails){
    if(showDetails.checked === true){
      bottomMenu.classList.remove("hide");
      ls.setItem("details", "show");
    }
    if(showDetails.checked === false){
      bottomMenu.classList.add("hide");
      ls.setItem("details", "hide");
    }
  }

  if(e.target === topFirst){
    if(topFirst.checked === true){
      indexContent.style.flexDirection = "column";
      ls.setItem("direction", "normal");
    }
  }

  if(e.target === bottomFirst){
    if(bottomFirst.checked === true){
      indexContent.style.flexDirection = "column-reverse";
      ls.setItem("direction", "reverse");
    }
  }

  if(e.target === buscarAnilox){
    modalSearchAnilox.style.display = "block";
  }

  if(e.target === closeModalSearchAnilox){
    modalSearchAnilox.style.display = "none";
  }
});

d.addEventListener("DOMContentLoaded",e=>{
  if(ls.getItem("sidebar") === null){
    ls.setItem("sidebar","show");
  }
  if(ls.getItem("sidebar") === "show"){
    sideMenu.classList.remove("hide");
    logo.classList.remove("hide");
  }
  if(ls.getItem("sidebar") === "hide"){
    sideMenu.classList.add("hide");
    logo.classList.add("hide");
  }

  if(ls.getItem("anilox") === null){
    ls.setItem("anilox","show");
  }
  if(ls.getItem("anilox") === "show"){
    rightMenu.classList.remove("hide");
  }
  if(ls.getItem("anilox") === "hide"){
    rightMenu.classList.add("hide");
  }

  if(ls.getItem("stats") === null){
    ls.setItem("stats","show");
  }
  if(ls.getItem("stats") === "show"){
    if(centerMenu !== null){
      centerMenu.classList.remove("hide");
    }
  }
  if(ls.getItem("stats") === "hide"){
    if(centerMenu !== null){
      centerMenu.classList.add("hide");
    }
  }

  if(ls.getItem("details") === null){
    ls.setItem("details","show");
  }
  if(ls.getItem("details") === "show"){
    if(bottomMenu !== null){
      bottomMenu.classList.remove("hide");
    }
  }
  if(ls.getItem("details") === "hide"){
    if(bottomMenu !== null){
      bottomMenu.classList.add("hide");
    }
  }

  if(ls.getItem("direction") === null){
    ls.setItem("direction","normal");
  }
  if(ls.getItem("direction") === "normal"){
    if(indexContent !== null){
      indexContent.style.flexDirection = "column";
    }
  }
  if(ls.getItem("direction") === "reverse"){
    if(indexContent !== null){
      indexContent.style.flexDirection = "column-reverse";
    }
  }
});

//Topbar

const $user = d.getElementById("user-name"),
      $level = d.getElementById("user-level");

const $clientLogo = d.getElementById("client-logo");

const getUser = async()=>{
  try {
    console.log("El ss.getItem(user) es: ", ss.getItem("user"));
    console.log("El ss.getItem(level) es: ", ss.getItem("level"));
      let res = await fetch("/api/usuarios", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
      }), //Falta extraer user
          json = await res.json();

      if(!res.ok) throw{status: res.status, statusText: res.statusText};

      ss.setItem("user",json.sesion_usuario);
      ss.setItem("level",json.result[0].level);    

    $user.textContent = ss.getItem("user");
    let level = ss.getItem("level");
    if(level === "1"){
      $level.textContent = "Operario";
    }
    else if(level === "2"){
      $level.textContent = "Supervisor";
    }
    else if(level === "3"){
      $level.textContent = "Administrador";
    }
  } 
  catch (err) {
    console.log(err);
    let errorCode = err.status || "2316",
        errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
    $level.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }
}

const getClient = async()=>{
  try {
    if(ss.getItem("client") === null){
      let res = await fetch("/api/clientes", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
      }),
      json = await res.json();

      if(!res.ok) throw{status: res.status, statusText: res.statusText};

      ss.setItem("client", json.result[0].name);
      ss.setItem("logo", json.result[0].logo);
    }

    $clientLogo.src = ss.getItem("logo");
  } 
  catch (err) {
    console.log(err);
    let errorCode = err.status || "2316",
        errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
    $clientName.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }
}

d.addEventListener("DOMContentLoaded",getUser);
d.addEventListener("DOMContentLoaded",getClient);

//Sidebar

const $logOut = d.getElementById("log-out"),
      $modalSearchAnilox = d.getElementById("modal-search-anilox"),
      $searchAnilox = d.getElementById("search-anilox"),
      $closeSearchAnilox = d.getElementById("close-search-anilox");

const logOut = e=>{
  ss.clear();
  e.stopPropagation();
  document.cookie.split(";").forEach((c) => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}

const showSearchAnilox = e=>{
  e.stopPropagation();
  $modalSearchAnilox.style.display = "block";
}

const closeSearchAnilox = e=>{
  e.stopPropagation();
  $modalSearchAnilox.style.display = "none";
}

$logOut.addEventListener("click",logOut);
$searchAnilox.addEventListener("click",showSearchAnilox);
$closeSearchAnilox.addEventListener("click",closeSearchAnilox);

// Search Anilox

const $formSearch = d.querySelector(".form-search"),
      $searchId = d.getElementById("search-id");
      
const searchAnilox = async(e)=>{
  if(e.target === $formSearch){
    e.preventDefault();
    let searchId = $searchId.value.toUpperCase();

    try {
      let res = await fetch("/api/listado", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
      }),
      json = await res.json();
      json = json.result;
      if(!res.ok) throw{status: res.status, statusText: res.statusText};
      
      let foundFlag;

      json.forEach(el=>{
        if(el.id === searchId){
          foundFlag = 1;
        }
      });
      if(foundFlag === 1){
        ss.setItem("aniloxId", searchId);
        window.location.href = 'anilox-detail.html';
      }
      if(foundFlag !== 1){
        alert("No se encontró ánilox con el código ingresado en su base de datos");
      }
      $searchId.value = "";
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
}

d.addEventListener("submit",searchAnilox);

// Alert Box

const closeAlertBox = (e)=>{
  if(e.target === $closeAlertBox){
    $modalAlertBox.style.display = "none";
  }
}

d.addEventListener("click", closeAlertBox);

// License remaining days

const $daysLeft = d.getElementById("days-left");

const getDaysLeft = async()=>{
  let expirationDate;
  try {
    let res = await fetch("/api/licencias", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      }
    }),
      json = await res.json();

    if(!res.ok) throw{status: res.status, statusText: res.statusText};
    ss.setItem("expiration", json.result[0].expiration);
    expirationDate = json.result[0].expiration;
  } 
  catch (err) {
    console.log(err);
    let errorCode = err.status || "2316",
        errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
    $daysLeft.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }
  
  let today = (new Date().toISOString()).slice(0,10);
  let days = Math.floor((Math.abs(Date.parse(expirationDate) - Date.parse(today)) /1000) / 86400);
  $daysLeft.textContent = days;
}

d.addEventListener("DOMContentLoaded", getDaysLeft);