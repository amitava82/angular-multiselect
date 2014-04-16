# A Native AngularJS multiselect directive


#### index.html
```html
<!DOCTYPE html>
<html ng-app="plunker">
  <head>
    <script src="app.js"></script>
    <script src="multiselect.js"></script>
  </head>
  <body ng-controller="MainCtrl">

    <multiselect multiple="true" ng-model="selectedCar" options="car.id as car.name for car in cars" />
    <div class="well well-small">
        {{selectedCar}}
    </div>

  </body>
</html>
```


#### app.js
```js
var app = angular.module('plunker', ['ui.multiselect']);

app.controller('MainCtrl', function($scope) {
  $scope.cars = [{id:1, name: 'Audi'}, {id:2, name: 'BMW'}, {id:3, name: 'Honda'}];
  $scope.selectedCar = [];
});
```


#### After selecting 'Audi' and 'Honda', the model will look like:
```
  $scope.selectedCar = [1, 3];
```


#### Change options to `car.name for car in cars` for a data model like:
```
  $scope.selectedCar = [{id:1, name: 'Audi'}, {id:3, name: 'Honda'}];
```

#### Changing options to `car.id for car in cars` will change the options labels in the UI:
`'Audi', 'BMW', 'Honda'` -> `'1', '2', '3'`


## Example
http://plnkr.co/edit/LPGYIf?p=preview

## License

MIT
