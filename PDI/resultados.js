function resultados(porcentajeTapadas, porcentajeDano, porcentajeDesgaste) {
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
        recomendacion = 'Lavar rodillo a profundidad';
    } else if (porcentajeTapadas > 5 && porcentajeTapadas <= 30) {
        diagnostico = 'Celdas sucias';
        recomendacion = 'Lavar rodillo';
    } else if (porcentajeTapadas >= 0 && porcentajeTapadas <= 5) {
        diagnostico = 'Celdas limpias';
        recomendacion = 'No requerido';
    }

    if (porcentajeDesgaste > 80 && porcentajeDano < 70) {
        diagnostico = 'Paredes muy desgastadas';
        recomendacion = 'Cambiar rodillo';
    } else if (porcentajeDano > 70 && porcentajeDesgaste < 80) {
        diagnostico = 'Celdas muy dañadas';
        recomendacion = 'Cambiar rodillo';
    } else if (porcentajeDesgaste > 80 && porcentajeDano > 70) {
        diagnostico = 'Paredes muy desgastadas y celdas muy dañadas';
        recomendacion = 'Cambiar rodillo';
    } else if (porcentajeDesgaste > 40 && porcentajeDesgaste <= 80 && porcentajeDano <= 70) {
        diagnostico = 'Paredes desgastadas';
        recomendacion = 'Lavar rodillo con mayor cuidado';
    } else if (porcentajeDano > 30 && porcentajeDano <= 70 && porcentajeDesgaste <= 80) {
        diagnostico = 'Celdas dañadas';
        recomendacion = 'Lavar rodillo con mayor cuidado';
    } else if (porcentajeDesgaste > 40 && porcentajeDesgaste <= 80 && porcentajeDano > 30 && porcentajeDano <= 70) {
        diagnostico = 'Paredes desgastadas y celdas dañadas';
        recomendacion = 'Lavar rodillo con mayor cuidado';
    } else if (porcentajeDesgaste > 0 && porcentajeDesgaste <= 40 && porcentajeDano <= 30) {
        diagnostico = 'Rodillo en buen estado';
        recomendacion = 'No requerido';
    } else if (porcentajeDano > 0 && porcentajeDano <= 30 && porcentajeDesgaste <= 40) {
        diagnostico = 'Rodillo en buen estado';
        recomendacion = 'No requerido';
    } else if (porcentajeDano > 0 && porcentajeDano <= 30 && porcentajeDesgaste > 0 && porcentajeDesgaste <= 40) {
        diagnostico = 'Rodillo en buen estado';
        recomendacion = 'No requerido';
    }

    return { estado, diagnostico, recomendacion };
}
