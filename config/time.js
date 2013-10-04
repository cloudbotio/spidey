var moment = require('moment');
moment().format();

module.exports = new function(){
	
	var exports = {span:{}};

	var s = exports.span = {};

	exports.span = {

		second: 1,
		minute: 60 * s.second,
		hour: 60 * s.minute,

		day: 24 * s.hour,
		week: 7 * s.day,
		month: 4 * s.week,

		bimester: 2 * s.month,
		trimester: 3 * s.month,
		semester: 2 * s.trimester,

		year: 2 * s.semester
	}

	return exports;
}