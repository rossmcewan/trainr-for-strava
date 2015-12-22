var controllers = angular.module('controllers.connect', []);

controllers.controller('ConnectController', function ($scope, $state, $ionicHistory, StravaService, UserService) {
	var currentUser = UserService.current();
	console.log('currentUser: ', currentUser);
	if (currentUser) {
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
		$ionicHistory.nextViewOptions({
			disableBack: true
		});

		return $state.go('app.main');
	}

	$scope.connect = function () {
		return StravaService.connect().then(function (result) {
			return UserService.login(result).then(function (result) {
				$ionicHistory.clearHistory();
				$ionicHistory.clearCache();
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('app.main');
			}, function (error) {
				console.log(error);
				$state.go('app.error');
			});
		}, function (error) {
			console.log(error);
			$state.go('app.error');
		});
	}
});