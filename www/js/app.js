// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic.service.core', 'ngCordovaOauth', 'ui.rCalendar', 'ngMap', 'nvd3', 'angular-svg-round-progress', 'angular-md5', 'services', 'controllers', 'controllers.connect'])
  .run(function ($ionicPlatform, $state) {
    Ionic.io();
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
    $state.go('connect');
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
    }).state('app.main', {
      url: '/main',
      views: {
        menuContent: {
          controller: 'MainController'
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
    }).state('app.new', {
      url:'/new-program',
      views:{
        menuContent:{
          controller:'NewProgramController',
          templateUrl:'templates/new-program.html'
        }
      },
      resolve:{
        athleteSummary:function(AthleteService){
          return AthleteService.getAthleteSummary();
        }
      }
    }).state('app.runningPreferences', {
      url:'/running-preferences',
      views:{
        menuContent:{
          controller:'RunningPreferencesController',
          templateUrl:'templates/running-preferences.html'
        }
      },
      params:{
        athleteSummary:null
      }
    }).state('app.performancePreferences', {
      url:'/performance-preferences',
      views:{
        menuContent:{
          controller:'PerformancePreferencesController',
          templateUrl:'templates/performance-preferences.html'
        }
      },
      params:{
        athleteSummary:null
      }
    }).state('app.goalPreferences', {
      url:'/goal-preferences',
      views:{
        menuContent:{
          controller:'GoalPreferencesController',
          templateUrl:'templates/goal-preferences.html'
        }
      },
      params:{
        athleteSummary:null
      }
    }).state('app.current', {
      url:'/current-program',
      views:{
        menuContent:{
          controller:'CurrentProgramController',
          templateUrl:'templates/current-program.html'
        }
      }
    }).state('app.error', {
      url:'/error',
      views:{
        menuContent:{
          templateUrl:'templates/error.html'
        }
      }
    });
    //$urlRouterProvider.otherwise('/connect');
  })
  .constant('StravaSettings', {
    clientId: '4290',
    clientSecret: 'fbea070c5dcd30b96e276bcd46f56b11c15e7a7e',
    appScope: ['view_private', 'write']
  });

