app.factory('MatchWebSocketService', function($window) {
	
	var service = {};
	service.ws = new Object();

	service.connect = function(idMatch) {
		if (service.ws[idMatch]
				&& service.ws[idMatch].readyState == WebSocket.OPEN) {
			return;
		}
		var appPath = $window.location.pathname.split('/')[1];
		var host = $window.location.hostname;
		var port = "8000";
		
		if (angular.equals(host, 'localhost') ){
			port = '8080';
		}
			
		var wsUrl = 'ws://'+ host + ':'+ port + '/' + appPath + '/matches/' + idMatch;
		var websocket = new WebSocket(wsUrl);

		websocket.onopen = function() {
			service.callback(idMatch,"CONNECTED");
		};

		websocket.onerror = function() {
			service.callback(idMatch,"Failed to open a connection" );
		};

		websocket.onclose = function() {
			service.callback(idMatch,"DISCONNECTED");
		};

		websocket.onmessage = function(message) {
			service.callback(idMatch, message.data);
		};

		service.ws[idMatch] = websocket;
	};

	service.sendBetMatchWinner = function(idMatch, player) {
		var msg = "{ \"type\" : \"betMatchWinner\", \"name\" : \""
			+ player + "\", \"idMatch\" : \""
			+ idMatch + "\"}";
		service.ws[idMatch].send(msg);
	};

	// Close the WebSocket connection
	service.disconnect = function(idMatch) {
		service.ws[idMatch].close();
	};
	
	service.status = function(idMatch) {
		if (service.ws == null || angular.isUndefined(service.ws[idMatch])){
			return WebSocket.CLOSED;
		}
		return service.ws[idMatch].readyState;
	};

	// handle callback
	service.subscribe = function(callback) {
		service.callback = callback;
	};

	return service;
});

app.factory('MatchRESTService', function($http, $window) {
	var appPath = $window.location.pathname.split('/')[1];
	var myService = {
		    async: function() {
		      // $http returns a promise, which has a then function, which
				// also returns a promise
		      var promise = $http.get('/'+ appPath + '/rest/tournament/lives').then(function (response) {
		        // The then function here is an opportunity to modify the
				// response
		        console.log(response);
		        // The return value gets picked up by the then in the
				// controller.
		        return response.data;
		      });
		      // Return the promise to the controller
		      return promise;
		    }
		  };
	return myService;
});
