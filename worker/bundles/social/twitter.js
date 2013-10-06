var util = require("util");
var request = require("request");
var lang = require("../../../language").getDefault();

var model = require("../../../api/adapters/model");
var config = require("../../../config/bundles.json");

var Twitter = function(){
	
	var exports = {};
    var task = null;
	
	var setTask = function(t) {
		task = t;
	}; exports.setTask = setTask;
    
	var getItems = function(cb){
        
        // check required parameters
		if(!task)
			throw new Error(lang.bundle.no_task || "Invalid or incorrect task specification");
			
		if(!task.q)
			throw new Error(lang.bundle.no_query || "Missing or invalid query string");
        
		var util = require('util'),
        twitter = require('twitter');
        
        //TODO: change api data to real envoirment attributes
        var twit = new twitter({
            consumer_key: 'VpgspDrpfYoJ9cCeNN7rng',
            consumer_secret: 'NoYAIEGfPzjRn9tApDBFaRP53Ks8e82FTpMN66TpCY',
            access_token_key: '1939091359-9WlXiccEuecI25hzY1Xi4wDRtjtEAwwM2zb7wA0',
            access_token_secret: 'NIkMFM3Rqciki8hetLaXW4XkbuL5iUiklzKOxmXQ'
        });
        
        var items = [];
        
        //TODO: stable twitter api
        twit.search(task.q, function(data) {
            var tweetUrl = null;
            tweets = data.statuses;
            for(var i=0;i<tweets.length; i++){
                
                //logical of url tweet
                if(tweets[i].retweeted_status){
                    tweetUrl = "https://twitter.com/" + tweets[i].retweeted_status.user.screen_name + "/status/" + tweets[i].retweeted_status.id_str;
                }else{
                    tweetUrl = "https://twitter.com/" + tweets[i].user.screen_name + "/status/" + tweets[i].id_str;
                }
                
                items.push(model.create("item", {        
                    title: tweets[i].text,
                    content: tweets[i].text,
                    meta: {
                        entities : tweets[i].entities,
                        geo : tweets[i].geo,
                        id : tweets[i].id,
                        lang : tweets[i].lang,
                        user : tweets[i].user
                    },
                    url: tweetUrl,
                    pubDate: new Date(tweets[i].created_at).toISOString()
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

module.exports = new Twitter();