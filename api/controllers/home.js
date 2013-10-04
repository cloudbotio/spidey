var response = require("../adapters/response");
var model = require("../adapters/model");
var policy = require("../policies/");

var lang = require("../../language").getDefault();

module.exports = {

	index: function(req, res) {
	
		response(res).view("home/index", {
			title: lang.home.title,
			message: lang.home.message
		});
	},

	login: function(req, res) {

		response(res).view("home/login", {
			title: lang.home.title,
			message: lang.home.message,
			destination: req.param("destination") || "dashboard"
		});
	},

	signup: function(req, res) {

		response(res).view("home/signup", {
			title: lang.home.title,
			message: lang.home.message,
			destination: req.param("destination") || "dashboard"
		});
	},	

	dashboard: function(req, res) {

		policy(req, res).check(["logged_in"], function() { 
		
			var _user = model.find("user",  {

				_id: req.cookies.user_id

			}, function(results) {

				if(!results[0])
					response(res).redirect("/login")

				var u = results[0];

				response(res).view("home/dashboard", {

					title: "node-web-cluster",
					message: lang.home.message,
					user: u
				});

			});
		});		
	}
}