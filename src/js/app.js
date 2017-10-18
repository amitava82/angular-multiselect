/* eslint angular/controller-name: "off" */

angular.module('app', ['am.multiselect'])
  .controller('appCtrl', ['$log',function ($log) {
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

    vm.focusHanadler=function(prop1) {
      $log.info("inside focusHandler - "+prop1);
    }
}]);
