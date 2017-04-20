budgetApp.service('configService', 
//Dependancies		
['$http', 
	
	function($http) {
		this.saveDeviceConfig = function(config, callback) {
			var json =  JSON.stringify(config);
			console.log("Attempting to save config " + json)
			callback()
		}
		
		this.deleteDeviceConfig = function(config, callback) {
			var json =  JSON.stringify(config);
			console.log("Attempting to delete config " + json)
			callback()
		}
	
		//Retrieve config from the database
		this.loadConfig = function(callback) {
			$http({
				url: "/conf",
			    method: 'GET',
			}).then(function (response) {
				console.log("Retrieved config")
				callback(response.data)
			});
		}
		
		
	}

]);