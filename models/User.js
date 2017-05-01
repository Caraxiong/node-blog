var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');
// 用于对用户的表进行操作
module.exports = mongoose.model('User',usersSchema);