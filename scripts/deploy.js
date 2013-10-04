#!/bin/env node

//////////////////////////////////////////////
//											//
//	Node Web Cluster - Deployment Routines	//
//											//
//////////////////////////////////////////////

var forever = require("forever")
var path = require("path")
var log = require("winston")

try {

	// fork and start
	forever.startDaemon(path.resolve(__dirname, "../app.js"), {
		logFile: path.resolve(__dirname, "../logs"),
		logFile: path.resolve(__dirname, "../logs/pids"),
	});

	log.info("forever started successfully")
}
catch(e) {

	// ooops
	log.error("ooops, forever could not be launched!");
	throw e;
}