const $image = d.getElementById("uploaded-image"),
      $imageUpload = d.getElementById("image-upload"),
      $csvUpload = d.getElementById("csv-upload"),
      $form = d.querySelector(".files-upload"),
      $code = d.getElementById("import-code"),
      $date = d.getElementById("import-date"),
      $volume = d.getElementById("import-volume"),
      $depth = d.getElementById("import-depth"),
      $opening = d.getElementById("import-opening"),
      $wall = d.getElementById("import-wall"),
      $screen = d.getElementById("import-screen"),
      $angle = d.getElementById("import-angle");

const $pdfUpload = d.getElementById("new-master");

let image, data, master;

let alreadyExists, saveId, saveBrand, saveType, savePurchase, saveMaster, saveLast, savePatron;

const $modalNewAnilox = d.getElementById("modal-new-anilox"),
      $closeModalNewAnilox = d.getElementById("close-new-anilox"),
      $formNew = d.querySelector(".form-new");

const $modalExtraAnilox = d.getElementById("modal-extra-anilox"),
      $closeModalExtraAnilox = d.getElementById("close-extra-anilox"),
      $formExtra = d.querySelector(".form-extra"),
      $extraSkip = d.getElementById("extra-skip"),
      $extraSubmit = d.getElementById("extra-submit"),
      $extraRecorrido = d.getElementById("extra-recorrido");

const uploadImage = e=>{
  if(e.target === $imageUpload){
    if(e.target.files[0].type !== "image/jpeg"){
      alert("Solo se permite imagenes tipo JPG/JPEG");
      return;
    }
    image = e.target.files[0];
    $image.src = URL.createObjectURL(image);
  }
}

const uploadPdf = e=>{
  if(e.target === $pdfUpload){
    if(e.target.files[0].type !== "application/pdf"){
      alert("Solo se permite reportes de tipo PDF");
      return;
    }
    master = e.target.files[0];
  }
}

const uploadCSV = e=>{
  if(e.target === $csvUpload){
    if(e.target.files[0].type !== "text/csv" && e.target.files[0].type !== "application/vnd.ms-excel"){
      alert("Solo se permite archivos de datos tipo CSV");
      return;
    }
    data = e.target.files[0];
    Papa.parse(data, {
      delimiter: ",",
      worker: true,
      skipEmptyLines: true,
      complete: function(results){
        const date = results.data[0][4].split(' ');
        const formatedDate = date[0].split('/');
        $code.value = results.data[0][2];
        $date.value = `${formatedDate[2]}-${formatedDate[1]}-${formatedDate[0]}`;
        $volume.value = results.data[0][16];
        $depth.value = results.data[0][17];
        $opening.value = results.data[0][18];
        $wall.value = results.data[0][19];
        $screen.value = results.data[0][20];
        $angle.value = results.data[0][21];
      }
    })
  }
}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

const closeModal = e=>{
  if(e.target === $closeModalNewAnilox){
    $modalNewAnilox.style.display = "none";
  }
  if(e.target === $closeModalExtraAnilox){
    $modalExtraAnilox.style.display = "none";
  }
}

const submit = async(e)=>{
  e.preventDefault();
  if(e.target === $form){
    if($image.src.includes("anilox-placeholder.jpg")){
      alert("Debe seleccionar una imagen de ánilox para poder importar los datos");
      return;
    }
    if($code.value === "" || $date.value === "" || $volume.value === "" || $depth.value === "" || $opening.value === "" || $wall.value === "" || $screen.value === "" || $angle.value === ""){
      alert("Debe seleccionar un archivo CSV válido para poder importar los datos");
      return;
    }
    if(!image.name.includes($code.value)){
      alert("Archivo CSV e imagen de ánilox no coinciden");
      return;
    }
    if(Date.parse(image.lastModifiedDate) !== Date.parse(data.lastModifiedDate)){
      alert("Fecha de archivo CSV e imagen de ánilox no coinciden");
      return;
    }
    
    try {
      let res = await fetch("/anillox-list/anilox"),
          json = await res.json();

      if(!res.ok) throw{status: res.status, statusText: res.statusText};

      json.forEach(el=>{
        if(el.id === $code.value){
          alreadyExists = 1;
          saveId = el.id;
          saveBrand = el.brand;
          saveType = el.type;
          savePurchase = el.purchase;
          saveLast = el.last;
          saveMaster = el.master;
          savePatron = el.patron;
        }
        else {
          alreadyExists = 0;
        }
      });

      if(alreadyExists === 1){
        if(Date.parse(e.target.date.value) > Date.parse(saveLast)){
          $modalExtraAnilox.style.display = "block";
        }
        else{
          alert("No se permite importar revisiones con fecha anterior a la última registrada");
        }
      }
      if(alreadyExists === 0){
        $modalNewAnilox.style.display = "block";
      }
    } catch (err) {
      let errorCode = err.status || "2316",
          errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
          message1 = "Error " + errorCode + ": ",
          message2 = errorStatus;
      $form.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
      setTimeout(()=>{
        $form.nextElementSibling.remove()
      }, 2000);
    }
  }

  if(e.target === $formNew){
    try {
      const imagen = await toBase64(image);
      const pdf = await toBase64(master);

      let options = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          id: $code.value,
          brand: e.target.brand.value,
          purchase: e.target.purchase.value,
          volume: $volume.value,
          depth: $depth.value,
          opening: $opening.value,
          wall: $wall.value,
          screen: $screen.value,
          angle: $angle.value,
          last: $date.value,
          master: pdf,
          patron: imagen,
        }),
      },
          res = await fetch("/anillox-list/anilox", options);

      if(!res.ok) throw{status: res.status, statusText: res.statusText};
    } catch (err) {
      let errorCode = err.status || "2316",
          errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
          message1 = "Error " + errorCode + ": ",
          message2 = errorStatus;
      $formNew.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
      setTimeout(()=>{
        $formNew.nextElementSibling.remove()
      }, 2000);
    }
  }
}

const recorrido = async(e)=>{
  if(e.target === $extraSkip || e.target === $extraSubmit){
    try {
      const imagen = await toBase64(image);
      let valRecorrido;
      if(e.target === $extraSkip){
        valRecorrido = '---';
      }
      else if(e.target === $extraSubmit){
        if($extraRecorrido.validity.patternMismatch){
          alert("Debe ingresar un número");
          return;
        }
        if($extraRecorrido.value === ""){
          valRecorrido = '---';
        } else {
          valRecorrido = $extraRecorrido.value;
        }
      }
      let options = {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          id: saveId,
          brand: saveBrand,
          type: saveType,
          purchase: savePurchase,
          recorrido: valRecorrido,
          volume: $volume.value,
          depth: $depth.value,
          opening: $opening.value,
          wall: $wall.value,
          screen: $screen.value,
          angle: $angle.value,
          last: $date.value,
          master: saveMaster,
          patron: savePatron,
          revision: imagen,
        }),
      },
          res = await fetch(`./anillox-list/anilox/${saveId}`, options);
  
      if(!res.ok) throw{status: res.status, statusText: res.statusText};
      $formExtra.submit();
    } catch (err) {
      let errorCode = err.status || "2316",
          errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
          message1 = "Error " + errorCode + ": ",
          message2 = errorStatus;
      $formExtra.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
      setTimeout(()=>{
          $formExtra.nextElementSibling.remove()
      }, 2000);
    }
  }
}

const levelCheck = ()=>{
  let level = ss.getItem("level");
  if(level !== "3"){
    alert("No se encuentra autorizado para realizar esta operación");
    window.location.href = "index.html";
  }
}

d.addEventListener("DOMContentLoaded",levelCheck);
d.addEventListener("change", uploadImage);
d.addEventListener("change", uploadCSV);
d.addEventListener("change", uploadPdf);
d.addEventListener("submit", submit);
d.addEventListener("click", closeModal);
d.addEventListener("click", recorrido);