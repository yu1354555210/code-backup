<template>
	<div class="bg_whife">
	    <header class="header">
	    	<a class="back header_left" @click="$router.back()"></a>
	    	<h1 class="header_title">收货地址</h1>
	    </header>
		<div id="mescroll" class="mescroll" style="background-color: #ffffff;">
		    <div class="weui-main weui-userlist" style="margin-bottom: 100px;" >
			 	<div class="weui-cells" >
				    
				    <div class='weui-cell weui-cell_access' v-for="pd in pdlist">
						<div class='weui-cell__hd' style='width: 90%;'>
							<div style='color: #000000;line-height:15px;font-size: 14px;'>{{pd.addr}}{{pd.addr_info}}</div>       	
							<div style='color: #999999;font-size: 12px;margin-top: 5px;'><span>{{pd.username}}</span>&nbsp;&nbsp;<span>{{pd.mobile}}</span></div>              	
						</div>               	
						<a href='javascript:;'>
							<div v-on:click='del(pd.addr_id)' style='width: 10%;float: right;margin-right: 20px;'>  
								<img src='http://wawah5-1252571264.file.myqcloud.com/images/btn_edit.png' width='20px'> 
							</div>
						</a>
					</div>
				</div>
		    </div>
	    </div>
	</div>
</template>

<script>
	
	export default{
	  name: 'app',
	  data () {
	    return {
	      pdlist:'',
	    }
	  },
	  methods : {
	  		del:function(aid){
	  			var token = getCookie("token");
				var self = this;
				$.confirm("您确定要删除该记录吗?", "温馨提示", function() {
		          	var url = "apiAction_userinfo.action?token="+token+"&op=addr_del&aid="+aid;
					self.$ajax.get(url).then(res=>{
				    	if(res.data==1){
				    		$.toast("删除成功!", "text");
				    		window.location.reload();
				    	}else{
				    		$.toast("删除失败!", "text");
				    	}
				    	
					}).catch(error=>console.log(error));
		        }, function() {
		           
		        });
	  		},
	  		
		},
		created: function(){
		},
		mounted:function(){
			this.$nextTick(function(){
                var self = this;
				self.mescroll = new MeScroll("mescroll", {
					down: {
						use:false,
						isBounce: false,
					},
					up: {
						use:false,
						isBounce: false, 
					}
				});
            })
			
			var token = getCookie("token");
			var url = "apiAction_userinfo.action?token="+token+"&op=addr_list";
			this.$ajax.get(url).then(res=>{
		    	this.pdlist = res.data.list;
			}).catch(error=>console.log(error));
		}
	}
</script>



<style>
[v-cloak] {
  display: none;
}
</style>