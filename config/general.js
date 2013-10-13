module.exports = {

	state: "production",
	lang: "en-US",

	development: {

		port: 3000,

		cluster: {

			max: 1
		},

		db: {
	
			protocol: "mongodb://",

			user: "root",
			password: "",

			db: "main",
			host: "localhost"
		},
		
		workers: 1,
		watchers: 1
	},

	test: {

		port: 3000,

		cluster: {
		
			max: 3
		},

		db: {
	
			protocol: "mongodb://",

			user: "root",
			password: "",

			db: "main",
			host: "localhost"
		},
		
		workers: 1,
		watchers: 1
	},

	production: {

		port: 3000,

		db: {
		
			protocol: "mongodb://",
			
			user: "spidey",
			password: "node",
			
			db: "app18488358",
			host: "nikki.mongohq.com",
			port: 10056,
		},
		
		workers: 1,
		watchers: 1
	}
}