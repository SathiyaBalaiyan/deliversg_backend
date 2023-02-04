require('../utils/message_code');
require('../utils/error_code');
require('../utils/constants');
var utils = require('../utils/utils');
var MainCategory = require('mongoose').model('main_category')
var console = require('../utils/console');



// add_main_category
exports.add_main_category = function (request_data, response_data) {
    utils.check_request_params(request_data.body, [{name: 'main_category_name', type: 'string'}], function (response) {
        if (response.success) {

            var request_data_body = request_data.body;
            var add_main_category = new MainCategory(request_data_body);

            let query = { $or: [{ 'main_category_name': request_data_body.main_category_name }] };

            MainCategory.findOne(query, function (err, mainCategory) 
            {
                if (mainCategory) 
                {
                    if (mainCategory.main_category_name == request_data_body.main_category_name) {
                        return response_data.json({ success: false, error_code: MAIN_CATEGORY_ERROR_CODE.MAIN_CATEGORY_ALREADY_EXIST });
                    }
                }
                else
                {
                    add_main_category.save().then(() => {
                        response_data.json({success: true, message: MAIN_CATEGORY_MESSAGE_CODE.ADD_MAIN_CATEGORY_SUCCESSFULLY});
                    }, (error) => {
                        console.log(error);
                        response_data.json({
                            success: false,
                            error_code: ERROR_CODE.SOMETHING_WENT_WRONG
                        });
                    });
                }
            })
            
        } 
        else 
        {
            response_data.json(response);
        }
    });
};


//fetch main_category datas
exports.fetch_main_category = function (request_data, response_data)
{
    utils.check_request_params(request_data.body, [], function (response) {
        if (response.success) {

            var request_data_body = request_data.body;

            var project = {
                $project: {
                            _id: 1,
                            main_category_name: 1,
                        }
            }
            

            MainCategory.aggregate([project]).then((catFil) => {
                if (catFil.length == 0) {
                    response_data.json({success: false, error_code: MAIN_CATEGORY_ERROR_CODE.MAIN_CATEGORY_DETAILS_NOT_FOUND
                    });
                } else {
                    response_data.json({success: true,
                        message: MAIN_CATEGORY_MESSAGE_CODE.GET_MAIN_CATEGORY_SUCCESSFULLY,
                        catFil: catFil

                    });
                }
            }, (error) => {
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





