var lang = require("../../language");

module.exports = {
	
	name: {

		required: true,
		type: "string"

	},

	email: {

		required: true,
		type: "email"

	},

	password: {

		required: true,
		type: "password",

		// default: sha256
		encryption: "sha256"
	},

	credit: {

		// sample credit card
		required: false,
		type: "string",

		validate: function(number) {

			// sample validation
			if(number.length < 8)
				throw new Error(lang.user.invalid_card || "The credit card should be at least 8 characters long");

			return true;
		}
	},

	access_token: {

		required: true,
		type: "string"

	},

	role: {

		required: true,
		type: "string",
		defaultTo: "user"
	},

	_sanitize: function(_this) {

		if(_this.password)
			delete _this.password;

		if(_this._timestamp) {
			_this.created = _this._timestamp;
			delete _this._timestamp
		}

		if(_this.timestamp) {
			_this.created = _this.timestamp;
			delete _this.timestamp
		}
	},

	toJSON: function(_this){

		delete _this.password;
		return JSON.stringify(_this);
	}
}