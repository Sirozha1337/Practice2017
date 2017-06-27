var app = angular.module('SEManager', ["ngRoute"]).controller('mainController', 
    function($scope, $http, $location, $templateCache){
        
    }
);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl : "/templates/loginForm.htm",
        controller: 'LoginCtrl'
    })
    .when('/securedPage', {
        templateUrl : "/templates/securedPage.htm",
        controller: 'securedPageCtrl'
    })
    .when('/page', {
        templateUrl : "/templates/page.htm",
        controller: 'PageCtrl'
    })
    .when('/register',{
        templateUrl : "/templates/signupForm.htm",
        controller: 'SignInCtrl'
    })
});

app.controller('LoginCtrl', function($scope, $rootScope, $http) {

});

app.controller('securedPageCtrl', function($scope, $rootScope, $http, $location) {
    $http.get("/currentUser").then(function(response) {
	if(response.data === '')
	    $location.url('/');
	else
	    $scope.user = response.data;
    });
});

app.controller('PageCtrl', function($scope, $rootScope, $http, $location) {
    $http.get("/currentUser").then(function(response) {
	if(response.data === '')
	    $location.url('/');
	else
	    $scope.user = response.data;
	
    });
});

app.controller('SignInCtrl', function($scope, $rootScope, $http, $location) {

});

