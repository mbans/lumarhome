var http = require('http'),
	serveStatic = require('serve-static'),
	express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	IFTTT = require('node-ifttt-maker'),
	
	//Mongodb
	Db = require('mongodb').Db,
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
    Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID

var ifttt = new IFTTT('dyxZMZOF0-TNik8rF74Rr3');
var server;

var LUMARHOME_DB_URL = 'mongodb://localhost:27017/lumarhome';
var lumarHomeDb;
var deviceConfig;
var roomConfig;

app.use(bodyParser.json());
app.use(express.static('public'));

//IFTTT Maker service
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
});

//////////////////////////////////////////////////////////////////////
//Retrieve all the config
//////////////////////////////////////////////////////////////////////
app.get('/conf', function(req, res) {
	var conf={};
	var gotDevices = false;
	var gotRooms = false;
	var gotScenes = false;
		
	  //Devices
	  getDocuments("deviceConfig", lumarHomeDb, 
			  function(docs) {
		  		conf.deviceConfig=docs;
		  		if(gotRooms && gotScenes) {
  		            res.setHeader('Content-Type', 'application/json');
  		            res.json(conf);
		  		}
		  		gotDevices=true;
	  });
	  //Rooms
	  getDocuments("roomConfig", lumarHomeDb, 
			  function(docs) {
		  		conf.roomConfig=docs;
		  		if(gotDevices && gotScenes) {
  		            res.setHeader('Content-Type', 'application/json');
  		            res.json(conf);
		  		}
		  		gotRooms=true;
	  });
	  
	  //Scenes
	  getDocuments("sceneConfig", lumarHomeDb, 
			  function(docs) {
		  		conf.sceneConfig=docs;
		  		if(gotDevices && gotRooms) {
  		            res.setHeader('Content-Type', 'application/json');
  		            res.json(conf);
		  		}
		  		gotScenes=true;
	  });
});
	

//Retrieves documents from a given collection
var getDocuments = function(collectionName, db, callback) {
	  // Get the documents collection
	  var collection = db.collection(collectionName);

	  collection.find({}).toArray(function(err, docs) {
		 assert.equal(err, null);
		 console.log("Found " +  docs.length + " documents from " + collectionName + " collection");
		 callback(docs)
	  });
}


//Initialize connection once
MongoClient.connect(LUMARHOME_DB_URL, function(err, database) {
  
  if(err) throw err;
  
  lumarHomeDb = database;
  
  // Start the application after the database connection is ready
  app.listen(1337);
  console.log("Lumarhome listening on port 1337");
});