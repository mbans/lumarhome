budgetApp.controller('RoomConfigModalController', ['$scope', '$http', '$uibModalInstance', 'selectedConfig', 'roomConfig', 'devicesConfig',
		
	function($scope, $http, $uibModalInstance, selectedConfig, roomConfig, devicesConfig) {
		
		$scope.roomConfig 		= roomConfig;
		$scope.selectedConfig   = selectedConfig
		$scope.devicesConfig   	= devicesConfig
		
		console.log("Initiated roomDeviceConfig={}")
		$scope.roomDeviceConfig = {};
		
		$scope.$watch('roomDeviceConfig',function() {
			console.log("roomDeviceConfig changed....");
		});
		
		
		$scope.save = function() {
			console.log("Saving room config");
			console.log("SelectedDevices = " + JSON.stringify($scope.roomDeviceConfig));
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
		
	}
])