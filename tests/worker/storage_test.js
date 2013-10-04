var storage = require("../../worker/storage");

exports.test_simpleAddItems = function(test){
	
	test.expect(1);
	
	storage.addItem({
		
		serie: "test",
		time: (new Date()).getTime(),
		
		values: {
			result: "ok",
			price: Math.floor((Math.random() * ((199 + 1) - 129)) + 129)
		}
		
	}, function(result){
		test.ok(result, "Storage result should be true");
		test.done();
	});
};

exports.test_simpleGetItems = function(test){
	
	test.expect(1);
	
	storage.getItems("test", {}, function(items){
		test.ok(items, "Storage items result should be true");
		test.done();
	});
};

exports.test_complexGetItems = function(test){
	
	test.expect(1);
	
	storage.getItems("test", {}, function(items){
		test.ok(items, "Storage items result should be true");
		test.done();
	});
};