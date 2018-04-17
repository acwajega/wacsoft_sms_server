var db_controller = require('../controllers/database_controller.js');   
var qry_action = db_controller.sd_use;//-------------SQL CONNECTION GOING TO PERFORM THE CRUD ACTIONS ON USERS
var url = require('url');
//---------------------------



//---------------------------inserting into the url response table-------------

module.exports.urlResponse = function(req,res,response){

//-----------------GETTING THE IP ADDRESS-------------------
var ip = req.headers['x-forwarded-for'] || 
req.connection.remoteAddress || 
req.socket.remoteAddress ||
req.connection.socket.remoteAddress;
//-----------------END OF GETTING THE IP ADDRESS---------------

//----------------------GETTING THE DATE AND TIME OF THE REQUEST--------
var d = new Date(); 
var mdate = d.getFullYear() +'-'+(d.getMonth()+1)+'-'+d.getDate() ;
var time = new Date();
var m_time = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
//----------------------END OF GETTING THE DATE AND TIME OF THE REQUEST----------
//-------------Getting the url 
var url_request = req.url;

qry_action.query('insert into url_responses set ?',{UR_NAME:url_request,UR_DATE:mdate,
	UR_TIME:m_time,UR_IP:ip,UR_RESPONSE:response},function(err,results){

if (err) {
throw err;
}
else
{
	console.log(results.insertId);
}

});	



}
//------------------------------end of inserting into the url response table-----