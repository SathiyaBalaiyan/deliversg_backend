var deliver_fee = require('../admin_controllers/deliver_fee'); // include ads controller ////
var express = require('express');
var router = express.Router();

    router.post('/admin/add_deliver_fee', deliver_fee.add_deliver_fee);
    router.get('/admin/get_deliver_fee', deliver_fee.get_deliver_fee);
   
module.exports = router; 