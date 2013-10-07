var response = require("../adapters/response");
var model = require("../adapters/model");
var policy = require("../policies/");

var lang = require("../../language").getDefault();

module.exports = {
	
	index: function(req, res) {

		policy(req, res).check(["logged_in"], function() { 
		
			var _user = model.find("user",  {

				_id: req.cookies.user_id

			}, function(results) {

				if(!results[0])
					response(res).redirect("/login")

				var u = results[0];

				response(res).view("dashboard/index", {

					title: "Dashboard",
					message: lang.home.message,
					user: u
				});
			});
		});		
	}
}