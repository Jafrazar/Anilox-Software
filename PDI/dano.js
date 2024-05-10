const express = require("express");
const mysql = require('mysql');

async function dano(IpPath, IrPath) {
    const { createCanvas, loadImage } = require('canvas');
    const fs = require('fs');

    // Leer las imágenes
    const Ip = await loadImage(IpPath);
    const Ir = await loadImage(IrPath);

    // Umbral para el canal rojo y verde
    let rThr, gThr, bThr;

    // Función para extraer el canal rojo y verde y contar píxeles
    const countColorPixels = (image, rThreshold, gThreshold, bThreshold) => {
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let colorPixelCount = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const mask = new Array(image.width * image.height).fill(false);

            if (r >= rThreshold[0] && r <= rThreshold[1] &&
                g >= gThreshold[0] && g <= gThreshold[1] &&
                b >= bThreshold[0] && b <= bThreshold[1]) {
                mask[i / 4] = true;
            }
        }

        return colorPixelCount;
    };

    // Contar píxeles rojos en las imágenes
    const IpRedPix = countColorPixels(Ip, [0, 255], [0, 140], [0, 140]);
    const IrRedPix = countColorPixels(Ir, [0, 255], [0, 140], [0, 140]);

    // Contar píxeles verdes en las imágenes
    const IpGreenPix = countColorPixels(Ip, [0, 255], [0, 0], [0, 110]);
    const IrGreenPix = countColorPixels(Ir, [0, 255], [0, 0], [0, 110]);

    // Crear imágenes solo con el canal rojo y verde
    const createColorImage = (image, redMask, greenMask) => {
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = redMask[i / 4] ? data[i] : 0;
            data[i + 1] = greenMask[i / 4] ? data[i + 1] : 0;
            data[i + 2] = 0;
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toBuffer();
    };

    // Crear imágenes solo con el canal rojo y verde
    const IpDano = createColorImage(Ip, IpRedPix, IpGreenPix);
    const IrDano = createColorImage(Ir, IrRedPix, IrGreenPix);

    // Calcular porcentaje de celdas dañadas
    const porcentajeDanadas = Math.round(((IrGreenPix / IpGreenPix) - 1) * 100);

    return { IpDano, IrDano, porcentajeDanadas };
}
