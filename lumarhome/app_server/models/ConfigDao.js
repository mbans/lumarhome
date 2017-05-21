var mongoose = require('mongoose'),
	Schema 	 = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var ConfigDao = function(dbURI,connectOnStartup) {
	
	console.log("dbURI = " + dbURI + ", connectOnStartup="+connectOnStartup);
	this.dbURI = dbURI;
	
	//Connect 
	this.connect =  function() {
		mongoose.connect(this.dbURI);
		console.log("Connected to " + this.dbURI);
	};
	
	//Connect 
	this.close =  function() {
		mongoose.connection.close();
		console.log("Disconnected");
	};
	
	//Create Mongo Schema
	this.createSchemas = function() {
		
		//DEVICE
		var DeviceSchema = new mongoose.Schema({
			name:  			{type : String, required : true},
			displayName: 	{type : String, required : true},
			type:			{type : String, required : true},
			account:		{type : String, required : true}
		});
																																																																																																			    DeviceSchema.post('save', function (doc) {		//Fires when we save an item
			  console.log('Device: document saved');
		});
		
		//ROOM CONFIG
		var RoomConfigSchema = new mongoose.Schema({
			name:  		{type : String, required : true},
			title: 		{type : String, required : true},
		//	devices:	[{ type : ObjectId, ref: 'Device' }],	//Store id of Devices
			devices:	[DeviceSchema],	
			image:		{type : String, required : true}
		});
		
		
		//DEVICE STATE
		var DeviceStateSchema = new mongoose.Schema({
		//	device : {type : ObjectId, ref: 'Device'},
			devie  : DeviceSchema,
			state  : {type : String},		//on or off
			color  : Number
		});
		
		//SCENE - this is a list of device states, this is what defines a scene
		var SceneConfigSchema = new mongoose.Schema({
			name:  			{type : String, required : true},
			deviceStates: 	[DeviceStateSchema]
		});
		
		
	    this.DeviceConfig = mongoose.model('deviceConfig', DeviceSchema);
	    this.RoomConfig = mongoose.model('roomConfig',RoomConfigSchema);
	    this.DeviceState = mongoose.model('deviceState',DeviceStateSchema);
	    this.SceneConfig = mongoose.model('sceneConfig',SceneConfigSchema);
		
		console.log("Created Mongoose Schema & Model...");
	};

	//Update existing roomConfig
	this.saveRoomConfig = function(roomConfigId, roomConfigToSave, callback) {
		console.log("Inserting RoomConfig id=" + roomConfigId + " with " + JSON.stringify(roomConfigToSave));
		if(roomConfigId == undefined) {
			//Could also use this.dao.RoomConfig.create(roomConfigToSave);			
			var newRoomConfig = this.dao.RoomConfig(roomConfigToSave);
			newRoomConfig.save(function (err) {
				if(err) {
					console.log("Error Saving Room Config " + err);
				}
				else {
					console.log("Successfully Saved Room Config:" + JSON.stringify(roomConfigToSave));
				}
				callback(err,newRoomConfig._id);
			});
		}
		else {
			console.log("Updating RoomConfig id=" + roomConfigId + " with " + JSON.stringify(roomConfigToSave));
			this.RoomConfig.findOneAndUpdate({_id: roomConfigId}, {upsert:true}, roomConfigToSave, function (err, device){
				if(err) {
					console.log("Error updating roomConfig " + err);
				}
				else {
					console.log("Successfully updated roomConfig to: " + JSON.stringify(roomConfigToSave));
				}
				callback(err,roomConfigId);
			});
		}
	};

	
	//Update existing roomConfig
	this.updateRoomConfig = function(roomConfigId, updatedRoomConfig, callback) {
		console.log("Updating RoomConfig id=" + roomConfigId + " with " + JSON.stringify(updatedRoomConfig));
		
		this.RoomConfig.findOneAndUpdate({_id: roomConfigId}, updatedRoomConfig, function (err, device){
			if(err) {
				console.log("Error updating roomConfig " + err);
			}
			else {
				console.log("Successfully updated roomConfig to: " + JSON.stringify(updatedRoomConfig));
			}
			callback(err,roomConfigId);
		});
	};
	
	
	//Retrieve all config from db;
	this.getConfig = function(callback) {
		
		var conf = {};
		var DeviceConfig = this.DeviceConfig; 
		var SceneConfig = this.SceneConfig;
		var RoomConfig = this.RoomConfig;
		//1. Retrieve RoomConfig
		
		RoomConfig.find({}, function(err, roomConfigs) { 
			conf.roomConfig=roomConfigs;
			if(err) {
				return callback(err,conf);
			}	
			console.log("Retrieved " + roomConfigs.length + " RoomConfigs");

			//2. Retrieve DeviceConfig
			DeviceConfig.find({},function(error, deviceConfigs) {
				if(err) {
					return callback(err,conf);
				};
				conf.deviceConfig=deviceConfigs;
				console.log("Retrieved " + deviceConfigs.length + " DeviceConfigs");
				
				//3. SceneConfig
				SceneConfig.find({}, function(error, sceneConfigs) {
					if(err) {
						return callback(err,conf);
					}	
					conf.sceneConfig=sceneConfigs;
					console.log("Retrieved " + sceneConfigs.length + " SceneConfigs");
					return callback(err, conf);
				});
			});
		});
	};
		
				
	
	
	if(connectOnStartup) {
		this.connect();
		this.createSchemas();
	}
};

//Available externally
module.exports = ConfigDao;

