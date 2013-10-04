var log = require("winston");
var path = require("path");

var classifier = require("classifier");
var _dict = require('./_dictionary.json');
var fs = require('fs');

var CLASSIFIER_TRAINED_PATH = "_trained.json";

var Dictionary = function(dict) {

	var exports = {};

	function expand(docs, arr, tag) {

		if(toString.call(arr) == toString.call("str"))
			arr = [arr];

		var _docs = [];
		arr = arr || [];

		for(var i = 0; i < docs.length; i++) {
			for(var j = 0; j < arr.length; j++) {

				_docs.push(docs[i].replace("%(" + tag + ")", arr[j].text || arr[j]));

				if(arr[j].female)
					_docs.push(docs[i].replace("%(" + tag + ")", arr[j].female));
			}
		}

		return _docs;
	}

	function feeling_map() {

		var res = {negative:[], positive:[]};
		var tmp = {negative:[], positive:[]};

		for(var i = 0; i < dict.nouns.length; i++) {

			if(dict.nouns[i].value < 0)
				tmp.negative.push(dict.nouns[i]);

			else if(dict.nouns[i].value > 0)
				tmp.positive.push(dict.nouns[i]);
		}

		res.negative = expand(dict.sentences, tmp.negative, "noun");
		res.positive = expand(dict.sentences, tmp.positive, "noun");

		tmp.positive = [];
		tmp.negative = [];

		for(var j = 0; j < dict.adjectives.length; j++) {

			if(dict.adjectives[j].value < 0)
				tmp.negative.push(dict.adjectives[j]);
			
			else if(dict.adjectives[j].value > 0)
				tmp.positive.push(dict.adjectives[j]);
		}

		res.negative = expand(res.negative, tmp.negative, "adjective");
		res.positive = expand(res.positive, tmp.positive, "adjective");

		return res;

	}; exports.feeling_map = feeling_map;

	function init() {
		return exports;
	}

	return init();
}

var async = require("async");
var natural = require("natural");
var classifier = new natural.BayesClassifier();

var Sentiment = function(dict) {

	var _feeling_map = null;

	function classify(col) {

		if(toString.call(col) == toString.call("str"))
			col = [col];

		col = col || [];

		var res = {}
		var tasks = [];

		for(var i = 0; i < col.length; i++) {

			var str = col[i].title && col[i].content ? 
				col[i].title +" "+ col[i].content :
				col[i].content || col[i] || "";

			var analysis = classifier.getClassifications(col);

			for(var j  = 0; j < analysis.length; j++) {
				res[analysis[j].label] = (res[analysis[j].label] || 0) + analysis[j].value;
			}
		}

		return res;

	}; exports.classify = classify;

	function init() {

		var fs = require("fs");

		try {

			if(fs.existsSync(path.resolve(__dirname, CLASSIFIER_TRAINED_PATH))) {

				var raw = fs.readFileSync(path.resolve(__dirname, CLASSIFIER_TRAINED_PATH));
				classifier = natural.BayesClassifier.restore(JSON.parse(raw));
				log.info("Classifier loaded from json file.")
			}
			
			else {

				_feeling_map = dict.feeling_map();

				// index map
				for(var k in _feeling_map) {

					for(var i = 0; i < _feeling_map[k].length; i++)
						classifier.addDocument(_feeling_map[k][i], k);
				}

				classifier.train();

				classifier.save(path.resolve(__dirname, CLASSIFIER_TRAINED_PATH), function(err, classifier) {
					log.info("Trained classifier created.")
				});
			}

			return exports;
		}

		catch(e) {

			throw new Error("Problem training classifier. " + e.toString())
		}
	}

	return init();
}

module.exports = new Sentiment(new Dictionary(_dict));