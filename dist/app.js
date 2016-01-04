angular.module('app', ['am.multiselect'])

.controller('appCtrl', ['$scope', function($scope){
    $scope.cars = [
                    {id:1, name: 'Audi'},
                    {id:2, name: 'BMW'},
                    {id:3, name: 'Honda'},
                    {id:4, name: 'A very very long name with spaces. It never ends at all. Keeps going on and on and on. So what can you do.'},
                    {id:5, name: 'AndThereComesTheNoSpaceMonsterThatYouHateToSeeInYourWebPageWhatCanYouDoAboutThis'}
                ];
    $scope.selectedCar = [];

    $scope.fruits = [
                        {id: 1, name: 'Apple'},
                        {id: 2, name: 'Orange'},
                        {id: 3, name: 'Banana: with some long story like there usual travel across the atlantic from south worm world to cold dizzy northern world.'}
                    ];
    $scope.selectedFruit = null;
        $scope.OnSelectionChange = function(event){
            console.log(event);
        }
}]);
