#!/bin/env node

//////////////////////////////////////////////
//											//
//	Node Web Cluster - Deployment Routines	//
//											//
//////////////////////////////////////////////

var forever = require("forever");
var log = require("winston")

try {

	log.info("stopping all forever forks")
	forever.stopAll()	
}
catch(e) {

	// ooops
	log.error("ooops, forever could not be stopped!");
	throw e;
}