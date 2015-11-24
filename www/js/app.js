// Ionic Starter App
var testAthlete = { "access_token": "e55e103f02dd289016c7b62fdbb64dde0b6761fd", "token_type": "Bearer", "athlete": { "id": 362235, "username": "ross_mcewan", "resource_state": 3, "firstname": "Ross", "lastname": "McEwan", "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/athletes/362235/226681/2/medium.jpg", "profile": "https://dgalywyr863hv.cloudfront.net/pictures/athletes/362235/226681/2/large.jpg", "city": "Cape Town", "state": "Western Cape", "country": "South Africa", "sex": "M", "friend": null, "follower": null, "premium": true, "created_at": "2012-04-01T18:24:33Z", "updated_at": "2015-07-25T11:52:48Z", "badge_type_id": 1, "follower_count": 141, "friend_count": 115, "mutual_friend_count": 0, "athlete_type": 1, "date_preference": "%m/%d/%Y", "measurement_preference": "meters", "email": "ross.mcewan@gmail.com", "ftp": null, "weight": 88, "clubs": [{ "id": 53380, "resource_state": 2, "name": "IRONMAN 2015 SA", "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/53380/1270975/1/medium.jpg", "profile": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/53380/1270975/1/large.jpg" }, { "id": 69476, "resource_state": 2, "name": "Ultra-trail Cape Town", "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/69476/1487768/4/medium.jpg", "profile": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/69476/1487768/4/large.jpg" }, { "id": 83211, "resource_state": 2, "name": "Amped 2 Race", "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/83211/1591737/2/medium.jpg", "profile": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/83211/1591737/2/large.jpg" }, { "id": 101708, "resource_state": 2, "name": "Cape Town Marathon 2014", "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/101708/1766183/1/medium.jpg", "profile": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/101708/1766183/1/large.jpg" }, { "id": 52550, "resource_state": 2, "name": "Comrades Buddy", "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/52550/1255611/1/medium.jpg", "profile": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/52550/1255611/1/large.jpg" }, { "id": 36869, "resource_state": 2, "name": "Comrades Marathon Runners", "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/36869/1016389/2/medium.jpg", "profile": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/36869/1016389/2/large.jpg" }, { "id": 118884, "resource_state": 2, "name": "Let's Ride!", "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/118884/2224883/1/medium.jpg", "profile": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/118884/2224883/1/large.jpg" }, { "id": 124125, "resource_state": 2, "name": "Green Point parkrun", "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/124125/2367838/1/medium.jpg", "profile": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/124125/2367838/1/large.jpg" }, { "id": 160918, "resource_state": 2, "name": "Ignite Cape Town ", "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/160918/3485566/1/medium.jpg", "profile": "https://dgalywyr863hv.cloudfront.net/pictures/clubs/160918/3485566/1/large.jpg" }], "bikes": [{ "id": "b627817", "primary": true, "name": "Cannondale SuperSix", "resource_state": 2, "distance": 8754944 }, { "id": "b1282046", "primary": false, "name": "Scott Spark 940", "resource_state": 2, "distance": 1106686 }], "shoes": [{ "id": "g123566", "primary": false, "name": "Brooks Glycerin  10 - Black & Red", "resource_state": 2, "distance": 780213 }, { "id": "g625851", "primary": false, "name": "Brooks Cascadia 10 (#1)", "resource_state": 2, "distance": 203747 }, { "id": "g626729", "primary": false, "name": "Brooks Glycerin 12 (#1)", "resource_state": 2, "distance": 839180 }, { "id": "g629745", "primary": false, "name": "Brooks Pureflow 3 (#1)", "resource_state": 2, "distance": 813015 }, { "id": "g733176", "primary": false, "name": "Brooks PureGrit 3 (#1)", "resource_state": 2, "distance": 398804 }, { "id": "g731894", "primary": true, "name": "Brooks Pureflow 4 (#1)", "resource_state": 2, "distance": 808126 }, { "id": "g821920", "primary": false, "name": "Brooks Pureflow 4 (#2)", "resource_state": 2, "distance": 564347 }] } };
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordovaOauth'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom");
    $stateProvider.state('connect', {
      url: '/connect',
      controller: 'ConnectController',
      templateUrl: 'templates/connect.html'
    }).state('app', {
      url: '/app',
      templateUrl: 'templates/menu.html',
      abstract: true
    }).state('app.welcome', {
      url: '/welcome',
      views: {
        menuContent: {
          controller: 'WelcomeController',
          templateUrl: 'templates/welcome.html'
        }
      }
    }).state('app.main', {
      url: '/main',
      views: {
        menuContent: {
          controller: 'MainController',
          templateUrl: 'templates/main.html'
        }
      }
    });
    $urlRouterProvider.otherwise('/connect');
  })
  .constant('StravaSettings', {
    clientId: '4290',
    clientSecret: 'fbea070c5dcd30b96e276bcd46f56b11c15e7a7e',
    appScope: ['view_private', 'write']
  })
  .value('StravaUser', {
    accessToken: '',
    athlete: {}
  })
  .controller('ConnectController', function ($scope, $state, StravaService, StravaUser) {
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
  })
  .controller('WelcomeController', function ($scope, $state, StravaService, StravaUser) {
    $scope.user = StravaUser;
  })
  .controller('MainController', function ($scope, $timeout, $state, $ionicTabsDelegate, StravaService, StravaUser) {
    $scope.user = StravaUser;
    $timeout(function () { $ionicTabsDelegate.select(1); });
    StravaService.getActivities().success(function(result){
      $scope.activities = result;
    })
  })
  .factory('StravaService', function ($q, $http, $cordovaOauth, StravaSettings, StravaUser) {
    return {
      connect: function () {
        return $q(function (resolve, reject) {
          resolve(testAthlete);
        });
        //return $cordovaOauth.strava(StravaSettings.clientId, StravaSettings.clientSecret, StravaSettings.appScope);
      },
      getActivities: function () {
        return $http.jsonp('https://www.strava.com/api/v3/athlete/activities?callback=JSON_CALLBACK&access_token='+StravaUser.accessToken);
      }
    }
  })

