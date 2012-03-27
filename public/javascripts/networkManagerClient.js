var NetworkManager = function(){ 

	this.socket = {};

	this.init = function(){
		this.socket = io.connect('http://'+ document.location.hostname +':8080');
	};


	this.addListener = function(event, listener){
		this.socket.on(event, listener);
	};

	this.init();

};