sightstudyapp.controller('userCtrl', ['$cookies', '$scope', '$state', 'userFactory', function ($cookies, $scope, $state, userFactory) {
    $scope.userData = {};
	$scope.user = $cookies.getObject('user');
    
    $scope.loginurl = function () {
        $state.go('login');
    },

    $scope.registerurl = function () {
        $state.go('register');
    },

    $scope.logout = function () {
        if ($scope.user.token != "") {
            $cookies.remove('user');
        }
        $state.go('login');
    },

	$scope.createUser = function(){
        var user = $scope.userR;
        if(user.username){
            userFactory.createUser(user.username, function(response){
                if(response.data.success){
                    $scope.user = $scope.userR;
                    $scope.errorData = {
                        success: response.data.success,
                        error: response.data.error
                    };
                    setTimeout($scope.login, 2000);
                    $('#collapseErrorLogin').collapse();  
                } else {
                    $scope.errorData = {
                        success: response.data.success,
                        error: response.data.error
                    };                    
                    $('#collapseErrorInscription').collapse();
                }
            });
        }
    };
	
	$scope.login = function(){
        var user = $scope.user;

        if(user.username){
            userFactory.login(user.username, function(response){
                if(response.data.success){
                    var cookie = {
                        token: response.data.token,
                        username: response.data.username
                    };
                    var now = new Date();
                    //On fait un cookie qui dure qu'une journée.
                    var exp = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
                    $cookies.putObject('user', cookie, {'expires': exp});
                    $state.go('home');
                } else {
                    $scope.errorData = {
                        success: response.data.success,
                        error: response.data.error
                    };
                    $('#collapseErrorLogin').collapse();              
                }
            });
        } else {
            $scope.errorData = {
                success: false,
                error: "Merci de compléter les deux champs."
            };
            $('#collapseErrorLogin').collapse();
        }
    };

    $scope.refreshUserSet = function () {
        userFactory.getUserSet(function (response) {
            $scope.users = response.data;
        });
    }

    $scope.refreshUserSet();
}]);
