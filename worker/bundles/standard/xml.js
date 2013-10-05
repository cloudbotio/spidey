var XmlBundle = function(){
	
	var exports = {};
	
	var getItems = function(){
		
		return sample_private();
		
	}; exports.getItems = getItems;
	
	// class constructor
	var init = function(){
		return exports;
	}
	
	// return public methods
	return init();
};

module.exports = new XmlBundle();