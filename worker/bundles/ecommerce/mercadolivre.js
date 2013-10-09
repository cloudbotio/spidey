var util = require("util");
var request = require("request");
var curl = require('node-curl');

var lang = require("../../../language").getDefault();

var model = require("../../../api/adapters/model");
var config = require("../../../config/bundles.json");

var log = require("winston");

var Mercadolivre = function(){

	var exports = {};
	var task = null;
	var user_url = null;
	var search_url = null;

	var setTask = function(t) {
		task = t;
	}; exports.setTask = setTask;

	var getItems = function(cb){
		
		// check required parameters
		if(!task)
			throw new Error(lang.bundle.no_task || "Invalid or incorrect task specification");

		if(!task.q)
			throw new Error(lang.bundle.no_query || "Missing or invalid query string");

		search_url = util.format(search_url, task.q);
		
		curl(search_url, {SSLVERSION: 3}, function(error, response) {
			
			var body = response.body;
			
			console.log('2b');

			if(error){
				console.log('3a '+error);

				throw new Error(util.format(lang.scrapper.problem, err.toString()) ||
							"Problem scrapping webpage: " + err.message.toString());

			} else if (response.status == 200) {
				console.log('3b');

				var list = JSON.parse(body)["results"];
				var items = [];

				console.log('4');
				for(var i = 0; i < list.length; i++) {
					console.log('5 > '+i);

					var product = list[i];

					try {

						if(!product.permalink)
							throw new Error("No url for product");

						var url = product.permalink;
						var subtitle = null;
						var name = null;
						var thumb = null;

						if(product.thumbnail)
							thumb = product.thumbnail;

						if(product.subtitle)
							subtitle = product.subtitle;
						else
							subtitle = product.title;

						name = getAuthor(product.seller);

						items.push(model.create("item", {
							title: product.title,
							content: subtitle,
							meta: {
								author: name,
								thumbnail: thumb,
								price: {
									currency: product.currency_id,
									value: product.price
								}
							},
							url: url
						}));
					} catch(e) {
						console.log("Problem creating item in Mercadolivre Bundle. " + err.message.toString());
						throw e;
					}
				}

				cb(items);
			}
		})

	}; exports.getItems = getItems;

	function getAuthor(author){
		var name = "";
		var request = require('request');

		request(util.format(user_url, author.id), function (error, response, body) {

			if(error)
				throw new Error(util.format(lang.scrapper.problem, err.toString()) ||
							"Problem scrapping webpage: " + err.message.toString());

			else if (response.statusCode == 200) {
				name = JSON.parse(body)["nickname"];
			}
		});

		return name;
	}

	var init = function(){

		if(!config["mercadolivre"])
			throw new Error("Could not load Mercadolivre API configuration file");

		user_url = config["mercadolivre"].user_url;
		search_url = config["mercadolivre"].search_url;

		return exports;
	}

	return init();
};

module.exports = new Mercadolivre();
