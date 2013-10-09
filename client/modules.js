//////////////////////////////////////////////////////////
//														//
//	Custom Modules - App developer, edit here!			//
//														//
//////////////////////////////////////////////////////////

(function(window) {

	window.user_module = function(sandbox) {

		var exports = {};
		var broadcast = sandbox.broadcast;

		//////////////////////////////
		// 		user actions		//
		//////////////////////////////
		var me = function(data) {

			// call the api
			sandbox.api("user", {}, function(response) {
				broadcast.publish("user/me/" + response.result, 
					response.data.user || {});
			});

		}; exports.me = me;

		var login = function(data) {
	
			// call the api
			sandbox.api("user/login", {

				email: $("#email").val(),
				password: $("#password").val()

			}).error(function(response){

				// broadcast problem with login
				broadcast.publish("user/login/" + response.result, 
					response || {});
				
			}).success(function(response) {

				// broadcas to whole app
				broadcast.publish("user/login/" + response.result, 
					response.data.user || response || {});

				if($("#destination").val())

					// render destination controller
					core.client.redirect($("#destination").val());

				else

					// render dashboard controller
					core.client.redirect("/");

			}).get()

		}; exports.login = login;

		var logout = function(data) {

			// call the api
			sandbox.api("user/logout", {}).error(function(response) {

				broadcast.publish("user/logout/" + response.result, response || {});

			}).success(function(){

				core.client.redirect("/");

			}).error(function(){

				core.client.redirect("/");

			}).get();

		}; exports.logout = logout;

		var signup = function(data) {

			// call the api
			sandbox.api("user/signup", {

				name: $("#name").val(),
				email: $("#email").val(),
				password: $("#password").val()

			}).success(function(response) {

				broadcast.publish("user/signup/" + response.result, response || {});
				core.client.render("/");

			}).error(function(response){

				broadcast.publish("user/signup/" + response.result, response || {});

			}).get();

		}; exports.signup = signup;

		function init() {

			core.log.info("starting user module...")
			return exports;

		}; exports.init = init;

		function destroy() {

			core.log.info("destroying user module...")
			
		}; exports.destroy = destroy;

		return exports;
	}
	
	window.graph_module = function(sandbox) {
		
		var exports = {};
		
		var plot = function(data) {
			new Morris.Area(data);			
		};
		
		var init = function(){
			
			core.log.info("initializing graph module...");
			sandbox.broadcast.subscribe("graph/plot", plot);
			return exports;
			
		}; exports.init = init;
		
		var destroy = function(){
			
			core.log.info("destroying graph module...")
			
		}; exports.destroy = destroy;
		
		return exports;
	};
	
	window.rule_module = function(sandbox) {
		
		var exports = {};
		
		var parseResumeObject = function(obj) {
			
			var binding = {
				price: {
					x: "max",
					y: "medium",
					z: "min"
				}
			};
			
			var res = {
				time: obj.time
			};
			
			obj = obj.values;
						
			for(var k in obj) {
				
				if(binding[k]) {
					
					if(typeof binding[k] === typeof "str")
						res[k] = obj[k];
					
					else if(typeof binding[k] === typeof {}) {
						
						for(var l in binding[k]) {
							if(typeof binding[k][l] === typeof "str"
							  && obj[k][binding[k][l]])
								res[l] = obj[k][binding[k][l]];
						}
					}
				}
			}
			
			return res;			
		}
		
		var plot_resume = function() {
			
			$("[data-graph][data-type='resume']").each(function(){
				
				var graph_id = $(this).attr("id");
				
				sandbox.api("rule/span")				
					.data({
						id: $(this).attr("data-graph"),
						time: $(this).attr("data-time") || "3 days ago"
					})
					.success(function(response){
					
						if(response.result != "success") throw new Error(response.message);
						
						var val = [];
						
						for(var i = 0; i < response.data.values.length; i++)
							val.push(parseResumeObject(response.data.values[i]));
							
						sandbox.broadcast.publish("graph/plot", {
							element: graph_id,
							data: val,
							xkey: 'time',
							lineWidth: 0,
							grid: false,
							pointSize: 0,
							ykeys: ['x', 'y', 'z'],
							labels: ['max', 'medium', 'min'],
							behaveLikeLine: true,
							fillOpacity: 1,
							lineColors: ['#ffce55', '#379ca8', '#ee6969']
						});
					})
					.error(function(response) {
						
						console.log(response);
						
					})
					.get();
			});
			
		}; exports.plot_resume = plot_resume;
		
		var create = function() {
			
			var src = {
				bundle: $("#bundle").val()
			};
			
			if($("#url").val())
				src.url = $("#url").val()
				
			if($("#query").val())
				src.q = $("#query").val()
			
			sandbox.api("rule/create")
				.data({
					source: src,
					tunnel: {					
						steps: [
							{
								pipeline: $("#pipeline").val().toLowerCase(),
								method: $("#method").val().toLowerCase()
							}
						]
					},
					repeat: 15})
				.success(function(response) {
					
					if(response.result == "success")
						app.client.render("/rules");
					
					else
						// TODO: improve error handling
						core.log.info(response);
										
				})
				.error(function(response) {
					
					// TODO: improve error handling
					core.log.info(response);
					
				}).post();
			
		}; exports.create = create;
		
		var init = function() {
			
			sandbox.broadcast.subscribe("pipeline/change", function() {
				var map = {
					statistic: "Resume",
					content: "Tags",											
				};
				$("#method").val(map[$("#pipeline").val()]);
			});	
			
			core.log.info("starting rule module...");
			return exports;
			
		}; exports.init = init;
		
		var destroy = function(){
			
			core.log.info("destroying rule module...");
			
		}; exports.destroy = destroy;
		
		return exports;
	}

	//////////////////////////////////////////////////////////
	//														//
	//	Standard Modules - Framework default (don't edit!)	//
	//														//
	//////////////////////////////////////////////////////////
	window.error_module = function(sandbox) {

		var exports = {};
		var broadcast = sandbox.broadcast;
		
		//////////////////////////////
		// 		error actions		//
		//////////////////////////////
		broadcast.subscribe("app/ready", function(data) {

			window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
				sandbox.broadcast.publish("error", {
					description: errorMsg || "unknown",
					url: url || "unknown",
					line: lineNumber || "unknown"
				})
			}
		});

		broadcast.subscribe("error", function(data) {
			core.log.error("Error Module: Unhandled error thrown by application.");
			core.log.error(data || {description: "unknown"});

			alert("Oops, The app has crashed!");
		});

		var init = function() {

			core.log.info("starting error module...")

			var broadcast = sandbox.broadcast;

			return exports;

		}; exports.init = init;

		var destroy = function() {

			core.log.info("destroying error module...")
			
		}; exports.destroy = destroy;

		return exports;		
	}

})(window)