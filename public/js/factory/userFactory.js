sightstudyapp.factory('userFactory', ['$http', function($http) {
    var factory = {};

    factory.createUser = function(username, callback) {
        var query = {
            username: username
        }
        $http({
            method: 'POST',
            url: '/createUser',
            data: query
        }).then(function successCallback(response){
            callback(response);
        }, function errorCallback(err){
            console.log('Error: ' + err.data.error);
        });
    };

    factory.login = function(username, callback){
        var query = {
            username: username
        }

        $http({
            method: 'POST',
            url: '/loginUser',
            data: query
        }).then(function successCallback(response){
            callback(response);
        }, function errorCallback(err){
            console.log('Error: ' + err.data.error);
        });
    };
    
    factory.getUsers = function(callback){
        $http({
            method: 'GET',
            url: '/getUsers',
        }).then(function successCallback(response){
            callback(response)
        }, function errorCallback(err){
            console.log('Error: ' + err.data.error);
        });
    };

    factory.createTest = function(testData, callback){
        $http({
            method: 'POST',
            url: '/saveTest',
            data: testData
        }).then(function successCallback(response){
            callback(response);
        }, function errorCallback(err){
            console.log('Error: ' + err.data.error);
        });
    };

    factory.getUserSet = function(callback){
        $http({
            method: 'GET',
            url: '/getUserSet',
        }).then(function successCallback(response){
            callback(response)
        }, function errorCallback(err){
            console.log('Error: ' + err.data.error);
        });
    };

    factory.getTests = function(callback){
        $http({
            method: 'GET',
            url: '/getTests',
        }).then(function successCallback(response){
            callback(response)
        }, function errorCallback(err){
            console.log('Error: ' + err.data.error);
        });
    };

    return factory;
}]);