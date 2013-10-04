var response = require("../adapters/response");
var model = require("../adapters/model");
var policy = require("../policies/");

var lang = require("../../language").getDefault();

var workerStorage = require("../../worker/storage");

module.exports = {
	
	// TODO: create method
	create: function(req, res) {
		
		policy(req, res).check(["authenticated"], function(){
			try {		
				
				var rule = model.create("rule", {
				
					owner: req.cookies.user_id,
					source: req.body.source,
					tunnel: req.body.tunnel,
					repeat: req.body.repeat
				
				});
					
				model.save(rule, function(r){
					
					if(r) {
						response(res).json({
							result: "success",
							message: "Rule created successfully!",
							data: {
								rule: rule
							}
						});
					}
					else
						response(res).json({
							result: "error",
							message: "The rule could not be created",
							code: 500
						});
				});	
			}
			catch(e) {
				
				response(res).json({
					result: "error",
					message: e.message.toString(),
					data: e,
					code: 500
				});
			}
		});
	},
	
	// TODO: get method	
	get: function(req, res) {
		
		try {
			policy(req, res).check(["authenticated"], function() { 
				
				var rule = req.param("rule") || req.param("rule_id") ||
					req.param("serie") || false;
				
				if(!rule)
					throw new Error("No rule defined");
				
				model.find("rule", {
					
					_id: req.param("rule"),
					owner: req.cookies.user_id
					
				}, function(docs) {
					
					try {
						if(!docs || !docs.length)
							throw new Error("The specified rule could not be accessed. "+
								"Please make sure you're the owner and the rule id is correct");
						
						rule = docs[0];
						
						workerStorage.getLatestAnalysis(rule._id, function(docs){
							
							if(docs && docs.length) {
								response(res).json({
									result: "success",
									message: "Lastest analysis report for the specified rule",
									data: docs[0].sanitize(docs[0])
								});
							}
							else {
								
								response(res).json({
									result: "error",
									message: "The rule is invalid or could not be analysed yet",
									code: 500
								});
							}
						})
					}
					
					catch(e) {
			
						response(res).json({
							result: "error",
							message: e.message.toString()
						});
			
						return;
					}
				});
			})
		}

		catch(e) {

			response(res).json({
				result: "error",
				message: e.message.toString()
			});

			return;
		}
	}
}