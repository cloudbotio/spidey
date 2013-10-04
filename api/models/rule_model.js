module.exports = {
	
	owner: {

		required: true,
		type: "string"

	},

	source: {
		
		required: true,
		type: "object",
		
		validate: function(src) {
		
			if(!src.bundle)
				throw new Error("No bundle specified in Source");
		
			return true;		
		}
	},
	
	tunnel: {

		required: true,
		type: "object",
		
		validate: function(p) {
		
			if(!p.steps || !p.steps.length)
				throw new Error("No pipeline steps specified.");
			else
				return true;		
		}
	},
	
	repeat: {

		required: true,
		type: "integer",
		defaultTo: 15
	},
	
	next: {
		
		required: true,
		type: "integer",
		
		defaultTo: (new Date()).getTime()
	}
}