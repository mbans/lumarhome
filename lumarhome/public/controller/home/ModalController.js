//var ModalController = function($scope) {
//}
//ModalController.$inject = ['$scope','$uibModal'];			//Inject the dependancies
//budgetApp.controller('ModalController',ModalController);	
//budgetApp.controller('ModalController', ModalController);

budgetApp.controller('ModalController', ['$scope', '$http', '$uibModalInstance', 'selectedItem', 
		
	function($scope, $http, $uibModalInstance, selectedItem) {
		
		$scope.selectedItem = selectedItem;
		
		$scope.save = function() {
			console.log("selectedItem = " + JSON.stringify($scope.selectedItem));
			
			$http({
			    url: '/update',
			    method: "POST",
			    data: JSON.stringify($scope.selectedItem),
			    headers: {'Content-Type': 'application/json'}
			}).then(function successCallback(response) {
				$uibModalInstance.close();
			    $scope.newItem={};
			    $scope.newItem.detail=null;
			}, function errorCallback(response) {
			    alert("Error saving detail");
				$uibModalInstance.close();
			});
		};
	
		$scope.cancel = function() {
			$uibModalInstance.close();
		};
	}
])
.controller('PlacesModalController', ['$scope', '$http', '$uibModalInstance',
	
	//Controller for adding new 'Places'
	function($scope, $http, $uibModalInstance) {
	
	
	$scope.addPlace = function() {
		toAdd = {"name" : $scope.newPlace};
		console.log("Adding place= " + JSON.stringify(toAdd));
		
		$http({
		    url: '/addPlace',
		    method: "POST",
		    data: JSON.stringify(toAdd),
		    headers: {'Content-Type': 'application/json'}

		}).then(function successCallback(response) {
			$scope.places.push(response.data);
			console.log("Added new Place " + JSON.stringify(response.data));
		    $scope.newItem.item=null;
			$uibModalInstance.close();
		}, function errorCallback(response) {
		    alert("Error adding place " + $scope.newPlace);
		    $scope.newItem.item=null;
			$uibModalInstance.close();
		});
		
		toAdd={};
		$scope.newPlace="";
	};

	$scope.cancel = function() {
		$uibModalInstance.close();
	};
}
])
