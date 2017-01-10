var blogApp = angular.module('blogApp', [])

.controller('blogController', ['$scope', '$http', function($scope, $http) {

    $scope.formData = {};

    console.log('running controller');

    $http.get('/api')
        .then(function (data) {
            $scope.entries = data;
            console.log(data);
        }, function (data) {
            console.log('Error: ' + data);
        });


    $scope.createEntry = function () {
        console.log('creating entry');
        $http.post('/api', $scope.formData)
            .then (function (data) {
                $scope.formData = {};
                $scope.entries = data;
                console.log(data);
            }, function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteEntry = function (id) {
        $http.delete('/api' + id)
            .success(function (data) {
                $scope.entries = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.talk = function() {
        console.log('brooooo');
    }
}]);
