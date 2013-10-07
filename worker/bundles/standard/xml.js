
var util = require("util");
var parseString = require("xml2js").parseString;
var request = require("request");
var crypto = require("crypto");
var lang = require("../../../language").getDefault();

var model = require("../../../api/adapters/model");
var config = require("../../../config/bundles.json");

var XmlBundle = function(){
	
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
                var object = null;
                parseString(body, function(error, result){
                    
                    if(error)
                        throw new Error("Invalid Xml file");
                    
                    object = result;
                });
				
                var items = [];
                
                items.push(model.create("item", {
                    title: task.title,
                    content: body,
                    meta: object,
                    url: task.url
                }));
                 
                cb(items);
            }
            
        });
    
    }; exports.getItems = getItems;
	
	// class constructor
	var init = function(){
		return exports;
	}
	
	// return public methods
	return init();
};

module.exports = new XmlBundle();