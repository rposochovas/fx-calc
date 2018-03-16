'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', function($scope, $http) {
    const COUNTRY_URL = 'https://free.currencyconverterapi.com/api/v5/countries';
    const CONVERTER_URL = 'https://free.currencyconverterapi.com/api/v5/convert?q=#FROM#_#TO#&compact=y';

    $scope.fromCurMissingError = false;
    $scope.toCurMissingError = false;

    $http({method: 'GET', url: COUNTRY_URL}).
        then(function(response) {
            $scope.countries = response.data.results;
        }, function(response) {
            console.log('Error: ' + response);
        });

    $scope.convert = function (fromCur, toCur, direction) {
        var fromToPair = fromCur + '_' + toCur;
        var url = CONVERTER_URL.replace('#FROM#_#TO#', fromToPair);

        if (!fromCur || !toCur) {
            $scope.fromCurMissingError = !fromCur;
            $scope.toCurMissingError = !toCur;
            return
        }

        $http({method: 'GET', url: url}).
            then(function(response) {
                var changeIndex = response.data[fromToPair].val;
                if (direction === 'ltr') {
                    var fromVal = $scope.fromVal? $scope.fromVal : 1;
                    $scope.toVal = fromVal * changeIndex;
                } else {
                    var toVal = $scope.toVal? $scope.toVal : 1;
                    $scope.fromVal = toVal * changeIndex;
                }
            }, function(response) {
                console.log('Error: ' + response);
            });
    };

    function retryConversion () {
        if ($scope.fromVal) {
            $scope.convert($scope.selectedCountryFrom.currencyId, $scope.selectedCountryTo.currencyId, 'ltr');
        } else if ($scope.toVal) {
            $scope.convert($scope.selectedCountryTo.currencyId, $scope.selectedCountryFrom.currencyId, 'rtl');
        }
    }

    $scope.countryFromSelected = function () {
        $scope.fromCurMissingError = false;

        retryConversion();
    };

    $scope.countryToSelected = function () {
        $scope.toCurMissingError = false;

        retryConversion();
    }

}]);