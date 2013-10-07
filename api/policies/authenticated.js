var response = require("../adapters/response");

var language = require("../../language");
var lang = language.getDefault();

module.exports = function(req, res, ok) {

	if(req.cookies.authenticated == "true"
	  && req.cookies.user_id) {

		ok();
	}
	
	else if (req.param("access_token")) {
		
		model.find("user", {
			
			access_token: req.param("access_token"),
			
		}, function(docs) {
			
			if(!docs || !docs.length)
				response(res).json({
					result: "error",
					message: "access token supplied is not valid"
				});
			else
				ok();			
		});
		
	}

	else {
		response(res).json({

			result: "error",
			message: lang.user.not_logged_in || "you're not logged in"
		});
	}

}