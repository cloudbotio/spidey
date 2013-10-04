var response = require("../adapters/response");

var language = require("../../language");
var lang = language.getDefault();

module.exports = {
	
	index: function(req, res) {

		response(res).json({

			result: lang.response.error || "error",
			code: 500,
			message: lang.error.unknown || "unknown"

		}, 500);
	},

	not_found: function(req, res) {

		response(res).json({

			result: lang.response.error || "error",
			code: 404,
			message: lang.error.not_found || "not found"

		}, 404);
	}
}