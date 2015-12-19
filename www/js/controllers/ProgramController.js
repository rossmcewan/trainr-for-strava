var controllers = angular.module('controllers.program', []);

controllers.controller('ProgramController', function ($scope, $state, StravaService, UserService) {

});

controllers.controller('NewProgramController', function ($scope, $state, $stateParams, $ionicHistory, UserService, AthleteService, ProgramService, athleteSummary, stravaAthlete) {
	$scope.user = UserService.current();
	$scope.athleteSummary = athleteSummary;
	$scope.stravaAthlete = stravaAthlete.data;
});

controllers.controller('RunningPreferencesController', function ($scope, $state, $stateParams, $ionicHistory, UserService) {
	$scope.user = UserService.current();
	$scope.athleteSummary = $stateParams.athleteSummary;
	$scope.stravaAthlete = $stateParams.stravaAthlete;

	$scope.format = function (seconds) {
		return moment.duration(seconds * 1000).format();
	}
});

controllers.controller('PerformancePreferencesController', function ($scope, $state, $stateParams, $ionicHistory, UserService) {
	$scope.user = UserService.current();
	$scope.athleteSummary = $stateParams.athleteSummary;
	$scope.stravaAthlete = $stateParams.stravaAthlete;

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

controllers.controller('GoalPreferencesController', function ($scope, $state, $stateParams, $ionicHistory, $ionicModal, UserService, StravaService) {
	$scope.user = UserService.current();
	$scope.athleteSummary = $stateParams.athleteSummary;
	$scope.stravaAthlete = $stateParams.stravaAthlete;
	
	$ionicModal.fromTemplateUrl('templates/routes.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;
	});
	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function () {
		$scope.modal.remove();
	});
	// Execute action on hide modal
	$scope.$on('modal.hidden', function () {
		$scope.showPace = null;
	});
	// Execute action on remove modal
	$scope.$on('modal.removed', function () {
		// Execute action
	});

	$scope.goal = {
	};

	$scope.selectRoute = function () {
		return StravaService.getRoutes().then(function(routes){
			$scope.routes = routes.data.filter(function(item){
				var pl = polyline.decode(item.map.summary_polyline);
				var map = {
					center: {
						latitude: pl[pl.length/2][0],
						longitude: pl[pl.length/2][1]
					},
					zoom: 8,
					polyline: pl
				}
				if($scope.stravaAthlete.measurement_preference == 'feet'){
					item.calculatedDistance = getValue(math.eval(item.distance + ' feet in miles')); 
					item.formattedDistance = item.calculatedDistance + ' miles';
				}
				if($scope.stravaAthlete.measurement_preference == 'meters'){
					item.calculatedDistance = getValue(math.eval(item.distance + ' meters in km'))
					item.formattedDistance = item.calculatedDistance + ' km';
				}
				item.formattedElevation = item.elevation_gain.toFixed(2) + ' ' + $scope.stravaAthlete.measurement_preference;
				item.map = map;
				return item.type == 2;
			});
			$scope.modal.show();	
		}, function(error){
			$state.go('app.error');
		});
	}
});

controllers.controller('RouteController', function($scope){
	$scope.selectRoute = function(route){
		$scope.goal.route = route;
		$scope.goal.distance = route.calculatedDistance;
		$scope.goal.elevationGain = parseFloat(route.elevation_gain.toFixed(2));
		$scope.modal.hide();
	}
});

controllers.controller('CurrentProgramController', function ($scope, $state, $stateParams, $ionicHistory) {
	$scope.program = $stateParams.currentProgram;
});

function getValue(mathval) {
  return parseFloat(JSON.parse(JSON.stringify(mathval)).value.toFixed(2));
}