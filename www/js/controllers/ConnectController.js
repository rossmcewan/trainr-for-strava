var controllers = angular.module('connect.controllers', []);

controllers.controller('ConnectController', function($scope, $state, StravaService, UserService){
	$scope.connect = function(){
		return StravaService.connect().then(function(result){
			return UserService.login(result).then(function(result){
				$state.go('app.main', {
					clear:true
				});
			}, function(error){
				$state.go('app.error');
			});
		}, function(error){
			$state.go('app.error');
		});
	}
});