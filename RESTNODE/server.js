var express=require('express');// Khai báo framework 
var app=express();

require('./routes/routes.js')(express,app);

var server=require('http').createServer(app);// Khai báo máy chủ 
server.listen(4000,function(){
	console.log('server running on port 4000');// Port Mặc định khi tải trang 
 })