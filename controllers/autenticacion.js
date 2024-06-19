let sesion_usuario = 'Franco', sesion_empresa = 'Anders Perú';
const mysql = require('mysql');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = mysql.createPool({
  host: 'database-1.cspwdfignp82.sa-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '104#55Fppl2',
  database: 'ANILOX'
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

function soloAdmin(req, res, next) {
  console.log("Solo admin: ",usuarios);
  const logueado = revisarCookie(req);
  if(logueado){
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
    console.log("No logueado / SoloPublico");
    return next();
  }
}

function revisarCookie(req){
  try {
    if (!req.headers.cookie) {
      return false;
    }
    console.log("Headers: ", req.headers.cookie);
    const cookieJWT = req.headers.cookie.split('; ').find(cookie => cookie.startsWith('jwt=')).slice(4);
    console.log("Cookie JWT: ", cookieJWT);
    console.log("Secret: ", process.env.ACCESS_TOKEN_SECRET);
    const decodificada = jwt.verify(cookieJWT, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decodificada: ", decodificada);
    console.log("Usuario: ", decodificada.user)
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

async function tablaAniloxList(req, res) {
  try {
    const { id, brand, purchase, volumen, depth, opening, wall, screen, angle, last, master, patron, insertar, modificar } = req.body;
    if(id && !brand) {
      const sql = 'SELECT * FROM anilox_list WHERE id=? and empresa=?';
      db.query(sql, [id, sesion_empresa], (err, result) => {
        if (err) throw err;
        // 'result' es un array de objetos, donde cada objeto representa una fila de la tabla 'anilox'
        // y tiene una propiedad 'estado' que es el valor de la columna 'estado'.
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
    else if (id && brand && modificar) {
      const sql = 'UPDATE anilox_list SET brand=?, purchase=?, volumen=?, depth=?, opening=?, wall=?, screen=?, angle=?, last=?, master=?, patron=? WHERE id=? and empresa=?';
      db.query(sql, [brand, purchase, volumen, depth, opening, wall, screen, angle, last, master, patron, id, sesion_empresa], (err, result) => {
        if (err) throw err;
        return res.status(200).send({ status: "Success", message: "Anilox actualizado correctamente" });
      });
    } 
    else if (id && brand && insertar) {
      const sql = 'INSERT INTO anilox_list (id, brand, purchase, volumen, depth, opening, wall, screen, angle, last, master, patron, empresa) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
      db.query(sql, [id, brand, purchase, volumen, depth, opening, wall, screen, angle, last, master, patron, sesion_empresa], (err, result) => {
        if (err) throw err;
      });
      const sql2 = 'INSERT INTO anilox_history (anilox, date, volume, empresa) VALUES (?,?,?,?)';
      db.query(sql2, [id, last, 100, 0, 0, 0, sesion_empresa], (err2, result2) => { // Hace falta cambiar esta línea pr los valores correctos de las celdas
        if (err2) throw err2;
      });      
      const sql3 = 'INSERT INTO anilox_analysis (id, next) VALUES (?,?,?,?,?,?)'; // FALTA VERIFICAR PRIMERO QUE NO EXISTA EL ID, SINO HACER UPDATE INSTEAD OF INSERT
      db.query(sql3, [id, 100, last, 0, 0, 0], (err3, result3) => {
        if (err3) throw err3;
        return res.status(200).send({ status: "Success", message: "Anilox insertado correctamente" });
      });
    }
    else {
      const sql = 'SELECT * FROM anilox_list WHERE empresa=?';
      db.query(sql, [sesion_empresa], (err, result) => {
        if (err) throw err;
        // 'result' es un array de objetos, donde cada objeto representa una fila de la tabla 'anilox'
        // y tiene una propiedad 'estado' que es el valor de la columna 'estado'.
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
        // 'result' es un array de objetos, donde cada objeto representa una fila de la tabla 'anilox'
        // y tiene una propiedad 'estado' que es el valor de la columna 'estado'.
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

module.exports = { login, registro, registro_licencia, soloAdmin, soloPublico, tablaAniloxAnalysis, tablaAniloxList, tablaUsuarios, tablaClientes, tablaLicencias, tablaAniloxHistory, borrarAnilox };
