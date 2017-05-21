var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var ConfigDao = require('./../models/ConfigDao')
	
var LumarHomeConfigController = function(dbUrl) {

	this.dao = new ConfigDao(dbUrl,true);
	
	this.getConfig = function(req,res) { 
		console.log("Retrieving all configuration");
		
        //Retrieve config from dao
        res.setHeader('Content-Type', 'application/json');
        this.dao.getConfig(function(err, conf) {
			if(err) {
				return res.status(500).send("There was a problem updating the configuration");
			}
			else {
				console.log("Retieved Config = " + JSON.stringify(conf));
		        return res.json(conf);
			}
		});
	};
	
	this.saveRoomConfig = function(req, res) {
		var roomConfigId = req.params.id;
		this.dao.saveRoomConfig(roomConfigId, req.body, 
			function(err, updatedRoomConfig) {
				if(err) {
					return res.status(500).send("There was a problem updating the room config");
				}
				else {
					console.log("Successfully updated RoomConfig ID="+updatedRoomConfig._id);
					return res.status(200).send(updatedRoomConfig);
				}
			}
		);
	};
	
	this.setDatabase = function(db) {
		this.db = db;
		console.log("Set the db on LumarHomeConfigController");
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

	
	
};

//Available externally
module.exports = LumarHomeConfigController;

