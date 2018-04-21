//---For Creating the Server
var http = require('http');

//-------For getting an sending url requests
var url = require('url');


//---------------------------CONTROLLERS------------------------------
var db_controller = require('./controllers/database_controller.js');  
var new_server_request_controller = require('./controllers/new_server_request_controller.js');  
var security_controller = require('./controllers/security_controller.js');  
var sms_controller = require('./controllers/send_sms_controller.js');  
var accounts_controller = require('./controllers/accounts_controller.js'); 
//-------------------------END OF CONTROLLERS-------------------------


//-------------------SQL CONNECTION PRAMETER WE ARE GOING TO USER-----
var sd_use = db_controller.sd_use;   
//---------------------END OF PARAMETER--------------------------------
//---------------------------------CONNECTING TO MYSQL DB--------------------------------------------------  
 db_controller.CONNECT_TO_DATABASE();
  //--------------------------------------------------------------------------------------------------------




//=======================================================
//=======================================================
var Servr =http.createServer(function(req,res){

//---------------------INSERTING THE SERVER REQUEST--------------------
 new_server_request_controller.recordServerRequest(req,res);//-----------------new_server_request_controller----
//----------------------END OF INSERTING THE SERVER REQUEST-------------



//------Specifying the type of request
   res.writeHead(200, {'Content-Type': 'application/json'});
//------End of Specifying the type of request------

//------------------------------Parsing the recieved URL----------
 var querryData = url.parse(req.url, true).query;
//---------------------------------------------------------
   
//-------------------When the action is Create Account---------------
 if (querryData.action === 'createAccount') {
 	accounts_controller.createAccount(req,res,querryData);//----------------TRYING TO LOG INTO THE SERVER
 }
//-------------------End of request Create Account-------

//-------------------When the action is authentication------
 if (querryData.action === 'auth') {
 	security_controller.logingIntosmsServer(req,res,querryData);//----------------TRYING TO LOG INTO THE SERVER
 }
//-------------------End of request authentication-------


//---------------------When the action is sending sms--------
if (querryData.action === 'sendSms'){
	sms_controller.sendSms(req,res,querryData,'256775212088','matilda123');
}
//---------------------End of When the action is sending sms--------




}).listen(7070, "0.0.0.0");

//-------------END OF CREATING THE SMS SERVER
   console.log('Server running at http://0.0.0.0:8080');