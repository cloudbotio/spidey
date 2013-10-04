module.exports = function(context){
	
	var exports = {};

	function resume(input, cb) {

		var res = {};
		
		
		for(var k in context) {
			
			var items = context[k];
			
			cb = cb || fn;
			items = items || {};
			
			//iterate over all items
			for(var i = 0; i < items.length; i++) {
				if(items[i].meta) {
					var meta = items[i].meta;
					for(var j in meta) {
						if(typeof meta[j] === typeof 0.0) {
							var value = parseFloat(meta[j]);
							res[j] = res[j] || {};
							res[j].sum = value + (res[j].sum != null ? res[j].sum : 0);
							res[j].cnt = 1 + (res[j].cnt != null ? res[j].cnt : 0);
							res[j].min = res[j].min == null ? value : (value < res[j].min ? value : res[j].min);
							res[j].max = res[j].max == null ? value : (value > res[j].max ? value : res[j].max);
						}
						else if(meta[j].value && typeof meta[j].value === typeof 0.0) {
							
							var value = parseFloat(meta[j].value);
							res[j] = res[j] || {};
							res[j].sum = value + (res[j].sum != null ? res[j].sum : 0);
							res[j].cnt = 1 + (res[j].cnt != null ? res[j].cnt : 0);
							res[j].min = res[j].min == null ? value : (value < res[j].min ? value : res[j].min);
							res[j].max = res[j].max == null ? value : (value > res[j].max ? value : res[j].max);
						}
					}
				}
			}
		}
		for(var k in res) {
			
			res[k].medium = res[k].sum / res[k].cnt;
			delete res[k].sum;
			delete res[k].cnt;
			
		}
			
		if(res)
			cb(res);

		else
			cb(new Error("No attribute suitable to resume."));
		
	}; exports.resume = resume;

	function init() {
		return exports;
	}

	return init();
}