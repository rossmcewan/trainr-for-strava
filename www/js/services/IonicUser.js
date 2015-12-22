var services = angular.module('services.ionic.user', []);

services.factory('IonicUser', function () {
	return {
		onLogin: function (user) {
			var ionicUser = Ionic.User.current();
			if (!ionicUser.id) {
				ionicUser.id = user.get('username');
			}
			return ionicUser.save();
		},
		onSignUp: function (user) {
			var ionicUser = Ionic.User.current();
			if (!ionicUser.id) {
				ionicUser.id = user.get('username');
			}
			return ionicUser.save();
		}
	}
});