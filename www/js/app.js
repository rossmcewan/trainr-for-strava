// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordovaOauth', 'ui.rCalendar', 'ngMap', 'nvd3', 'angular-md5', 'services', 'controllers'])
  .run(function ($ionicPlatform, $state, StravaUser) {
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
    Parse.initialize('GvT1P7jCNYp5yeO1C4bxGDRqooq5lhpvcBk1stOI', 'R6YNsm8x8cNdvNmb7Ru1cxgyvqjcsMXAcKrEaOXe');
    var currentUser = Parse.User.current();

    if (currentUser) {
      StravaUser.user = currentUser;
      StravaUser.athlete = currentUser.get('athlete');
      StravaUser.accessToken = currentUser.get('stravaAccessToken');
      $state.go('app.main');
    }else{
      $state.go('connect');
    }
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
    }).state('app.activity', {
      url: '/activity',
      views: {
        menuContent: {
          controller: 'ActivityController',
          templateUrl: 'templates/activity.html'
        }
      },
      params: { activity: null }
    });
    //$urlRouterProvider.otherwise('/connect');
  })
  .constant('StravaSettings', {
    clientId: '4290',
    clientSecret: 'fbea070c5dcd30b96e276bcd46f56b11c15e7a7e',
    appScope: ['view_private', 'write']
  })
  .value('StravaUser', {
    accessToken: '',
    athlete: {},
  });

