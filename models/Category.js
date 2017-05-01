var mongoose = require('mongoose');
var categoriesSchema = require('../schemas/categories');
// 用于对用户的表进行操作
module.exports = mongoose.model('Category',categoriesSchema);