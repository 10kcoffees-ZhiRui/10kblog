var blogApp = angular.module('blogApp', [])

.controller('blogController', ['$scope', '$http', function($scope, $http) {

    $scope.formData = {};
    $scope.entries = [];

    console.log('running controller');

    $http.get('/api')
        .then(function (data) {
            $scope.entries = data.data;
            console.log(data.data);
        }, function (data) {
            console.log('Error: ' + data);
        });



    $scope.createEntry = function () {
        console.log('creating entry');
        $http.post('/api', $scope.formData)
            .then (function (data) {
                $scope.formData = {};
                $scope.entries = data.data;
                console.log(data);
            }, function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteEntry = function (id) {
        $http.delete('/api/' + id)
            .then (function (data) {
                $scope.entries = data.data;
                console.log(data);
            },function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.talk = function() {
        console.log('brooooo');
    }
}])

.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);
