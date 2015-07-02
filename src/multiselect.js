// Source: https://github.com/amitava82/angular-multiselect
angular.module('ui.multiselect', [])

  //from bootstrap-ui typeahead parser
  .factory('optionParser', ['$parse', function ($parse) {
  
   //                      00000111000000000000022200000000000000003333333333333330000000000044000
    var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
  
    return {
      parse:function (input) {
  
        var match = input.match(TYPEAHEAD_REGEXP);
        if (!match) {
          throw new Error(
            'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
              ' but got "' + input + '".');
        }
  
        return {
          itemName:match[3],
          source:$parse(match[4]),
          viewMapper:$parse(match[2] || match[1]),
          modelMapper:$parse(match[1])
        };
      }
    };
  }])

  .directive('multiselect', ['$parse', '$document', '$compile', '$interpolate', 'optionParser',

    function ($parse, $document, $compile, $interpolate, optionParser) {
      return {
        restrict: 'E',
        require: 'ngModel',
        link: function (originalScope, element, attrs, modelCtrl) {
          //Redefine isEmpty - this allows this to work on at least Angular 1.2.x
          var isEmpty = modelCtrl.$isEmpty;
          modelCtrl.$isEmpty = function(value) {
            return isEmpty(value) || (angular.isArray(value) && value.length == 0);
          };

          var exp = attrs.options,
            parsedResult = optionParser.parse(exp),
            isMultiple = attrs.multiple ? true : false,
            required = false,
            scope = originalScope.$new(),
            changeHandler = attrs.change || angular.noop;

          scope.items = [];
          scope.header = 'Select';
          scope.multiple = isMultiple;
          scope.disabled = false;
          scope.onBlur = attrs.ngBlur || angular.noop;

          originalScope.$on('$destroy', function () {
            scope.$destroy();
          });

          var popUpEl = angular.element('<multiselect-popup' + 
                        (attrs.templateUrl ? (' template-url="' + attrs.templateUrl + '"'): '' ) + 
                        '></multiselect-popup>');
						
          //required validator
          if (attrs.required || attrs.ngRequired) {
            required = true;
          }
          attrs.$observe('required', function(newVal) {
            required = newVal;
          });

          //watch disabled state
          scope.$watch(function () {
            return $parse(attrs.disabled)(originalScope);
          }, function (newVal) {
            scope.disabled = newVal;
          });

          //watch single/multiple state for dynamically change single to multiple
          scope.$watch(function () {
            return $parse(attrs.multiple)(originalScope);
          }, function (newVal) {
            isMultiple = newVal || false;
          });

          //watch option changes for options that are populated dynamically
          scope.$watch(function () {
            return parsedResult.source(originalScope);
          }, function (newVal) {
            if (angular.isDefined(newVal))
              parseModel();
          }, true);

          //watch model change
          scope.$watch(function () {
            return modelCtrl.$modelValue;
          }, function (newVal, oldVal) {
            //when directive initialize, newVal usually undefined. Also, if model value already set in the controller
            //for preselected list then we need to mark checked in our scope item. But we don't want to do this every time
            //model changes. We need to do this only if it is done outside directive scope, from controller, for example.
            if (angular.isDefined(newVal)) {
              markChecked(newVal);
              scope.$eval(changeHandler);
            }
            getHeaderText();
            modelCtrl.$setValidity('required', scope.valid());
          }, true);

          function parseModel() {
            scope.items.length = 0;
            var model = parsedResult.source(originalScope);
            if(!angular.isDefined(model)) return;
            for (var i = 0; i < model.length; i++) {
              var local = {};
              local[parsedResult.itemName] = model[i];
              scope.items.push({
                label: parsedResult.viewMapper(originalScope, local),
                model: parsedResult.modelMapper(originalScope, local),
                checked: false
              });
            }
          }

          parseModel();

          element.append($compile(popUpEl)(scope));

          function getHeaderText() {
            if (is_empty(modelCtrl.$modelValue)) return scope.header = attrs.msHeader || 'Select';
            
              if (isMultiple) {
                  if (attrs.msSelected) {
                      scope.header = $interpolate(attrs.msSelected)(scope);
                  } else {
                     if (modelCtrl.$modelValue.length == 1) {
                          for(var i = 0; i < scope.items.length; i++) {
                              if(scope.items[i].model === modelCtrl.$modelValue[0]) {
                                  scope.header = scope.items[i].label;
                              }
                          }
                      } else {
                          scope.header = modelCtrl.$modelValue.length + ' ' + 'selected';
                      }
                  }
              
            } else {
              if(angular.isString(modelCtrl.$modelValue)){
                scope.header = modelCtrl.$modelValue;
              }else{
                var local = {};
                local[parsedResult.itemName] = modelCtrl.$modelValue;
                scope.header = parsedResult.viewMapper(originalScope, local)
                    || scope.items[modelCtrl.$modelValue].label;
              }
            }
          }
          
          function is_empty(obj) {
            if (angular.isNumber(obj)) return false;
            if (obj && obj.length && obj.length > 0) return false;
            for (var prop in obj) if (obj[prop]) return false;
            return true;
          };

          scope.valid = function validModel() {
            if(!required) return true;
            var value = modelCtrl.$modelValue;
            return (angular.isArray(value) && value.length > 0) || (!angular.isArray(value) && value != null);
          };

          function selectSingle(item) {
            if (item.checked) {
              scope.uncheckAll();
            } else {
              scope.uncheckAll();
              item.checked = !item.checked;
            }
            setModelValue(false);
          }

          function selectMultiple(item) {
            item.checked = !item.checked;
            setModelValue(true);
          }

          function setModelValue(isMultiple) {
            var value = null;

            if (isMultiple) {
              value = [];
              angular.forEach(scope.items, function (item) {
                if (item.checked) value.push(item.model);
              })
            } else {
              angular.forEach(scope.items, function (item) {
                if (item.checked) {
                  value = item.model;
                  return false;
                }
              })
            }
            modelCtrl.$setViewValue(value);
          }

          function markChecked(newVal) {
            if (!angular.isArray(newVal)) {
              angular.forEach(scope.items, function (item) {
                if (angular.equals(item.model, newVal)) {
                  scope.uncheckAll();
                  item.checked = true;
                  setModelValue(false);
                  return false;
                }
              });
            } else {
              angular.forEach(scope.items, function (item) {
                item.checked = false;
                angular.forEach(newVal, function (i) {
                  if (angular.equals(item.model, i)) {
                    item.checked = true;
                  }
                });
              });
            }
          }

          scope.checkAll = function () {
            if (!isMultiple) return;
            angular.forEach(scope.items, function (item) {
              item.checked = true;
            });
            setModelValue(true);
          };

          scope.uncheckAll = function () {
            angular.forEach(scope.items, function (item) {
              item.checked = false;
            });
            setModelValue(true);
          };

          scope.select = function (item) {
            if (isMultiple === false) {
              selectSingle(item);
              scope.toggleSelect();
            } else {
              selectMultiple(item);
            }
          }
        }
      };
    }])

  .directive('multiselectPopup', ['$document', function ($document) {
    return {
      restrict: 'E',
      scope: false,
      replace: true,
      templateUrl: function (element, attr) {
                return attr.templateUrl || 'multiselect.tmpl.html';
        },
      link: function (scope, element, attrs) {

        scope.isVisible = false;

        scope.toggleSelect = function () {
          if (element.hasClass('open')) {
            element.removeClass('open');
            $document.unbind('click', clickHandler);
            scope.$parent.$eval(scope.onBlur);
          } else {
            element.addClass('open');
            $document.bind('click', clickHandler);
            scope.focus();
          }
        };

        function clickHandler(event) {
          if (elementMatchesAnyInArray(event.target, element.find(event.target.tagName))) {
          	scope.$parent.$eval(scope.onBlur);
          } else {
          	element.removeClass('open');
          	$document.unbind('click', clickHandler);
          	scope.$apply();
          }
        }

        scope.focus = function focus(){
          var searchBox = element.find('input')[0];
          if (searchBox) {
            searchBox.focus();
          }
        }

        var elementMatchesAnyInArray = function (element, elementArray) {
          for (var i = 0; i < elementArray.length; i++)
            if (element == elementArray[i])
              return true;
          return false;
        }
      }
    }
  }]);
