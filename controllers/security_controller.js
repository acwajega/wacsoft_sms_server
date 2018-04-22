var db_controller = require('../controllers/database_controller.js');   
var url_response_controller = require('../controllers/url_response_controller.js');
var qry_action = db_controller.sd_use;//-------------SQL CONNECTION GOING TO PERFORM THE CRUD ACTIONS ON USERS
var url = require('url');
//----------------------------Loging into the eSente----------------------------

//----------------------------LOGGING INTO THE SMS SERVER---------------
module.exports.logingIntosmsServer = function (req,res) {
    var login_credentials = req.body;
//console.log('tried to login');

qry_action.query('select * from client_list where cl_username = ? and cl_password = ?',
	[login_credentials.username,login_credentials.password],function(err,results){

if (err){
return    res.end(JSON.stringify({ err: err }));  //------RETURN THE ERROR RESULT

}
else//---------------if there is no error with the table

{
if (results.length === 0){
//-------------if the supplied credentials are false
console.log('Access Denied ........Invalid username or password.....');
//----------------------inserting the the url response table -----------------
url_response_controller.urlResponse(req,res,'Sorry, Access Denied, Invalid Username or Password');
//----------------------End of inserting into the url respnse table----
//-----Response---
return   res.end(JSON.stringify({ resp:"err",err: 'Sorry, Access Denied, Invalid Username or Password' }));


//------End of Response
}

//=====================================================
//====================================================
else//---- if the credentials are correct
{

console.log('account found');//--------logging the account being found------
//----------------------inserting the the url response table -----------------
url_response_controller.urlResponse(req,res,'Login Access Granted....');
//----------------------End of inserting into the url respnse table----

///--------------------------------------

//----------------------Checking if the account is active-----

qry_action.query('select * from client_list where cl_status = ?',['Y'],function(err,result){

//---if an error occure
if (err)
{
return res.end(JSON.stringify({ err: err }));
//res.status(500).json({ err: err });
}
else
{
if (results.length ===  0){
return res.end(JSON.stringify({ resp:"err",err: 'Sorry, your Account has been Suspended or Deactivated!!' }));
//----------------------inserting the the url response table -----------------
url_response_controller.urlResponse(req,res,'Sorry, your Account has been Suspended or Deactivated!!');
//----------------------End of inserting into the url respnse table----


}
else
{
//-----------------------CAN LOGIN---------
var d = new Date(); 
var Adate = d.getFullYear() +'-'+(d.getMonth()+1)+'-'+d.getDate() ;

var Atime = new Date();
var m_time = Atime.getHours() + ":" + Atime.getMinutes() + ":" + Atime.getSeconds();

//-------Generating an access token ------------------------------------------------
var hat = require('hat');
var token_id = hat();
//--------------------------End of token Generation --------------------------------
var user = results[0];
var obj = JSON.parse(JSON.stringify(user));
res.end(JSON.stringify({resp:"pass",
account_username:obj.CL_USERNAME,
account_id:obj.CL_ID,
account_name :obj.CL_NAME,
access_token:token_id}));

console.log(JSON.stringify(user));

//------------------------INSERTING GENERATED CLIENT ACCESS TOKENS-----------------------
//--------checking if the generated access token has already been generated or not-----

qry_action.query('insert into client_access_tokens set ?',{CAT_TOKEN:token_id,CAT_GEN_DATE:Adate,CAT_GEN_TIME:m_time},function(err,result){

if (err) throw err;
console.log(result.insertId);



});





var d = new Date(); 
var Adate = d.getFullYear() +'-'+(d.getMonth()+1)+'-'+d.getDate() ;

var Atime = new Date();
var m_time = Atime.getHours() + ":" + Atime.getMinutes() + ":" + Atime.getSeconds();

var ip = req.headers['x-forwarded-for'] || 
req.connection.remoteAddress || 
req.socket.remoteAddress ||
req.connection.socket.remoteAddress;
//-----------------------------RECORDING A USER LOG INTO THE SYSTEM -------------------------------------------------------
qry_action.query('insert into client_logins set ?', {  CL_CI_ID: obj.CI_ID,CL_USERNAME: obj.CI_USERNAME,
CL_ACCESS_TOKEN: token_id,
CL_DATE: Adate,CL_TIME: Atime,CL_IP: ip,CL_API_ACCESS_KEY: login_credentials.access_api_key}, function(err, result) {
if (err) throw err;

console.log(result.insertId);
});

//------------------------END OF INSERTING CLIENT ACCESS TOKENS--------------------------



//----------------------END OF CAN LOGIN------


}


}

});


//----------------------End of checking if the account is active----




}

//======================================================
//=======================================================
}

});


}
//----------------------------------END OF LOGING INTO THE SMS SERVER---------