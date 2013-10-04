var queue = function(){

	var exports = {};
	var q = [];

	var push = function(data) {

		q.push(data);

	}; exports.push = push;

	var get = function(cb) {

		cb = cb || function(){};

		var task = q.shift() || false;

		if(task)
			cb(task);

	}; exports.get = get;

	var size = function() {

		return q.length;

	}; exports.size = size;

	var init = function() {

		if(queue.caller != queue.getInstance){
			throw new Error("This object cannot be instanciated");
		}

		return exports;
	}

	return init();
}
 
/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
queue.instance = null;

/**
 * singleton getInstance definition
 * @return queue class
 */
queue.getInstance = function(){
	if(this.instance === null){
		this.instance = new queue();
	}
	return this.instance;
}

module.exports = queue.getInstance();