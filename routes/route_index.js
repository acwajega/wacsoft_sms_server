var express = require('express');
var router = express.Router();
var security_controller = require('../controllers/security_controller.js');
var send_sms_controller = require('../controllers/send_sms_controller.js');



//-------------- routing to user api for account Login ------------------
router.post('/api/user/login',security_controller.logingIntosmsServer);
//---------------- End of userAccount login api ---------------------------------

//-------------- routing to user to send sms for account Login ------------------
router.post('/api/user/sendSms',send_sms_controller.sendSms);
//---------------- End of userAccount login api ---------------------------------
module.exports = router;