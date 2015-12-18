var controllers = angular.module('controllers.application', []);

controllers.controller('ApplicationController', function ($scope, $state, $ionicHistory, UserService) {
	$scope.signout = function () {
		console.log('signout()');
		UserService.logout().then(function (result) {
			$ionicHistory.clearHistory();
			$ionicHistory.clearCache();
			$state.go('connect');
		}, function (error) {
			console.log(error);
			$state.go('app.error');
		});
	}
});