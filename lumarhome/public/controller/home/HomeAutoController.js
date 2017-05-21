budgetApp.controller('HomeAutoController', ['$scope','uiGridConstants','$http', '$window', '$uibModal', 'configService',
						function($scope, uiGridConstants, $http, $window, $uibModal, configService) {
	  
  //The current state of all our devices, this is required in order to 
  //maintain the correct toggle states on the buttons
  $scope.deviceStates = {};

   //Are we currently discovering devices
   $scope.discoveringDevices=true;

   //Currently selected scene
   $scope.currentScene=""

   $scope.offlineDevices=[];
    
   //The actual device resource, with state etc   
   $scope.devices=[];
   
   //Our configuration
   $scope.deviceConfig=[];
   $scope.roomConfig=[];
   $scope.sceneConfig=[]
   
  //////////////////////////////////////////////////////////////////////////////////////////////////////////// 
   
   //Discovered Devices  
//   $scope.discoveredDevicesColDefs = [
//	     	{ name: 'id', 	    width: '15%', displayName: 'Id'},
//		    { name: 'name', 	enableCellEdit: true, enableCellEditOnFocus:true, width: '15%', displayName: 'Name'},
//	        { name: 'type', 	width: '10%', displayName: 'Type'},
//	        { name: 'state',    width: '10%', displayName: 'State'},
//	        { name: 'Toggle',   width: '10%', cellTemplate: '<center><button ng-click="grid.appScope.toggleDevice(row.entity.name)">Toggle</button></center>'}
//	];
   
    //Device Config
    $scope.columnDefs = [
	        { name: 'name', 	enableCellEdit: true, enableCellEditOnFocus:true, width: '20%', displayName: 'Name'},
	        { name: 'type', 	width: '20%', displayName: 'Type'},
	        { name: 'state',    width: '20%', displayName: 'State'},
	        { name: 'Update',   width: '20%', cellTemplate: '<center><button ng-click="grid.appScope.saveDeviceConfig(row.entity)">Update</button></center>'},
	        { name: 'Delete',   width: '20%', cellTemplate: '<center><button ng-click="grid.appScope.deleteDeviceConfig(row.entity)">Delete</button></center>'}
	];

    //RoomConfig
	$scope.roomConfigColumnDefs = [
		{ name: 'title', width: '75%', displayName: 'Room Name'},
		{ name: 'edit', width: '25%',cellTemplate: '<center><div ng-click="grid.appScope.viewRoomConfig(row.entity)">Edit</div></center>'}
	];	
	
	//Scene Config
	
   //Grid Options
//   $scope.discoveredDevicesGridOptions  = {data :[], columnDefs: $scope.discoveredDevicesColDefs}
   $scope.gridOptions 				    = {data :[], columnDefs: $scope.columnDefs, enableCellEditOnFocus : true}
   $scope.roomConfigGridOptions 		= {data :[], columnDefs: $scope.roomConfigColumnDefs}

   $scope.saveDeviceConfig = function(deviceConfig) {
		configService.saveDeviceConfig(deviceConfig, 
			function() {
			}
		);
	}
   
   //
   // Invoked from UI for adding a room config
   //
//   $scope.addRoomConfig = function() {
//		configService.addRoomConfig(deviceConfig, 
//			function(newRoomConfig) {
//				$scope.roomConfig.push(newRoomConfig);
//			}
//		);
//	}
   
	
	//User clicks on 'Delete Config' 
	$scope.deleteDeviceConfig = function(deviceConfig) {
		configService.deleteDeviceConfig(deviceConfig, 
				//callback
				function() {
					var index = $scope.gridOptions.data.indexOf(deviceConfig);
					$scope.gridOptions.data.splice(index, 1);
				}
		);
	}

   //Turns all lights in a given room on/off
   $scope.toggleRoom = function(roomName, toggleValue) {
		console.log("Turning all lights in living room " + toggleValue)	
		
		angular.forEach($scope.roomConfig, function(room, idx){
			if(room.name == roomName) {
				lights = room.lights;
				
				angular.forEach(lights, function(light, lightIdx){
					$scope.toggleLight(light, toggleValue);
					console.log("Turning light light " + light.name + " toggleValue");
				});
			}
		});
   }
     
   //
   // Select a given scene
   //
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
   
   
   //
   // Set Hue for lights
   //
   $scope.setHue = function(lightName, value) {
	   console.log("Setting " + lightName + " hue to" + value)
	   $http({
		    url: LUMARHOME_DEVICE_CONTROLLER + "/devices/"+lightName+"/hue/" + value,
		    method: 'GET',
		}).then(function (response) {
		});
   }
   
   
   $scope.getDevice = function(deviceName) { 
	   for(var i=0; i<$scope.devices.length; i++) {
		   device=$scope.devices[i];
		   if(device.name == deviceName) {
			   //Always set the state of the device;
			   return device;
		   }
	   }
	   throw "No device named " + deviceName;
   }
   
   //
   // Toggle a device on and off 
   //
   $scope.toggleDevice = function(deviceName) {
	   	
	   	device = $scope.getDevice(deviceName)
	   
	    currentState=device.state
	    
	    //Toggle power on/off
	    powerUrl=LUMARHOME_DEVICE_CONTROLLER + device.capabilities.power_on
	    if(currentState == "on") {
		    powerUrl=LUMARHOME_DEVICE_CONTROLLER + device.capabilities.power_off
		}
		
		console.log("Calling " + powerUrl);
		
		//Make the call
		$http({
		    url: powerUrl, 
		    method: 'GET',
		}).then(function (response) {
			//Update the devices list with the new status
			newDevice=response.data.data
			for(i=0; i< $scope.devices.length; i++) {
				if($scope.devices[i]['name'] == device.name) {
					$scope.devices[i] = newDevice
				}
			}
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
	
	//
	// Retrieve all registered devices
	//
	$scope.discoverDevices = function(callback) {
		$scope.deviceStates={};
		$scope.devices=[];
		
		//In process of discovering
		$scope.discoveringDevices=true;
		console.log("Discovering devices")
		$http({ 
				url    :  LUMARHOME_DEVICE_CONTROLLER + "/devices",
				method : 'GET',
			  }).
		then(function successCallback(success) {
			console.log("Discovered " + $scope.devices.length + " devices");
			$scope.devices = success.data.data;
			
			//Reset the status of all the buttons based on the config just loaded (as it contains the current status)
			$scope.setDeviceState();
			$scope.detectProblemDevices();
			$scope.discoveringDevices=false;
			callback();
		},
		
		function errorCallback(error) {
			$scope.discoveringDevices=false;
		});
	};
	
	
	
	$scope.setDeviceState = function() {		
		for (i=0; i < $scope.devices.length; i++) {
			device = $scope.devices[i];
			deviceName   = device['name'];
			state = device['state'];
			//Status
			
			stateBool = false;
			if (state == "on") {
				stateBool = true;
			}
			$scope.deviceStates[deviceName] = stateBool
		}
	}
	
	
	//Show Room modal
   $scope.viewRoomConfig = function(row) {
      $uibModal.open(
       {
        animation:     true,
        templateUrl:  'views/home/roomConfigModal.html',
        controller:   'RoomConfigModalController',
        resolve:      {selectedConfig: row,
        			   roomConfig    : function() {return $scope.roomConfig; },
        			   devicesConfig    : function() {return $scope.deviceConfig; }
         			   }
       });
	}
   
	//Retrieves config from the database
	$scope.loadConfig = function(callback) {
		configService.loadConfig(
			//Config contain 'deviceConfig', 'roomConfig' and 'sceneConfig'
			function(config) {
				$scope.deviceConfig=config.deviceConfig;
				$scope.roomConfig=config.roomConfig;
				$scope.sceneConfig=config.sceneConfig;
					
				//Load grid data 
				$scope.gridOptions.data = $scope.deviceConfig;
				$scope.roomConfigGridOptions.data = $scope.roomConfig;
				$scope.scenes = config.sceneConfig;
				
				callback();
			}
		);
	};
	
	
	//
	// The DeviceConfig does not have state, this function will 
	// retrieve the state from the 'discovered' devices and set it on the conifg
	//
	$scope.enrichDeviceConfigWithState = function() {
		for(var i=0; i< $scope.deviceConfig.length; i++ ) {
			deviceConfig = $scope.deviceConfig[i];
			var device;
			try {
				device=$scope.getDevice(deviceConfig.name)
				deviceConfig.state = device.state;
			}
			catch(err) {
				deviceConfig.state = 'Device not found';
				continue;
			}
		}
	}
	
	
	$scope.initialise = function() {
		$scope.pingDeviceController();
		$scope.discoveringDevices=true

		$scope.loadConfig(function() {
			$scope.discoverDevices(
						function() {
							$scope.discoveringDevices=false;
							$scope.enrichDeviceConfigWithState();
						},
						//ErrorCallback
						function() {
							$scope.discoveringDevices=false;
						}
			);
		});
	};
	
	
	$scope.detectProblemDevices = function() {
		//Have config, but not descovered
		$scope.offlineDevices = [];			
		$scope.unregisteredDevices = [];	//No config and discovred
		
		for(var i=0; i < $scope.deviceConfig.length; i++) {
			
			deviceName = $scope.deviceConfig[i].name;

			var device;
			try {
				device=$scope.getDevice(deviceName);
			}
			catch(err) {
				$scope.offlineDevices.push(deviceName);
				continue;
			}
			
			//Otherwise check if device is offline
			state = device.state;
			if (state == 'offline') {
				$scope.offlineDevices.push(deviceName);
			}
		}
	}
	
	$scope.pingDeviceController = function() {
		$http({
		    url: LUMARHOME_DEVICE_CONTROLLER + '/ping',
		    method: 'GET',
		}).then(function successCallback(response) {
			$scope.deviceControllerDown=false;
		}, function errorCallback(response) {
			$scope.deviceControllerDown=true;
		});
	};
	
	
	// The "main"
	angular.element(function() {
		console.log("Page load complete...discovering devices")
		$scope.initialise();
	});

	$scope.initialise();

}]);	
