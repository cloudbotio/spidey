module.exports = function(context){

	var exports = {};

	function merge(input, cb) {

		// TODO: merge all collections
		// in context;

		// ex: if context looks like:

		// context = {
		//		smartphone: [ (items) ],
		//		samsung: [ (items) ]   
		// }

		// it will return something like:
		// context = [ (items) ]

		return null;
	};

	function unmerge(input, cb) {

		// input should say which
		// will be the unmerge restriction.

		// (ex: rule, bundle, date...)

		return null;
	}

	function interval(input, cb) {

		// TODO: separate items in intervals
		// input should give the interval

		// ex: if context looks like:

		// context = [ (items) ]

		// it will return something like:

		// context = {
		// 		"today": [ (items) ],
		//		"week": [ (items) ],
		//		"month": [ (items) ]
		//		"year": [ (items) ]
		//
		//				(...)
		// }

		// ____________ OR ____________ //

		// context = {
		// 		"today": [ (items) ],
		//		"yesterday": [ (items) ],
		//		"2 days ago": [ (items) ]
		//		"3 days ago": [ (items) ]
		//
		//				(...)
		// }

		// ____________ OR ____________ //

		// context = {
		// 		"price": {
		//			"less than R$ 500,00": [ (items) ],
		//			"from R$ 500,00 to R$ 1000,00": [ (items) ],
		//			"greater than R$ 1000,00": [ (items) ],
		//
		//				(...)
		// }

	}

	function init() {
		return exports;
	}

	return init();
}