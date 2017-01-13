var blogApp = angular.module('blogApp', ['ui.router', 'satellizer'])

.controller('blogController', ['$scope', '$http', '$auth', '$state', function($scope, $http, $auth, $state) {

    $scope.formData = {};
    $scope.entries = [];
    $scope.currBlogId = "";
    $scope.blogData = {};
    $scope.blogName = "";
    $scope.blogIds= [];


    console.log('running controller');

    $http.get('/api')
        .then(function (data){
            console.log(data);
            if (data !== null) {
                data.data.forEach(function(blog) {
                    $scope.blogIds.push(blog);
                });
                $scope.currBlogId = $scope.blogIds[0]._id;

                console.log($scope.blogIds);

                $http.get('/api/switchBlog/' + $scope.currBlogId)
                    .then (function(data) {
                        $scope.entries = data.data.posts;
                        $scope.currBlogId = data.data._id;
                        $scope.blogName = data.data.name;
                        console.log(data);
                    }, function (data) {
                        console.log('Error: ' + data);
                    });
            }
        }, function (data) {
            console.log('Error: ' + data);
        });


    $scope.authenticate = function(provider) {
        $auth.authenticate(provider);
    };

// register new user
    $scope.newUser = {};
    $scope.errorMessage = false;
    $scope.register = function(){
        // send signup POST request to /auth/signup
        console.log($scope.newUser);
        $auth.signup($scope.newUser)
            .then(function(res){
                // set localstorage token
                $scope.newUser = {};
                $auth.setToken(res);
                $state.go('blog');
            })
            .catch(function(res){
                $scope.errorMessage = true;
            });
    };

    $scope.loginUser = {};
    $scope.login = function ()  {
        console.log("attempting to log in");
        $auth.login($scope.loginUser)
            .then(function(res) {
                $scope.loginUser = {};
                $auth.setToken(res);
                $state.go('blog');
            })
            .catch(function(res){
                console.log("incorrect login");
                alert("Incorrect Login");
            });
    };

    $scope.logout = function() {
        console.log("logging out");
        $auth.logout().then(function () {
            $state.go('login');
        });
    };


    $scope.switchBlog = function (id) {
        $http.get('/api/switchBlog/' + id)
            .then (function(data) {
                $scope.currBlogId = id;
                $scope.entries = data.data.posts;
                $scope.currBlogId = data.data._id;
                $scope.blogName = data.data.name;
                console.log(data);
            }, function (data) {
                console.log('Error: ' + data);
            });
    };

 /*   $http.get('/api' + $scope.currBlogId)
        .then(function (data) {
            $scope.entries = data.data.posts;
            console.log(data.data);
        }, function (data) {
            console.log('Error: ' + data);
        });*/

    $scope.createBlog = function() {
        console.log('creating blog');
        $http.post('/api/createBlog', $scope.blogData)
            .then (function(data) {
                $scope.blogData = {};
                $scope.entries = data.data.posts;
                $scope.currBlogId = data.data._id;
                $scope.blogName = data.data.name;
                $scope.blogIds.push({
                    _id: data.data._id,
                    name: data.data.name
                });
                console.log(data);
            }, function (data) {
            console.log('Error: ' + data);
        });
    };


    $scope.createEntry = function () {
        console.log('creating entry');
        $http.post('/api/' + $scope.currBlogId, $scope.formData)
            .then (function (data) {
                $scope.formData = {};
                $scope.entries = data.data;
                console.log(data);
            }, function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteEntry = function (id) {
        $http.delete('/api/' + $scope.currBlogId + '/' + id)
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

blogApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('blog', {
            url: '/blog',
            templateUrl: 'blog.tpl.html',
            data: { requiredLogin: true }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'login.tpl.html',
        })
            .state('register', {
            url: '/register',
            templateUrl: 'register.tpl.html'
        });
    //$urlRouterProvider.otherwise('/login');

});


blogApp.run(function ($rootScope, $state, $auth) {
    $rootScope.$on('$stateChangeStart',
        function (event, toState) {
            var requiredLogin = false;
            // check if this state need login
            if (toState.data && toState.data.requiredLogin)
                requiredLogin = true;

            // if yes and if this user is not logged in, redirect him to login page
            console.log($auth.isAuthenticated());
            if (requiredLogin && !$auth.isAuthenticated()) {
                event.preventDefault();
                $state.go('login');
            }
        });
});
