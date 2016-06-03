var treeApp = angular.module('treeApp', ['euTree.directive']);

var treeController = treeApp.controller('treeController', function($scope, $http) {
    $scope.list = [];
    $http.get('/tree').then(function(response) {
        $scope.list = [response.data];
    })
    $scope.$watch('selectedPath', function() {
        console.log($scope.selectedPath);
    })
})
