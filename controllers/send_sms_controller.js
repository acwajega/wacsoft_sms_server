//-----------For Sending SMS requests to smshour APIL----Requests
var request = require('request');
var db_controller = require('../controllers/database_controller.js');   
var qry_action = db_controller.sd_use;//-------------SQL CONNECTION GOING TO PERFORM THE CRUD ACTIONS ON USERS


//--------------------------Sending sms -----------------------------
module.exports.sendSms = function(req,res){


var smsBody  = req.body;
console.log(smsBody);
var _=require("underscore");
   var jsonObject=JSON.parse(JSON.stringify(smsBody));
_.each(jsonObject, function(data_obj) {

var smsRecord =JSON.parse(JSON.stringify(data_obj));


//----------------------GETTING THE DATE AND TIME OF THE REQUEST--------
var d = new Date(); 
var mdate = d.getFullYear() +'-'+(d.getMonth()+1)+'-'+d.getDate() ;
var time = new Date();
var m_time = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
//----------------------END OF GETTING THE DATE AND TIME OF THE REQUEST----------


//-----------------GETTING THE IP ADDRESS-------------------
var ip = req.headers['x-forwarded-for'] || 
req.connection.remoteAddress || 
req.socket.remoteAddress ||
req.connection.socket.remoteAddress;
//-----------------END OF GETTING THE IP ADDRESS---------------


qry_action.query('insert into sms_sending_que set ?',{SSQ_ACCESS_TOKEN:smsRecord.access_token,SSQ_USERNAME:smsRecord.username,SSQ_NUMBER:smsRecord.number,SSQ_MESSAGE:smsRecord.message,
	SSQ_DATE:mdate,SSQ_TIME:m_time,SSQ_IP:ip},function(err,results){

if (err)
{
 throw err;

}
else
{
  console.log(results.insertId);
}



	});



//-----------------------------------SENDING OF THE SMS-------------------------
// Set the headers
var headers = {
'User-Agent':       'Super Agent/0.0.1',
'Content-Type':     'application/x-www-form-urlencoded'
}



// Configure the request
var options = {
url: 'http://smshour.com/smsserver/bulksms-api.php',
method: 'POST',
headers: headers,
form: { 'username': '256775212088',
'password':'matilda123','type':'normal','recipients':smsRecord.number,'message':smsRecord.message,
'from':smsRecord.username} 
}


// Start the request
request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {
    // Print out the response body
    console.log(body)
 

//--------SENDING BACK RESPONSE TO THE CLIENT------
 res.end(JSON.stringify({ resp:"pass",msg: 'Message has been successfully sent!!' })); 




var jsonObject=JSON.parse(body);
    if (jsonObject.success === true){

    	//---------------update the sent status to true------
    	qry_action.query('update sms_sending_que set  ssq_status= ? where ssq_username =? and ssq_access_token =? ',
    		['Y',smsRecord.username,smsRecord.access_token]);


    	//------

    } 
}
else
{
	res.end(JSON.stringify({ resp:"err",err: 'Sorry, we are unable to send this message at this time, please try again later!!' })); 
}
});
//-------------------------------------END OF SENDING OF THE SMS------

});




}

//=================================END











