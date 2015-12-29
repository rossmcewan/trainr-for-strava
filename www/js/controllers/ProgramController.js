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
});

controllers.controller('RunningDaysController', function ($scope, $state, $stateParams, $ionicHistory, $ionicPopup, UserService, AthleteService) {
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
			AthleteService.saveRunningPreferences({
				runDays:$scope.athleteSummary.runDays,
				longRunDays:$scope.athleteSummary.longRunDays
			}).then(function(saved){
				$state.go('app.performancePreferences', {
					athleteSummary:$scope.athleteSummary, 
					stravaAthlete:$scope.stravaAthlete
				});
			}, function(error){
				return $state.go('app.error');
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
	$scope.errors = [];
	
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
		date: moment().day(7).add(6, 'weeks').toDate(),
		elevation: 0
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
		var distanceMeasurement = $scope.getDistanceMeasurementUnit();
		var distance;
		if(distanceMeasurement == 'miles'){
			distance = getValue(math.eval($scope.goal.distance + ' miles in meters'));
		}else{
			distance = getValue(math.eval($scope.goal.distance + ' km in meters'));
		}
		if(validate()){
			var goalDate = moment($scope.goal.date);
			return ProgramService.createProgram({
				goal:{
					distance:distance,
					elevation:getValue(math.eval($scope.goal.elevation + ' ' + $scope.stravaAthlete.measurement_preference + ' in meters')),
					date:{
						year:goalDate.format('YYYY'),
						month:goalDate.format('MM'),
						day:goalDate.format('DD')
					},
					routeId:$scope.goal.route&&$scope.goal.route.id
				},
				today:{
					year:moment().format('YYYY'),
					month:moment().format('MM'),
					day:moment().format('DD')
				}
			}).then(function(result){
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
	
	function validate(){
		var distanceMeasurement = $scope.getDistanceMeasurementUnit();
		var goalDate = moment($scope.goal.date);
		var today = moment();
		var diff = Math.abs(today.diff(goalDate, 'weeks'));
		if(diff < 6){
			$scope.errors.push('Your goal must be more than 6 weeks away');
		}
		if(diff > 24){
			$scope.errors.push('Your goal must be less than 24 weeks away');
		}
		if(!$scope.goal.distance){
			$scope.errors.push('Please enter a goal distance');
		}
		if($scope.goal.distance < 0){
			$scope.errors.push('Your goal distance must be more than zero');
		}
		if(getValue(math.eval($scope.goal.distance + ' ' + distanceMeasurement + ' in meters')) > 160934){
			if(distanceMeasurement == 'miles'){
				$scope.errors.push('Your goal distance must be less than 100 miles');
			}else{
				$scope.errors.push('Your goal distance must be less than 160.934 km');
			}
		}
		if(!$scope.goal.elevation){
			$scope.errors.push('Please enter a goal elevation');
		}
		if(getValue(math.eval($scope.goal.elevation + ' ' + $scope.stravaAthlete.measurement_preference + ' in meters')) > 8000){
			if($scope.stravaAthlete.measurement_preference == 'feet'){
				$scope.errors.push('Your goal elevation must be less than 26246.72 feet');
			}else{
				$scope.errors.push('Your goal elevation must be less than 8000 meters');
			}
		}
		return $scope.errors.length == 0;
	}
});

controllers.controller('RouteController', function($scope){
	$scope.selectRoute = function(route){
		$scope.goal.route = route;
		$scope.goal.distance = route.calculatedDistance;
		$scope.goal.elevation = parseFloat(route.elevation_gain.toFixed(2));
		$scope.modal.hide();
	}
});

controllers.controller('CurrentProgramController', function ($scope, $state, $stateParams, $ionicHistory, UserService) {
	$scope.program = $stateParams.currentProgram;
	$scope.user = UserService.current();
	console.log($stateParams.currentProgram);
});

function getValue(mathval) {
  return parseFloat(JSON.parse(JSON.stringify(mathval)).value.toFixed(2));
}