sightstudyapp.controller('userCtrl', ['$cookies', '$scope', '$state', 'userFactory', function ($cookies, $scope, $state, userFactory) {
	$scope.user = $cookies.getObject('user');
    
    $scope.homeurl = function () {
        if($scope.user) {
            $state.go('home');
        }
        else {
            $state.go('login');
        }
    },

	$scope.unlock = function(){
        var password = $scope.password;
        
        console.log(password);

        if(password != ""){
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
                error: "Merci de sélectionner votre profil."
            };
            $('#collapseErrorLogin').collapse();
        }
    };

    $scope.testurl = function () {
        $state.go('test');
    },

    $scope.statsurl = function () {
        $state.go('stats');
    },

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
        if(user != undefined && user.username){
            userFactory.createUser(user.username, function(response){
                if(response.data.success){
                    $scope.user = $scope.userR;
                    $scope.errorData = {
                        success: response.data.success,
                        error: response.data.error
                    };
                    setTimeout($scope.login, 1500);
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

        if(user != undefined && user.username){
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
                error: "Merci de sélectionner votre profil."
            };
            $('#collapseErrorLogin').collapse();
        }
    };

    $scope.createTest = function (req){
        if ($scope.user.token != "") {
            var testData = {
                user: $scope.user,
                etdrs_d: req.etdrs_d,
                av_d: req.av_d,
                etdrs_g: req.etdrs_g,
                av_g: req.av_g
            };
            userFactory.createTest(testData, function (response) {
                if(response.data.success){
                    $state.go('home');
                    $scope.errorData = {
                        success: response.data.success,
                        error: response.data.error
                    };               
                    $('#collapseErrorLogin').collapse();  
                } else {
                    $scope.errorData = {
                        success: response.data.success,
                        error: response.data.error
                    };                    
                    $('#collapseErrorInscription').collapse();
                }
            });
        } else {
            alert("Merci de vous reconnecter.");
        }
    },

    $scope.refreshUser = function () {
        userFactory.getUsers(function (response) {
            $scope.users = response.data;
        });
    }

    $scope.refreshTests = function () {
        userFactory.getTests(function (response) {
            $scope.tests = response.data.tests;
        });
    }

    $scope.teststart = function () {
        next_letter(tailles[line]);
        startReco();

    }

    $scope.goodurl = function () {
        if(!$scope.user) {
            $state.go('login');
        }
    }

    $scope.copyright = function () {
        $scope.varcopyright = document.getElementById('copyright').appendChild(document.createTextNode(new Date().getFullYear()));
    }
}]);
