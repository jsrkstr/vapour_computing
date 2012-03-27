// Job class
var Job = function(jobFile, dataFile){

	this.data = require(dataFile).data;
	this.mapper = require(jobFile).map;
	this.reducer = require(jobFile).reduce;
	this.config = require(jobFile).config;

};

exports.Job = Job;
