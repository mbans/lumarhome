budgetApp.controller('HomeAutoController', ['$scope','uiGridConstants','$http', '$window',
						function($scope, uiGridConstants, $http, $window) {
		
   //All the devices (from config)
   $scope.allRegisteredDevices = {}  
   $scope.bulbs=[]
   $scope.deviceStates = {}
   $scope.devices = {} 
   $scope.discoveringDevices=true;
   $scope.currentScene=""
   
   //Turns all lights in a given room on/off
   $scope.toggleRoom = function(roomName, toggleValue) {
		console.log("Turning all lights in living room " + toggleValue)	
		
		angular.forEach($scope.roomConfig, function(room, idx){
			if(room.name == roomName) {
				lights = room.lights;
				
				angular.forEach(lights, function(light, lightIdx){
					$scope.toggleLight(light.name, toggleValue, light.type);
					console.log("Turning light light " + light.name + " toggleValue");
				});
			}
		});
   }
   
   //Sets a given 
   $scope.setScene = function(scene) {
	   sceneName = scene['name']
	   lights = scene['lights']
	   for(i=0; i < lights.length; i++) {
		   lightName = lights[i].name;
		   hue = lights[i].hue;
		   $scope.setHue(lightName, hue)
	   }
	   console.log("Just set Scene " + sceneName)
	   $scope.currentScene = sceneName
   }
   
   $scope.setHue = function(lightName, value) {
	   console.log("Setting " + lightName + " hue to" + value)
		$http({
		    url: "http://61.10.133.31:5000/bulbs/"+lightName+"/hue/" + value,
		    method: 'GET',
		}).then(function (response) {
			console.log("Set hue on" + lightName + " to " + value)
		});
   }
	   
   $scope.toggleLight = function(lightName, toggleValue, type) {
		value="off"
		if(toggleValue) {
			value="on"
		}
		
		console.log("Attempting to switch " + lightName + " " + toggleValue)

		//An IFTTT controlled light
		if (type == "ifttt") {
			$scope.ifttt(lightName + "_" + value);
			$scope.deviceStates[lightName] = toggleValue
			return
		}
		
		//Non-IFTTT controlled (YeeLight)
		$http({
		    url: "http://61.10.133.31:5000/bulbs/"+lightName+"/power/" + value,
		    method: 'GET',
		}).then(function (response) {
			$scope.deviceStates[lightName] = toggleValue
		});
	}
	
	$scope.ifttt= function(service) {
		console.log("Calling ifttt " + service);
		$http({
		    url: '/ifttt/' + service,
		    method: 'GET',
		}).then(function successCallback(response) {
			console.log("Succesfully called ifttt service "+ service + " response="+ JSON.stringify(response));
			$scope.iftttRunninge=false;
			$scope.iftttSuccess=true;
			$scope.iftttFailure=false;
			
		}, function errorCallback(response) {
			console.log("Error calling ifttt service "+ service + ", " + JSON.stringify(response));
			$scope.iftttFailureMessage=JSON.stringify(response);
		});
	}	
	
	$scope.isDiscovered = function(deviceName) {
		console.log("Checking for " + deviceName)
		
		device = $scope.allRegisteredDevices[deviceName]
		
		//Check if it is discoverable 
		isDiscoverable = device['discoverable'] 
		
		//Check if it is discoverable and has not been discovered
		if(!isDiscoverable) {
			return false;
		}
		
		//Check if we have discovered it
		state = $scope.deviceStates[deviceName] 
			
		return !(state == undefined || state == null) 
	}
	
	//Make the call to the 'device-controller' to grab status of bulbs and switches
	
	$scope.discoverSwitches = function () {
		//Reset the status of the devices
		$scope.deviceStates={}
		$scope.devices={}
		
		//In process of discovering
		$scope.discoveringSwitches=true;
		
		console.log("Discovering switches...")
		$http({ 
				url    : 'http://61.10.133.31:4000/switches',
				method : 'GET',
			  }).
		then(function successCallback(success) {
				callback()
				$scope.switches = success.data
				console.log("Discovered Switches" + $scope.switches.length  + " switches")
			
				for (i=0; i < $scope.switches.length; i++) {
					currentSwitch = $scope.switches[i]
					state 		  = $scope.switches[i]['state']
					name    = $scope.switches[i]['name']
					
					statusBool = false 
					if (status == "on") {
						statusBool = true
					}
					console.log(deviceName +" " + statusBool)
					$scope.deviceStates[deviceName] = statusBool
					$scope.devices[deviceName] = ""
				}
		},
		function errorCallback(error) {
			console.log("Error = " + JSON.stringify(error))
		});
	}
	
	$scope.discoverBulbs = function() {
		//Reset the status of the devices
		$scope.deviceStates={}
		$scope.devices={}
		
		//In process of discovering
		$scope.discoveringDevices=true;
		
		console.log("Discovering bulbs...")
		$http({ 
//				url    : 'http://61.10.133.31:5000/bulbs',
				url    : 'http://61.10.133.31:4000/bulbs',
				method : 'GET',
			  }).
		then(function successCallback(success) {
				callback()
				$scope.bulbs = success.data.data
				console.log("Discovered bulbs" + $scope.bulbs.length  + " bulbs")
			
				for (i=0; i < $scope.bulbs.length; i++) {
					currentBulb = $scope.bulbs[i]
					status = $scope.bulbs[i]['powerStatus']
					deviceName   = $scope.bulbs[i]['name']
					
					statusBool = false 
					if (status == "on") {
						statusBool = true
					}
					console.log(deviceName +" " + statusBool)
					$scope.deviceStates[deviceName] = statusBool
					$scope.devices[deviceName] = ""
				}
		},
		function errorCallback(error) {
			console.log("Error = " + JSON.stringify(error))
		});
	};
	
	angular.element(function() {
		console.log("Page load complete...discovering devices")
		$scope.initialise();
	});
	
	
	$scope.initialise = function() {
		register();
		$scope.discoveringDevices=true
		$scope.discoverDevices(function() {
			$scope.discoveringDevices=false;
		})
		
		$scope.discoverSwitches(function() {
			$scope.discoveringDevices=false;
		})
		
		
	};
	
	function register() {
		for(i=0; i< $scope.roomConfig.length; i++) {
			lights = ($scope.roomConfig[i])['lights']
			
			if(lights == undefined) {
				console.log("No lights defined for " + config['name'])
				continue
			}
			
			for (j=0; j < lights.length; j++) {
				currentLightName = (lights[j])['name']
				console.log("Adding " + currentLightName)
				$scope.allRegisteredDevices[currentLightName] = lights[j]
			}
		}
	}
	
	
	//Scene Config
	$scope.scenes = [   {"name" : "Movies", 
		   				 "lights" : [{"name" : "livingroom_biglight"    , "hue" : "180"},
		   					 		 {"name" : "livingroom_littlelight" , "hue" : "180"},
 		    					 	 {"name" : "thai_lamp"				, "hue" : "180"}]
		   				},
		   			
		   				{"name" : "Date", 
			   			 "lights" : [{"name" : "livingroom_biglight",    "hue" : "300"},
			   				         {"name" : "livingroom_littlelight", "hue" : "300"},
			   			 			 {"name" : "thai_lamp", 			 "hue" : "300"}]
		   				},
		   				
		   				{"name" : "Ambient", 
				   			 "lights" : [{"name" : "livingroom_biglight",    "hue" : "30"},
				   				         {"name" : "livingroom_littlelight", "hue" : "30"},
				   			 			 {"name" : "thai_lamp", 			 "hue" : "30"}]
		   				},

		   				{"name" : "Dinner", 
				   			 "lights" : [{"name" : "livingroom_biglight",    "hue" : "40"},
				   				         {"name" : "livingroom_littlelight", "hue" : "40"},
				   			 			 {"name" : "thai_lamp", 			 "hue" : "40"}]
		   				},
		   					
		   				{"name" : "Irish", 
				   			 "lights" : [{"name" : "livingroom_biglight",    "hue" : "150"},
				   				         {"name" : "livingroom_littlelight", "hue" : "150"},
				   			 			 {"name" : "thai_lamp", 			 "hue" : "150"}]
		   				}
		   			]
	
	// Constant config - there needs to be a page that allows user to configure this from UI 
	// and save down into mongo or something
	$scope.roomConfig = 
   	 	[
   	 	{ "name"   : "livingroom",
   	 	   "title"  :  "LIVING ROOM",
   	 	   "lights" : [ {"displayName": "Big Light"		, "name" : "livingroom_biglight", "discoverable" : "true", "type" : "yeelight"}, 
						{"displayName": "Little Light"	, "name" : "livingroom_littlelight", "discoverable" : "true", "type" : "yeelight"},
						{"displayName": "Thai Light"	, "name" : "thai_lamp", "discoverable" : "true", "type" : "yeelight"},
						{"displayName": "Fairy Lights"	, "name" : "fairy_lights", "type" : "ifttt", "type" : "switch"},
						{"displayName": "The LEDs"		, "name" : "leds", "type" : "ifttt", "type" : "switch"}
					  ],
   		   "image"  : "static/img/living_room50pc.png"
		}
		,

		{ "name"   : "bedoorm",
   	 	   "title"  :  "BEDROOM",
   	 	   "lights" : [ {"displayName": "Martin's Lamp"		, "name" : "bedroom_martin", "discoverable" : "true", "type" : "yeelight"}, 
						{"displayName": "Lucy's Light"	, "name" : "bedroom_lucy", "discoverable" : "true", "type" : "yeelight", "type" : "yeelight"}],
   		   "sceneLabel" : "Bedroom Scene",
   		   "sceneName"  : "bedroom_scene",
   		   "scenes" : ["Barry-White"],
   		   "image"  : "static/img/bedroom50pc.png"
		},
		
		
		{ "name"   : "office",
   	 	   "title"  :  "OFFICE",
   	 	   "lights" : [ {"displayName": "Office Light", "name" : "office", "discoverable" : "true", "type" : "yeelight"}],
   		   "image"  : "static/img/spare_room50pc.png"
		},
		
		{ 
		   "name"   : "benedict_room",
   	 	   "title"  :  "BENEDICT's ROOM",
   	 	   "lights" : [ {"displayName": "B's wee light", "name" : "yeelight_bluetooth_lamp", "type" : "ifttt", "discoverable" : "false", "type" : "switch"}],
   		   "image"  : "static/img/benedict_room.png"
		}
		,
		
		{ 
		   "name"     : "home_appliances",
   	 	   "title"    :  "HOUSEHOLD APPLIANCES",
   	 	   "lights" : [ 
   	 	   				{"img" : "static/img/dehumidifier.png"	, "displayName": "Dehumidifier", "name" : "dehumidifier", "type" : "ifttt", "device_type" : "tplink_switch", "discoverable" : "false", "type" : "switch"},
   	 	   				{"img" : "static/img/oven.png"			, "displayName": "The Oven"	   , "name" : "oven", 		  "type" : "ifttt", "device_type" : "tplink_switch", "discoverable" : "false", "type" : "switch"}
   	 	   			  ],
   		   "image"    : "static/img/appliances.png"
		}
	]
}]);	
