var express = require('express');
var router = express.Router();
var User = require('../models/User')

// 统一返回格式
var responseData;
router.use(function(req,res,next){
	responseData = {
		code:0,
		message:""
	}

	next();
})
// 用户注册
// 注册逻辑
// 1.用户名不能为空
// 2.密码不能为空
// 3.两次密码必须一直
// 4.用户名是否已经被注册
router.post('/user/register',function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.rePassword;
	if(username == ''){
		responseData.code = 1;
		responseData.message = '用户名不能为空';
		// 会把对象转为json格式返回给前端
		res.json(responseData);
		return;
	}
	if(password == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空'
		// 会把对象转为json格式返回给前端
		res.json(responseData);
		return;
	}
	if(password !== repassword){
		responseData.code = 3;
		responseData.message = '两次密码必须一致'
		// 会把对象转为json格式返回给前端
		res.json(responseData);
		return;
	}
	// 判断用户是否已经被注册
	User.findOne({
		username:username
	}).then(function(userInfo){
		if(userInfo){
			// 表示数据库中有该记录
			responseData.code = 4;
			responseData.message = '用户名已被注册'
			// 会把对象转为json格式返回给前端
			res.json(responseData);
			return;
		}else{
			//保存用户信息到数据库
			var user = new User({
				username:username,
				password:password
			});
			return user.save();
		}
	}).then(function(newUserInfo){
		console.log(newUserInfo)
		responseData.message = '用户注册成功'

		responseData.userInfo = {
			username:newUserInfo.username,
			_id:newUserInfo._id
		}
		//发送一个cookie
		req.cookies.set('userInfo',JSON.stringify({
			username:newUserInfo.username,
			_id:newUserInfo._id
		}));
		// 会把对象转为json格式返回给前端
		res.json(responseData);
	})
})

// 登录
router.post('/user/login',function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	if(username == ''){
		responseData.code = 1;
		responseData.message = '用户名不能为空';
		// 会把对象转为json格式返回给前端
		res.json(responseData);
		return;
	}
	if(password == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空'
		// 会把对象转为json格式返回给前端
		res.json(responseData);
		return;
	}
	
	// 判断用户是否已经被注册
	User.findOne({
		username:username
	}).then(function(userInfo){
		if(!userInfo){
			// 表示数据库中有该记录
			responseData.code = 3;
			responseData.message = '用户名还未注册'
			// 会把对象转为json格式返回给前端
			res.json(responseData);
			return;
		}
		responseData.message = '登录成功'
		responseData.userInfo = {
			username:userInfo.username,
			_id:userInfo._id
		}
		//发送一个cookie
		req.cookies.set('userInfo',JSON.stringify({
			username:userInfo.username,
			_id:userInfo._id
		}));
		res.json(responseData);
		return;
	})
})
//后台退出
router.get('/user/logout',function(req,res){
	req.cookies.set('userInfo',null);
	res.json(responseData);

})


module.exports = router