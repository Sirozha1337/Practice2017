var app = angular.module('SEManager', ["ngRoute"]).controller('mainController', 
    function($scope, $http, $location, $templateCache){
        
    }
);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl : "/templates/loginForm.htm"
    })
    .when('/securedPage', {
        templateUrl : "/templates/securedPage.htm"
    })
    .when('/page', {
        templateUrl : "/templates/page.htm"
    })
});
