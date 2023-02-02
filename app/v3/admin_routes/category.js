var category = require('../admin_controllers/category'); // include admin controller ////
var express = require('express');
var router = express.Router();

    router.post('/admin/add_category', category.add_category);

module.exports = router;



