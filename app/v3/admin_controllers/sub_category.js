require('../utils/message_code');
require('../utils/error_code');
require('../utils/constants');
var utils = require('../utils/utils');
var SubCategory = require('mongoose').model('sub_category');
var Store = require('mongoose').model('store');
var Delivery = require('mongoose').model('delivery');
var mongoose = require('mongoose');
var console = require('../utils/console');


// add_sub_category
exports.add_sub_category = function (request_data, response_data) 
{
    utils.check_request_params(request_data.body, [{ name: 'sub_category_name', type: 'string' }, { name: 'store_delivery_id', type: 'string' }], function (response) 
    {
        if (response.success) 
        {
            var request_data_body = request_data.body;

            var add_sub_category = new SubCategory(request_data_body);

            let image_file = request_data.files;
            if (image_file != undefined && image_file.length > 0) 
            {
                let image_name = add_sub_category._id + utils.generateServerToken(4);
                let url = utils.getStoreImageFolderPath(FOLDER_NAME.SUB_CATEGORY_IMAGES) + image_name + FILE_EXTENSION.SUB_CATEGORY;
                add_sub_category.sub_category_image = url;
                utils.storeImageToFolder(image_file[0].path, image_name + FILE_EXTENSION.SUB_CATEGORY, FOLDER_NAME.SUB_CATEGORY_IMAGES);
            }

            let query = { $or: [{ 'sub_category_name': request_data_body.sub_category_name }] };

            Delivery.findOne({ _id: request_data_body.store_delivery_id }).then((deliveryId) => {
                if (deliveryId)
                {
                    SubCategory.findOne(query, function (err, subCategory) 
                    {
                        if (subCategory) 
                        {
                            if (subCategory.sub_category_name == request_data_body.sub_category_name) {
                                return response_data.json({ success: false, error_code: SUB_CATEGORY_ERROR_CODE.SUB_CATEGORY_ALREADY_EXIST });
                            }
                        }
                        else
                        {
                            add_sub_category.save().then(() => 
                            {
                                response_data.json({success: true, message: SUB_CATEGORY_MESSAGE_CODE.ADD_SUB_CATEGORY_SUCCESSFULLY});
                            }, 
                            (error) => {
                                console.log(error);
                                response_data.json({
                                    success: false,
                                    error_code: ERROR_CODE.SOMETHING_WENT_WRONG
                                });
                            });
                        }
                    })
                }
            }, 
            (error) => {
                console.log(error);
                response_data.json({
                    success: false,
                    error_code: ERROR_CODE.SOMETHING_WENT_WRONG
                });
            });
        }
        else 
        {
            response_data.json(response);
        }
    });
};


//To get sub category data
exports.get_sub_category = function (request_data, response_data) {

    SubCategory.find({}, {_id: 1, store_delivery_id: 1, sub_category_name: 1, sub_category_image: 1, unique_id: 1}).then((sub_category_data) => {

            if (sub_category_data.length == 0) {
                response_data.json({ success: false, error_code: SUB_CATEGORY_ERROR_CODE.SUB_CATEGORY_DETAILS_NOT_FOUND });
            } else {
                response_data.json({
                    success: true,
                    message: SUB_CATEGORY_MESSAGE_CODE.GET_SUB_CATEGORY_SUCCESSFULLY,
                    sub_category_data: sub_category_data
                });
            }
        }, (error) => {
            console.log(error)
            response_data.json({
                success: false,
                error_code: ERROR_CODE.SOMETHING_WENT_WRONG
            });
        });
};


// fetch stores using sub_category_id
exports.get_sub_category_stores = function (request_data, response_data)
{
    utils.check_request_params(request_data.body, [{ name: 'sub_category_id', type: 'string' }], function (response) {
        if (response.success) 
        {
            var request_data_body = request_data.body;
            var sub_category_id = request_data_body.sub_category_id;

            var store_query = {
                $lookup:
                        {
                            from: "sub_categories",
                            localField: "sub_category_id",
                            foreignField: "_id",
                            as: "sub_category_stores"
                        }
            };

            var array_to_json_store_query = {$unwind: "$sub_category_stores"};

            Store.find({sub_category_id: request_data_body.sub_category_id}, {_id: 1, name: 1, email: 1, phone: 1, address: 1}).then((subCategory_stores) => {

                if (subCategory_stores.length == 0) 
                {
                    response_data.json({success: false, error_code: USER_ERROR_CODE.STORE_LIST_NOT_FOUND
                    });
                } 
                else 
                {
                    response_data.json({success: true,
                        message: USER_MESSAGE_CODE.GET_STORE_LIST_SUCCESSFULLY,
                        subCategory_stores: subCategory_stores

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





