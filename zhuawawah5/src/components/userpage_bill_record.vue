<template>
	<div class="bg_whife">
	    <header class="header">
            <a class="back header_left" @click="$router.back()"></a>
	        <h1 class="header_title">娃娃币账单</h1>
	    </header>
	    
	    <div id="mescroll" class="mescroll" style="background-color: #F3F3F3;">
		    <div style="margin-top: 35px;">
				 <div style="text-align: center;color: #B3B3B3;">账户余额</div>
				 <div style="text-align: center;">
				 	<span id="mycoin" style="font-size: 35px;color:#FF94A6;font-weight: 800;text-decoration: underline;">{{coin}}</span><span style="color: #FBABCF;font-weight: bold;margin-left: 5px;">币</span>
				 </div>
		    </div>
	        <div class="weui-cells" style="margin-top: 35px;margin-bottom: 50px;" v-html="content">
				{{content}}
			</div>
	    </div>
	                	
	</div>
</template>

<script>
	export default {
	    name: 'app',
	    data () {
		    return {
		      content: '',
		      coin:''
		    }
	    },
	    methods : {
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
			
			var url = "apiAction_userinfo.action?token="+token+"&op=bodyBill";
			this.$ajax.get(url).then(res=>{
		    	this.content = res.data.result;
		    	this.coin = res.data.coin;
		    	
			}).catch(error=>console.log(error));
		}
	}
</script>

<style>
[v-cloak] {
  display: none;
}
</style>