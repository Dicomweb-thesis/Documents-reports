module.exports = function(express,app){
	var router=express.Router();
	var bodyParser=require('body-parser');
	var oc = require('orthanc-client');
	
	app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    var gt='';
    var kq=[];
// connect orthan server
	var client = new oc({
    url: 'http://localhost:8042',
    auth: {
      username: '',
      password: ''
    		}
    });

// Greetting and display all patients
   //mãng chứa các phần tử là một id của bệnh nhân
    // cho một vòng lặp duyệt tất cả các phần tử để truy vấn cũng như dispay tất cả các bệnh nhân
    
	router.get('/',function(req,resp){
        client.patients.getAll()
		.then(function(res) {
            gt=res.toString();// xữ lý ngắt chuỗi hoặc bất cứ thao tác gì để có được một mãng
            //thêm vòng lặp cho thao tác ở dưới 
            //console.log(gt);
            kq=gt.split(',');
            //console.log('so luong phan tu cua mang:'+kq.length);
        })
        .then(function(){
        resp.setHeader('Content-Type', 'application/json');
            for(i=0;i<kq.length;i++){
                client.patients.get(kq[i])
                .then(function(res) {
                //console.log(JSON.stringify(res));
                resp.write(JSON.stringify(res));
                })
            .catch(function(err) {
                resp.json({message:'loi khong xac dinh'});
            });
            }
        })
    	.catch(function(err) {
       		resp.json({message:'loi khong xac dinh'});
        });
       
	});
// get all instances
	router.get('/allInstances',function(req,resp){
	client.instances.getAll()
		.then(function(res) {
        	resp.json(res);
   			 })
    	.catch(function(err) {
       		resp.json({message:'loi khong xac dinh'});
    		});
        });
        

// get all studies
    var maso='27f7126f-4f66fb14-03f4081b-f9341db2-53925988';
    router.get('/studies',function(req,resp){
        client.patients.getStudies(maso)
            .then(function(res) {
                console.log(JSON.stringify(res));
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

     

//app use    
    app.use('/',router);
	app.use('/tatcabenhnhan',router);
    app.use('/studies',router);
    app.use('/now',router);
    app.use('/patient',router);
   
}