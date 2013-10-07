module.exports = {
	
	rule: {
		
		required: true,
		type: "string"
	},
	
	time: {
		
		required: true,
		type: "integer"
	},
	
	values: {
		
		required: true,
		type: "object"
	},
	
	time_entities: {
		required: true,
		type: "object",
		
		defaultTo: function() {
			
			var now = new Date();
			
			return {
				minutes: now.getMinutes(),
				hours: now.getHours(),
				day: now.getDay(),
				month: now.getMonth(),
				year: now.getFullYear()
			}
		}
	}
}