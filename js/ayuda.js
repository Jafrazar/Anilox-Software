const $licenseNumber = d.getElementById("license-number"),
      $licenseHolder = d.getElementById("license-holder"),
      $userLimit = d.getElementById("user-limit");

const licenseData = async ()=>{
  console.log("algodon");
  try {
    // if(ss.getItem("licenseNumber") === null){
    let res = await fetch("/api/licencias", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      }
    }),
      json = await res.json();

    if(!res.ok) throw{status: res.status, statusText: res.statusText};

    ss.setItem("licenseNumber",json.result[0].licenseNumber);
    ss.setItem("licenseHolder",json.result[0].licenseHolder);
    ss.setItem("usersUsed",json.result[0].usersUsed);
    ss.setItem("usersLimit",json.result[0].usersLimit);
    // }
    console.log("algodon3");
    $licenseNumber.textContent = ss.getItem("licenseNumber");
    $licenseHolder.textContent = ss.getItem("licenseHolder");
    $userLimit.textContent = `${ss.getItem("usersUsed")} / ${ss.getItem("usersLimit")}`;
  } catch (err) {
    let errorCode = err.status || "2316",
        errorStatus = err.statusText || "No se pudo establecer contacto con el servidor",
        message1 = "Error " + errorCode + ": ",
        message2 = errorStatus;
    $licenseHolder.insertAdjacentHTML("afterend", `<p><b>${message1}</b>${message2}</p>`);
  }
}

d.addEventListener("DOMContentLoaded",licenseData);