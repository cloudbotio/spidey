//////////////////////////////////////////
//										//
//	Response Model - Required model 	//
//	Default JSON schema for responses	//
//										//
//////////////////////////////////////////

module.exports = {
	
	result: {

		required: true,
		type: "string"

	},

	code: {

		required: true,
		type: "integer",
		defaultTo: 200

	},

	message: {

		required: false,
		type: "string"
	},

	data: {

		required: true,
		type: "object",
		defaultTo: {}
	}
}