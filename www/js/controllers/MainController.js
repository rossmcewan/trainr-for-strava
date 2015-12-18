var controllers = angular.module('controllers.main', []);

controllers.controller('MainController', function ($scope, $state, $ionicHistory, StravaService, UserService, ProgramService) {
	var currentUser = UserService.current();
	console.log('currentUser: ', currentUser);
	if (!currentUser) {
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
		return $state.go('connect');
	}
	return ProgramService.getCurrentProgram().then(function (result) {
		if (result) {
			console.log('sending to current program');
			$ionicHistory.clearHistory();
			$ionicHistory.clearCache();
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('app.current',{
				currentProgram:result
			});
		} else {
			console.log('sending to new program');
			$ionicHistory.clearHistory();
			$ionicHistory.clearCache();
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('app.new');
		}
	}, function (error) {
		console.log(error);
		$state.go('app.error');
	})
});