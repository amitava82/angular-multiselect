angular.module('app', ['ui.multiselect'])

.controller('appCtrl', ['$scope', function($scope){
    $scope.cars = [{id:1, name: 'Audi'}, {id:2, name: 'BMW'}, {id:3, name: 'Honda'}];
    $scope.selectedCar = [];

    $scope.fruits = [{id: 1, name: 'Apple'}, {id: 2, name: 'Orange'},{id: 3, name: 'Banana'}];
    $scope.selectedFruit = null;
}])
