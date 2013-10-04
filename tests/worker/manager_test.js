exports.simple_workerManagerTest = function(test) {
	
	var workerManager = require("../../worker");
	workerManager.startAll();
	test.done();
};