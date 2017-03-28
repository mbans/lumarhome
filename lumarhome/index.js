require('lokijs');

var http = require('http');
var serveStatic = require('serve-static');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
var loki = require('lokijs');


//Express setting
app.use(bodyParser.json());

//Database
var db = new loki('logbook.json');

db.loadDatabase({}, function () {
	db.addCollection('items');
//	db.saveDatabase();
	console.log('Loaded database');
});


//Serves static content
app.use(express.static('public'));

//List all items
app.get('/listItems', function (req, res) {
	var allItems = db.getCollection("items").find(); //Returns all items
	console.log("Retrieved " + allItems.length + " item(s) from the database");
	res.end(JSON.stringify(allItems));
})

//Add Item
app.post('/addItem', function (request, response) {
    // First read existing users.
	var items = db.getCollection("items").insert(request.body);
	console.log("Successfully added" + JSON.stringify(request.body) + " to database");
//	db.saveDatabase();
	response.end(JSON.stringify(request.body));
});

app.delete('/deleteItem', function (request, response) {

	console.log("Attempting to delete " + JSON.stringify(request.body));

	
	//Retrieve from db (must retrieve before deleting as remove required meta data chars)
	var current = db.getCollection('items').findOne(request.body);
	if(current == 'Undefined') {
		console.log("Attempt to delete something that is not in the db....." + JSON.stringify(request.body));
		response.send(JSON.stringify(request.body));
	}
		
	db.getCollection("items").remove(current);
	console.log("Successfully deleted" + JSON.stringify(request.body));
//	db.saveDatabase();
	response.end(JSON.stringify(request.body));
});


var server = app.listen(1337, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port);
})


