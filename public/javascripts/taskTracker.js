var TaskTracker = function(){

	this.init = function(){

		var networkManager = new NetworkManager(3002);
		networkManager.addListener("task", this.processTask);		
		Console.log("TaskTracker Initialised");

	};


	this.processTask = function(job, response){

		Console.log("Received New " + job.type +" Task");
		Console.log(job);
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
     
      	Console.log('Task Completed');
      	Console.log("Execution Time : " + executionTime + " ms");
      	Console.log('Results');
		Console.log(results);

		response(results);
	}

	this.init();
}

// $.ready(function(){
// 	log.toggle();
// 	$("#blackbird").attr("class", "bbBottomLeft bbLarge");
// 	var t1 = new TaskTracker();
// });

window.onload = function(){
	log.toggle();
	$("#blackbird").appendTo($("#console")).attr("class", "bbTopLeft bbLarge").css({ position : "relative", float :"left"});
	var t1 = new TaskTracker();
}



