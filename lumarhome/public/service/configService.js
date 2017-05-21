budgetApp.service('configService', 
//Dependancies		
['$http', 
	
	function($http) {
		this.saveDeviceConfig = function(config, callback) {
			var json =  JSON.stringify(config);
			console.log("Attempting to save config " + json);
			callback();
		};
		
		//
		// Inserts/
		//
		this.saveRoomConfig = function(roomConfig, callback) { 
			var newConfig = (roomConfig._id == undefined || roomConfig._id == null)
			var methodType= "PUT";
			
			var theUrl = "/roomconfig/"+roomConfig._id;
			if(newConfig) {
				theUrl = "/roomconfig";
				methodType = "POST"
			}
				
			console.log("Saving RoomConfig, methodType="+methodType);
			$http({
				url: theUrl,
			    method: methodType,
				data: roomConfig
			}).then(function (response) {
				callback();
			});
		};
		
		
		//
		// Deletes Device from DB
		//
		this.deleteDeviceConfig = function(config, callback) {
			var json =  JSON.stringify(config);
			console.log("Attempting to delete config " + json);
			callback();
		};
	
		//Retrieve config from the database
		this.loadConfig = function(callback) {
			$http({
				url: "/conf",
			    method: 'GET',
			}).then(function (response) {
				console.log("Retrieved config");
				callback(response.data);
			});
		};
		
		
	}

]);