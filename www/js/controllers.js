var controllers = angular.module('controllers', []);

controllers.controller('ConnectController', function ($scope, $state, StravaService, StravaUser) {
    $scope.connect = function () {
		StravaService.connect().then(function (result) {
			console.log(result);
			StravaUser.accessToken = result.access_token;
			StravaUser.athlete = result.athlete;
			$state.go('app.main');
		}, function (error) {
			console.log(error);
			alert('Error: ' + error);
		});
    }
});

controllers.controller('WelcomeController', function ($scope, $state, StravaService, StravaUser) {
	$scope.user = StravaUser;
});

controllers.controller('ActivityController', function($scope, $state, $stateParams, StravaService, StravaUser){
	$scope.user = StravaUser;
	$scope.activity = $stateParams.activity;
	StravaService.getActivity($scope.activity.activity.id).success(function(result){
		$scope.fullActivity = result;
		$scope.fullActivity.segment_efforts.forEach(function(segment){
			segment.formattedDistance = (segment.distance/1000).toFixed(2)+' km';
			segment.formattedElapsedTime = moment.utc(segment.elapsed_time*1000).format('HH:mm:ss');
			segment.formattedPace = moment.utc((16.666667/(segment.distance/segment.elapsed_time))*60*1000).format('mm:ss')+' /km';
			segment.inTop10 = segment.kom_rank && segment.kom_rank < 11;
		});
	});
});

controllers.controller('MainController', function ($scope, $interval, $state, $timeout, $ionicTabsDelegate, StravaService, StravaUser, NgMap) {
	$scope.chart = {};
	$scope.options = {
		chart: {
			type: 'discreteBarChart',
			height: 50,
			width:100,
			margin : {
				top: 0,
				right: 0,
				bottom: 0,
				left: 10
			},
			color:function(d,i){
				return 'green';	
			},
			refreshDataOnly:true,
			deepWatchData:true,
			x: function(d){ return d.label; },
			y: function(d){ return getDayDistance(d.label); },
			showValues: true,
			// valueFormat: function(d){
			// 	return d3.format(',.4f')(d);
			// },
			transitionDuration: 500,
			showXAxis:false,
			showYAxis:false,
			showValues:false
		}
	};
	$scope.data = [{
		key: "This weeks distance",
		values: [
			{ "label" : "Mon" , "value" : 0 },
			{ "label" : "Tue" , "value" : 0 },
			{ "label" : "Wed" , "value" : 0 },
			{ "label" : "Thu" , "value" : 0 },
			{ "label" : "Fri" , "value" : 0 },
			{ "label" : "Sat" , "value" : 0 },
			{ "label" : "Sun" , "value" : 0 },
		]
	}];
	function getDayDistance(day){
		return $scope.distances[day];
	}
	$scope.distances = {
		'Mon':0,
		'Tue':0,
		'Wed':0,
		'Thu':0,
		'Fri':0,
		'Sat':0,
		'Sun':0
	}
	$scope.user = StravaUser;
	$scope.title = 'Feed';
	$timeout(function () { 
		$ionicTabsDelegate.select(1); 
	});
	var runs = [];
	$scope.model = {
		runs: []
	};
	$scope.onEventSelected = function(event){
		$scope.model.selectedRun = event;
	}
	$scope.runs = [];
	$scope.calendar = {};
	$scope.eventSources = [runs];
	$scope.uiConfig = {
      calendar:{
        editable: true,
        header:{
          left: 'month basicWeek basicDay',
          center: 'title',
          right: 'prev,next'
        },
		firstDay:1
      }
    };
	$scope.setTitle = function(title){
		$scope.title = title;
	};
	StravaService.getActivities().success(function (result) {
		$scope.activities = result;
		result.filter(function (item) {
			return item.type == 'Run';
		}).forEach(function(item){
			var x = {
				title:item.name,
				start:item.start_date_local,
				startTime:new Date(item.start_date_local),
				endTime:moment(item.start_date_local).add(item.elapsed_time, 'seconds').toDate(),
				activity:item,
				humanizedAgo:moment.duration(moment().diff(item.start_date_local)).humanize(),
				formattedStartDate:moment(item.start_date_local).format('HH:mm:ss on ddd, MMMM DD, YYYY'),
				formattedMovingTime:moment.utc(item.moving_time*1000).format('HH:mm:ss'),
				formattedDistance:(item.distance/1000).toFixed(2)+' km',
				formattedAveragePace:moment.utc((16.666667/item.average_speed)*60*1000).format('mm:ss')+' /km',
				map:{
					center: {
						latitude:item.start_latlng[0],
						longitude:item.end_latlng[1]
					},
					zoom:12,
					polyline:polyline.decode(item.map.summary_polyline)
				}
			}
			$scope.model.runs.push(x);
		});
		//first need to find the dates of each day
		var dayIndex = 1;
		var byDay = _.groupBy($scope.model.runs, function(item){
			return moment(item.activity.start_date_local).startOf('day').toDate().toString()
		})
		var totalDistance = 0;
		for(var prop in $scope.distances){
			var date = moment().day(dayIndex++).startOf('day').toDate().toString();
			var total = _.sum(byDay[date], function(item){
				return item.activity.distance;
			});
			$scope.distances[prop] = total/1000;
			totalDistance += (total/1000);
		}
		$scope.distanceThisWeek = totalDistance.toFixed(1);
		$scope.plannedDistanceThisWeek = 90;
		$scope.chart.api.refresh();
	});
});