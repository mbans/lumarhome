var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
// Connection url
var url = 'mongodb://localhost:27017/budget';


// Connect using MongoClient
MongoClient.connect(url, function(err, db) {
	
	
  // Create a collection we want to drop later
var col = db.collection('places');

console.log(col);

//// Show that duplicate records got dropped
//  col.find().toArray(function(err, items) {
//    
//    
//  });
});