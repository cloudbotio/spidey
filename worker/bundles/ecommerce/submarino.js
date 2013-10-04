var Bundle = require("../bundle");
var model = require("../../../api/adapters/model");
var config = require("../../../config/bundles.json");

var Submarino = function (config) {
	
	var exports = {};
	var task = null;
	var api_url = null;
	
	var setTask = function(t) {
		task = t;
	}; exports.setTask = setTask;
	
	var getItems = function(cb) {
	
		// check required parameters
		if(!task)
			throw new Error(lang.bundle.no_task || "Invalid or incorrect task specification");
			
		if(!task.q)
			throw new Error(lang.bundle.no_query || "Missing or invalid query string");
		
		var scrapper = new Bundle("scrapper", {
			url: config.submarino.search_url,
			q: task.q,
		});
		
		scrapper.get(function($){
            
			var items = [];
          
            //build title array
            var titles = $('.short-product-name');
        
            //build content array
            var contents = $('.description');
            
            //build url array
            var urls = $('.url');
            
            //build amount array
            var amounts = regexExport($(".amount").text(), /[0-9:]/g);
        
            for(var i = 0;i<20; i++){
                items.push(model.create("item", {
                                
                    title: $(titles[i]).text(),
                    content: $(contents[i]).text().trim()!=="" ? $(contents[i]).text() : $(titles[i]).text() ,
                    meta: {
                        price: amounts[i+1],
                        currency: "BRL"
                    },
                    url: $(urls[i]).attr().href.split("?link=")[1]
                }));
                
            }
            cb(items);
		});
		
	}; exports.getItems = getItems;
	
    //export price from $('.amount').text selector in submarino and americanas search
    var regexExport = function extractSummary(iCalContent, patt) {
        var match = iCalContent.match(patt);
        var result = match.join().replace(/,/g,"");
        result = result.split(":");
        delete result[0];
        for(var j=1; j<=20; j++){
            result[j] = [result[j].slice(0, result[j].length-2), ".", result[j].slice(result[j].length-2)].join('');
            result[j] = parseFloat(result[j]);
        }
        return result;
    }
    
	var init = function(config) {
		return exports;
	};
	
	return init(config);
}

module.exports = new Submarino(config);