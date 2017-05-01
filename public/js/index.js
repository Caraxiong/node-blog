$(function(){
	var $loginBox = $('#loginBox');
	var $registerBox = $('#registerBox');
	var $userInfoBox = $('#userInfoBox');

	$loginBox.find('a').on('click',function(){
		$registerBox.show();
		$loginBox.hide();
	})

	$registerBox.find('a').on('click',function(){
		$loginBox.show();
		$registerBox.hide();
	})

	$registerBox.find('button').on('click',function(){
		// 通过ajax提交请求
		$.ajax({
			type:'post',
			url:'/api/user/register',
			data: {
				username:$registerBox.find('[name="username"]').val(),
				password:$registerBox.find('[name="password"]').val(),
				rePassword:$registerBox.find('[name="rePassword"]').val()
			},
			dataType:'json',
			success: function(data){
				$registerBox.find('.colWarning').html(data.message)
				if(!data.code){
					// setTimeout(function(){
					// 	$loginBox.show();
					// 	$registerBox.hide();
					// },1000)
					
					window.location.reload();
				}
			}
		})
	})

	$loginBox.find('button').on('click',function(){
		// 通过ajax提交请求
		$.ajax({
			type:'post',
			url:'/api/user/login',
			data: {
				username:$loginBox.find('[name="username"]').val(),
				password:$loginBox.find('[name="password"]').val()
			},
			dataType:'json',
			success: function(data){
				$loginBox.find('.colWarning').html(data.message)
				if(!data.code){
					// setTimeout(function(){
					// 	$userInfoBox.show();
					// 	$loginBox.hide();
					// 	//显示用户登录信息
					// 	$userInfoBox.find('.username').html(data.userInfo.username);
					// 	$userInfoBox.find('.info').html(data.userInfo._id);
					// },1000)
					window.location.reload();
				}
			}
		})
	})
	// 退出
	$userInfoBox.find('button').on('click',function(){
		// 通过ajax提交请求
		$.ajax({
			type:'get',
			url:'/api/user/logout',
			success: function(data){
				if(!data.code){
					window.location.reload();
				}
			}
		})
	})
})