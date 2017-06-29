/* Controls local login page */
app.controller('localLoginCtrl', function($scope, $http, $location){
    $scope.localEmail = '';
    $scope.localPass = '';
    $scope.localLoginError = '';
    $scope.errid = 0;
    
    $scope.localLogin = function(){
		var formData = {};
		formData.email = $scope.localEmail;
		formData.password = $scope.localPass;
		$http.post('/login', formData).then(function(response){
			/* On success redirect to second page */
			$location.url('/securedPage');
		}).catch(function(response){
			/* On error display error message */
			$scope.localLoginError = response.data;
			$scope.errid = 1;
		});
    }
});

