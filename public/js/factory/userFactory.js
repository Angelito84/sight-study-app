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
    
    factory.getUserSet = function(user,callback){
        $http({
            method: 'GET',
            url: '/getUserSet',
        }).then(function successCallback(response){
            callback(response)
        }, function errorCallback(err){
            console.log('Error: ' + err.data.error);
        });
    };

    return factory;
}]);