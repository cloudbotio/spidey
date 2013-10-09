var Bundle = require("../../worker/bundles/bundle");

exports.test_simpleMercadolivre = function(test){

    var bundle = new Bundle("ecommerce/mercadolivre", {
		q: "smartphone"
	});

	test.expect(2)
 	test.ok(bundle, "The bundle should be valid");

	bundle.getItems(function(items){
		test.ok(items, "The items should be valid");
		test.done();
	})
}