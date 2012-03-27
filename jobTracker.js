var Console = require("./console").Console;

var JobTracker = function(Job){

	var job = {};

	var taskTrackers = [];

	var partialResults = [];

	var finalResults = [];

	var tasks = [];

	var currentTasks = 0;



	this.init = function(Job){
		
		job = Job;

		this.createMapTasks();

		var NetworkManager = require("./networkManager").NetworkManager;
		NetworkManager.init();

		NetworkManager.addListener('connection', this.registerTaskTracker);
		NetworkManager.addListener("disconnect", this.disconnected);

		console.log("JobTracker Initialized");
		console.log('Waiting for Task Trackers to connect');
	};




	this.registerTaskTracker = function(client){
		
		var id = "tt" + (taskTrackers.length + 1);
		
		taskTrackers.push(client);

		Console.log('Task Tracker '+ id +' connected', "debug");

		client.set("id",  id, function(){

			if(taskTrackers.length == job.config.startNodes){
				for(var i=0; i < taskTrackers.length; i++){
					othis.assignTask(taskTrackers[i]);
				}
				othis.startTime = Date.now();
			}
		});
	};




	this.disconnected = function(){
		//Console.log("client has disconnected", "error");
	};




	this.splitData = function(data, splits){
		data.text = data.text.concat(data.text);

		var splitSize = data.text.length / splits;
		var dataSplits = [];
		for(var  i=0; i < splits; i++){
			dataSplits.push({ 
				text :  data.text.splice(0, splitSize)
			});
		}
		return dataSplits;
	};




	this.assignTask = function(client){


		if(tasks.length < 1){
			if(othis.createReduceTask()){
				othis.assignTask(client);
			}
			return false;
		}
			
		var task = tasks.shift();

		task.timestamp = Date.now();

		currentTasks++;

		client.emit("task", task, othis.saveResults);

		client.get("id", function(e, id){
			Console.log('Assigning task to Task Tracker ' + id, "debug");
		});
		
	};




	this.saveResults = function(results){
		this.get("id", function(e, id){
			Console.log("Saving results from Task Tracker " + id);
		});

		
		var taskTime = Date.now() - results.timestamp;
		var networkTime = taskTime - results.executionTime;

		Console.log("Task Time " + taskTime);
		Console.log("Network Time " + networkTime);
		Console.log("Execution Time " + results.executionTime);


		currentTasks--;

		if(results.type == "map")
			partialResults = partialResults.concat(results.value);
		else if(results.type == "reduce"){
			finalResults = results.value;
			othis.showResults(finalResults);
			return false;
		}

		othis.assignTask(this);
	};




	this.showResults = function(results){
		this.endTime = Date.now();
		this.totalTime = this.endTime - this.startTime;
		Console.log("Job Completed", "debug");
		Console.log("Total Time : " + this.totalTime + " ms");
		Console.log("Showing Results - ");
		Console.log(JSON.stringify(results));
		console.log(results);
	},




	this.createReduceTask = function(){
		

		if(job.reducer == undefined || currentTasks > 0)
			return false;

		var reduceTask = {
			type : "reduce",
			reducer : "reducer = " + job.reducer.toString(),
			data : partialResults
		};

		job.reducer = undefined;

		tasks.push(reduceTask);		

		Console.log('Creating reduce task', "warn");

		return true;
	};




	this.createMapTasks = function(){
		Console.log('Creating map tasks', "warn");
		var dataSplits = this.splitData(job.data, job.config.dataSplits);

		for(var i=0; i < job.config.dataSplits; i++){
			var task = {
				type : "map",
				mapper : "mapper = " + job.mapper.toString(),
				data : dataSplits[i]
			};		
			tasks.push(task);
		}

		job.mapper = undefined;
		
		return true;
	};


	
	var othis = this;
	this.init(Job);	

};

exports.JobTracker = JobTracker;