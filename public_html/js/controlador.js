
/* global angular, rePalRes */

angular.module("compilador", ['ngSanitize'])

        .run(function ($rootScope) {
            $rootScope.text;

            $rootScope.modificar = function (mod) {
                $rootScope.text = mod;
            };
        })

        .controller("guardian", function ($scope) {

            $scope.res = "";

            $scope.azul = 0;
            $scope.gris = 0;

            $scope.tipDat = null;
            $scope.dats = null;

            $scope.ver = function () {

                $scope.tipDat = {entero: new Array(), real: new Array(), fecha: new Array(), cadena: new Array(), logico: new Array(), nov: new Array()};
                $scope.todos = new Array();
                $scope.dats = new Array();

                $scope.azul = 0;
                $scope.gris = 0;

                $scope.res = "";
                $scope.res = compilar($scope.text, "\n");

            };

            //-----------------------------------------------------------------------------------------------------------------------------------

            function compilar(texto, separador) {

                swicht = false;
                html = "";
                lineas = texto.split(separador);
                var coment = /#/;
                var pRes = new RegExp("(inicio|si|entonces|sino|finsi|mq|finmq|para|finpara|haga|declare|envia|recibe|llamar|fin)", "g");
                var tDato = /(entero|real|cadena|fecha|logico)(\s*;\s*)?$/;
                var comentario = "";
                var subtexto = "";

                for (var i = 0; i < lineas.length; i++) {
                    comentario = "";
                    pat = coment.exec(lineas[i]);
                    if (pat !== null) {
                        comentario = '<font color="#848484"><b>' + lineas[i].substring(pat.index) + '</b></font>';
                        $scope.gris++;
                        lineas[i] = lineas[i].substring(0, pat.index);
                    }
                    lineas[i] = palReservadas(lineas[i]);
                    lineas[i] = "<mark>" + (i + 1) + ". </mark>" + lineas[i] + comentario;

                }
                return lineas.join("<br>");
            }

            $scope.prueba = function () {

                $scope.res = compilar($scope.text, "\n");
                alert(compilar($scope.text, "\n"));
            };

            function idVariables(vars) {
                var vr = vars;
                var er = /^(\s*)[a-zA-Z][a-zA-Z0-9_]{0,14}(\s*)$/;
                for (var i = 0; i < vr.length; i++) {
                    if (isReserved(vr[i])) {

                        vr[i] = "<font color='blue'><b>" + vr[i] + "</b></font>";
                        $scope.azul++;

                    } else if (er.test(vr[i])) {
                        if ($scope.todos.indexOf(vr[i].trim()) === -1) {
                            $scope.dats.push(vr[i].trim());
                            $scope.todos.push(vr[i].trim());
                            vr[i] = "<font color='black'><b>" + vr[i] + "</b></font>";
                        } else {
                            vr[i] = "<font color='black'><s>" + vr[i] + "</s></font>";
                        }

                    } else {
                        $scope.tipDat.nov.push(vr[i]);
                        vr[i] = "<font color='red'><b>" + vr[i] + "</b></font>";

                    }
                }
                return vr.join(",");
            }


            function palReservadas(lin) {
                var linea = lin.split(" ");
                for (var i = 0; i < linea.length; i++) {
                    if (isReserved(linea[i])) {
                        if (linea[i].trim() === "declare") {
                            
                            var temp = linea.slice(i);
                            
                            linea.splice(i, linea.length - i);

                            linea.push( declaraciones(temp.join(" ")) );
                            return linea.join("&nbsp");
                        }
                        var aperturas = /^(inicio|si|entonces|sino|mq|para|haga|declare|envia|recibe|llamar)/g;
                        var cerraduras = /^(fin(para|si|mq)?);/g;
                        //alert(aperturas.test(linea[i]));
                        if(aperturas.test(linea[i])){
                            linea[i] = "<font color='blue'><b>" + linea[i] + "</b></font>";
                        }else if(cerraduras.test(linea[i])){
                            linea[i] = "<font color='blue'><b>" + linea[i] + "</b></font>";
                        }else{
                            linea[i] = "<u><font color='blue'><b>" + linea[i] + "</b></font></u>";
                        }
                        
                        $scope.azul++;
                    } else if (isMethod(linea[i])) {
                        linea[i] = "<font color='blue'><b>" + linea[i].split("(")[0] + "</b></font>" + "(" + linea[i].split("(")[1];
                        $scope.azul++;
                    }
                }
                return linea.join("&nbsp");
            }


            function declaraciones(text) {
                var tipoDatp = null;
                var html = "";
                var fin = "";

                var val = text;
                var declare = /^(\s*)declare/;
                var arr = declare.exec(val);
                if (arr !== null) {
                    html += "<font color='blue'><b>" + arr[0] + "</b></font>";
                    $scope.azul++;
                    val = val.replace(arr[0], "");
                    //alert(val);
                    var tDato = /(entero|real|cadena|fecha|logico)(\s*;*\s*)?$/;
                    var puntoComa = /;$/;
                    arr = tDato.exec(val);
                    if (arr !== null) {
                        if (puntoComa.test(arr[0])) {
                            fin = arr[0].replace(arr[1], "<font color='blue'><b>" + arr[1] + "</b></font>");
                        }else{
                            fin = arr[0].replace(arr[1], "<u><font color='#008080'><b>" + arr[1] + "</b></font></u>");
                        }
                        $scope.azul++;
                        tipoDato = arr[1];
                        val = val.substring(0, arr.index);
                        //alert(val);
                        val = idVariables(val.split(","));
                        html += val + fin;
                        asignarVariables(tipoDato);
                        return html;
                        //alert(val.substring(0, arr.index));
                    } else {
                        return html + val;
                    }
                }

            }





            function iscoment(linea) {
                if (linea === undefined) {
                    linea = "";
                }
                var pal = linea;
                if (pal.indexOf("#") === 0) {
                    return true;
                } else {
                    return false;
                }
            }

            function isReserved(linea) {
                if (linea === undefined) {
                    linea = "";
                }
                var pal = linea.split(";");
                pals = rePalRes.call();

                for (k = 0; k < pals.length; k++) {
                    if (pal[0] === pals[k]) {
                        return true;
                    }
                }
                return false;
            }

            function isMethod(linea) {
                if (linea === undefined) {
                    linea = "";
                }
                var pal = linea.split("(");
                pals = rePalRes.call();
                for (k = 0; k < pals.length; k++) {
                    if (pal[0] === pals[k]) {
                        return true;
                    }
                }
                return false;
            }

            function isSigno(linea) {
                if (linea === undefined) {
                    linea = "";
                }
                var patt = /[^a-zA-Z0-9_]/
                if (patt.test(linea)) {
                    return true;
                } else {
                    return false;
                }
            }

            function asignarVariables(identi) {
                //alert(identi);
                if (identi === "entero") {
                    $scope.tipDat.entero = $scope.tipDat.entero.concat($scope.dats);
                } else if (identi === "real") {
                    $scope.tipDat.real = $scope.tipDat.real.concat($scope.dats);
                } else if (identi === "cadena") {
                    $scope.tipDat.cadena = $scope.tipDat.cadena.concat($scope.dats);
                } else if (identi === "logico") {
                    $scope.tipDat.logico = $scope.tipDat.logico.concat($scope.dats);
                } else if (identi === "fecha") {
                    $scope.tipDat.fecha = $scope.tipDat.fecha.concat($scope.dats);
                }
                $scope.dats = new Array();
            }

            //----------------------------------------------------------------------------------------------------------------------

            $scope.oc = 0;
            $scope.mostrar = false;

            $scope.buscar = function () {
                $scope.rec = "";
                var texto = $scope.text;
                var er = null;
                var rec;
                $scope.oc = 0;
                if (texto !== undefined) {
                    if (texto !== "" && $scope.bus !== "") {
                        var arr;
                        er = new RegExp($scope.bus, "g");
                        //alert(er.exec(texto));
                        while ((arr = er.exec(texto)) !== null) {
                            $scope.oc++;
                        }

                        var palabras = texto.split("\n");
                        for (var j = 0; j < palabras.length; j++) {

                            rec = palabras[j].split($scope.bus);
                            palabras[j] = "";
                            for (var i = 0; i < rec.length; i++) {
                                if (i !== rec.length - 1) {
                                    palabras[j] += rec[i] + "<font color='darkgreen'><b>" + $scope.bus + "</b></font>";
                                } else {
                                    palabras[j] += rec[i];
                                }
                            }
                        }

                        for (var i = 0; i < palabras.length; i++) {
                            if ((i + 1) === palabras.length) {
                                $scope.rec += palabras[i];
                            } else {
                                $scope.rec += palabras[i] + "<br>";
                            }
                        }
                        ;


                    }

                }

                if ($scope.oc > 0) {
                    $scope.mostrar = true;
                    supertemp = $scope.text;
                } else {
                    $scope.mostrar = false;
                }
            };
//-----------------------------------------------------------------------------------------------------------------------
            var supertemp = "";
            $scope.trempl = "";//es el texto que se usa para rmplazar

            $scope.remplazar = function () {
                $scope.text = supertemp;
                if ($scope.trempl !== "" && $scope.trempl !== " ") {
                    $("#contenido").attr('disabled', 'disabled');
                    var ex = new RegExp($scope.bus, "g");
                    $scope.text = $scope.text.replace(ex, $scope.trempl);
                    $scope.codf = true;
                } else {
                    $("#contenido").removeAttr('disabled');
                }
                $scope.ver();
            };

            $scope.aplicar = function () {
                $("#contenido").removeAttr('disabled');
                $scope.trempl = "";
                $scope.oc = 0;
                $scope.bus = "";
                $scope.rec = "";
                $scope.mostrar = false;

            };


        });


