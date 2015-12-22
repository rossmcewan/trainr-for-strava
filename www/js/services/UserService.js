var services = angular.module('services.user', []);

services.factory('UserService', function ($q, $http, md5, IonicUser) {
	return {
		current: function(){
			var currentUser = Parse.User.current();
			if(!currentUser) return null;
			return {
				accessToken:currentUser.get('stravaAccessToken'),
				username:currentUser.get('username'),
				email:currentUser.get('email'),
				firstname:currentUser.get('firstname'),
				lastname:currentUser.get('lastname'),
				image:currentUser.get('image')
			}
		},
		logout:function(){
			console.log('logging out');
			return Parse.User.logOut();
		},
		login: function (stravaConnect) {
			var username = stravaConnect.athlete.id.toString();
			var password = md5.createHash(username);
			return Parse.User.logIn(username, password).then(function (user) {
				return IonicUser.onLogin(user).then(function (ionicUser) {
					return $q(function (resolve, reject) {
						return resolve(user);
					});
				});
			}, function (error) {
				if(error.code == 101){
					var user = new Parse.User();
					user.set('username', username);
					user.set('password', password);
					user.set('email', stravaConnect.athlete.email);
					user.set('firstname', stravaConnect.athlete.firstname);
					user.set('lastname', stravaConnect.athlete.lastname);
					user.set('image', stravaConnect.athlete.profile);
					user.set('stravaAccessToken', stravaConnect.access_token);
					
					return user.signUp(null).then(function(user){
						return IonicUser.onSignUp(user).then(function(ionicUser){
							return $q(function(resolve, reject){
								return resolve(user);
							});
						});
					}, function(error){
						return $q(function(resolve, reject){
							return reject(error);
						});
					});
				}
			})
		}
	}
});