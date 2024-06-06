function [IpRed, IrRed, porcentajeTapadas] = limpieza(IpPath, IrPath)
    Ip = imread(IpPath);
    Ir = imread(IrPath);
    
    % Extraer canal rojo de imagen patrón
    rThr = 0;
    gThr = 140;
    bThr = 140;

    IpRed = Ip(:,:,1) >= rThr & Ip(:,:,2) <= gThr & Ip(:,:,3) <= bThr;
    IpRedPix = sum(sum(IpRed));
    
    % Extraer canal rojo de imagen para analizar
    IrRed = Ir(:,:,1) >= rThr & Ir(:,:,2) <= gThr & Ir(:,:,3) <= bThr;
    IrRedPix = sum(sum(IrRed));
    
    % Imágenes solo con el canal rojo
    blk = zeros(size(Ip,1), size(Ip,2), 'uint8');
    IpRed = uint8(cat(3,IpRed,blk,blk)).*Ip;
    IrRed = uint8(cat(3,IrRed,blk,blk)).*Ir;
    
    % Cálculo de porcentaje de celdas tapadas
    porcentajeTapadas = uint8((1 - (IrRedPix / IpRedPix)) * 100);
end