var TaskTracker = function(){

	this.init = function(){

		var networkManager = new NetworkManager(3002);
		networkManager.addListener("task", this.processTask);		
		Console.log("Task Tracker Initialised", "debug");

	};


	this.processTask = function(job, response){

		Console.log("Received New " + job.type +" Task", "debug");
		//Console.log(job);
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

		response(results);
	}

}

// $.ready(function(){
// 	log.toggle();
// 	$("#blackbird").attr("class", "bbBottomLeft bbLarge");
// 	var t1 = new TaskTracker();
// });

window.onload = function(){
	$("#blackbird").appendTo($("#console")).attr("class", "bbTopLeft bbLarge").css({ display : "block", position : "relative", float :"left"})
	$("#blackbird .header .left").append('<div style="font-weight:900; padding : 17px 0px 0px 90px; color: #fff">Client Log</div>')

	var tt = new TaskTracker();
	$("#start-button").one("click", $.proxy(tt.init, tt));
}



