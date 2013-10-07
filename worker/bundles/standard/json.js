
var util = require("util");
var request = require("request");
var crypto = require("crypto");
var lang = require("../../../language").getDefault();

var model = require("../../../api/adapters/model");
var config = require("../../../config/bundles.json");

var JsonBundle = function(){
	
    var exports = {};
    var task = null;
	
	var setTask = function(t) {
		task = t;
	}; exports.setTask = setTask;
    
	var getItems = function(cb){
        
     // check required parameters
		if(!task)
			throw new Error(lang.bundle.no_task || "Invalid or incorrect task specification");
			
		if(!task.url)
			throw new Error(lang.bundle.no_query || "Missing or invalid url string");
		
        if(!task.title)
            task.title = crypto.createHash("sha256").update(new Date().toISOString()).digest("hex").replace(/\W/g, '');
        
		request(task.url, function (error, response, body) {
			
			if(error){
				throw new Error(util.format(lang.scrapper.problem, err.toString()) || 
							"Problem scrapping webpage: " + err.message.toString());
			
            }else if (response.statusCode == 200) {
				
                var items = [];
                
                items.push(model.create("item", {
                    title: task.title,
                    content: body,
                    meta: JSON.parse(body),
                    url: task.url
                }));
            }
            
            cb(items);
        });
    
    }; exports.getItems = getItems;
	
	// class constructor
	var init = function(){
		return exports;
	}
	
	// return public methods
	return init();
};

module.exports = new JsonBundle();