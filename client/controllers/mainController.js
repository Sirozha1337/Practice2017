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
        templateUrl : "/templates/securedPage.htm",
        controller: 'securedPageCtrl'
    })
    .when('/register',{
        templateUrl : "/templates/signupForm.htm"
    })
    .when('/addEvent',{
        templateUrl : "/templates/newEventForm.htm",
        controller: 'NewEventFormCtrl'
    })
});

app.controller('securedPageCtrl', function($scope, $rootScope, $http, $location) {
    $scope.id = -1;
    $scope.emails = [];
    $scope.invites = [];
    $scope.showid = -1;
    if(typeof $rootScope.user == 'undefined'){
	$http.get("/currentUser").then(function(response) {
	    if(response.data === '')
		$location.url('/');
	    else{
		$scope.user = response.data;
		$rootScope.user = $scope.user;
		if(typeof $rootScope.events == 'undefined'){
		    $http.get("/myEvents").then(function(eventResponse) {
			if(response.data === '')
			    $rootScope.events = [];
			else{
			    $rootScope.events = eventResponse.data;
			}
			$scope.events = $rootScope.events;
		    });
		}
	    }
	});
    }
    $scope.addEvent = function() {
	$location.url('/addEvent');
    }

    $scope.addPerson = function(index) {
	if($scope.id == index)
	    $scope.id = -1;
	else{
	    $scope.emails[index] = "";
	    $scope.id = index;
	}
    }
    $scope.postInvite = function(index) {
	var newinvite = {};
	newinvite.email = $scope.emails[index];
	console.log($scope.emails[index]);
	newinvite.eventId = $scope.events[index]["id"];
	console.log($scope.events[index]["id"]);
	$http.post('/newInvite', newinvite).then(function(response) {
	    $scope.id = -1;
	    $scope.emails[index] = "";
	});
    }

    $scope.showPerson = function(index) {
	if($scope.showid == index)
	    $scope.showid = -1;
	else{
	    $scope.showid = index;
	    var getlist = {
			params:{
				eventId: $scope.events[index]["id"]
			}
		}
	    console.log(getlist);
	    $http.get('/usersInEvent', getlist).then( function(response){
		$scope.invites[index] = response.data;
		console.log(response);
	    });
	}
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
		if(typeof $rootScope.events == 'undefined'){
		    $http.get("/myEvents").then(function(eventResponse) {
			if(response.data === '')
			    $rootScope.events = [];
			else{
			    $rootScope.events = eventResponse.data;
			}
			$scope.events = $rootScope.events;
		    });
		}
	    }
	});
    }

    $scope.postEvent = function() {
	var newevent = {};
	newevent.name = $scope.name;
	newevent.description = $scope.desc;
	$http.post('/newEvent', newevent).then(function(response) {
	    $rootScope.events.unshift(response.data);
	    $location.url('/securedPage');
	});
    }
    
});
