var http = require('http'),
	serveStatic = require('serve-static'),
	express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
    IftttController = require('./app_server/controller/IftttController'),
    LumarHomeConfigController = require('./app_server/controller/LumarHomeConfigController'),
	ConfigDao = require('./app_server/models/ConfigDao'),
	Db = require('mongodb').Db,
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
    Server = require('mongodb').Server;
    
var LUMARHOME_DB_URL = 'mongodb://localhost:27017/lumarhome';
//var dao = new ConfigDao('mongodb://localhost:27017/lumarhome_test',true);
var iftttController = new IftttController('dyxZMZOF0-TNik8rF74Rr3');
var lumarHomeConfigController = new LumarHomeConfigController('mongodb://localhost:27017/lumarhome');

var server;
var lumarHomeDb;
var deviceConfig;
var roomConfig;

app.use(bodyParser.json());
app.use(express.static('public'));

//IFTTT Maker service
app.get('/ifttt/:service', function(req,res) {
	iftttController.call(req,res);
});

app.get('/conf', function(req, res) {
	lumarHomeConfigController.getConfig(req,res);
});

app.put('/roomconfig/:id', function(req, res) {
	lumarHomeConfigController.saveRoomConfig(req,res);
});

app.post('/roomconfig', function(req, res) {
	lumarHomeConfigController.saveRoomConfig(req,res);
});


var getDevice = function(callback) {
//		dao.Device.find({}, function (err, deviceDoc, callback){
//		    if (err) {
//		    	console.log("Error Retrieving Device " + err);
//		    } else {
//		    	console.log("Updated Document =" + JSON.stringify(deviceDoc));
//		    }
//		    callback(deviceDoc)
//		    dao.close();
//		})
};



//Retrieves documents from a given collection
var update = function(collectionName, db, id, record, callback) {
	  // Get the documents collection
	  var collection = db.collection(collectionName);
	  
	  
		  //Now update
	  var replacement = record;
	  console.log("Updating ID="+id + " with " + JSON.stringify(record));
	  collection.update({'_id' : new ObjectID(id)}, record, function(err, result) {
		  console.log("Result = " + JSON.stringify(result));
          assert.equal(null, err);
		  callback(err,result);
	  });
};

//Initialize connection once
MongoClient.connect(LUMARHOME_DB_URL, function(err, database) {
  
  if(err) throw err;
  
  lumarHomeDb = database;
  
  lumarHomeConfigController.setDatabase(lumarHomeDb);
  
  // Start the application after the database connection is ready
  app.listen(1337);
  console.log("Lumarhome listening on port 1337");
});