<template>
	<div class="bg_whife">
	    <header class="header">
            <a class="back header_left" @click="$router.back()"></a>
	        <h1 class="header_title">意见反馈</h1>
	    </header>
	    <div id="tab_feedback_contain" class="weui-main weui-userlist">
			<div style="margin-top: 10px;margin-left: 10px;font-size: 16px;">
				 <div style=";color: #A8A8A8;">你反馈的内容</div>
		    </div>
			<div style="margin-top: 10px;">
	        	<textarea id="feedback_content" style="border-style: none;width: 100%;height: 200px;padding-left: 10px;padding-top: 5px;font-size: 15px;" placeholder="请输入你反馈的内容..." maxlength="200"></textarea>
	        </div>
		        
		    <div style="margin-top: 8px;margin-left: 10px;font-size: 16px;">
				 <div style=";color: #A8A8A8;">你的联系方式</div>
		    </div>
		    
		    <div style="margin-top: 10px;">
		        <input id="contacts" type="text" style="border-style: none;padding-left:10px;width: 100%;height: 40px;font-size: 15px;" placeholder="留下邮箱或手机号码,方便我们联系你"/>
		    </div>
		    
		    <div style="margin-top: 50px;" >
			    <a href="javascript:;" id="submit_feedback" class="weui-btn weui-btn_default" style="">提交反馈</a>
		    </div>
	    </div>
	                	
	</div>
</template>

<script>
	export default {
	    name: 'app',
	    data () {
		    return {
		    }
	    },
	    methods : {
		},
		created: function(){
		},
		mounted:function(){
			
			var token = getCookie("token");
			$("#submit_feedback").click(function(){
		    	var feedback_content = $("#feedback_content").val();
		    	var contacts = $("#contacts").val();
				
				if(feedback_content!="" && contacts!=""){
					
					var url = "apiAction_userinfo.action?&token="+token+"&op=feedback";
					$.post(url,
					  {
					  	feedback_content:feedback_content,
					    contacts:contacts,
					  },
					  function(data,status){
					    if(data=="1"){
				  			$.alert({
					            title: "提示",
					            text: "提交成功!",
					            onOK: function(text){
					            },
					            onCancel: function(){
					            },
					        });
				  		}else{
				  			$.alert({
					            title: "提示",
					            text: "提交失败!",
					            onOK: function(text){
					            },
					            onCancel: function(){
					            },
					        });
				  		}
					  });
				}
				else{
					$.alert({
			            title: "温馨提示",
			            text: "内容不能为空",
			            onOK: function(text){
			            },
			            onCancel: function(){
			            },
			        });
				}
							    
		    });

		}
	}
</script>

<style>
 
</style>
