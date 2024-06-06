const fs = require('fs');
const { execSync } = require('child_process');
const { dano, limpieza, desgaste, resultados } = require('./your_functions_module');

function analysis(IpPath, IrPath, axCode) {
    const date = new Date().toLocaleDateString('es-PE', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' });
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 6);
    const nextDateString = nextDate.toLocaleDateString('es-PE', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' });

    const workDir = __dirname;
    const resDir = `${workDir}/analysisResults/`;
    if (!fs.existsSync(resDir)) {
        fs.mkdirSync(resDir);
    }
    const axDir = `${resDir}${axCode}/`;
    if (!fs.existsSync(axDir)) {
        fs.mkdirSync(axDir);
    }
    const dateDir = `${axDir}${date}/`;
    if (!fs.existsSync(dateDir)) {
        fs.mkdirSync(dateDir);
    }
    const dateDirFiles = fs.readdirSync(dateDir);
    if (dateDirFiles.length === 2) {
        const IrDano = dano(IpPath, IrPath);
        const IrRed = limpieza(IpPath, IrPath);
        const IrBlue = desgaste(IpPath, IrPath);
        const { estado, porcentajeTapadas, porcentajeDanadas, porcentajeDesgaste, diagnostico, recomendacion } = resultados(porcentajeTapadas, porcentajeDanadas, porcentajeDesgaste);

        fs.writeFileSync(`${dateDir}${axCode}_Daño_${date}.jpg`, IrDano);
        fs.writeFileSync(`${dateDir}${axCode}_Limpieza_${date}.jpg`, IrRed);
        fs.writeFileSync(`${dateDir}${axCode}_Desgaste_${date}.jpg`, IrBlue);

        const data = [axCode, nextDateString, estado.toString(), porcentajeTapadas.toString(), porcentajeDanadas.toString(), porcentajeDesgaste.toString(), diagnostico, recomendacion];
        const timestamp = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        fs.writeFileSync(`${dateDir}${axCode}_Analisis_${date}.csv`, data.join(',') + '\n');
        fs.writeFileSync(`${dateDir}/ts.txt`, timestamp);
    }
}
