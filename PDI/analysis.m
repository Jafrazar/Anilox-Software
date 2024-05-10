function analysis(IpPath, IrPath, axCode)
    date = datetime('now',"TimeZone","America/Lima","Format","yyyy-MM-dd");
    nextDate = date + calmonths(6);
    date = string(date);
    nextDate = string(nextDate);
    workDir = pwd;
    resDir = workDir + "/analysisResults/";
    if(exist(resDir,"dir") ~= 7)
        mkdir(resDir);
    end
    axDir = resDir + axCode + "/"; 
    if(exist(axDir,"dir") ~= 7)
        mkdir(axDir);
    end
    dateDir = axDir + date + "/";
    if(exist(dateDir, "dir") ~= 7)
        mkdir(dateDir);
    end
    dateDirSize = size(dir(dateDir));
    if(dateDirSize(1) == 2)
        [~, IrDano, porcentajeDanadas] = dano(IpPath, IrPath);
        [~, IrRed, porcentajeTapadas] = limpieza(IpPath, IrPath);
        [~, IrBlue, porcentajeDesgaste] = desgaste(IpPath, IrPath);
        [estado, diagnostico, recomendacion] = resultados(porcentajeTapadas, porcentajeDanadas, porcentajeDesgaste);
        imwrite(IrDano,dateDir + axCode + "_Daño_" + date + ".jpg");
        imwrite(IrRed,dateDir + axCode + "_Limpieza_" + date + ".jpg");
        imwrite(IrBlue,dateDir + axCode + "_Desgaste_" + date + ".jpg");
        data = {axCode,nextDate,num2str(estado),num2str(porcentajeTapadas),num2str(porcentajeDanadas),num2str(porcentajeDesgaste),diagnostico, recomendacion};
        ts = {string(datetime('now',"TimeZone","America/Lima",'Format','yyyy-MM-dd-HH:mm:ss'))};
        writecell(data,dateDir + axCode + "_Analisis_" + date + ".csv");
        writecell(ts,dateDir + "/ts.txt");
    end
end