var response = require("../adapters/response");
var model = require("../adapters/model");
var policy = require("../policies/");
var interval = require("interval");

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
	
	get: function(req, res) {
		
		policy(req, res).check(["authenticated"], function() { 
			
			try {
				
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
			}
			
			catch(e) {

				response(res).json({
					result: "error",
					message: e.message.toString()
				});
	
				return;
			}
		})
	},
	
	span: function(req, res) {
		
		policy(req, res).check(["authenticated"], function() { 
			
			try {
				
				var rule = req.param("rule") || req.param("id") || false;
				
				if(!rule)
					throw new Error("No rule defined");
				
				if(!req.param("time"))
					throw new Error("No time restriction defined");
				
				model.find("rule", {
					
					_id: req.param("rule") || req.param("id"),
					owner: req.cookies.user_id
					
				}, function(docs) {
					
					try {
						if(!docs || !docs.length)
							throw new Error("The specified rule could not be accessed. "+
								"Please make sure you're the owner and the rule id is correct");
						
						rule = docs[0];
						
						var timespan = {};
						var rest = req.param("time").split(" ");
						
						timespan.max = (new Date()).getTime();
						timespan.min = {};
						timespan.min[rest[1]] = parseInt(rest[0]);
						
						timespan.min = interval.subtract(new Date(), timespan.min).getTime()
						
						workerStorage.getTimeSpan(rule._id, timespan, function(docs){
							
							if(docs && docs.length) {
								
								for(var i = 0;  i < docs.length; i++)
									docs[i] = docs[i].sanitize(docs[i]);
								
								response(res).json({
									result: "success",
									message: "Latest analysis reports for the specified rule",
									data: {
										values: docs
									}
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
			}
			
			catch(e) {

				response(res).json({
					result: "error",
					message: e.message.toString(),
					data: e
				});
	
				return;
			}
		})
	}
}