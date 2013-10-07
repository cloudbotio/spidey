var Bundle = require("../../worker/bundles/bundle");

exports.test_simpleJson = function(test){
    
    var bundle = new Bundle("standard/json", {
		url: "https://gist.github.com/luiseduardobrito/6858606/raw/d5ca56d195057af0e7fb967dfb79ce07b015579c/sample"
	});
    
	test.expect(2)
 	test.ok(bundle, "The bundle shoud be valid");
	
	bundle.getItems(function(items){
		test.ok(items, "The items shoud be valid");
		test.done();
	})
}