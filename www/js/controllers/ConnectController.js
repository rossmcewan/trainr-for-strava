var controllers = angular.module('controllers.connect', []);

controllers.controller('ConnectController', function($scope, $state, StravaService, UserService){
	var currentUser = UserService.current();
	if(currentUser){
		$state.go('app.main');
	}
	
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