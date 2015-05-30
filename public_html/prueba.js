/* global angular, $rootScope */
var ex;
//var ex = /^(a((aa)*(bb)*|(abab)*)*(baba)*(bb)*)$/;
var espO = "(\n| )+";
var esp = "(\n| )*";
var declare = "declare";
var varb = "[a-zA-Z][a-zA-Z0-9_]{0,14}";
var varbs = varb + "(" + esp + "," + esp + varb + ")*";
var tipovarb = "(entero|real|cadena|fecha|logico)";
var condicion = "(si|para|mq|haga)";
var finCondicion = "(fin(si|para|mq))";
var palabrasReservadas = "(inicio|declare|entero|real|cadena|fecha|logico|si|para|mq|haga|entonces|fin(si|para|mq¿haga)*)";
//Guardian de comentarios
var gcoment = new Array();
//Declaraciones
var declaraciones = "(" + declare + espO + varbs + espO + tipovarb + esp + ";" + esp + ")*";
var condiciones = "(" + condicion + espO + "entonces" + espO + finCondicion + esp + ";" + ")*";
//Contenedor de variables
var variable = {entero: new Array(), real: new Array(), cadena: new Array(), fecha: new Array(), logico: new Array()};
var todasReservadas = new Array();

function reset() {
    variable = {entero: new Array(), real: new Array(), cadena: new Array(), fecha: new Array(), logico: new Array(), todas: new Array()};
    todasReservadas = new Array();
    ncoment = 0;
    saltos = 1;
}


angular.module("compilador", ['ngSanitize']).run(function($rootScope) {
    $rootScope.code;
    $rootScope.res;
    $rootScope.validar;
}).controller("guardian", function($rootScope, $scope) {
    $('#contenido').val("inicio\n \nfin;");
    reset();
    $scope.rows = saltos;
    $scope.datos;
    $scope.ncoment;
    $scope.todasReservadas;

    $rootScope.validar = function() {
        $rootScope.code = $('#contenido').val();
        reset();
        ex = new RegExp(
                "^inicio" + espO
                + "(" + "#|" + declaraciones + esp + "|" + condiciones + esp + ")*" +
                "fin;$");
        var pal = $rootScope.code;

        //document.getElementById("val").value = ex.test(pal);
        var hespO = "(<br>|&nbsp)+";
        var hesp = "(<br>|&nbsp)*";
        var hdeclare = "declare";
        var hvarb = "[a-zA-Z][a-zA-Z0-9_]{0,14}";
        var hvarbs = hvarb + "(" + hesp + "," + hesp + hvarb + ")*";
        var htipovarb = "(entero|real|cadena|fecha|logico)";
        var hdeclaraciones = "(" + hdeclare + hespO + hvarbs + hespO + htipovarb + hesp + ");?";

        var palRes = new RegExp("inicio|" + hespO + "(" + hdeclaraciones + "|" + palabrasReservadas + "|" + hvarb + ")|fin", "g");

        var res = $rootScope.code.replace(/ /g, "&nbsp&nbsp");
        res = res.replace(/\n/g, function() {
            saltos++;
            return "<br>";
        });
        res = comentarios(res);
        res = res.replace(palRes, function(token) {
            var ex = new RegExp(hdeclaraciones);
            var varb = new RegExp(hvarb);
            var reservadas = new RegExp(palabrasReservadas);
            if (ex.test(token))
                return declarar(token);
            else if (reservadas.test(token)) {
                todasReservadas.push(token);
                return "<font color='blue'><b>" + token + "</b></font>";
            } else if (varb.test(token)) {
                return variables(token, varb);
            } else
                return token;
        });
        res = res.replace(/©/g, function() {
            ncoment++;
            return gcoment.pop();
        });
        res = res.replace(/♂/g, "&nbsp");
        res = res.replace(/♀/g, "<br>");
        $scope.todasReservadas = todasReservadas;
        $scope.datos = variable;
        $scope.ncoment = ncoment;
        $rootScope.res = res;
        $scope.rows = saltos;
    };

    $scope.ver = function() {
        var pal = $rootScope.code;
        var reg = new RegExp(declare + espO + varbs + espO + tipovarb + esp + ";", "g");
        var res = pal.match(reg);
        alert(res);
    };

    $scope.validar();

});

