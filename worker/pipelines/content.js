var S = require('string');
var natural = require('natural');
var classifier = require('classifier');
var config = require('../../config/text');
var state = config[config.state];

var async = require("async");
var log = require("winston");

var strip = config.strip;
var TfIdf = natural.TfIdf;

module.exports = function(context){

	var exports = {};
	var fn = function(){};

	function tags(input, cb) {

		var res = {};

		cb = cb || fn;

		for(var k in context) {

			var hist = {};
			var items = context[k] || [];

			//iterate over all items
			for(var i = 0; i < items.length; i++) {
				
				if(!items[i].text) 
					items[i].text = items[i].title + items[i].content;
				
				items[i].text = S(items[i].text).stripTags().s;
				wordexists(hist, items[i].text);
			}

			// get the percentage
			for(var x in hist) {
				hist[x] = (hist[x]/items.length);
			}

			res[k] = hist;
		}

		var res_arr = {};

		for(var j in res) {

			res_arr[j] = res_arr[j] || [];

			for(var k in res[j]) {
				if(res[j][k] > 0.10)
					res_arr[j].push({tag:k, value:parseFloat(res[j][k]).toFixed(2)});
			}

			res_arr[j].sort(compare);
			res_arr[j] = res_arr[j].slice(0, (res[j].length > 10 ? 10 : res[j].length));
		}

		cb(res_arr);

	}; exports.tags = tags;

	function sentiment(input, cb) {

		var res = {};
		var sentiment = require("../../config/text/sentiment");

		cb = cb || fn;

		try  {

			var res = {};
			var tot = 0;

			for(var k in context) {
				res[k] = sentiment.classify(context[k]);

				for(var j in res[k])
					tot = tot + res[k][j];

				for(var j in res[k])
					res[k][j] = (res[k][j] / tot);
			}

			cb(res);
		}

		catch(e) {

			throw new Error("Problem classifying documents. " + e.toString())
		}


	}; exports.sentiment = sentiment;

	function wordcnt(hist, text){

		var words = text.split(" ");

		for(var i in  words)
			if(words[i].length > 3 && parseInt(words) != null) {

				words[i] = clean_str(words[i]);

				//tests if is in strip list
				if(strip[words[i]] !== false){
					hist[words[i]] ? hist[words[i]] += 1 : hist[words[i]] = 1;
				}
		   	}
	};

	function wordexists(hist, text){

		var words = text.split(" ");
		var wordlist = {};

		for(var i in  words)
			if(words[i].length > 3 && parseInt(words) != null) {

				words[i] = clean_str(words[i]);

				//tests if is in strip list and if is in wordlist
				if(strip[words[i]] !== false && wordlist[words[i]] !== false){
					hist[words[i]] ? hist[words[i]] += 1 : hist[words[i]] = 1;
					wordlist[words[i]] = 1;
				}
		   	}
	};

	function clean_str(input)
	{
		input = input.replace(new RegExp("[áàâãª]", "gi"), "a");
		input = input.replace(new RegExp("[ÁÀÂÃ]", "gi"), "A");

		input = input.replace(new RegExp("[éèêë]", "gi"), "e");
		input = input.replace(new RegExp("[ÉÈÊË]", "gi"), "E");

		input = input.replace(new RegExp("[íìî]", "gi"), "i");
		input = input.replace(new RegExp("[ÍÌÎ]", "gi"), "I");

		input = input.replace(new RegExp("[óòôõº]", "gi"), "o");
		input = input.replace(new RegExp("[ÓÒÔÕ]", "gi"), "O");

		input = input.replace(new RegExp("[úùû]", "gi"), "u");
		input = input.replace(new RegExp("[ÚÙÛÜ]", "gi"), "U");

		input = input.replace(new RegExp("[ç]", "gi"), "c");
		input = input.replace(new RegExp("[Ç]", "gi"), "C");

		input = input.replace(new RegExp("[(){}]", "gi"), "");
		input = input.replace(new RegExp("[\[\]]", "gi"), "");

		// TODO: improve non-alphanumeric strip below
		return input.toLowerCase();
	}

	function compare(a, b) {
		for(var k in a)
			if (a.value < b.value)
				return 1;
		if (a.value > b.value)
			return -1;
		return 0;
	}

	function init(entity){
		return exports;
	};

	return init();
};
