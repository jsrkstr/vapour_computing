Console = {

	log : function(m, t){
		var type = t || "info";
		var msg = m || "hello";

		switch(type){
			case "debug" : log.debug(msg);
				break;
			case "info" : log.info(msg);
				break;
			case "warn" : log.warn(msg);
				break;
			case "error" : log.error(msg);
				break;
		}

		console.log(msg);
	}

};


