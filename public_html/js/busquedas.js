angular.module("compilador").controller("busquedas", function ($rootScope ,$scope) {

    $scope.oc = 0;
    $scope.mostrar = false;

    $scope.buscar = function () {
        $scope.rec = "";
        var texto = $rootScope.code;
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
            supertemp = $rootScope.code;
        } else {
            $scope.mostrar = false;
        }
    };
//-----------------------------------------------------------------------------------------------------------------------
    var supertemp = "";
    $scope.trempl = "";//es el texto que se usa para rmplazar

    $scope.remplazar = function () {
        $rootScope.code = supertemp;
        $('#contenido').val($rootScope.code);
        if ($scope.trempl !== "" && $scope.trempl !== " ") {
            $("#contenido").attr('disabled', 'disabled');
            var ex = new RegExp($scope.bus, "g");
            $rootScope.code = $rootScope.code.replace(ex, $scope.trempl);
            $('#contenido').val($rootScope.code);
            $scope.codf = true;
        } else {
            $("#contenido").removeAttr('disabled');
        }
        $scope.validar();
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

	