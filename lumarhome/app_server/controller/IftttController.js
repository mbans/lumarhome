var IFTTT = require('node-ifttt-maker');

//var ifttt = new IFTTT('dyxZMZOF0-TNik8rF74Rr3');

var IftttController = function(iftttKey) {
	
	this.ifttt = new IFTTT(iftttKey);
		
	this.call = function (req, res) {
	    var service = req.params.service;
	    console.log("Calling ifttt service [" + service + "]");
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
	}
};

//Available externally
module.exports = IftttController;

