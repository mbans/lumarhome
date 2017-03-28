budgetApp.controller('MainController', ['$scope','uiGridConstants','$http','$uibModal','modalService',
						function($scope, uiGridConstants, $http, $uibModal, modalService) {
		
	   //Initialise
	   $scope.newItem={};
	   $scope.newItem.detail=null;
	   $scope.viewDetail=false;
	   $scope.showAnalysis=false;
	   
	   $scope.columnDefs = [
	        { name: 'date', 	width: '20%', displayName: 'Date', cellFilter: 'date:"dd-MM-yyyy"'},
	        { name: 'item', 	width: '40%', displayName: 'Shop' },
	        { name: 'price', 	width: '15%', aggregationType: uiGridConstants.aggregationTypes.sum, displayName : 'Price'},
	        { name: 'person',   width: '15%', displayName: 'Person'},
	        { name: 'Details',  enableFiltering : false, enableSorting: false, width: '5%', cellTemplate: '<center><a href ng-click="grid.appScope.viewDetails(row)"><img src="static/img/details.png"></a></center>'},
	        { name: 'Delete',   enableFiltering : false, enableSorting: false, width:  '5%', cellTemplate: '<center><a href ng-click="grid.appScope.deleteRow(row)"><img src="static/img/delete-icon.png"></a></center>'}
	   ];
	   
	   $scope.toggleAnalysis = function() {
		   $scope.showAnalysis= !$scope.showAnalysis
	   }
	   
		$scope.gridOptions = {
		    showColumnFooter: true,
			"data" : [],
			"columnDefs": $scope.columnDefs,
	        enableFiltering: true,
	        enableSorting: true,
	        onRegisterApi: function (gridApi) {
	        	$scope.gridApi = gridApi;
	        }
		}
			
		//Show detail modal
 	    $scope.viewDetails = function(row) {
	      $uibModal.open({
	        animation:    $scope.animationsEnabled,
	        templateUrl:  'views/detailsModal.html',
	        controller:   'ModalController',
	        resolve:      {selectedItem: row.entity }
	      });
		}
		
		
    //Adds new item to table 
	$scope.addNewItem=function() {
		var detail = $scope.newItem.detail; 
		if(detail == null) {
			$scope.newItem.detail='No details added, add if required.';
		}
		
		toAdd = $scope.newItem
		toAdd.item = JSON.parse($scope.newItem.item)["name"]; 		//Just want the name of the place not the entire record
		console.log("Attempting to add" + JSON.stringify(toAdd));
		
		$http({
		    url: '/add',
		    method: 'POST',
		    data: JSON.stringify(toAdd),
		    headers: {'Content-Type': 'application/json'}
		}).then(function successCallback(response) {
			var persistedItem = response.data;
		    console.log("Added new item(s): " + JSON.stringify(persistedItem)); 
			
		    $scope.gridOptions.data.push(persistedItem);
		    $scope.newItem={};
		    $scope.newItem.detail=null;
		}, function errorCallback(response) {
		    console.log("Error, could not add " + toAdd); 
		});
	}	
	
	
	$scope.deleteRow = function(row) {
		
		   var index = $scope.gridOptions.data.indexOf(row.entity);
		   var json =  JSON.stringify(row.entity);
		   	
		   $http({
			    url: '/deleteItem',
			    
			    method: "DELETE",
			    
			    data: json,
			    
			    headers: {'Content-Type': 'application/json'}
		   
			}).then(function successCallback(response) {
			
				console.log("Deleted " + json); 
			    
				$scope.gridOptions.data.splice(index, 1);
				
			}, function errorCallback(response) {
			    console.log("Error deleting " + json); 
			});
	   };
 
    //Loads all config from db - called on startup
    $scope.loadItems = function() {
    	$http.get('/getItems').
        then(function(response) {
            $scope.gridOptions.data = response.data;
            console.log("Loaded " + response.data.length + " item(s)");
        }, function errorCallback(response) {
        	console.log("error items data db");
        });
    }
    
    $scope.loadPlaces = function() {	
       	$http.get('/getPlaces').
        then(function(response) {
            $scope.places = response.data;
            
            //Manually add an entry as a hook for adding new 'places'
            $scope.places.push({"name" : "Add Value"});
            
            console.log("Loaded " + response.data.length + " places(s)");
        }, function errorCallback(response) {
        	console.log("error loading data places from db");
        });
 
    }

    
    //User has changed the 'Drop down' for categories
    $scope.changedPlace = function() {
    	if(JSON.parse($scope.newItem.item)["name"] == 'Add Value') {
  	      $uibModal.open({
  	        animation:    $scope.animationsEnabled,
  	        templateUrl:  'views/placesModal.html',
  	        controller:   'PlacesModalController',
  	        scope: $scope,
  	      });
    	}
    	
    }
    
    
	$scope.energy=function(onOrOff) {
		console.log("Energy =800606813DAFD15C131CECBEA16707DD17CB082B");
		var request = 
		{
				 "method":"passthrough",
				 "params":{
				 "deviceId":"800606813DAFD15C131CECBEA16707DD17CB082B",
				 "requestData":"{\"system\":{\"set_relay_state\":{\"state\":"+onOrOff+"}}}"
				 }
		};
		lightControl(request);
	}
	
	$scope.dining=function(onOrOff) {
		console.log("Dining = 8006468CE9EDF43E290FCCCC0996574D1850A119");
		var request = 
		{
				 "method":"passthrough",
				 "params":{
				 "deviceId":"8006468CE9EDF43E290FCCCC0996574D1850A119",
				 "requestData":"{\"system\":{\"set_relay_state\":{\"state\":"+onOrOff+"}}}"
				 }
		};	
		lightControl(request);
	}
	
	$scope.neon=function(onOrOff) {
		console.log("Neon = 8006CB9F94205A1158634A1607E237F217B03112");
		var request = 
		{
				 "method":"passthrough",
				 "params":{
				 "deviceId":"8006CB9F94205A1158634A1607E237F217B03112",
				 "requestData":"{\"system\":{\"set_relay_state\":{\"state\":"+onOrOff+"}}}"
				 }
		};
		lightControl(request);
	}
	

	$scope.lightsAll=function(onOrOff) {
		$scope.neon(onOrOff);
		$scope.energy(onOrOff);
		$scope.dining(onOrOff);
	}

	


	

	



	
    	    
	//Load all the items
	$scope.loadPlaces();
	$scope.loadItems();
	
}]);	
