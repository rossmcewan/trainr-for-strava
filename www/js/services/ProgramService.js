var services = angular.module('services.program', []);

services.factory('ProgramService', function($q){
	return {
		getCurrentProgram:function(){
			return Parse.Cloud.run('getCurrentProgram');
		},
		createProgram:function(params){
			return Parse.Cloud.run('createProgram', params);
		}
	}
});