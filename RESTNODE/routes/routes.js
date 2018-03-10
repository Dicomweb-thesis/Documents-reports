module.exports = function(express,app){
	var router=express.Router();
	var bodyParser=require('body-parser');
	var oc = require('orthanc-client');
	
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());



// connect orthan server
	var client = new oc({
    url: 'http://localhost:8042',
    auth: {
      username: 'foo',
      password: 'bar'
    		}
	});
// Greetting and display all patients
    var gt='';
	router.get('/',function(req,resp){
        // resp.json({message:'xin chao port 4000'});
        client.patients.getAll()
		.then(function(res) {
           // resp.json(res);
           resp.writeHead(200,{'Content-type':'text/html'});
           resp.write('<h2>danh sach cac benh nhan </h2>');
           resp.write(res.toString());
           resp.end('');
                })
    	.catch(function(err) {
       		resp.json({message:'loi khong xac dinh'});
            });
	});
// get all instances
	router.get('/tatcabenhnhan',function(req,resp){
	client.instances.getAll()
		.then(function(res) {
        	resp.json(res);
        	
   			 })
    	.catch(function(err) {
       		resp.json({message:'loi khong xac dinh'});
    		});
        });
        

// get all studies
    router.get('/studies',function(req,resp){
        client.studies.getAll()
            .then(function(res) {
                resp.json(res);

            })
            .catch(function(err) {
                resp.json({message:'loi khong xac dinh'});
            });
    });
// get all patients
    router.get('/patient',function(req,resp){
        
    });


// get time
    router.get('/now',function(req,resp){
        client.tools.now()
            .then(function(res) {
                resp.json(res);

            })
            .catch(function(err) {
                resp.json({message:'loi khong xac dinh'});
            });
    });

//get for id of a patient
    var maso='0946fcb6-cf12ab43-bad958c1-bf057ad5-0fc6f54c';
    router.get('/id',function(req,resp){
        client.patients.get(maso)
            .then(function(res) {
                resp.json(res);

            })
            .catch(function(err) {
                resp.json({message:'loi khong xac dinh'});
            });
    });    

    
	app.use('/',router);
	app.use('/tatcabenhnhan',router);
    app.use('/studies',router);
    app.use('/now',router);
    app.use('/patient',router);
    app.use('/id',router);
}