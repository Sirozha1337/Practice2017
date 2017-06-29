/* Controls Register page */
app.controller('localRegisterCtrl', function($scope, $http, $location){
    $scope.localEmail = '';
    $scope.name = '';
    $scope.localPass = '';
    $scope.localRegisterError = '';
    $scope.errid = 0;
    
    $scope.localRegister = function(){
        var formData = {};
        formData.name = $scope.name;
        formData.email = $scope.localEmail;
        formData.password = $scope.localPass;
        $http.post('/signup', formData).then(function(response){
            /* On success redirect to login page */
            $location.url('/');
        }).catch(function(response){
            /* On error display error message */
            $scope.localRegisterError = response.data;
            $scope.errid = 1;
        });
    }
});