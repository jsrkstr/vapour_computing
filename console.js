var io = require('socket.io').listen(3001);
io.set('log level', 0);

var Console = {

	log : function(m, t){
		var type = t || "info";
		var msg = m || "hello";

		io.sockets.emit(type, msg);
		//console.log(msg);
	}

};

//io.sockets.on("connection", Console.log);

exports.Console = Console;
