// Configs for Content Pipeline

module.exports = {

	strip: {},
	strip_arr: ["para", "mais", "entre", "muito", "nesta", "foram", "pela"]
};

// convert arrray to object
var strip_arr = module.exports.strip_arr;

for(var i = 0; i < strip_arr.length; i++)
	module.exports.strip[strip_arr[i]] = false;