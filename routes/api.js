module.exports = {

	"error": "error/not_found",

	/*
	 * GET methods
	 */
	"get": {

		// views
		"/login": "login",
		"/": "dashboard",
		"/rules": "dashboard/rules",
		"/rules/resume": "dashboard/rule_resume",
		"/rules/create": "dashboard/rule_create",
		"/pipelines": "dashboard/pipelines",
		"/settings": "dashboard/settings",

		// api
		"/api/user": "user",
		"/api/user/signup": "user/signup",
		"/api/user/login": "user/login",
		"/api/user/logout": "user/logout",
		"/api/user/rules": "user/rules",
		
		"/api/rule/get": "rule/get",
		"/api/rule": "rule/span",
		"/api/rule/span": "rule/span",
				
		"/api/test/get": "test/get"
	},

	/*
	 * POST methods
	 */
	"post": {
		
		// api
		"/api/rule/create": "rule/create",
		"/api/rule": "rule/get",
		"/api/rule/get": "rule/get",		
		
		"/test/post": "test/post"
	},

	/*
	 * PUT methods
	 */
	"put": {
		"/test/put": "test/put"
	}
};