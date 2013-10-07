var Bundle = require("../../worker/bundles/bundle");

exports.test_simpleXml = function(test){
    
    var bundle = new Bundle("standard/xml", {
		url: "http://www.w3schools.com/xml/note.xml"
	});
    
	test.expect(2)
 	test.ok(bundle, "The bundle shoud be valid");
	
	bundle.getItems(function(items){
		test.ok(items, "The items shoud be valid");
		test.done();
	})
}