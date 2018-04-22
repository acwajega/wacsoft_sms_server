//--------------SERVER CONFIGURATION-------------
var express  = require('express');
var app      = express();  
var server = require('http').createServer(app); 
var path = require('path');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override');
//---------------END OF SERVER CONFIGURATION---------


//------------------------APP CONFIGURATION---------------------------
app.use(express.static(__dirname + '/routes')); 
app.use(express.static(__dirname + '/controllers'));
//--------------------------END OF APP CONFIGUARATION---------

//--------------------APPLICATION MIDDLEWARE----------------------------
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
//--------------------------------------------------------------------------------------------------------


//-------For getting an sending url requests
var url = require('url');


//---------------------------CONTROLLERS-----------------------------------
var db_controller = require('./controllers/database_controller.js');  
//-------------------------END OF CONTROLLERS-------------------------


//-------------------SQL CONNECTION PRAMETER WE ARE GOING TO USER-----
var sd_use = db_controller.sd_use;   
//---------------------END OF PARAMETER--------------------------------
//--------------------------------------------------------------------------------------------------------
var route_index = require('./routes/route_index');	
//--------------------------------------------------------------------------------------------------------

//---------------------------------CONNECTING TO MYSQL DB--------------------------------------------------  
db_controller.CONNECT_TO_DATABASE();
//--------------------------------------------------------------------------------------------------------


 //*****************************    ROUTING *******************************************************************

    app.post('/api/user/login',route_index);//--------User login    
    app.post('/api/user/sendSms',route_index);//--------User login    


//***************************** END OF ROUTING ****************************************************************






 // =====================listen (start app with node server.js) ====================================
//app port
var port = process.env.PORT || 7070;

server.listen(port, function(){
 console.log('http://localhost'+port+'/');
});
// =================================================================================================













