//Iterates through a map where key=<deviceName> value=<true|false>
//Returns - JSON array for each key/value where value is TRUE, in the form {"name":<deviceName>}
budgetApp.filter('selectedDeviceFilter', function() {
	return function(deviceMap) {
		var toReturn = [];
		for (var deviceName in deviceMap) {
			if(deviceMap[deviceName]) {
				var device = {};
				device.name 			= deviceName;
				device.displayName 		= deviceName;
				toReturn.push(device);
			}
		}
		return toReturn;
	};
});