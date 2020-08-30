const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// tcp server
const net = require('net');

// database connection
const DateDoc = require("./models/dateDoc");
const connect = require("./dbconnect");
const saveData = require("./saveData")

const httpPort = 5000;
const tcpPort = 5001;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

io.on('connection', (socket) => {
	socket.on('date', (date) => {
		console.log("Got request for", date);
		DateDoc.findOne({ "date": date }).then(doc => {
			try {
				(()=>{
					return Promise.resolve(socket.emit("data", doc.data));
				})().then(()=>{
					console.log("Response for", date, "was sent.");
				});			
			} catch (err) {
				(()=>{
					return Promise.resolve(socket.emit("data", "empty"));
				})().then(()=>{
					console.log("No data was found for", date, "-> sending empty response.");
				});
			}
		});
	});
});

http.listen(httpPort, () => {
  	console.log('HTTP server listening on :', String(httpPort));
});

http.on("request", (request) => {
	console.log(request.url);
});

let tcpServer = new net.Server();
tcpServer.listen(tcpPort, function() {
    console.log('TCP server listening on localhost:', String(tcpPort));
});

tcpServer.on('connection', function(socket) {
    socket.on('data', function(chunk) {
		let data = chunk.toString().trim();
		console.log('Data received from client :', data);
		let pairs = {};
		try {
			let arr = data.split("&");			
			arr.forEach(el => {
				let pair = el.split("=");
				pairs[pair[0]] = parseFloat(pair[1]);			 	
			});
		}
		catch(err){
			console.log(err);
		}        

		saveData(pairs);
	});
	socket.on('error', (err) => {
		console.log(err);
	})
});