
//Defines the application along with the 'modules that are required
var budgetApp = angular.module('BudgetApp', ['lokijs','ui.bootstrap','ui.grid','ui.grid.pagination','ui.toggle', 'ngRoute']);

var LUMARHOME_SERVICE = "http://localhost:1337/";
//var LUMARHOME_DEVICE_CONTROLLER = "http://localhost:4000";
//var LUMARHOME_DEVICE_CONTROLLER = "http://192.168.0.101:4000";
var LUMARHOME_DEVICE_CONTROLLER = "http://61.10.133.31:4000";


budgetApp.config(function($routeProvider, $locationProvider) {
	  $routeProvider
    .when("/home",			   {templateUrl : "views/home/rooms.html",       controller : "HomeAutoController"})
    
    .when("/home/config", 	   {templateUrl : "views/home/config.html",controller : "HomeAutoController"})

    .when("/investment", {templateUrl : "views/investments/investments.html",controller : "InvestmentController"})
    
    .when("/spending", {templateUrl : "views/spending/spending.html",controller : "SpedController"})
    
    .when('/404', {templateUrl: 'views/404.html'})
    .otherwise({redirectTo: '/404'});
	  
//$locationProvider.html5Mode(true);
});
