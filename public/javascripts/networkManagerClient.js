var NetworkManager = function(port){ 

	this.socket = {};

	this.init = function(port){
		this.socket = io.connect('http://'+ document.location.hostname +':' + port);
	};


	this.addListener = function(event, listener){
		this.socket.on(event, listener);
	};

	this.init(port);

};