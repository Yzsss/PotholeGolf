var http = require('http');
var fs = require('fs');
var path = require('path');
var httpServer = http.createServer(requestHandler);

function requestHandler (request,response){
//http.createServer(function (request, response) {
    //console.log('request starting...');

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}

httpServer.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');

// // HTTP Portion
// var http = require('http');
// var fs = require('fs'); // Using the filesystem module
// var httpServer = http.createServer(requestHandler);
// var url = require('url');

// function requestHandler(req, res) {

// 	var parsedUrl = url.parse(req.url);
// 	//console.log("The Request is: " + parsedUrl.pathname);

// 	// Read in the file they requested

// 	fs.readFile(__dirname + parsedUrl.pathname,
// 		// Callback function for reading
// 		function (err, data) {
// 			// if there is an error
// 			if (err) {
// 				res.writeHead(500);
// 				return res.end('Error loading ' + parsedUrl.pathname);
// 			}
// 			// Otherwise, send the data, the contents of the file
// 			res.writeHead(200);
// 			res.end(data);
//   		}
//   	);
// }

// // Call the createServer method, passing in an anonymous callback function that will be called when a request is made
// var httpServer = http.createServer(requestHandler);

// // Tell that server to listen on port 8080
// httpServer.listen(8080);
// console.log('Server listening on port 8080');


// //http portion
// var http = require('http');
// //var https = require('https');
// var fs = require('fs'); // Using the filesystem module
// var url = require('url');
// //var vidList = [];
// var gpsMarkers=[];

// // var options = {
// //   key: fs.readFileSync('my-key.pem'),
// //   cert: fs.readFileSync('my-cert.pem')
// // };

// function handleIt(req, res) {
//   var parsedUrl = url.parse(req.url);

//   var path = parsedUrl.pathname;
//   if (path == "/") {
//     path = "index.html";
//   }

//   fs.readFile(__dirname + path,
//     // Callback function for reading
//     function(err, fileContents) {
//       // if there is an error
//       if (err) {
//         res.writeHead(500);
//         return res.end('Error loading ' + req.url);
//       }
//       // Otherwise, send the data, the contents of the file
//       res.writeHead(200);
//       res.end(fileContents);
//     }
//   );

//   // Send a log message to the console
//   console.log("Got a request " + req.url);
// }

// //var httpServer = http.createServer(onRequest);
// var httpServer = http.createServer(handleIt);
// httpServer.listen(8080);
// console.log('Server listening on port 8080');



// To all clients, on io.sockets instead
// io.sockets.emit('message', "this goes to everyone");

//socket.broadcast.send(data);




// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);
var markersArray=[];


io.sockets.on('connection', 
    // We are given a websocket object in our function
    
	function (socket) {
    console.log("We have a new client: " + socket.id);

        io.emit('gpsMarkers', markersArray);
  
        //io.broadcast.emit('gpaMarkers', markersArray);
        //socket.broadcast.emit('gpsMarkers', markersArray);

        console.log("send markers" + markersArray);

        //io.sockets.emit('gpsMarker', vidNum);
        
        //socket.broadcast.send('vid', vid);
	
		// When this user "send" from clientside javascript, we get a "message"
		// client side: socket.send("the message");  or socket.emit('message', "the message");

        
      socket.on('GPS', function(gps){
		  console.log("New GPS");
		  markersArray.push(gps);
      	  console.log(markersArray);

      socket.broadcast.emit('gpsMarkers', markersArray);
      
      
    });
    
      socket.on('requestData', function(data){
			io.emit('gpsMarkers', markersArray);
      })
        
        

		socket.on('disconnect', function() {
			console.log("Client has disconnected");
        });

        
	}
);
