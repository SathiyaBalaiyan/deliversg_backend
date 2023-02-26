require('../utils/message_code');
require('../utils/error_code');
require('../utils/constants');
var utils = require('../utils/utils');
var DeliverFee = require('mongoose').model('deliver_fee');
var mongoose = require('mongoose');
var console = require('../utils/console');


//add deliver fee
exports.add_deliver_fee = function (request_data, response_data) 
{
    utils.check_request_params(request_data.body, [], function (response) 
    {
        if (response.success) 
        {
            var request_data_body = request_data.body;

            var deliverFee = new DeliverFee(request_data_body);
            // var deliver_fee_name = request_data_body.deliver_fee_name;

            DeliverFee.findOne().then((deliver_fee_data) => {
                if (!deliver_fee_data)
                {
                    deliverFee.save().then((deliver_fee_add) => 
                    {
                        if (deliver_fee_add)
                        {
                            response_data.json({success: true, message: DELIVERY_FEE_MESSAGE_CODE.DELIVERY_FEE_ADDED_SUCCESSFULLY});
                        }
                        else
                        {
                            response_data.json({success: false, error_code: DELIVERY_FEE_ERROR_CODE.DELIVERY_FEE_ADD_FAILED});
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
                    DeliverFee.findOneAndUpdate({}, {$push: { delivery_fee: { $each: request_data_body.delivery_fee}}}).then((deliver_fee_update) => {

                        if (deliver_fee_update)
                        {
                            deliver_fee_update.save().then(result => {
                                response_data.json({ success: true, message: DELIVERY_FEE_MESSAGE_CODE.DELIVERY_FEE_UPDATED_SUCCESSFULLY });
                            })
                        }
                        else
                        {
                            response_data.json({ success: false, error_code: DELIVERY_FEE_ERROR_CODE.DELIVERY_FEE_UPDATE_FAILED });
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
            });
        }
        else 
        {
            response_data.json(response);
        }
    });
};


//To get peak hour status
exports.get_deliver_fee = function (request_data, response_data) 
{

    DeliverFee.find({}, {_id: 1, delivery_fee: 1}).then((deliveryFee) => 
    {
            if (deliveryFee.length == 0) 
            {
                response_data.json({ success: false, error_code: DELIVERY_FEE_ERROR_CODE.DELIVERY_FEE_DATA_NOT_FOUND });
            } 
            else 
            {
                response_data.json({
                    success: true,
                    message: DELIVERY_FEE_MESSAGE_CODE.DELIVERY_FEE_DATA_FOUND,
                    deliveryFee: deliveryFee
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
