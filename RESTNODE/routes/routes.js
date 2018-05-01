module.exports = function(express,app){
	var router=express.Router();
	var bodyParser=require('body-parser');
	var oc = require('orthanc-client');
	
	app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
   
    app.engine('html', require('ejs').renderFile)
    app.set('view engine', 'ejs')
    var gt='';
    var kq=[];
    var patientID='13f2f0c2-aa60846c-9478b998-01553691-e3a88d90';
    var instancesID='107ba45a-1d23dab3-9274143c-d2929952-20040f35';
    //var studiesID='6c65289b-db2fcb71-7eaf73f4-8e12470c-a4d6d7cf';
// connect orthan server
	var client = new oc({
    url: 'http://localhost:8042',
    auth: {
      username: 'admin',
      password: 'password'
    		}
    });

// Greetting and display all patients
   //mãng chứa các phần tử là một id của bệnh nhân
    // cho một vòng lặp duyệt tất cả các phần tử để truy vấn cũng như dispay tất cả các bệnh nhân
    
	router.get('/',function(req,resp,next){
        client.patients.getAll()
		.then(function(res) {
            gt=res.toString();
            kq=gt.split(',');
        })
        .then(function(){
        resp.setHeader('Content-Type', 'application/json');
            for(i=0;i<kq.length;i++){
                client.patients.get(kq[i])
                .then(function(res) {
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

// get all studies of a patient and print infomation of every studies
    //giải thích: client side nhận thấy danh sách bệnh nhân 
    // Hữu: xữ lý json ở client và lập trình even button click vào một bệnh nhân sẽ get id bệnh nhân gửi về server 
    // Thiên:xữ lý server nhận được một id bệnh nhân và routes cho ra danh sách studies và thông tin 
    router.get('/studies',function(req,resp,next){
        resp.setHeader('Content-Type', 'application/json');
        client.patients.getStudies(patientID)
            .then(function(res) {
                resp.write(JSON.stringify(res));
            })
            .catch(function(err) {
                resp.json({message:'loi khong xac dinh'});
            });
    });
// get all series of a studies given by studies id
    router.get('/series',function(req,resp,next){
        resp.setHeader('Content-Type', 'application/json');
        client.patients.getSeries(patientID)
            .then(function(res) {
                resp.write(JSON.stringify(res));
            })
            .catch(function(err) {
                resp.json({message:'loi khong xac dinh'});
            });
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

     
// button viewer to Render index.html to handle image
    /*xử lý sự kiện khi user click button VIEW tự động render một trang html mới để thao tác 
    xử lý ảnh trong thư viện cornerstone( main task)
     cách giải quyết:lấy tất cả các instances given by id of patients,bằng cách nào đó 
    đưa ra tên file(trích xuất tên file),dùng thư viện dicomParser đẩy ra một buffer cho load 
    lên frame 
    */
   router.get('/view',function(req,resp){
        resp.render('index.html');
    });
//get file
    router.get('/file',function(req,resp,next){
        resp.setHeader('Content-Type', 'application/json');
        client.instances.get(instancesID)
            .then(function(res) {
                resp.write(JSON.stringify(res));
            })
            .catch(function(err) {
                resp.json({message:'loi khong xac dinh'});
            });
    });
//app use    
    app.use('/',router);
    app.use('/studies',router);
    app.use('/now',router);
    app.use('/patient',router);
   
}
