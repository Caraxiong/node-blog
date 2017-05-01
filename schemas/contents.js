var mongoose = require('mongoose');

// 内容的表结构
module.exports = new mongoose.Schema({
	//关联字段   分类的id
	category : {
		//类型   
		type:mongoose.Schema.Types.ObjectId,
		//引用
		ref:'Category'
	},
	user : {
		//类型   
		type:mongoose.Schema.Types.ObjectId,
		//引用
		ref:'User'
	},
	//填加时间
	addTime:{
		type:Date,
		default:new Date()
	},
	//阅读量
	views:{
		type:Number,
		default:0
	},
	//	分类标题
	title:String,

	//简介
	desc: {
		type:String,
		default:''
	},
	//内容
	content: {
		type:String,
		default:''
	},
})