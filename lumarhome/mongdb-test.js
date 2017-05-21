var ObjectID = require('mongodb').ObjectID;
var ConfigDao = require('./app_server/models/ConfigDao')


var dao = new ConfigDao('mongodb://localhost:27017/lumarhome_test',true);
//dao.connect();
//dao.createSchemas();
//
//Create a new Device
var newDevice = dao.DeviceConfig({name: "new_device", displayName: "New Device", type: "yeelight", account: "lumarhome"});

//Add a device
newDevice.save(function(err) {
	if(err) {
		console.log("Error = " + err);
	}
	else {
		console.log("Successfully saved device");
	};
});

dao.DeviceConfig.find({}, function (err, all){
	console.log("Device finding....");
	console.log("All = " + JSON.stringify(all));
    dao.close();
 });



////Find a device
//var newDoc =  {name: "found_by_id", displayName: "New Device", type: "switch", account: "lumarhome2"};
//dao.Device.findOneAndUpdate({_id: "58fc82bf5840265951e6e617"}, newDoc, function (err, device){
//    if (err) {
//    	console.log("Error....")
//    } else {
//    	console.log("Updated Document =" + JSON.stringify(device));
//    }
//    dao.close();
// });







