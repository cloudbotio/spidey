var interpreter = require("../../worker/bundles/interpreter");
var map = require("../../worker/bundles/map");
var Bundle = require("../../worker/bundles/bundle");

exports.test_simpleMap = function(test){
    
    test.ok(map, "Map should be valid");
    test.done();
}

exports.test_simpleInterpreter = function(test){
    
	test.expect(1);
	
    interpreter.get({
		
        bundle: "scrapper",
		url: "http://google.com/search?q=%s", 
		q: "nodejs"
		
    }, function(items) {
		
		test.ok(items, "Interpreter items should be valid");
    	test.done();
	});
}

// TODO: Correct this test
var test_complexScrapperInterpreter = function(test){
    
	test.expect(1);
	
    interpreter.get({
		
        bundle: "submarino",
		q: "smartphone"
		
    }, function(items) {
		
		test.ok(items, "Interpreter items should be valid");
    	test.done();
	});
}