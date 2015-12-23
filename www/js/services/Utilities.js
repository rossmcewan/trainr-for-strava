var services = angular.module('services.utility', []);

services.factory('Utilities', function(){
	return {
		prepareActivityForMap:function(item, options){
			var result = {
				title: item.name,
				start: item.start_date_local,
				startTime: new Date(item.start_date_local),
				endTime: moment(item.start_date_local).add(item.elapsed_time, 'seconds').toDate(),
				activity: item,
				humanizedAgo: moment.duration(moment().diff(item.start_date_local)).humanize(),
				formattedStartDate: moment(item.start_date_local).format('HH:mm:ss on ddd, MMMM DD, YYYY'),
				formattedMovingTime: moment.utc(item.moving_time * 1000).format('HH:mm:ss'),
				map: {
					center: {
						latitude: item.start_latlng[0],
						longitude: item.start_latlng[1]
					},
					zoom: 12,
					polyline: polyline.decode(item.map.summary_polyline)
				}
			}
			if(options.measurement_preference == 'feet'){
				result.formattedDistance = math.eval(item.distance + ' feet in miles').toString();
				result.formattedAveragePace = moment.utc((88 / item.average_speed) * 60 * 1000).format('mm:ss') + ' /mile';
			}
			if(options.measurement_preference == 'meters'){
				result.formattedDistance = math.eval(item.distance + ' meters in km').toString();
				result.formattedAveragePace = moment.utc((16.666667 / item.average_speed) * 60 * 1000).format('mm:ss') + ' /km';
			}
			return result;
		}
	}
});