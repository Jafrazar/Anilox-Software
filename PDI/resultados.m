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
    recomendacion = 'Lavar rodillo a profundidad';
end
if porcentajeTapadas > 5 && porcentajeTapadas <= 30
    diagnostico = 'Celdas sucias';
    recomendacion = 'Lavar rodillo';
end
if porcentajeTapadas >= 0 && porcentajeTapadas <= 5
    diagnostico = 'Celdas limpias';
    recomendacion = 'No requerido';
end
if porcentajeDesgaste > 80 && porcentajeDano < 70
    diagnostico = 'Paredes muy desgastadas';
    recomendacion = 'Cambiar rodillo';
end
if porcentajeDano > 70 && porcentajeDesgaste < 80
    diagnostico = 'Celdas muy dañadas';
    recomendacion = 'Cambiar rodillo';
end
if porcentajeDesgaste > 80 && porcentajeDano > 70
    diagnostico = 'Paredes muy desgastadas y celdas muy dañadas';
    recomendacion = 'Cambiar rodillo';
end
if porcentajeDesgaste > 40 && porcentajeDesgaste <= 80 && porcentajeDano <= 70
    diagnostico = 'Paredes desgastadas';
    recomendacion = 'Lavar rodillo con mayor cuidado';
end
if porcentajeDano > 30 && porcentajeDano <= 70 && porcentajeDesgaste <= 80
    diagnostico = 'Celdas dañadas';
    recomendacion = 'Lavar rodillo con mayor cuidado';
end
if porcentajeDesgaste > 40 && porcentajeDesgaste <= 80 && porcentajeDano > 30 && porcentajeDano <= 70
    diagnostico = 'Paredes desgastadas y celdas dañadas';
    recomendacion = 'Lavar rodillo con mayor cuidado';
end
if porcentajeDesgaste > 0 && porcentajeDesgaste <= 40 && porcentajeDano <= 30
    diagnostico = 'Rodillo en buen estado';
    recomendacion = 'No requerido';
end
if porcentajeDano > 0 && porcentajeDano <= 30 && porcentajeDesgaste <= 40
    diagnostico = 'Rodillo en buen estado';
    recomendacion = 'No requerido';
end
if porcentajeDano > 0 && porcentajeDano <= 30 && porcentajeDesgaste > 0 && porcentajeDesgaste <= 40
    diagnostico = 'Rodillo en buen estado';
    recomendacion = 'No requerido';
end

end