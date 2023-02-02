require('../utils/message_code');
require('../utils/error_code');
require('../utils/constants');
var utils = require('../utils/utils');
var Category = require('mongoose').model('category')
var console = require('../utils/console');



// add_category
exports.add_category = function (request_data, response_data) {
    utils.check_request_params(request_data.body, [{name: 'category_name', type: 'string'}], function (response) {
        if (response.success) {

            var request_data_body = request_data.body;
            request_data.category_name = request_data.body.category_name;
            var add_category = new Category(request_data_body);
            add_category.save().then(() => {
                    response_data.json({success: true, message: CATEGORY_MESSAGE_CODE.ADD_CATEGORY_SUCCESSFULLY});
            }, (error) => {
                console.log(error);
                response_data.json({
                    success: false,
                    error_code: ERROR_CODE.SOMETHING_WENT_WRONG
                });
            });
        } else {
            response_data.json(response);
        }
    });
};





