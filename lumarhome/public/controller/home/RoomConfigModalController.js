budgetApp.controller('RoomConfigModalController', ['$scope', '$http', '$uibModalInstance', '$filter', 'configService', 'selectedConfig', 'roomConfig', 'devicesConfig',
	
	function($scope, $http, $uibModalInstance, $filter, configService, selectedConfig, roomConfig, devicesConfig) {
		
		//The configuration for all the rooms? 
		$scope.roomConfig = roomConfig;

		//The configuration currently selected (viewed in modal)
		$scope.selectedConfig   = selectedConfig	
		
		//All the devices that are available and can be added to the selected config
		$scope.devicesConfig = devicesConfig
		
		$scope.roomDevices = {};
		
		$scope.save = function() {
			$scope.selectedConfig.devices = $filter('selectedDeviceFilter')($scope.roomDevices);
			configService.saveRoomConfig(selectedConfig, function(message) {
				console.log(message);
			});
			$scope.configUpdated = false;
			$scope.message = "Successfully saved config";
		};
		
		$scope.cancel = function() {
			$uibModalInstance.close();
		};
		
		$scope.containsDevice = function(deviceName) {
			for(var i=0; i<selectedConfig.devices.length; i++) {
				device=selectedConfig.devices[i];
				if(device.name === deviceName) {
					return true;
				}
			}
			return false;
		};
		
		//This populates the JSON object with current devices that are part of the current room config
		//For some reason this doesnt get populated via the dom initially, only populates for a given device
		//When the state is changed.
		$scope.initialiseRoomDevices = function() {
			var isNewRoom = ($scope.selectedConfig._id == undefined);
			for(var i=0; i<devicesConfig.length; i++) {
				currentDevice = devicesConfig[i];
				if(isNewRoom) {
					$scope.roomDevices[currentDevice.name] = false;
				}
				else {
					$scope.roomDevices[currentDevice.name] = $scope.containsDevice(currentDevice.name);
				}
			}
			console.log("Populated 'roomDevices'");
		}
		
		$scope.getSelectedDevices = function() {
		}
		
		$scope.noDevicesSelected = function() {
			$scope.selectedDevices
		}
		
		$scope.updated = function() {
			$scope.configUpdated = true;
			$scope.message = "";
		}
		
		$scope.initialiseRoomDevices();
	}
])