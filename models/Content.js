var mongoose = require('mongoose');
var contentsSchema = require('../schemas/contents');
// 用于对用户的表进行操作
module.exports = mongoose.model('Content',contentsSchema);