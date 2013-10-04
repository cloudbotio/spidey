var Bundle = require("../../worker/bundles/bundle");

exports.test_simpleRss = function(test){
    
    var bundle = new Bundle("rss", {
		url: "http://feeds.feedburner.com/gizmodobr"
	});
    
	test.expect(2)
 	test.ok(bundle, "The bundle shoud be valid");
	
	bundle.getItems(function(items){
		
		console.log(items);
		
		test.ok(items, "The items shoud be valid");
		test.done();
	})
}