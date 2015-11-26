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

controllers.controller('ActivityController', function(){
	
});

controllers.controller('MainController', function ($scope, $timeout, $state, $ionicTabsDelegate, StravaService, StravaUser) {
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
				formattedStartDate:moment(item.start_date_local).format('HH:mm:ss on ddd, MMMM DD, YYYY'),
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
		// $scope.model.runs = runs;
	});
});