var express=require('express');
var app=express();


require('./routes/routes.js')(express,app);

var server=require('http').createServer(app);
server.listen(4000,function(){
	console.log('server running on port 4000');
 })