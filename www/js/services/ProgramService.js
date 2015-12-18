var services = angular.module('services.program', []);

services.factory('ProgramService', function($q){
	return {
		getCurrentProgram:function(){
			return $q(function(resolve, reject){
				return resolve(null);
			});
		}
	}
});