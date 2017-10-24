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
      },
      {
        id: 4,
        name: 'Audi'
      },
      {
        id: 5,
        name: 'BMW'
      },
      {
        id: 6,
        name: 'Honda'
      },
      {
        id: 7,
        name: 'Audi'
      },
      {
        id: 8,
        name: 'BMW'
      },
      {
        id: 9,
        name: 'Honda'
      },
      {
        id: 10,
        name: 'Audi'
      },
      {
        id: 11,
        name: 'BMW'
      },
      {
        id: 12,
        name: 'Honda'
      },
      {
        id: 13,
        name: 'Audi'
      },
      {
        id: 14,
        name: 'BMW'
      },
      {
        id: 15,
        name: 'Honda'
      },
      {
        id: 16,
        name: 'Audi'
      },
      {
        id: 17,
        name: 'BMW'
      },
      {
        id: 18,
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
