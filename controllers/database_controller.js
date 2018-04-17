var mysql = require('mysql');
var configDB = require('../config/db.js');
var sms_server_db = mysql.createConnection(configDB.connection_parameters);// connect to mysql database

module.exports.CONNECT_TO_DATABASE = function(req,res){
  sms_server_db.connect(function(err){
    if (err){
       console.log('SORRY, THE SERVER IS UNABLE TO CONNECT TO THE WACSOFT SMS SERVER DATABASE!!!');
    }
    else
    {
      console.log('CONNECTED TO THE WACSOFT SMS SERVER DATABASE!!!');
      
    }
  })
}

module.exports.sd_use = sms_server_db;