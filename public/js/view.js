$(function(){
	// 每次页面重载获取一下文章所有评论
	$.ajax({
		type:'GET',
		url:'/api/comment',
		data:{
			contentId:$('#contentId').val()
		},
		success:function(rsData){
			renderComment(rsData.data.reverse());
		}
	})

	var perPage = 3
	var pages = 0

	$("#messageBtn").on('click',function(){
		$.ajax({
			type:'POST',
			url:'/api/comment/post',
			data:{
				contentId:$('#contentId').val(),
				content:$('#messageContent').val()
			},
			success:function(rsData){
				$('#messageContent').val('');
				renderComment(rsData.data.reverse());
			}
		})
	})
	// delegate:事件委托
	$('.pager').delegate('a','click',function(){

	})

	function renderComment(comments){
		$('#msgCount').html(comments.length);
		// pages = Math.ceil(comments.length/perPage);
		
		// var start = 0
		// var end = 0

		var html = '';
		for(var i = 0;i<comments.length;i++){
			html += `<div>${comments[i].username}时间${formatDate(comments[i].postTime)}内容${comments[i].content}</div>`
		}
		$('.messageList').html(html);
	}
	function formatDate(d){
		var date = new Date(d);
		return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	}
})