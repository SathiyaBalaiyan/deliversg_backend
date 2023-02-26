var peak_hour = require('../admin_controllers/peak_hour'); // include ads controller ////
var express = require('express');
var router = express.Router();

    router.post('/admin/add_peak_hour_status', peak_hour.add_peak_hour_status);
    router.get('/admin/get_peak_hour_status', peak_hour.get_peak_hour_status);

    
module.exports = router; 