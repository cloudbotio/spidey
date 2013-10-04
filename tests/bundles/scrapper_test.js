var Bundle = require("../../worker/bundles/bundle");

exports.test_simpleScrapper = function(test){
    
    var bundle = new Bundle("scrapper", {
		url: "http://google.com/search?q=%s", 
		q: "nodejs"
	});
    
	test.expect(2)
 	test.ok(bundle, "The bundle shoud be valid");
	
	bundle.getItems(function(items){
		test.ok(items, "The items shoud be valid");
		test.done();
	})
}