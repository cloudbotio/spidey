var config = require("../config/general");
var fs = require("fs");
var path = require("path");
var vsprintf = require("format").vsprintf;

var Language = function(default_lang) {

	var exports = {};
	var lang = null;

	var get = function(_lang) {

		try {

			lang = _lang;

			if(fs.existsSync(path.join(__dirname, lang + ".js")))
				dict = require("./" + lang);

			else if(fs.existsSync(path.join(__dirname, lang + ".json")))
				dict = require("./" + lang + ".json");				

			else
				throw new Error();
		}
		catch(e) {

			throw new Error("Invalid or unknown dictionary for '" + lang + "' language.");
		}

		return dict;

	}; exports.get = get;

	var val = function() {

		if(!arguments.length)
			throw new Error("No string id supplied");

		// args: id, var1, var2, var3
		var id = arguments[0];
		id = id.split('.') || id;

		var args = [];

		for(var k in arguments)
			args.push(arguments[k]);

		var str = getDefault()[id[0] || id + ""];

		for(var i = 1; i < id.length; i++)
			str = str[id[i]];

		if(!args.length)
			return str;
		else
			return vsprintf(str, args);

	}; 

	exports.val = val; 
	exports.value = val;

	var getDefault = function() {

		var _lang = config.language || 
			config.lang || 
			config.i18n || 
			config.locale;

		try {

			if(!_lang)
				throw new Error();

			lang = _lang;
			return get(lang);
		}

		catch(e) {

			throw e;
		}

	}; exports.getDefault = getDefault;

	var init = function() {
		lang = default_lang || getDefault();
		return exports;
	}
	
	return init();
};

module.exports = new Language();