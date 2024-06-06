async function limpieza(IpPath, IrPath) {
    const { createCanvas, loadImage } = require('canvas');
    const fs = require('fs');

    // Leer las imágenes
    const Ip = await loadImage(IpPath);
    const Ir = await loadImage(IrPath);

    // Umbral para el canal rojo
    const rThr = 0;
    const gThr = 140;
    const bThr = 140;

    // Función para extraer el canal rojo y contar píxeles rojos
    const countRedPixels = (image) => {
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

            if (r >= rThr && g <= gThr && b <= bThr) {
                redPixelCount++;
            }
        }

        return redPixelCount;
    };

    // Contar píxeles rojos en las imágenes
    const IpRedPix = countRedPixels(Ip);
    const IrRedPix = countRedPixels(Ir);

    // Calcular porcentaje de celdas tapadas
    const porcentajeTapadas = Math.round((1 - (IrRedPix / IpRedPix)) * 100);

    return { IpRedPix, IrRedPix, porcentajeTapadas };
}
