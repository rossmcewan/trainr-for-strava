var controllers = angular.module('controllers.program', []);

controllers.controller('ProgramController', function ($scope, $state, StravaService, UserService) {

});

controllers.controller('NewProgramController', function ($scope, $state, $stateParams, $ionicHistory, UserService, AthleteService, ProgramService, athleteSummary) {
	$scope.user = UserService.current();
	$scope.athleteSummary = athleteSummary;
	console.log(athleteSummary);
});

controllers.controller('RunningPreferencesController', function ($scope, $state, $stateParams, $ionicHistory, UserService) {
	$scope.user = UserService.current();
	$scope.athleteSummary = $stateParams.athleteSummary;

	$scope.format = function (seconds) {
		return moment.duration(seconds * 1000).format();
	}
});

controllers.controller('PerformancePreferencesController', function ($scope, $state, $stateParams, $ionicHistory, UserService) {
	$scope.user = UserService.current();
	$scope.athleteSummary = $stateParams.athleteSummary;

	var item = $scope.athleteSummary.bestScore.activity;

	$scope.activity = {
		title: item.name,
		start: item.start_date_local,
		startTime: new Date(item.start_date_local),
		endTime: moment(item.start_date_local).add(item.elapsed_time, 'seconds').toDate(),
		activity: item,
		humanizedAgo: moment.duration(moment().diff(item.start_date_local)).humanize(),
		formattedStartDate: moment(item.start_date_local).format('HH:mm:ss on ddd, MMMM DD, YYYY'),
		formattedMovingTime: moment.utc(item.moving_time * 1000).format('HH:mm:ss'),
		formattedDistance: (item.distance / 1000).toFixed(2) + ' km',
		formattedAveragePace: moment.utc((16.666667 / item.average_speed) * 60 * 1000).format('mm:ss') + ' /km',
		map: {
			center: {
				latitude: item.start_latlng[0],
				longitude: item.end_latlng[1]
			},
			zoom: 12,
			polyline: polyline.decode(item.map.summary_polyline)
		}
	}

	$scope.format = function (seconds) {
		return moment.duration(seconds * 1000).format();
	}
});

controllers.controller('GoalPreferencesController', function($scope, $state, $stateParams, $ionicHistory, UserService){
	$scope.user = UserService.current();
	$scope.athleteSummary = $stateParams.athleteSummary;
});

controllers.controller('CurrentProgramController', function ($scope, $state, $stateParams, $ionicHistory) {
	$scope.program = $stateParams.currentProgram;
});