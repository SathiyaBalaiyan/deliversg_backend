var main_category = require('../admin_controllers/main_category'); // include admin controller ////
var express = require('express');
var router = express.Router();

    router.post('/admin/add_main_category', main_category.add_main_category);
    router.get('/admin/fetch_main_category', main_category.fetch_main_category);

module.exports = router;



