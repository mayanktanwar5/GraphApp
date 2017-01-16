var myApp = angular.module("myApp",["ui.router"]);

myApp.config(function($stateProvider,$urlRouterProvider,$locationProvider){

  $stateProvider.state('home',{
  	url:'/',
  	templateUrl:"../js/templates/dashboard.html",
  	controller:'chartController'
  })
  $urlRouterProvider.otherwise('/');

});

myApp.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});
