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
    .when('/addEvent',{
        templateUrl : "/templates/newEventForm.htm",
        controller: 'NewEventFormCtrl'
    })
});

app.controller('LoginCtrl', function($scope, $rootScope, $http) {

});

app.controller('securedPageCtrl', function($scope, $rootScope, $http, $location) {
    if(typeof $rootScope.user == 'undefined'){
	$http.get("/currentUser").then(function(response) {
	    if(response.data === '')
		$location.url('/');
	    else{
		$scope.user = response.data;
		$rootScope.user = $scope.user;
	    }
	});
    }
    $scope.addEvent = function() {
	$location.url('/addEvent');
    }
});

app.controller('NewEventFormCtrl', function($scope, $rootScope, $http, $location) {
    if(typeof $rootScope.user == 'undefined'){
	$http.get("/currentUser").then(function(response) {
	    if(response.data === '')
		$location.url('/');
	    else{
		$scope.user = response.data;
		$rootScope.user = $scope.user; 
	    }
	});
    }

    $scope.postEvent = function() {
	var newevent = {};
	newevent.name = $scope.name;
	newevent.description = $scope.desc;
	$http.post('/newEvent', newevent).then(function(response) {
	    $location.url('/securedPage');
	});
    }
    
});

app.controller('SignInCtrl', function($scope, $rootScope, $http, $location) {

});

app.controller('PageCtrl', function($scope, $rootScope, $http, $location) {

});

