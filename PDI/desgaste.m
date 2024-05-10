function [IpBlue, IrBlue, porcentajeDesgaste] = desgaste(IpPath, IrPath)
    Ip = imread(IpPath);
    Ir = imread(IrPath);
    
    % Extraer canal azul de imagen patrón
    rThr = 150;
    gThr = 150;
    bThr = 0;

    IpBlue = Ip(:,:,1) <= rThr & Ip(:,:,2) <= gThr & Ip(:,:,3) >= bThr;
    IpBluePix = sum(sum(IpBlue));
    
    % Extraer canal azul de imagen para analizar
    IrBlue = Ir(:,:,1) <= rThr & Ir(:,:,2) <= gThr & Ir(:,:,3) >= bThr;
    IrBluePix = sum(sum(IrBlue));
    
    % Imágenes solo con el canal azul
    blk = zeros(size(Ip,1), size(Ip,2), 'uint8');
    IpBlue = uint8(cat(3,blk,blk,IpBlue)).*Ip;
    IrBlue = uint8(cat(3,blk,blk,IrBlue)).*Ir;
    
    % Cálculo de porcentaje de celdas tapadas
    porcentajeDesgaste = uint8((1 - (IrBluePix / IpBluePix)) * 100);
end