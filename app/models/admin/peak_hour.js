var mongoose = require('mongoose');
var schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var peak_hour = new schema({
    unique_id: Number,
    day: {type: String},
    peak_hours: 
    {type: Array, default: [{
        from_time: {type: Number},
        to_time: {type: Number},
        status: {type: Boolean}
    }]},
    delay_time: {type: Number},
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    strict: true,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

peak_hour.plugin(autoIncrement.plugin, {model: 'peak_hour', field: 'unique_id', startAt: 1, incrementBy: 1});
module.exports = mongoose.model('peak_hour', peak_hour);