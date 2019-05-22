var sightstudyapp = angular.module('sightstudyapp', ['ui.router','ngCookies']);

sightstudyapp.config(function($stateProvider){
    
    var loginState = {
        name: "login",
        url: "/login/",
        templateUrl: "login.html",
        controller: "userCtrl"
    }

    var registerState = {
        name: "register",
        url: "/register/",
        templateUrl: "register.html",
        controller: "userCtrl"
    }
	
    var homeState = {
        name: "home",
        url: "/",
        templateUrl: "home.html",
        controller: "userCtrl"
    }
	
	var testState = {
        name: "test",
        url: "/test/",
        templateUrl: "test.html",
        controller: "userCtrl"
    }

    var stastState = {
        name: "stats",
        url: "/stats/",
        templateUrl: "stats.html",
        controller: "userCtrl"
    }

    $stateProvider.state(loginState);
    $stateProvider.state(registerState);
    $stateProvider.state(homeState);
    $stateProvider.state(testState);
    $stateProvider.state(stastState);
    
});

sightstudyapp.run(['$cookies','$state', '$timeout' , function($cookies,$state, $timeout) {
    // On verifie si le cookie existe et si il contient un token
    var user = $cookies.getObject('user');
    if(user) {
        $state.go('home');
    }
    else {
        $timeout(function(){
            $state.go('login');
        })
    }
}]);