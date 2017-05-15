/* eslint angular/controller-name: "off" */

angular.module('app', ['am.multiselect'])
  .controller('appCtrl', [function () {
    var vm=this;

    vm.cars = [
      {
        id: 1,
        name: 'Audi'
      },
      {
        id: 2,
        name: 'BMW'
      },
      {
        id: 3,
        name: 'Honda'
      }
                ];
    vm.selectedCar = [];

    vm.fruits = [
      {
        id: 1,
        name: 'Apple'
      },
      {
        id: 2,
        name: 'Orange'
      },
      {
        id: 3,
        name: 'Banana'
      }
                    ];
    vm.selectedFruit = null;
}]);
