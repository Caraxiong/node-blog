var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function(req,res,next){
	if(!req.userInfo.isAdmin){
		//如果当前用户是非管理员
		res.send('sorry！')
		return;
	}
	next();
})
// 首页
router.get('/',function(req,res,next){
	res.render('admin/index',{
		userInfo:req.userInfo
	});
})
// 用户管理
router.get('/user',function(req,res,next){
	//从数据库中读取所有数据
	// limit(Number):限制获取的数据条数
	// skip(Number):忽略数据的条数   （当前页-1）*limit
	var page = Number(req.query.page) || 1;
	var limit = 5; 
	var pages = 0;
	//获取总条数
	User.count().then(function(count){

		// 计算总页数
		pages = Math.ceil(count / limit);
		// 取值不能超过pages
		page = Math.min(page,pages);
		// 取值不能小于1
		page = Math.max(page,1);

		var skip = (page - 1) * limit;

		User.find().limit(limit).skip(skip).then(function(users){
			res.render('admin/user_index',{
				userInfo:req.userInfo,
				users:users,
				page:page,
				count:count,
				pages:pages,
				limit:limit
			});
		})
	});
	
})

//分类首页
router.get('/category',function(req,res){
	//从数据库中读取所有数据
	// limit(Number):限制获取的数据条数
	// skip(Number):忽略数据的条数   （当前页-1）*limit
	var page = Number(req.query.page) || 1;
	var limit = 5; 
	var pages = 0;
	//获取总条数
	Category.count().then(function(count){

		// 计算总页数
		pages = Math.ceil(count / limit);
		// 取值不能超过pages
		page = Math.min(page,pages);
		// 取值不能小于1
		page = Math.max(page,1);

		var skip = (page - 1) * limit;
		//排序
		//1:升序
		//-1:降序
		Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
			res.render('admin/category_index',{
				userInfo:req.userInfo,
				categories:categories,
				page:page,
				count:count,
				pages:pages,
				limit:limit
			});
		})
	})
})

//添加分类
router.get('/category/add',function(req,res){
	res.render('admin/category_add',{
		userInfo:req.userInfo
	})
})
	
//分类的保存
router.post('/category/add',function(req,res){
	var name = req.body.name || '';
	if(name == ''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			errorMsg:'名称不能为空',
			url:''
		})
		return;
	}
	// 数据库是否存在相同name
	Category.findOne({
		name:name
	}).then(function(rs){
		if(rs){
			// 数据库中已经存在
			res.render('admin/error',{
				userInfo:req.userInfo,
				errorMsg:'该名称已经存在'
			})
			return Promise.reject();
		}else{
			//不存在则保存
			return new Category({
				name:name
			}).save();
		}
	}).then(function(newCategory){
		res.render('admin/success',{
			userInfo:req.userInfo,
			msg:'分类保存成功',
			url:'/admin/category'
		})
	})
})

//分类修改
router.get('/category/edit',function(req,res){
	//获取要修改的分类信息，并且用表单的形式展现出来
	var id = req.query.id || '';
	// 获取要修改的分类信息
	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
			res.render('admin/error',{
				userInfo:req.userInfo,
				msg:'分类信息不存在'
			})
		}else{
			res.render('admin/category_edit',{
				userInfo:req.userInfo,
				category:category
			})
		}
	})
})

// 分类修改保存
router.post('/category/edit',function(req,res){
	//获取要修改的分类信息，并且用表单的形式展现出来
	var id = req.query.id || '';
	var name = req.body.name || '';
	// 获取要修改的分类信息
	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
			res.render('admin/error',{
				userInfo:req.userInfo,
				msg:'分类信息不存在'
			})
			return Promise.reject();
		}else{
			// 当用户没有做任何修改提交的时候
			if(name == category.name){
				res.render('admin/error',{
					userInfo:req.userInfo,
					errorMsg:'修改成功',
					url:'/admin/category'
				})
				return Promise.reject();
			}else{
				//判断新修改的名称在数据库中是否已经存在
				return Category.findOne({
					_id:{$ne:id},
					name:name
				})
			}
		}
	}).then(function(sameCategory){
		if(sameCategory){
			res.render('admin/error',{
				userInfo:req.userInfo,
				errorMsg:'数据库中已经存在同名分类'
			})
			return Promise.reject();
		}else{
			return Category.update({
				_id:id
			},{
				name:name
			});
		}
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			msg:'修改成功',
			url:'/admin/category'
		})
	})
})

// 分类删除
router.get('/category/delete',function(req,res){
	//获取要修改的分类信息，并且用表单的形式展现出来
	var id = req.query.id || '';
	// 获取要修改的分类信息
	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
			res.render('admin/error',{
				userInfo:req.userInfo,
				msg:'分类信息不存在'
			})
		}else{
			Category.remove({
				_id:id
			}).then(function(){
				res.render('admin/success',{
					userInfo:req.userInfo,
					msg:'删除成功',
					url:'/admin/category'
				})
			})
		}
	})
})
//内容首页
router.get('/content',function(req,res){
	//从数据库中读取所有数据
	// limit(Number):限制获取的数据条数
	// skip(Number):忽略数据的条数   （当前页-1）*limit
	var page = Number(req.query.page) || 1;
	var limit = 5; 
	var pages = 0;
	Content.count().then(function(count){
		// 计算总页数
		pages = Math.ceil(count / limit);
		// 取值不能超过pages
		page = Math.min(page,pages);
		// 取值不能小于1
		page = Math.max(page,1);

		var skip = (page - 1) * limit;
		//排序
		//1:升序
		//-1:降序

		// populate('category') 返回的contents结构中包含的category是从另一个表中读取出来的数据
		Content.find().sort({addTime:-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
			res.render('admin/content_index',{
				userInfo:req.userInfo,
				contents:contents,
				page:page,
				count:count,
				pages:pages,
				limit:limit
			});
		})
	})
})
// 内容添加页面
router.get('/content/add',function(req,res){
	Category.find().sort({_id:-1}).then(function(categories){
		res.render('admin/content_add',{
			userInfo:req.userInfo,
			categories:categories

		})
	})
})

// 内容保存
router.post('/content/add',function(req,res){
	if(req.body.category==''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			errorMsg:'内容分类不能为空'
		})
		return;
	}
	if(req.body.title==''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			errorMsg:'内容标题不能为空'
		})
		return;
	}
	// 保存数据到数据库
	new Content({
		category:req.body.category,
		title:req.body.title,
		user:req.userInfo._id.toString(),
		desc:req.body.desc,
		content:req.body.content
	}).save().then(function(rs){
		res.render('admin/success',{
			userInfo:req.userInfo,
			msg:'内容保存成功',
			url:'/admin/content'
		})
	})
})

// 修改内容
router.get('/content/edit',function(req,res){
	//获取要修改的分类信息，并且用表单的形式展现出来
	var id = req.query.id || '';
	var categories = []
	Category.find().sort({_id:-1}).then(function(rs){

		categories = rs;
		// 获取要修改的分类信息
		return Content.findOne({
			_id:id
		}).populate(['category','user']);
	}).then(function(content){
		if(!content){
			res.render('admin/error',{
				userInfo:req.userInfo,
				msg:'内容不存在'
			})
			return Promise.reject();
		}else{
			res.render('admin/content_edit',{
				userInfo:req.userInfo,
				content:content,
				categories:categories
			})
		}
	})
})
//保存修改内容
router.post('/content/edit',function(req,res){
	var id = req.query.id || '';
	if(req.body.category==''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			errorMsg:'内容分类不能为空'
		})
		return;
	}
	if(req.body.title==''){
		res.render('admin/error',{
			userInfo:req.userInfo,
			errorMsg:'内容标题不能为空'
		})
		return;
	}
	Content.update({
		_id:id
	},{
		category:req.body.category,
		title:req.body.title,
		desc:req.body.desc,
		content:req.body.content
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			msg:'内容保存成功',
			url:'/admin/content/edit?id='+id
		})
	})
})

// 内容删除
router.get('/content/delete',function(req,res){
	var id = req.query.id || '';
	Content.remove({
		_id:id
	}).then(function(){
		res.render('admin/success',{
			userInfo:req.userInfo,
			msg:'删除成功',
			url:'/admin/content'
		})
	})
})
module.exports = router