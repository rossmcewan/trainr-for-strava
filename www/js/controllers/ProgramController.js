var controllers = angular.module('controllers.program', []);

controllers.controller('ProgramController', function ($scope, $state, StravaService, UserService) {

});

controllers.controller('NewProgramController', function ($scope, $state, $stateParams, $ionicHistory, UserService, AthleteService, ProgramService, athleteSummary, stravaAthlete) {
	$scope.user = UserService.current();
	$scope.athleteSummary = athleteSummary;
	$scope.stravaAthlete = stravaAthlete.data;
	
	if($scope.stravaAthlete.measurement_preference == 'feet'){
		$scope.athleteSummary.formattedAverageDistancePerWeek = math.eval($scope.athleteSummary.averageDistancePerWeek + ' feet in miles').toString();	
		$scope.athleteSummary.formattedAverageDistancePerRun = math.eval($scope.athleteSummary.averageDistancePerRun + ' feet in miles').toString();
		$scope.athleteSummary.formattedLongestRun = math.eval($scope.athleteSummary.longestRun.distance + ' feet in miles').toString();
	}
	if($scope.stravaAthlete.measurement_preference == 'meters'){
		$scope.athleteSummary.formattedAverageDistancePerWeek = math.eval($scope.athleteSummary.averageDistancePerWeek + ' meters in km').toString();	
		$scope.athleteSummary.formattedAverageDistancePerRun = math.eval($scope.athleteSummary.averageDistancePerRun + ' meters in km').toString();
		$scope.athleteSummary.formattedLongestRun = math.eval($scope.athleteSummary.longestRun.distance + ' meters in km').toString();
	}
});

controllers.controller('RunningSummaryController', function ($scope, $state, $stateParams, $ionicHistory, $ionicPopup, UserService, Utilities) {
	$scope.user = UserService.current();
	$scope.athleteSummary = $stateParams.athleteSummary;
	$scope.stravaAthlete = $stateParams.stravaAthlete;
	$scope.errors = [];

	$scope.format = function (seconds) {
		return moment.duration(seconds * 1000).format();
	}
	
	$scope.next = function(){
		$state.go('app.runningDays', {
			athleteSummary:$scope.athleteSummary, 
			stravaAthlete:$scope.stravaAthlete
		});
	}
	
	$scope.longestRun = Utilities.prepareActivityForMap($scope.athleteSummary.longestRun, {
		measurement_preference: $scope.stravaAthlete.measurement_preference
	}); 
	
	$scope.averageRunsPerWeekChart = {};
	$scope.averageRunsPerWeekOptions = {
		chart:{
			type:'discreteBarChart',
			height:50,
			margin:{
				top:0,
				right:0,
				bottom:0,
				left:0
			},
			color: function (d, i) {
				return 'lightgray';
			},
			refreshDataOnly: true,
			deepWatchData: true,
			transitionDuration: 500,
			x: function (d) { 
				return d.key.toString(); 
			},
			y: function (d) { 
				return d.count; 
			},
			showXAxis: false,
			showYAxis: false,
			showValues: false
		}
	}
	var weeklyItems = _.values($scope.athleteSummary.weeklySummary);
	var number = 1;
	weeklyItems.forEach(function(item){item.key = number++;});
	$scope.averageRunsPerWeekData = [{
		key: "Average Runs per Week",
		values: weeklyItems
	}];
	
	$scope.averageDistancePerWeekChart = {};
	$scope.averageDistancePerWeekOptions = {
		chart:{
			type:'discreteBarChart',
			height:50,
			margin:{
				top:0,
				right:0,
				bottom:0,
				left:0
			},
			color: function (d, i) {
				return 'lightgray';
			},
			refreshDataOnly: true,
			deepWatchData: true,
			transitionDuration: 500,
			x: function (d) { 
				return d.key.toString(); 
			},
			y: function (d) { 
				return d.totalDistance; 
			},
			showXAxis: false,
			showYAxis: false,
			showValues: false
		}
	}
	var weeklyItems = _.values($scope.athleteSummary.weeklySummary);
	var number = 1;
	weeklyItems.forEach(function(item){item.key = number++;});
	$scope.averageDistancePerWeekData = [{
		key: "Average Distance per Week",
		values: weeklyItems
	}];
	
	// //$scope.averageRunsPerWeekChart.api.refresh()
	
	// $scope.chart = {};
	// $scope.options = {
	// 	chart: {
	// 		type: 'multiChart',
	// 		margin : {
	// 			top: 0,
	// 			right: 0,
	// 			bottom: 0,
	// 			left: 0
	// 		},
	// 		color: d3.scale.category10().range(),
	// 		//useInteractiveGuideline: true,
	// 		duration: 500,
	// 		xAxis: {
	// 			tickFormat: function(d){
	// 				return d;
	// 			}
	// 		},
	// 		// type: 'discreteBarChart',
	// 		// height: 50,
	// 		// width: 100,
	// 		// margin: {
	// 		// 	top: 0,
	// 		// 	right: 0,
	// 		// 	bottom: 0,
	// 		// 	left: 10
	// 		// },
	// 		// color: function (d, i) {
	// 		// 	return 'green';
	// 		// },
	// 		// refreshDataOnly: true,
	// 		// deepWatchData: true,
	// 		// x: function (d) { return d.label; },
	// 		// y: function (d) { return getDayDistance(d.label); },
	// 		// transitionDuration: 500,
	// 		// showXAxis: false,
	// 		// showYAxis: false,
	// 		// showValues: false
	// 	}
	// };
	// $scope.data = [
	// {
	// 	key: "This weeks distance",
	// 	type:'bar',
	// 	yAxis:1,
	// 	// x: function (d) { return d.label; },
	// 	// y: function (d) { return getDayDistance(d.label); },
	// 	values: [
	// 		{ "x": "1", "y": 100 },
	// 		{ "x": "2", "y": 50 },
	// 		{ "x": "3", "y": 0 },
	// 		{ "x": "4", "y": 50 },
	// 		{ "x": "5", "y": 55 },
	// 		{ "x": "6", "y": 19 },
	// 		{ "x": "7", "y": 44 },
	// 	]
	// },
	// {
	// 	key: 'Average',
	// 	type: 'line',
	// 	yAxis: 1,
	// 	values: [
	// 		{ "x": "1", "y": 50 },
	// 		{ "x": "2", "y": 25 },
	// 		{ "x": "3", "y": 0 },
	// 		{ "x": "4", "y": 25 },
	// 		{ "x": "5", "y": 26 },
	// 		{ "x": "6", "y": 9 },
	// 		{ "x": "7", "y": 22 }
	// 	]
	// }];
	// function getDayDistance(label){
	// 	return 50;
	// }
});

controllers.controller('RunningDaysController', function ($scope, $state, $stateParams, $ionicHistory, $ionicPopup, UserService) {
	$scope.user = UserService.current();
	$scope.athleteSummary = $stateParams.athleteSummary;
	$scope.stravaAthlete = $stateParams.stravaAthlete;
	$scope.errors = [];

	$scope.deactivateOtherDays = function(runningDay, days){
		days.forEach(function(item){
			if(item.day != runningDay.day){
				item.active = false;
			}
		});
	}
	
	$scope.next = function(){
		if(validate()){
			$state.go('app.performancePreferences', {
				athleteSummary:$scope.athleteSummary, 
				stravaAthlete:$scope.stravaAthlete
			});
		}else{
			$ionicPopup.alert({
				title: 'Validation',
				template: '<div ng-repeat="error in errors"><p>{{error}}</p></div>',
				scope: $scope,
				okType: 'button-calm'
			}).then(function(){
				$scope.errors = [];
			});
		}
	}
	
	function validate(){
		var runDays = $scope.athleteSummary.runDays.filter(function(item){return item.active == true;}).length;
		if(runDays < 3){
			$scope.errors.push('Select at least 3 running days');
		}
		
		var longRunDays = $scope.athleteSummary.longRunDays.filter(function(item){return item.active == true;}).length;
		if(longRunDays != 1){
			$scope.errors.push('Select a long run day');
		}
		
		return $scope.errors.length == 0;
	}
});

controllers.controller('PerformancePreferencesController', function ($scope, $state, $stateParams, $ionicHistory, UserService, Utilities) {
	$scope.user = UserService.current();
	$scope.athleteSummary = $stateParams.athleteSummary;
	$scope.stravaAthlete = $stateParams.stravaAthlete;
	$scope.paceUnit = '';

	var item = $scope.athleteSummary.bestScore.activity;

	$scope.activity = Utilities.prepareActivityForMap(item, {
		measurement_preference: $scope.stravaAthlete.measurement_preference
	});
	if($scope.stravaAthlete.measurement_preference == 'feet'){
		$scope.paceUnit = 'mile';
	}
	if($scope.stravaAthlete.measurement_preference == 'meters'){
		$scope.paceUnit = 'km';
	}

	$scope.format = function (seconds) {
		return moment.duration(seconds * 1000).format();
	}
});

controllers.controller('GoalPreferencesController', function ($scope, $state, $stateParams, $ionicHistory, $ionicModal, $ionicPopup, UserService, StravaService, ProgramService) {
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
		date: moment().day(7).add(6, 'weeks').toDate()
	};
	
	$scope.getElevationMeasurementUnit = function(){
		return $scope.stravaAthlete.measurement_preference;
	}
	
	$scope.getDistanceMeasurementUnit = function(){
		if($scope.stravaAthlete.measurement_preference == 'feet'){
			return 'miles';
		}
		if($scope.stravaAthlete.measurement_preference == 'meters'){
			return 'km';
		}
	}
	
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
	
	$scope.next = function(){
		if(validate()){
			return ProgramService.createProgram().then(function(result){
				return $state.go('app.current');
			}, function(error){
				return $state.go('app.error', {
					operation:'program-create',
					error:error
				});
			})
		}else{
			return $ionicPopup.alert({
				title: 'Validation',
				template: '<div ng-repeat="error in errors"><p>{{error}}</p></div>',
				scope: $scope,
				okType: 'button-calm'
			}).then(function(){
				$scope.errors = [];
			});
		}
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