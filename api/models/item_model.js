module.exports = {
	
	title: {

		required: true,
		type: "string"

	},

	content: {

		required: true,
		type: "string"
	},
	
	url: {

		required: true,
		type: "string"
	},
	
	pubDate: {

		required: true,
		type: "string",
		defaultTo: function(){
			return new Date().toISOString()
		}
	},
	
	time: {
		
		required: true,
		type: "object",
		defaultTo: function(){
			
			var d = new Date();
			
			return {
				minute: d.getMinutes(),
				hour: d.getHours(),
				day: d.getDate(),
				month: d.getMonth() + 1,
				year: d.getFullYear()
			}
		}
	},
	
	meta: {
		
		required: false,
		type: "object"
	}
}