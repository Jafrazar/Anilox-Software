function [IpDano, IrDano, porcentajeDanadas] = dano(IpPath, IrPath)
    Ip = imread(IpPath);
    Ir = imread(IrPath);

    % Extraer canal rojo de imagen patrón
    rThr = 0;
    gThr = 140;
    bThr = 140;

    IpRed = Ip(:,:,1) >= rThr & Ip(:,:,2) <= gThr & Ip(:,:,3) <= bThr;

    % Extraer canal rojo de imagen para analizar
    IrRed = Ir(:,:,1) >= rThr & Ir(:,:,2) <= gThr & Ir(:,:,3) <= bThr;
    
    % Extraer canal verde de imagen patrón
    rThr = 255;
    gThr = 0;
    bThr = 110;

    IpGreen = Ip(:,:,1) <= rThr & Ip(:,:,2) >= gThr & Ip(:,:,3) <= bThr;
    IpGreenPix = sum(sum(IpGreen));
    
    % Extraer canal verde de imagen para analizar
    IrGreen = Ir(:,:,1) <= rThr & Ir(:,:,2) >= gThr & Ir(:,:,3) <= bThr;
    IrGreenPix = sum(sum(IrGreen));
    
    % Imágenes solo con el canal verde
    blk = zeros(size(Ip,1), size(Ip,2), 'uint8');
    IpDano = uint8(cat(3,IpRed,IpGreen,blk)).*Ip;
    IrDano = uint8(cat(3,IrRed,IrGreen,blk)).*Ir;
    
    % Cálculo de porcentaje de celdas tapadas
    porcentajeDanadas = uint8((((IrGreenPix) / (IpGreenPix)) - 1) * 100);
end