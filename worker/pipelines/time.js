var s = require("../../config/time");
var moment = require("moment");
moment().format();

// s = time span
// ex: s.minute = 60 //seconds

module.exports = function(context){

	var exports = {};

	function after(rest, cb) {

		cb = cb || function(){};

		var af = (typeof rest === typeof "str" ? rest :
			( rest.time !== {} ? rest.time["after"]: ""));

		var time_arr = af.split(' ');

		// expecting: "[n] [entities] ago"

		var time_arr = {
			entity: time_arr[1],
			value: parseInt(time_arr[0]),
			from: time_arr[2]
		}

		var limit = {};
		limit[time_arr.entity] = time_arr.value;

		var m = moment().startOf('minute');
		m = m.subtract(limit);

		var res = {};

		for(var k in context) {

			if(context[k].length) {

				for(var i = 0; i < context[k].length; i ++) {

					var t = context[k][i].pubDate || context[k][i].timestamp 
						|| context[k][i].time || "";

					if(moment(m).isBefore(moment(t).format())) {

						res[k] = (res[k] && res[k].length? res[k] : []);
						res[k].push(context[k][i]);
					}
				}
			}
		}

		cb(res);
		return;

	}; exports.after = after;


	function before(rest, cb) {

		cb = cb || function(){};

		var af = (typeof rest === typeof "str" ? rest :
			( rest.time !== {} ? rest.time["before"]: ""));

		var time_arr = af.split(' ');

		// expecting: "[n] [entities] ago"

		var time_arr = {
			entity: time_arr[1],
			value: parseInt(time_arr[0]),
			from: time_arr[2]
		}

		var limit = {};
		limit[time_arr.entity] = time_arr.value;

		var m = moment().startOf('minute');
		m = m.subtract(limit);

		var res = {};

		for(var k in context) {

			if(context[k].length) {

				for(var i = 0; i < context[k].length; i ++) {

					var t = context[k][i].pubDate || context[k][i].timestamp 
						|| context[k][i].time || "";

					if(moment(m).isAfter(moment(t).format())) {

						res[k] = (res[k] && res[k].length? res[k] : []);
						res[k].push(context[k][i]);
					}
				}
			}
		}

		cb(res);
		return;

	}; exports.before = before;

	function timestring(str, cb) {

		cb = cb || function(){};

		// perform logic to convert str to time		

		// expecting: "[after/before/null] [value] [entities] ago"

		// ex: "before 3 days ago"
		// ex: "after 3 year ago"

		if(is_str(str))
			var time_arr = str.split(' ');

		else if(is_str(context.time))
			var time_arr = context.time.split(' ');
			

		// "[before/after] [n] [entitiy] ago"
		// ex: "after 3 hours ago"
		if(time_arr.length > 3) {
			var time_arr = {
				cmd: time_arr[0],
				entity: time_arr[2],
				value: parseInt(time_arr[1]),
			}
		}

		// "[n] [entitiy] ago"
		// ex: "3 hours ago"
		else if (time_arr.length == 3) {
			var time_arr = {
				cmd: "after",
				entity: time_arr[1],
				value: parseInt(time_arr[0]),
			}
		}

		else {

			// TODO: throw interpreter exception
			cb(new Error("Error in time parsing. Check the time filter parameters are ok."));
		}

		// ----------- EXECUTE -------------//

		context = context || {};
		var input = "" + time_arr.value + " " + time_arr.entity + " ago";

		if(time_arr.cmd == "after")
			return after(input, cb);

		else if(time_arr.cmd == "before")
			return before(input, cb);

	}; exports.timestring = timestring;

	function strToDate(str, qtd) {
		if(parseInt(s[str]) === s[str])
			return qtd * s[str];
	}

	function is_str(str) {
		if(str && str.length)
			return str_equals(str, "");
		return false;
	}

	function str_equals(str1, str2) {
		return (str1 + str2 === str2 + str1? true : false);
	}

	function init() {
		return exports;
	}

	return init();
}