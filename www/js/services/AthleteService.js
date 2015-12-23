var services = angular.module('services.athlete', []);

services.factory('AthleteService', function(){
	return {
		getAthleteSummary:function(){
			return Parse.Cloud.run('getAthleteSummary');
		},
		saveRunningPreferences:function(params){
			return Parse.Cloud.run('saveRunningPreferences', params);
		}
	}
})