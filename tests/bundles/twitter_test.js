var Bundle = require("../../worker/bundles/bundle");

exports.test_simpleTwitter = function(test){

    var bundle = new Bundle("social/twitter", {
		q: "smartphone"
	});

	test.expect(2)
 	test.ok(bundle, "The bundle shoud be valid");

	bundle.getItems(function(items){
		test.ok(items, "The items shoud be valid");
		test.done();
	})
}