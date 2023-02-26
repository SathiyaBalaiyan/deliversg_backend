require('../utils/message_code');
require('../utils/error_code');
require('../utils/constants');
var utils = require('../utils/utils');
var PeakHour = require('mongoose').model('peak_hour');
var Store = require('mongoose').model('store');
var console = require('../utils/console');


//To enable peak hour status
exports.add_peak_hour_status = function (request_data, response_data) {

    utils.check_request_params(request_data.body, [{ name: 'day', type: 'string' }], function (response) {
        
        if (response.success) 
        {
            var request_data_body = request_data.body;

            var peakHour = new PeakHour(request_data_body);
            var day = request_data_body.day;
            
            PeakHour.findOne({day: day}).then((peak_hour_data) => {
                if (!peak_hour_data)
                {
                    peakHour.save().then((peak_hour_enable) => 
                    {
                        if (peak_hour_enable)
                        {
                            response_data.json({success: true, message: PEAK_HOUR_MESSAGE_CODE.PEAK_HOUR_ADDED_SUCCESSFULLY});
                        }
                        else
                        {
                            response_data.json({success: false, error_code: PEAK_HOUR_ERROR_CODE.PEAK_HOUR_ADD_FAILED});
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

                    PeakHour.findOneAndUpdate({day: day}, {$push: { peak_hours: { $each: request_data_body.peak_hours}}}).then((peak_hour_update) => {

                        if (peak_hour_update)
                        {
                            peak_hour_update.save().then(result => {
                                response_data.json({ success: true, message: PEAK_HOUR_MESSAGE_CODE.PEAK_HOUR_UPDATED_SUCCESSFULLY });
                            })
                        }
                        else
                        {
                            response_data.json({ success: false, error_code: PEAK_HOUR_ERROR_CODE.PEAK_HOUR_UPDATE_FAILED });
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
}


//To get peak hour status
exports.get_peak_hour_status = function (request_data, response_data) 
{

    PeakHour.find({}, {_id: 1, day: 1, peak_hours: 1, delay_time: 1, unique_id: 1}).then((peak_hours_status) => 
    {
            if (peak_hours_status.length == 0) 
            {
                response_data.json({ success: false, error_code: PEAK_HOUR_ERROR_CODE.PEAK_HOUR_DATA_NOT_FOUND });
            } 
            else 
            {
                response_data.json({
                    success: true,
                    message: PEAK_HOUR_MESSAGE_CODE.GET_SUB_CATEGORY_SUCCESSFULLY,
                    peak_hours_status: peak_hours_status
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