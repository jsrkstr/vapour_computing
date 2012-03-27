var NetworkManager = {


	clientCount : 0,


	clients : {},

	sockets : {},


	init : function(){
		var io = require('socket.io').listen(8080);	
		io.set('log level', 1);
		NetworkManager.sockets = io.sockets;
	},

	


	addListener : function(event, listener){

		NetworkManager.sockets.on(event, listener);

	}


};


exports.NetworkManager = NetworkManager;
