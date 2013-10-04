module.exports = {

	response: {

		// do not change unless you know what you're doing
		success: "success",
		error: "error",
		unhandled_error: "Problem serving app response"
	},

	// Error Handling
	error: {

		unknown: "Unknown error: %s",

		// Error Levels
		critical: "Critical",
		warning: "Warning",

		// HTML Errors
		not_found: "Page not found",
		internal: "Internal server error",
	},
	
	interpreter: {
		no_bundle: "Invalid task, no bundle specified",
	},
	
	bundle: {
		invalid: "Invalid or incorrect Bundle",
		no_url: "Missing or invalid url",
		no_task: "Invalid or incorrect task specification",
		no_query: "Invalid or incorrect query specification",
	},

	type: {

		unknown: "Specified type is not recognized",

		// validation errors
		not_null: "The input should not be null",
		not_numeric: "Input is not a number",
		not_integer: "Input is not an integer",
		not_string: "The input should be a string",
		not_encrypted: "The input is not encrypted",
		not_enough_length: "The input should be at least 8 characters length",
		not_email: "The input is not a valid email",
		not_valid_domain: "The input is not a valid domain",
		not_object: "The input is not a valid object",
		not_array: "The input is not a valid array",
	},

	model: {

		encryption_error: "Problem encrypting string",
		hash_error: "Problem generating random hash",
		validation_error: "Problem parsing required field",
		not_from_framework: "Object provided is not from any framework model, we can't persist it",
		not_primary_key: "Object provided has none primary key, the default '_id' was removed"
	},

	database: {
		query_error: "Problem querying database"
	},

	home: {

		title: "spidey.cloudbot.io",
		message: "Welcome to the index page!"
	},

	user: {

		email_registered: "Email already registered",
		create_success: "User created successfully",
		create_error: "User could not be created",

		not_logged_in: "User not logged in",

		invalid_credentials: "Invalid or incorrect credentials",
		login_success: "User logged in successfully",
		login_error: "User could not be logged in",

		logout_success: "User logged out successfully",
		logout_error: "User could not be logged out",

		forbidden_access: "Forbidden access. You're not a root user"
	}
}