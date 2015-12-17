var controllers = angular.module('controllers.main', []);

controllers.controller('MainController', function($scope, $state, StravaService, UserService, ProgramService){
	var currentUser = UserService.current();
	if(!currentUser){
		return $state.go('connect');
	}
	return ProgramService.getCurrentProgram().then(function(result){
		if(result){
			//we have a program
			$state.go('app.current', {
				clear:true
			})
		}else{
			$state.go('app.new', {
				clear:true
			});
		}
	}, function(error){
		$state.go('app.error');
	})
});