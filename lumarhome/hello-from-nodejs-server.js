var loki = require('lokijs'),
	http = require('http'),
	serveStatic = require('serve-static'),
	MongoClient = require('mongodb').MongoClient;
	express = require('express'),
	bodyParser = require('body-parser'),
	Db = require('mongodb').Db,
	Server = require('mongodb').Server,
	app = express(),
	fs = require("fs"),
	inDeployMode=true,
	db = new loki('logbook.json'),
	IFTTT = require('node-ifttt-maker');
	

var ifttt = new IFTTT('dyxZMZOF0-TNik8rF74Rr3');

var server;
var budgetDb;
var items;
var places;

//Express setting
app.use(bodyParser.json());


var budgetDb = new Db('budget', new Server('localhost', 27017));
budgetDb.open(function(err, database) {
  if(err) throw err;
  
  console.log("database = "+ database);
  budgetDb = database;
  items  = budgetDb.collection('items');
  places = budgetDb.collection('places');
  
  //Webserver only accepts connections after we have initialised the db
  server = app.listen(1337); 
  console.log("Budget app listening on port 1337");
});



app.get('/ifttt/:service', function (req, res) {
    var service = req.params.service;
    console.log("calling ifttt service [" + service + "]");
	ifttt.request({
	    event: service,
	    method: 'GET'
	}, function (err) {
	    if (err) {
	      console.log('Error running ' + err);
	    } else {
	      console.log('Succesffully run ' + service);
	    }
	    res.end();
	});
})



////Reuse database object in request handlers
//app.get("/getFromMongo", function(req, res) {
//	items.find(function(err, docs) {
//	    docs.each(function(err, doc) {
//	    console.log("error="+err);
//	      if(doc) {
//	        console.log(doc);
//	      }
//	      else {
//	    	console.log("no doc")
//	        res.end();
//	      }
//	    });
//	});
//});


//Serves static content
app.use(express.static('public'));

//List all items
app.get('/getItems', function (req, res) {
	
//	var promise = items.find().toArray();
//
//	promise.then(function(docs) {
//		console.log("Got " + docs.length + " returned");
//		console.logJSON.stringify(docs[0]);
//		res.end(JSON.stringify(docs));
//	});
//	
//	
//	items.find(function(err,docs) {
//		if(docs) {
//			console.log("getItems " + docs);
//			var item = docs[0];
//			console.log("Item" + item);
////			var toString = JSON.stringify(docs);
////			console.log("Item Length = " + docs.length + " string="+toString);
////			res.end(docs);
//		}
//	});
////	console.log("Retrieved " + allItems.length + " item(s) from the database");
////	res.end(JSON.stringify(allItems));
})


function getFindAllItemsPromise() {
	return items.find();
}
 

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