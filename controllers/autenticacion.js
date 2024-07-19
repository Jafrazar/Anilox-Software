let sesion_usuario = 'Franco', sesion_empresa = 'Anders Perú';
const mysql = require('mysql');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const path = require('path');
const { Chart } = require('chart.js/auto');
const ChartDataLabels = require('chartjs-plugin-datalabels');
Chart.register(ChartDataLabels);
const { createCanvas, loadImage } = require('canvas');
const { PDFNet } = require("@pdftron/pdfnet-node");
const fs = require('fs');
const os = require('os');

const db = mysql.createPool({
  host: 'database-1.crkw6qaew4si.sa-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '104-55Fppl2',
  database: 'ANDERS'
});

db.getConnection((err) => {
  if (err) throw err;
  console.log('Conexión exitosa a MySQL');
});

let usuarios = []; 
const query = 'SELECT user_l FROM login';
db.query(query, (err, results) => {
  if (err) throw err;

  // Extrae los usuarios de los resultados
  usuarios = results.map((row) => row.user_l);

  // Imprime los usuarios
  console.log('Usuarios:');
  usuarios.forEach((usuario) => {
    process.stdout.write(usuario + ", "); // Sirve para imprimir en la consola en una misma línea
  });
  console.log("\n");
});

async function login(req, res) {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM login WHERE user_l = ? AND pass_l = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            console.log(result[0].user_l);
            const token = jwt.sign({ user: result[0].user_l }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRATION // expira en una hora
            });

            const cookieOption = {
              expires: new Date(Date.now() + 1000*1800), // process.env.ACCESS_COOKIE_EXPIRATION * 3600 * 24 * 1000 -- expira en 1 dia
              path: '/',
            }
            res.cookie("jwt", token, cookieOption);
            res.set('Authorization', token);
            sesion_usuario = result[0].user_l;
            sesion_empresa = result[0].empresa;
            return res.status(200).send({status: "Success", message: `Usuario ${username} logueado correctamente`,  redirect: '/index'});
        } else {
            console.log('Error: Usuario o contraseña incorrectos');
            return res.status(400).send({status: "Error", message: "Usuario o contraseña incorrectos"});     
        }
    });
}

async function registro(req, res) {
  const { username, password, email, license } = req.body;
  console.log(username, password, email, license); 
    const licenciaSql = 'SELECT * FROM licencias WHERE licenseNumber = ?';
    db.query(licenciaSql, [license], (err, result) => {
      if (err) throw(err);
      if(result.length == 0){
        console.log('Consola: Licencia no válida');
        return res.status(400).send({status: "Error", message: "Licencia no válida"});
      } else {
        const licenseHolder = result[0].licenseHolder;
        const checkSql = 'SELECT * FROM login WHERE user_l = ? OR mail = ?';
        db.query(checkSql, [username, email], (err2, resultado) => {
            if (err2) throw err2;
            if (resultado.length > 0) {
              console.log('Consola: El usuario ingresado ya existe');
              return res.status(400).send({status: "Error", message: "El usuario ingresado ya existe"});              
            } else {
                const sql = 'INSERT INTO login (user_l, pass_l, mail, empresa) VALUES (?, ?, ?, ?)';
                db.query(sql, [username, password, email, licenseHolder], (err3, resultado2) => {
                    if (err3) throw err3;
                    if (resultado2.affectedRows === 0) {                      
                      return res.status(400).send({status: "Error", message: "Error al registrar usuario"});
                    } else {
                        console.log('Usuario registrado nuevo:', resultado2.insertId);
                        return res.status(201).send({status: "Success", message: 'Usuario ${username} registrado correctamente', redirect: '/registro_licencia'});
                    }
                });
            }
        });
      }
    });
}

async function registro_licencia(req, res) {
  const { username_su, email_su, password_su, username_op, email_op, password_op } = req.body;
  console.log(username_su, email_su, password_su, username_op, email_op, password_op); 
    const licenciaSql = 'SELECT * FROM licencias WHERE licenseNumber = ?';
    db.query(licenciaSql, [license], (err, result) => {
      if (err) throw(err);
      if(result.length == 0){
        console.log('Consola: Licencia no válida');
        return res.status(400).send({status: "Error", message: "Licencia no válida"});
      } else {
        const checkSql = 'SELECT * FROM login WHERE user_l = ? OR mail = ?';
        db.query(checkSql, [username, email], (err2, resultado) => {
            if (err2) throw err2;
            if (resultado.length > 0) {
              console.log('Consola: El usuario ingresado ya existe');
              return res.status(400).send({status: "Error", message: "El usuario ingresado ya existe"});              
            } else {
                const sql = 'INSERT INTO login (user_l, pass_l, mail) VALUES (?, ?, ?)';
                db.query(sql, [username, password, email], (err3, resultado2) => {
                    if (err3) throw err3;
                    if (resultado2.affectedRows === 0) {                      
                      return res.status(400).send({status: "Error", message: "Error al registrar usuario"});
                    } else {
                        console.log('Usuario registrado nuevo:', resultado2.insertId);
                        return res.status(201).send({status: "Success", message: 'Usuario ${username} registrado correctamente', redirect: '/'});
                    }
                });
            }
        });
      }
    });
}

let primeraVezAdmin = true; let primeraVezPublico = true;
function soloAdmin(req, res, next) {
  console.log("Solo admin: ",usuarios);
  const logueado = revisarCookie(req);
  if(logueado){
    if(primeraVezAdmin) {
      primeraVezAdmin = false;
      console.log("Logueado / SoloAdmin");
    }
    console.log("Logueado / SoloAdmin");
    return next();
  }
  else {
    return res.redirect("/");
  }
}

function soloPublico(req, res, next) {
  
  console.log("Solo publico: ",usuarios);
  const logueado = revisarCookie(req);
  if(logueado){
    console.log("Logueado / SoloPublico");
    return res.redirect("/index");
  }
  if(!logueado){
    if(primeraVezPublico) {
      primeraVezPublico = false;
      console.log("No logueado / SoloPublico");
    }
    return next();
  }
}

function revisarCookie(req){
  try {
    if (!req.headers.cookie) {
      return false;
    }
    // console.log("Headers: ", req.headers.cookie);
    const cookieJWT = req.headers.cookie.split('; ').find(cookie => cookie.startsWith('jwt=')).slice(4);
    // console.log("Cookie JWT: ", cookieJWT);
    // console.log("Secret: ", process.env.ACCESS_TOKEN_SECRET);
    const decodificada = jwt.verify(cookieJWT, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decodificada: ", decodificada);
    const usuarioARevisar = usuarios.find(usuario => usuario == decodificada.user);
    if(!usuarioARevisar) {
      console.log("No se encontró el usuario en la base de datos");
      return false;
    }
    console.log("Usuario encontrado: ", usuarioARevisar);
    return true;
  }
  catch (error){
    console.log(error);
    return false;
  }
}

async function limpieza(IpPath, IrPath) {
  console.log(`Iniciando limpieza`);
  const Ip = await loadImage(IpPath);
  const Ir = await loadImage(IrPath);
  // Nuevos umbrales para el canal rojo
  const rThr = 0;
  const gThr = 140;
  const bThr = 140;

  console.log(`Umbrales - Rojo: ${rThr}, Verde: ${gThr}, Azul: ${bThr}`);

  // Función para extraer el canal rojo y contar píxeles
  const countRedPixels = (image, rThreshold, gThreshold, bThreshold) => {
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let redPixelCount = 0;

      for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Cambio en la condición para contar píxeles rojos
          if (r > rThreshold && g <= gThreshold && b <= bThreshold) {
              redPixelCount++;
          }
      }
      console.log(`Total de píxeles rojos encontrados: ${redPixelCount}`);

      return redPixelCount;
  };

  // Contar píxeles rojos en las imágenes
  const IpRedPix = countRedPixels(Ip, rThr, gThr, bThr);
  const IrRedPix = countRedPixels(Ir, rThr, gThr, bThr);
  console.log(`Total de píxeles rojos en Ip: ${IpRedPix}, en Ir: ${IrRedPix}`);

  // Crear imágenes solo con el canal rojo
  const createRedImage = (image, redMask) => {
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
          // Cambio para mantener solo el canal rojo
          data[i] = redMask[i / 4] ? data[i] : 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas.toBuffer();
  };
  // Crear imágenes solo con el canal rojo
  const IpRed = createRedImage(Ip, IpRedPix);
  const IrRed = createRedImage(Ir, IrRedPix);
  // Calcular porcentaje de celdas tapadas
  const porcentajeTapadas = Math.round((1 - (IrRedPix / IpRedPix)) * 100);
  console.log(`Porcentaje de celdas tapadas: ${porcentajeTapadas}`);
  return { IpRed, IrRed, porcentajeTapadas };
}

async function desgaste(IpPath, IrPath) {
  const Ip = await loadImage(IpPath);
  const Ir = await loadImage(IrPath);
  // Umbral para el canal azul
  const rThr = 150;
  const gThr = 150;
  const bThr = 0;

  // Función para extraer el canal azul y contar píxeles
  const countBluePixels = (image, rThreshold, gThreshold, bThreshold) => {
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let bluePixelCount = 0;

      for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (r <= rThreshold && g <= gThreshold && b >= bThreshold) {
              bluePixelCount++;
          }
      }  
      console.log(`Total de píxeles azules encontrados: ${bluePixelCount}`);
      return bluePixelCount;
  };

  // Contar píxeles azules en las imágenes
  const IpBluePix = countBluePixels(Ip, rThr, gThr, bThr);
  const IrBluePix = countBluePixels(Ir, rThr, gThr, bThr);
  console.log(`Total de píxeles azules en Ip: ${IpBluePix}, en Ir: ${IrBluePix}`);

  // Crear imágenes solo con el canal azul
  const createBlueImage = (image, blueMask) => {
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = blueMask[i / 4] ? data[i + 2] : 0;
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas.toBuffer();
  };

  // Crear imágenes solo con el canal azul
  const IpBlue = createBlueImage(Ip, IpBluePix);
  const IrBlue = createBlueImage(Ir, IrBluePix);
  // Calcular porcentaje de celdas desgastadas
  const porcentajeDesgaste = Math.round((1 - (IrBluePix / IpBluePix)) * 100);  
  console.log(`Porcentaje de celdas desgastadas: ${porcentajeDesgaste}`);
  return { IpBlue, IrBlue, porcentajeDesgaste };
}

async function dano(IpPath, IrPath) {
    const Ip = await loadImage(IpPath);
    const Ir = await loadImage(IrPath);

    // Función para contar píxeles rojos
    const contarPixelesRojos = (imagen) => {
        const rThr = 0;
        const gThr = 140;
        const bThr = 140;
        return contarPixeles(imagen, rThr, gThr, bThr);
    };

    // Función para contar píxeles verdes
    const contarPixelesVerdes = (imagen) => {
        const rThr = 255;
        const gThr = 0;
        const bThr = 110;
        return contarPixeles(imagen, rThr, gThr, bThr, true);
    };

    // Función genérica para contar píxeles según umbrales
    const contarPixeles = (imagen, rThr, gThr, bThr, esVerde = false) => {
        const canvas = createCanvas(imagen.width, imagen.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imagen, 0, 0);
        const {data} = ctx.getImageData(0, 0, imagen.width, imagen.height);
        let contador = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (esVerde) {
                if (r <= rThr && g >= gThr && b <= bThr) contador++;
            } else {
                if (r >= rThr && g <= gThr && b <= bThr) contador++;
            }
        }

        return contador;
    };

    // Conteo de píxeles rojos y verdes
    const IpRedPix = contarPixelesRojos(Ip);
    const IrRedPix = contarPixelesRojos(Ir);
    const IpGreenPix = contarPixelesVerdes(Ip);
    const IrGreenPix = contarPixelesVerdes(Ir);

    const createRedGreenImage = (image, RedGreenMask) => {
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = blueMask[i / 4] ? data[i + 2] : 0;
        }
  
        ctx.putImageData(imageData, 0, 0);
        return canvas.toBuffer();
    };

    // Cálculo de porcentaje de daño
    const porcentajeDano = (((IrGreenPix) / (IpGreenPix)) - 1) * 100;
    console.log({IpRedPix, IrRedPix, IpGreenPix, IrGreenPix, porcentajeDano});
    return {porcentajeDano};
}

async function resultados(porcentajeTapadas, porcentajeDano, porcentajeDesgaste) {
  const pesoTapadas = 1;
  const pesoDano = 7;
  const pesoDesgaste = 12;
  const pesoTotal = pesoTapadas + pesoDano + pesoDesgaste;

  const tapadas = pesoTapadas * porcentajeTapadas;
  const dano = pesoDano * porcentajeDano;
  const desgaste = pesoDesgaste * porcentajeDesgaste;

  const estado = Math.round(100 - (tapadas + dano + desgaste) / pesoTotal, 1);

  let diagnostico, recomendacion;

  if (porcentajeTapadas > 30) {
    diagnostico = 'Celdas muy sucias';
    recomendacion = 'Realizar lavado profundo';
  } else if (porcentajeTapadas > 5 && porcentajeTapadas <= 30) {
      diagnostico = 'Celdas sucias';
      recomendacion = 'Realizar lavado';
  } else if (porcentajeTapadas >= 0 && porcentajeTapadas <= 5) {
      diagnostico = 'Celdas limpias';
      recomendacion = 'Mantener calidad de limpieza';
  }

  if (porcentajeDesgaste > 80 && porcentajeDano < 70) {
      diagnostico = 'Paredes muy desgastadas';
      recomendacion = 'Considerar cambio de anilox';
  } else if (porcentajeDano > 70 && porcentajeDesgaste < 80) {
      diagnostico = 'Celdas muy dañadas';
      recomendacion = 'Considerar cambio de anilox';
  } else if (porcentajeDesgaste > 80 && porcentajeDano > 70) {
      diagnostico = 'Paredes muy desgastadas y celdas muy dañadas';
      recomendacion = 'Considerar cambio de anilox';
  } else if (porcentajeDesgaste > 40 && porcentajeDesgaste <= 80 && porcentajeDano <= 70) {
      diagnostico = 'Paredes desgastadas';
      recomendacion = 'Revisar desgaste causado por rasquetas';
  } else if (porcentajeDano > 30 && porcentajeDano <= 70 && porcentajeDesgaste <= 80) {
      diagnostico = 'Celdas dañadas';
      recomendacion = 'Manipular y lavar con mayor cuidado';
  } else if (porcentajeDesgaste > 40 && porcentajeDesgaste <= 80 && porcentajeDano > 30 && porcentajeDano <= 70) {
      diagnostico = 'Paredes desgastadas y celdas dañadas';
      recomendacion = 'Manipular y lavar con mayor cuidado, y revisar desgaste causado por rasquetas';
  } else if (porcentajeDesgaste > 0 && porcentajeDesgaste <= 40 && porcentajeDano <= 30) {
      diagnostico = 'Rodillo en buen estado';
      recomendacion = 'Mantener calidad de manejo y lavado';
  } else if (porcentajeDano > 0 && porcentajeDano <= 30 && porcentajeDesgaste <= 40) {
      diagnostico = 'Rodillo en buen estado';
      recomendacion = 'Mantener calidad de manejo y lavado';
  } else if (porcentajeDano > 0 && porcentajeDano <= 30 && porcentajeDesgaste > 0 && porcentajeDesgaste <= 40) {
      diagnostico = 'Rodillo en buen estado';
      recomendacion = 'Mantener calidad de manejo y lavado';
  }
  console.log({estado, diagnostico, recomendacion});
  return { estado, diagnostico, recomendacion };
}

function analysis(IpPath, IrPath) {
  const { IpRed, IrRed, porcentajeTapadas } = limpieza(IpPath, IrPath);
  const { IpBlue, IrBlue, porcentajeDesgaste } = desgaste(IpPath, IrPath);
  const { porcentajeDano } = dano(IpPath, IrPath);
  const { estado, diagnostico, recomendacion } = resultados(porcentajeTapadas, porcentajeDano, porcentajeDesgaste);

  console.log("Analisis exitoso", { IpRed, IrRed, porcentajeTapadas, IpBlue, IrBlue, porcentajeDesgaste, porcentajeDano, estado, diagnostico, recomendacion });
  return { IpRed, IrRed, porcentajeTapadas, IpBlue, IrBlue, porcentajeDesgaste, porcentajeDano, estado, diagnostico, recomendacion };
}

async function tablaAniloxList(req, res) {
  try {
    let { id, brand, purchase, volume, depth, opening, wall, screen, angle, last, master, patron, revision, insertar, modificar, recorrido, nomvol } = req.body;
    let tipo = angle ? (angle > 50 && angle < 70 ? "Hexagonal" : "GTT") : "";  
    if (id) {
      if (id.startsWith("AA")) {
        id = id.slice(0, 9);
      } else if (id.startsWith("AS")) {
        id = id.slice(0, 8);
      }
    }
    if(id && !brand) {
      const sql = 'SELECT * FROM anilox_list WHERE id=? and empresa=?';
      db.query(sql, [id, sesion_empresa], (err, result) => {
        if (err) throw err;
        result.forEach(row => {
          if(row.purchase) {
            let date = new Date(row.purchase);
            row.purchase = date.toISOString().split('T')[0]; // Esto devolverá la fecha en formato 'YYYY-MM-DD'
          }
        });
        result.forEach(row => {
          if(row.last) {
            let date2 = new Date(row.last);
            row.last = date2.toISOString().split('T')[0]; // Esto devolverá la fecha en formato 'YYYY-MM-DD'
          }
        });
        return res.status(200).send({ status: "Success", message: "Estado", result });
      });
    }
    else if (id && brand && modificar) {  // Esto es cuando se ingresa el recorrido de un anilox existente
      console.log("yo modifico");
      const sqlObtenerPatron = 'SELECT patron FROM anilox_list WHERE id=?';
      db.query(sqlObtenerPatron, [id], (err, result) => {
        if (err) throw err;
        patron = result[0].patron;
        const sqlModificarLista = 'UPDATE anilox_list SET recorrido=?, volume=?, last=?, revision=? WHERE id=?';
        db.query(sqlModificarLista, [recorrido, volume, last, revision, id], (errA, resultA) => {
          if (errA) throw errA;
          console.log("id: ", id, "volume: ", volume, "last: ", last, "recorrido: ", recorrido);
          analysis(patron, revision).then(res_analysis => {
            const { IpRed, IrRed, porcentajeTapadas, IpBlue, IrBlue, porcentajeDesgaste, porcentajeDano, estado, diagnostico, recomendacion } = res_analysis;
            let nextDate2 = new Date(last);
            nextDate2.setMonth(nextDate2.getMonth() + 6);
            const sqlUpdate = 'UPDATE anilox_analysis SET next = ?, estado = ?, tapadas = ?, danadas = ?, desgastadas = ?, diagnostico = ?, recomendacion = ? WHERE id = ?';
            db.query(sqlUpdate, [nextDate2, estado, porcentajeTapadas, porcentajeDano, porcentajeDesgaste, diagnostico, recomendacion, id], (errB, resultB) => {
              if (errB) throw errB;
              const sqlVerifyHistory = 'SELECT * FROM anilox_history WHERE anilox = ?';
              db.query(sqlVerifyHistory, [id], (errC, resultC) => {
                if (errC) throw errC;
                let aux = resultC.length > 0 ? resultC.length + 1 : 1; // Si ya existe se suma 1 al id máximo, caso contrario id se inicia en 1
                const sqlModifyHistory = 'INSERT INTO anilox_history (anilox, id, date, volume, report, empresa) VALUES (?,?,?,?,?,?)';
                db.query(sqlModifyHistory, [id, aux, last, volume, "https://www.africau.edu/images/default/sample.pdf", sesion_empresa], (errD, resultD) => {
                  if (errD) throw errD;
                  const sqlHistory = 'UPDATE anilox_history SET diagnostico = ? WHERE anilox = ?';
                  db.query(sqlHistory, [diagnostico, id], (errE, resultE) => {
                    if (errE) throw errE;
                    console.log("diagnostico: ", diagnostico, "id: ", id);
                    const sqlInsert = 'INSERT INTO imagenes (id, ipred, irred, ipblue, irblue, ipdano, irdano) VALUES (?,?,?,?,?,?,?)';
                    db.query(sqlInsert, [id, IpRed, IrRed, IpBlue, IrBlue, "", ""], (errF, resultF) => {
                      if (errF) throw errF;
                      return res.status(200).send({ status: "Success", message: "Anilox actualizado correctamente" });
                    });
                  });
                });
              });
            });
          });
        });
      });
    }
    else if (id && brand && insertar) {
      const sqlVerificarList = 'SELECT * FROM anilox_list WHERE id = ?';
      db.query(sqlVerificarList, [id], (err, result) => {
        if (err) throw err;
        if(result.length > 0){
          const sql = 'UPDATE anilox_list SET volume=?, last=?, revision=? WHERE id=?';
          db.query(sql, [volume, last, revision, id], (err2, result2) => {
            if (err2) throw err2;
          });
        }
        else{
          const sql = 'INSERT INTO anilox_list (id, brand, type, purchase, recorrido, nomvol, volume, depth, opening, wall, screen, angle, last, master, patron, revision, empresa) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
          db.query(sql, [id, brand, tipo, purchase, 0, nomvol, volume, depth, opening, wall, screen, angle, last, master, patron, patron, sesion_empresa], (err3, result3) => {
            if (err3) throw err3;
          });
        }
        setTimeout(() => {
          const sqlVerificarHistory = 'SELECT * FROM anilox_history WHERE anilox = ?';
          db.query(sqlVerificarHistory, [id], (err4, result4) => {
            if (err4) throw err4;
            console.log("Insertando historial. result.length = ", result4.length);
            let aux = result4.length > 0 ? result4.length + 1 : 1; // Si ya existe se suma 1 al id máximo, caso contrario id se inicia en 1
            const sqlModificarHistory = 'INSERT INTO anilox_history (anilox, id, date, volume, report, empresa) VALUES (?,?,?,?,?,?)';
            db.query(sqlModificarHistory, [id, aux, last, volume, "https://www.africau.edu/images/default/sample.pdf",sesion_empresa], (err5, result5) => {
              if (err5) throw err5;
              // Primero, verifica si el id ya existe
              const sqlVerificar = 'SELECT * FROM anilox_analysis WHERE id = ?';
              db.query(sqlVerificar, [id], (err6, result6) => {
                if (err6) throw err6;
                let nextDate = new Date(last);
                nextDate.setMonth(nextDate.getMonth() + 6); // Se suma 6 meses a la fecha de última revisión
                // Si el id ya existe, actualiza el registro
                if (result6.length === 0) {
                  console.log("No se encontró el anilox con el id ingresado.");
                  return res.status(400).send({ status: "Error", message: "No se encontró el id en anilox_analysis." });
                }
                else if(result6.length > 0) {
                  let volumenOriginal = 1;
                  const sqlVolume = 'SELECT * FROM anilox_history WHERE id = ? AND anilox = ?';
                  db.query(sqlVolume, [1, id], (err7, result7) => {
                    if (err7) throw err7;
                    volumenOriginal = result7[0].volume;
                    let porcentaje_estado = (volume / volumenOriginal) * 100;
                    if (porcentaje_estado > 100){ porcentaje_estado = 100; }                    
                    console.log("El % de estado es: ", porcentaje_estado);
                    const sqlUpdate = 'UPDATE anilox_analysis SET estado = ? WHERE id = ?';
                    db.query(sqlUpdate, [porcentaje_estado, id], (err8, result8) => {
                      if (err8) throw err8;
                      analysis(patron, revision).then(res_analysis => {
                        console.log("Anlizando ando");
                        const { IpRed, IrRed, porcentajeTapadas, IpBlue, IrBlue, porcentajeDesgaste, porcentajeDano, estado, diagnostico, recomendacion } = res_analysis;
                        const sqlUpdate2 = 'UPDATE anilox_analysis SET next = ?, estado = ?, tapadas = ?, danadas = ?, desgastadas = ?, diagnostico = ?, recomendacion = ? WHERE id = ?';
                        db.query(sqlUpdate2, [nextDate, estado, porcentajeTapadas, porcentajeDano, porcentajeDesgaste, diagnostico, recomendacion, id], (err9, result9) => {
                          if (err9) throw err9;
                          const sqlHistory = 'UPDATE anilox_history SET diagnostico = ? WHERE anilox = ?';
                          db.query(sqlHistory, [diagnostico, id], (err10, result10) => {
                            if (err10) throw err10;
                            const sqlInsert = 'INSERT INTO imagenes (id, ipred, irred, ipblue, irblue, ipdano, irdano) VALUES (?,?,?,?,?,?,?)';
                            db.query(sqlInsert, [id, IpRed, IrRed, IpBlue, IrBlue, "", ""], (err11, result11) => {
                              if (err11) throw err11;
                              return res.status(200).send({ status: "Success", message: "Anilox actualizado correctamente" });
                            });
                            console.log("Se pasó la funcion analysis de manera exitosa");
                          });
                        });
                      });
                    });
                  });     
                }
                else {
                  // Si el id no existe, inserta el nuevo registro
                  const sqlInsert = 'INSERT INTO anilox_analysis (id, next, estado, tapadas, danadas, desgastadas, empresa) VALUES (?,?,?,?,?,?,?)';
                  db.query(sqlInsert, [id, nextDate, 100, 0, 0, 0, sesion_empresa], (err3, result3) => {
                    if (err3) throw err3;
                    return res.status(200).send({ status: "Success", message: "Anilox insertado correctamente" });
                  });
                }
              });                        
            });
          });
        }, 1500);
      });        
    }
    else {
      const sql = 'SELECT * FROM anilox_list WHERE empresa=?';
      db.query(sql, [sesion_empresa], (err, result) => {
        if (err) throw err;
        result.forEach(row => {
          if(row.purchase) {
            let date = new Date(row.purchase);
            row.purchase = date.toISOString().split('T')[0]; // Esto devolverá la fecha en formato 'YYYY-MM-DD'
          }
        });
        result.forEach(row => {
          if(row.last) {
            let date2 = new Date(row.last);
            row.last = date2.toISOString().split('T')[0]; // Esto devolverá la fecha en formato 'YYYY-MM-DD'
          }
        });
        return res.status(200).send({ status: "Success", message: "Estado", result });
      });
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).send({status: "Error", message: "Error al obtener el listado de los anilox"});
  }
}

async function tablaAniloxAnalysis(req, res) {
  try {
    const { id, moda } = req.body;
    if(id){
      const sql = 'SELECT * FROM anilox_analysis WHERE id=? and empresa=?';
      db.query(sql, [id, sesion_empresa], (err, result) => {
        if (err) throw err;
        result.forEach(el => {
          if(el.next) {
            let date = new Date(el.next);
            el.next = date.toISOString().split('T')[0]; // Esto devolverá la fecha en formato 'YYYY-MM-DD'
          }
        });
        return res.status(200).send({ status: "Success", message: "Analisis", result });
      });
    } else {      
      const sql = 'SELECT * FROM anilox_analysis WHERE empresa=?';
      db.query(sql, [sesion_empresa], (err, result) => {
        if (err) throw err;
        let numBuenos = 0,
            numMedios = 0,
            numMalos = 0;

        result.forEach(el => {
          estado = parseFloat(el.estado);
          if(estado >= 80 && estado <= 100){numBuenos++}
          if(estado >= 25 && estado < 80){numMedios++}
          if(estado >= 0 && estado < 25){numMalos++}
          if(el.next) {
            let date = new Date(el.next);
            el.next = date.toISOString().split('T')[0]; // Esto devolverá la fecha en formato 'YYYY-MM-DD'
          }
        });
        let primero = result[0].id;      let tapadas = result[0].tapadas;
        let danadas = result[0].danadas; let desgastadas = result[0].desgastadas;
        return res.status(200).send({ status: "Success", message: "Estado", numBuenos, numMedios, numMalos, primero, tapadas, danadas, desgastadas, result });
      });
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).send({status: "Error", message: "Error al obtener el estado de los anilox"});
  }
}

async function tablaAniloxHistory(req, res) {
  try {
    const { id, aniloxReportId } = req.body;
    if(id){
      const sql = 'SELECT * FROM anilox_history WHERE anilox=? and empresa=?';
      db.query(sql, [id, sesion_empresa], (err, result) => {
        if (err) throw err;
        result.forEach(row => {
          if(row.date) {
            let date = new Date(row.date);
            row.date = date.toISOString().split('T')[0]; // Esto devolverá la fecha en formato 'YYYY-MM-DD'
          }
        });
        return res.status(200).send({ status: "Success", message: "Estado", result });
      });
    } else if(aniloxReportId){
        const sql = 'SELECT * FROM anilox_history WHERE anilox=? and empresa=?';
        db.query(sql, [aniloxReportId, sesion_empresa], (err, result) => {
          if (err) throw err;
          result.forEach(row => {
            if(row.date) {
              let date = new Date(row.date);
              row.date = date.toISOString().split('T')[0]; // Esto devolverá la fecha en formato 'YYYY-MM-DD'
            }
          });
          return res.status(200).send({ status: "Success", message: "Estado", result });
      });
    } else {
        const sql = 'SELECT * FROM anilox_history WHERE empresa=?';
        db.query(sql, [sesion_empresa], (err, result) => {
          if (err) throw err;
          result.forEach(row => {
            if(row.date) {
              let date = new Date(row.date);
              row.date = date.toISOString().split('T')[0]; // Esto devolverá la fecha en formato 'YYYY-MM-DD'
            }
          });
          return res.status(200).send({ status: "Success", message: "Estado", result });
        });
    }
  } catch {
    console.log(error);
    return res.status(500).send({status: "Error", message: "Error al obtener el historial del anilox"});
  }
}

async function borrarAnilox(req, res) {
  try {
    const { deleteID } = req.body;
    const sql = 'DELETE FROM anilox_list WHERE id=? and empresa=?';
    if(deleteID){
      db.query(sql, [deleteID, sesion_empresa], (err, result) => {
        if (err) throw err;
        const sql2 = 'DELETE FROM anilox_analysis WHERE id=? and empresa=?';
        db.query(sql2, [deleteID, sesion_empresa], (err2, result2) => {
          if (err2) throw err2;
          const sql3 = 'DELETE FROM anilox_history WHERE anilox=? and empresa = ?';
          db.query(sql3, [deleteID, sesion_empresa], (err3, result3) => {
            if (err3) throw err3;
            return res.status(200).send({ status: "Success", message: "Anilox eliminado correctamente" });
          });        
        });
      });
    }    
  } catch {
    console.log(error);
    return res.status(500).send({status: "Error", message: "Error al eliminar el anilox"});
  }
}

async function tablaUsuarios(req, res) {
  try {
    const sql = 'SELECT * FROM usuarios';
    db.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(200).send({ status: "Success", message: "Estado", result, sesion_usuario });
    });
  } catch {
    console.log(error);
    return res.status(500).send({status: "Error", message: "Error al obtener los datos del cliente"});
  }
}

async function tablaClientes(req, res) {
  try {
    const sql = 'SELECT * FROM clientes';
    db.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(200).send({ status: "Success", message: "Estado", result });
    });
  } catch {
    console.log(error);
    return res.status(500).send({status: "Error", message: "Error al obtener los datos del cliente"});
  }
}

async function tablaLicencias(req, res) {
  try {
    const sql = 'SELECT * FROM licencias';
    db.query(sql, (err, result) => {
      if (err) throw err;
      return res.status(200).send({ status: "Success", message: "Estado", result });
    });
  } catch {
    console.log(error);
    return res.status(500).send({status: "Error", message: "Error al obtener los datos del cliente"});
  }
}

async function addBase64ImageToPDF(pdfPath, base64Image, options) {
  await PDFNet.initialize();

  const pdfDoc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
  await pdfDoc.initSecurityHandler();
  const page = await pdfDoc.getPage(1);
  const pageSet = await PDFNet.PageSet.createRange(1, 1);

  // Convertir la cadena base64 a buffer y escribirlo en un archivo temporal
  const imageBuffer = Buffer.from(base64Image, 'base64');
  const tempImagePath = path.join(os.tmpdir(), 'tempImage.jpg'); // Asegúrate de usar la extensión correcta
  fs.writeFileSync(tempImagePath, imageBuffer);

  // Cargar la imagen desde el archivo temporal
  const pdfImage = await PDFNet.Image.createFromFile(pdfDoc, tempImagePath);

  // Definir la posición y el tamaño de la imagen
  const rect = await PDFNet.Rect.init(options.x, options.y, options.x + options.width, options.y + options.height);

  // Usar PDFNet.Stamper para colocar la imagen en el documento PDF
  const stamper = await PDFNet.Stamper.create(PDFNet.Stamper.SizeType.e_absolute_size, options.width, options.height);
  stamper.setAlignment(PDFNet.Stamper.HorizontalAlignment.e_horizontal_left, PDFNet.Stamper.VerticalAlignment.e_vertical_top);
  stamper.setPosition(options.x, options.y);
  await stamper.stampImage(pdfDoc, pdfImage, pageSet);

  // Guardar el documento PDF modificado
  const outputPath = 'output.pdf';
  await pdfDoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);

  // Opcional: Eliminar el archivo temporal de la imagen
  fs.unlinkSync(tempImagePath);
}

async function generarPdf(req, res) {
  try {
    const { id, revision } = req.body;
    const pdfPath = "./modelo_reporte_final.pdf";
    const sql_PDF = 'SELECT * FROM anilox_list WHERE id=?';
    db.query(sql_PDF,[anilox], (err, rows) => {
      if (err) throw err;
      let revisionPDF = rows[0].revision;
      revisionPDF = revisionPDF.replace('data:image/jpeg;base64,', '');
    });
    const sql = 'SELECT * FROM anilox_history WHERE anilox=?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      console.log("El result.length es: ", result.length);
      if(result.length === 0){
        return res.status(400).send({ status: "Error", message: "No se encontró el anilox con el id ingresado." });
      }
      else {
        const coord_revision = {
          x: 270,
          y: 300,
          width: 100,
          height: 100
        };
        //------------------------
        const outputPath = path.join(__dirname, '/output.pdf');
        const replaceText = async () => {
            const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
            await pdfdoc.initSecurityHandler();
            const replacer = await PDFNet.ContentReplacer.create();
            const page = await pdfdoc.getPage(1);

            await replacer.addString('ANILOX', anilox);
            await replacer.addString('date', '2024-06-16');
            await replacer.addString('fabricante', 'Apex');
            // await replacer.addString('tapadas', tapadas);
            // await replacer.addString('danadas', danadas);
            // await replacer.addString('desgastadas', desgastadas);

            await replacer.process(page);

            pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);

            addBase64ImageToPDF(outputPath, revision, coord_revision)
                .then(() => {
                    console.log('Imagen añadida al PDF con éxito');
                    fs.readFile(outputPath, (err, data) => {
                        if (err) {
                            console.error('Error al leer el archivo PDF:', err);
                            res.status(500).send('Error al procesar el archivo PDF');
                            return;
                        }
                        // Convertir el contenido a Base64
                        const base64PDF = data.toString('base64');
                        // const sql2 = 'INSERT INTO anilox_history (id_anilox, fecha, pdf) VALUES (?,?,?)';
                        // db.query(sql2,[anilox, new Date(), base64PDF], (err, rows) => {
                        //     if (err) throw err;
                        //     console.log('PDF convertido a Base64 y almacenado con éxito');
                        // });
                        res.send('PDF convertido a Base64 y almacenado con éxito');
                    });                
                })
                .catch((error) => {
                    console.error('Error al añadir imagen al PDF:', error);
                    res.status(500).send('Error al añadir imagen al PDF');
                });  
        }    

      PDFNet.runWithCleanup(replaceText, "demo:1720195871717:7f8468a2030000000072c68a051f8b60b73e2b966862266ca0be4eacb7").then(() => {
          fs.readFile(outputPath, (err, data) => {
              if (err) {
                  res.statusCode = 500;
                  res.send(err);
              } else {
                  res.setHeader('Content-Type', 'application/pdf');
                  res.send(data);
              }
          })
      }).catch(err => {
          res.statusCode = 500;
          res.send(err);
      });
        const sql2 = 'UPDATE anilox_history SET report=? WHERE id=?';
        db.query(sql2, ["https://www.africau.edu/images/default/sample.pdf", result.length], (err2, result2) => {
          if (err2) throw err2;
          return res.status(200).send({ status: "Success", message: "PDF generado correctamente" });
        });
      }

      return res.status(200).send({ status: "Success", message: "Estado", result });
    });
  } catch {
    console.log(error);
    return res.status(500).send({status: "Error", message: "Error al obtener los datos del cliente"});
  }
}

module.exports = { login, registro, registro_licencia, soloAdmin, soloPublico, tablaAniloxAnalysis, tablaAniloxList,
                   tablaUsuarios, tablaClientes, tablaLicencias, tablaAniloxHistory, borrarAnilox, generarPdf };
