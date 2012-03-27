var TaskTracker = function(){

	this.init = function(){

		var networkManager = new NetworkManager();
		networkManager.addListener("task", this.processTask);		
		console.log("TaskTracker Initialised");
		console.log('.');
		console.log('.');
	};

	this.processTask = function(job, response){

		console.log("Received New " + job.type +" Task");
		console.log(job);
		var startTime = Date.now();

    	var results = {};

    	results.timestamp = job.timestamp;

		if(job.type == "map")
		{
			results.type = "map";
			results.value = [];
			var process = eval(job.mapper);	

	    	for(var i=0; i< job.data.text.length; i++)
	      		results.value = results.value.concat(process(job.data.text[i]));			
		}
		else if(job.type == "reduce")
		{
			results.type = "reduce";
			results.value = [];
			var process = eval(job.reducer);	
			results.value = process(job.data);
		}

		
      	var endTime = Date.now();
      	var executionTime = endTime - startTime;

      	results.executionTime = executionTime;
     
      	console.log('Task Completed');
      	console.log("Execution Time : " + executionTime + " ms");
      	console.log('Results');
		console.log(results);
		console.log('.');
		response(results);
	}

	this.init();
}

var t1 = new TaskTracker();




