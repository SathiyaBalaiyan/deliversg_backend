var mongoose = require('mongoose');
var schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var category = new schema({
    unique_id: Number,
    category_name: {type: String, default: ""}
});

category.plugin(autoIncrement.plugin, {model: 'category', field: 'unique_id', startAt: 1, incrementBy: 1});
module.exports = mongoose.model('category', category);