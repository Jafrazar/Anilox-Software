function [eolData, percentData] = estimarVida(volMedido, volNominal)
    volMedido = volMedido';
    [width, ~] = size(volMedido);
    t = (1:width)';
    volLimite = volNominal * 0.6;
    if volMedido(width) <= volLimite
        eolData = 1000;
        percentData = [];
    else
        T = [ones(length(t),1) t];
        b = round(T\volMedido, 3);
        if b(2) <= -0.01
            h = -((b(1) - volLimite) / b(2)) + 10;
            t2 = (1:h)';
            T2 = [ones(length(t2), 1) t2];
            volCalculado = T2 * b;
            for i = 1:length(t2)
                if(volCalculado(i) <= volLimite)
                    eolData = round(volCalculado(1:i), 3);
                    break;
                end
            end
            for i = 1:length(eolData)
                if(eolData(i) <= volNominal*0.9)
                    percentData(1,1) = i;
                    percentData(2,1) = volCalculado(i);
                    break;
                end
            end
            for i = 1:length(eolData)
                if(eolData(i) <= volNominal*0.8)
                    percentData(1,2) = i;
                    percentData(2,2) = volCalculado(i);
                    break;
                end
            end
            for i = 1:length(eolData)
                if(eolData(i) <= volNominal*0.7)
                    percentData(1,3) = i;
                    percentData(2,3) = volCalculado(i);
                    break;
                end
            end
            percentData(1,4) = length(eolData);
            percentData(2,4) = eolData(length(eolData));
        else
            eolData = 2000;
            percentData = [];
        end
    end
end