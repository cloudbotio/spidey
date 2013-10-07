var response = require("../adapters/response");
var model = require("../adapters/model");
var policy = require("../policies/");

var lang = require("../../language").getDefault();

module.exports = {
	
	index: function(req, res) {

		response(res).view("login/index", {
			title: "Login",
			destination: req.param("destination") || "/",
			layout: false
		});
	}
}