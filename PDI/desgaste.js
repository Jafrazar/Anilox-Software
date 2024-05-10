async function desgaste(IpPath, IrPath) {
    const { createCanvas, loadImage } = require('canvas');
    const fs = require('fs');

    // Leer las imágenes
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

        return bluePixelCount;
    };

    // Contar píxeles azules en las imágenes
    const IpBluePix = countBluePixels(Ip, rThr, gThr, bThr);
    const IrBluePix = countBluePixels(Ir, rThr, gThr, bThr);

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

    return { IpBlue, IrBlue, porcentajeDesgaste };
}
