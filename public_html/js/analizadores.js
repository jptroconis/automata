/* global varb, variable, todasReservadas, gcoment */
function alertas() {
    $(function() {
        $('.rep').tooltip();
    });
}

function declarar(dec) {
    var puntoComa = /;/.test(dec);
    var temporales = new Array();
    var er = new RegExp("declare|entero|real|cadena|fecha|logico", "g");
    dec = dec.replace(/&nbsp/g, "♂");
    dec = dec.replace(/<br>/g, "♀");
    dec = dec.replace(new RegExp(varb, "g"), function(token) {
        if (!er.test(token)) {
            if ($.inArray(token, variable.todas) === -1) {
                variable.todas.push(token);
                temporales.push(token);
                return "<strong><b>" + token + "<b></strong>";
            } else {
                return "<font class='rep' data-toggle='tooltip' data-placement='bottom' title='Variable ya declarada'><strong>" + token + "</strong></font>";
            }
        } else
            return token;
    });
    dec = dec.replace(er, function(token) {
        var tipoDato = /(entero|real|cadena|fecha|logico)/;
        todasReservadas.push(token);
        if (tipoDato.test(token)) {
            variable[token] = $.merge(variable[token], temporales);
        }
        if (puntoComa | /declare/.test(token))
            return "<font color='blue'><b>" + token + "</b></font>";
        else
            return "<font color='blue' class='rep' data-toggle='tooltip' data-placement='bottom' title='Falta Punto y Coma' ><b>" + token + "</b></font>";
    });
    dec = dec.replace(/♂/g, "&nbsp");
    dec = dec.replace(/♀/g, "<br>");
    dec = dec.replace(/;/g, "<font><b>;</b></font>");
    return dec;
}

function comentarios(codigo) {
    var lineas = codigo.split("<br>");
    var coment = /#/;
    for (var i = 0; i < lineas.length; i++) {
        comentario = "";
        pat = coment.exec(lineas[i]);
        if (pat !== null) {
            var divisor = lineas[i].split(/#/);
            comentario = divisor[1] = '<font color="#848484"><b>#' + divisor[1] + '</b></font>';
            divisor[i] = "©";
            lineas[i] = divisor.join("");
            gcoment.push(comentario);
        }
    }
    gcoment.reverse();
    return lineas.join("<br>");
}

function variables(varb, er) {
    varb = varb.replace(/&nbsp/g, "♂");
    varb = varb.replace(/<br>/g, "♀");
    varb = varb.replace(er, function(token) {
        if ($.inArray(token, variable.todas) === -1)
            return "<strong class='rep' data-toggle='tooltip' data-placement='bottom' title='Esta Variable No Ha Sido Declarada' ><b>"
                    + token + '</b></strong>';
        else
            return "<strong><b>" + token + "<b></strong>";
    });
    varb = varb.replace(/♂/g, "&nbsp");
    varb = varb.replace(/♀/g, "<br>");
    return varb;
}