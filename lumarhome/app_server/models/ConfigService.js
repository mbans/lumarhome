var daoHelper = require('./DaoHelper')    
	Schema 	  = mongoose.Schema,
	ObjectId  = Schema.ObjectId;

var ConfigService = function(dbURI) {
	
	this.dbURI = dbURI;
	var dao = new DaoHelper(dbURI);
	
	//Connect 
	this.connect =  function() {
		this.dao.connect();
	}
	
	//Close/Disconnect
	this.close =  function() {
		this.dao.close();
	}
};

//Available externally
module.exports = ConfigService;

