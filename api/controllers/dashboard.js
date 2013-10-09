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
	},
	
	rules: function(req, res) {
		
		policy(req, res).check(["logged_in"], function() { 
		
			var _user = model.find("user",  {

				_id: req.cookies.user_id

			}, function(results) {

				if(!results[0])
					response(res).redirect("/login")

				var u = results[0];
				
				model.find("rule", {
					owner: u._id,
				}, function(r) {
					response(res).view("dashboard/rules", {
	
						title: "My Rules",
						user: u,
						rules: r
					});
				});
			});
		});
	},
	
	rule_resume: function(req, res) {
		
		policy(req, res).check(["logged_in"], function() { 
		
			var _user = model.find("user",  {

				_id: req.cookies.user_id

			}, function(results) {

				if(!results[0])
					response(res).redirect("/login")

				var u = results[0];
				
				model.find("rule", {
					
					_id: req.param("id"),
					
				}, function(r) {
					
					response(res).view("dashboard/rule_resume", {
						title: "My Rules",
						user: u,
						rule: r[0] || r,
						results: [],
						type: t
					});
				});
			});
		});
	},
	
	rule_create: function(req, res) {
		
		policy(req, res).check(["logged_in"], function() { 
		
			var _user = model.find("user",  {

				_id: req.cookies.user_id

			}, function(results) {

				if(!results[0])
					response(res).redirect("/login")

				var u = results[0];	
				var bundle_map = require("../../worker/bundles/map");
				var b = [];
				
				for(var k in bundle_map)
					b.push(k);
				
				response(res).view("dashboard/rule_create", {
					title: "My Rules",
					user: u,
					bundles: b,
					repeat: [15, 30, 60]
				});
			});
		});	
	},
	
	pipelines: function(req, ser) {
		return null;
	},
	
	settings: function(req, ser) {
		return null;
	}
}