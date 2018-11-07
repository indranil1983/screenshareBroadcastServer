/*//Server
var express=require('express');
var server = require('http').Server(app);
var app = express();
var fileUpload = require('express-fileupload');

var io = require('socket.io').listen(server); 

//app.use(express.static(__dirname + '/node_modules'))




app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
});


app.listen("8080");

var receiveImage = function(image){
    
	socket.emit('image', {data:
		image.data.toString('base64')});
	
	socket.broadcast({tipo:'imagen', data:
        image.data.toString('base64')
        }
     );
    //success(true);
}


//default options
app.use(fileUpload());

app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log("file received");
  res.status(200).send('files were uploaded.');
//The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let screenshot = req.files.screenshot;
  console.log("file details :" +screenshot);
  console.log(screenshot);
  receiveImage(screenshot);
});





*/


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fileUpload = require('express-fileupload');
var port = process.env.PORT || 3000;

var socketList = null;

var ioList = {};

app.get('/joinRoom', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/createRoom', function(req, res){
	  console.log(req.query.room);
	  ioList[req.query.room]=io.of(req.query.room);
	  ioList[req.query.room].on('connection', function(socket){
		  console.log('someone connected to room '+req.query.room);
		});
	  //console.log("Room Created " + req.query.room);
	  //console.log(ioList[req.query.room]);
	  res.status(200).send("");
});

var receiveImage = function(image,roomID){
	console.log("emit image to "+roomID)
	ioList[roomID].emit('image', {data:
		image.data.toString('base64')});
	
}

io.on('connection', function(socket){
	console.log("Connected");
	socketList = socket;
	});


//default options
app.use(fileUpload());
app.post('/upload', function(req, res) 
{
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  
  var roomID= req.body.roomID;
  res.status(200).send('files were uploaded.');
//The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let screenshot = req.files.screenshot;
  receiveImage(screenshot,roomID);
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});
