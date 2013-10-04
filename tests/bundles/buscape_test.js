var Bundle = require("../../worker/bundles/bundle");

exports.test_simpleBuscape = function(test){
    
    var bundle = new Bundle("ecommerce/buscape", {
		q: "smartphone"
	});
    
	test.expect(2)
 	test.ok(bundle, "The bundle shoud be valid");
	
	bundle.getItems(function(items){
		test.ok(items, "The items shoud be valid");
		test.done();
	})
}