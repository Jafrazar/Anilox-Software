function [estado, diagnostico, recomendacion] = resultados(porcentajeTapadas, porcentajeDano, porcentajeDesgaste)
    pesoTapadas = 1;
    pesoDano = 7;
    pesoDesgaste = 12;
    pesoTotal = double(pesoTapadas) + double(pesoDano) + double(pesoDesgaste);
    
    tapadas = double(pesoTapadas) * double(porcentajeTapadas);
    dano = double(pesoDano) * double(porcentajeDano);
    desgaste = double(pesoDesgaste) * double(porcentajeDesgaste);
    
    estado = round(100 - (tapadas + dano + desgaste) / (pesoTotal), 1);

    if porcentajeTapadas > 30
        diagnostico = 'Celdas muy sucias';
        recomendacion = 'Realizar lavado profundo';
    end
    if porcentajeTapadas > 5 && porcentajeTapadas <= 30
        diagnostico = 'Celdas sucias';
        recomendacion = 'Realizar lavado';
    end
    if porcentajeTapadas >= 0 && porcentajeTapadas <= 5
        diagnostico = 'Celdas limpias';
        recomendacion = 'Mantener calidad de limpieza';
    end
    if porcentajeDesgaste > 80 && porcentajeDano < 70
        diagnostico = 'Paredes muy desgastadas';
        recomendacion = 'Considerar cambio de anilox';
    end
    if porcentajeDano > 70 && porcentajeDesgaste < 80
        diagnostico = 'Celdas muy dañadas';
        recomendacion = 'Considerar cambio de anilox';
    end
    if porcentajeDesgaste > 80 && porcentajeDano > 70
        diagnostico = 'Paredes muy desgastadas y celdas muy dañadas';
        recomendacion = 'Considerar cambio de anilox';
    end
    if porcentajeDesgaste > 40 && porcentajeDesgaste <= 80 && porcentajeDano <= 70
        diagnostico = 'Paredes desgastadas';
        recomendacion = 'Revisar desgaste causado por rasquetas';
    end
    if porcentajeDano > 30 && porcentajeDano <= 70 && porcentajeDesgaste <= 80
        diagnostico = 'Celdas dañadas';
        recomendacion = 'Manipular y lavar con mayor cuidado';
    end
    if porcentajeDesgaste > 40 && porcentajeDesgaste <= 80 && porcentajeDano > 30 && porcentajeDano <= 70
        diagnostico = 'Paredes desgastadas y celdas dañadas';
        recomendacion = 'Manipular y lavar con mayor cuidado, y revisar desgaste causado por rasquetas';
    end
    if porcentajeDesgaste > 0 && porcentajeDesgaste <= 40 && porcentajeDano <= 30
        diagnostico = 'Rodillo en buen estado';
        recomendacion = 'Mantener calidad de manejo y lavado';
    end
    if porcentajeDano > 0 && porcentajeDano <= 30 && porcentajeDesgaste <= 40
        diagnostico = 'Rodillo en buen estado';
        recomendacion = 'Mantener calidad de manejo y lavado';
    end
    if porcentajeDano > 0 && porcentajeDano <= 30 && porcentajeDesgaste > 0 && porcentajeDesgaste <= 40
        diagnostico = 'Rodillo en buen estado';
        recomendacion = 'Mantener calidad de manejo y lavado';
    end
end