$scope.bulbDict={}
   require('lokijs');

var http = require('http');
var serveStatic = require('serve-static');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
var loki = require('lokijs');
var inDeployMode=true;
var request = require('request-promise')  

//Express setting
app.use(bodyParser.json());

/////////////////////////////////////////////////// HOME AUTOMATION STUFF ///////////////////////////////////////////////////

		

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Database
var db = new loki('logbook.json');
db.loadDatabase({}, function () {
	db.addCollection('items');
	db.addCollection("places");
	saveDb();
	console.log('Loaded database');
});


//Serves static content
app.use(express.static('public'));

//List all items
app.get('/getItems', function (req, res) {
	var allItems = db.getCollection("items").find(); //Returns all items
	console.log("Retrieved " + allItems.length + " item(s) from the database");
	res.end(JSON.stringify(allItems));
})

//UpdateDetail
app.post('/update', function (request, response) {
	var update = request.body;
	var id = getId(update); 
	
	if(id == null) {
		console.log("Cannot update as no id present on " + jStr(update));
		return res.status(500).send({ error: 'Cannot update as no id present ;-(' })
	}	
	
	var current = db.getCollection('items').find({"$loki" : id});
	db.getCollection("items").update(update);
	console.log('Item-ID-' + id  + ' Updated from ' + jStr(current) + " to " + jStr(update)); 
	
	saveDb();
	response.end(JSON.stringify(current));
});


app.post('/add', function (request, response) {
	var insert = request.body;
	current = db.getCollection("items").insert(insert);	
	console.log('Item-ID-' + getId(current) + ' Inserted ' +  jStr(insert));
	saveDb();
	response.end(JSON.stringify(current));
});

app.delete('/deleteItem', function deletePlace(request, response) {
	var toDelete = request.body;
	toDelStr = jStr(toDelete);
	var id = getId(toDelete);
	
	//Attempting to delete something that has no LokiId, not allowed
	if(id == null) {
		console.log("Cannot delete as no id present " + toDelStr);
		return res.status(500).send({ error: 'Cannot delete as no id present on entry ;-(' })
	}
		
	//True is the 'justOne' flag
	items().remove({"$loki" : id}, true);	
	
	saveDb();
	
	console.log('Place-ID-' + id + ' Deleted ' + toDelStr);
	response.end(JSON.stringify(request.body));
});

// Adding / Removing Places 
app.post('/addPlace', function (request, response) {
	var newPlace = request.body;
	
	console.log("Adding New Place" + jStr(newPlace))
	savedPlace = places().insert(newPlace);	
	console.log('Place-ID-' + getId(savedPlace) + ' Inserted ' +  jStr(savedPlace));
	saveDb();
	response.end(JSON.stringify(savedPlace));
});


//List all places in the db
app.get('/getPlaces', function (req, res) {
	//Mock these out if in deploy mode
	allPlaces = [];
	if(inDeployMode) {
		allPlaces[0] = {"name" : "MarketPlace"};
		allPlaces[1] = {"name" : "Taste"};
		allPlaces[2] = {"name" : "Wetmarket"};
	}
	else {
		allPlaces = places().find();
	}
	console.log("Retrieved " + allPlaces.length + " places(s) from the database");
	res.end(JSON.stringify(allPlaces));	
})


app.delete('/deletePlace', function (request, response) {
	var toDelete = request.body;
	toDelStr = jStr(toDelete);
	var id = getId(toDelete);
	
	//Attempting to delete something that has no LokiId, not allowed
	if(id == null) {
		console.log("Cannot delete as no id present " + toDelStr);
		return res.status(500).send({ error: 'Cannot delete as no id present on entry ;-(' })
	}
		
	//True is the 'justOne' flag
	db.getCollection("items").find({"$loki" :id}).remove();	
	
	saveDb();
	
	console.log('Item-ID-' + id + ' Deleted ' + toDelStr);
	
	response.end(JSON.stringify(request.body));
});



var server = app.listen(1337, function () {
   var host = server.address().address;
   var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
})


function jStr(jsonObj) {
	return JSON.stringify(jsonObj);
}


function getId(jsonObj) {
	return jsonObj["$loki"];
}


function items() {
	return db.getCollection("items")
}

function places() {
	return db.getCollection("places");
}

function saveDb() {
	if(!inDeployMode) {
		db.saveDatabase();
	}
}