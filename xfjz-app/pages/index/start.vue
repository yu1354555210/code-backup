<template>
	<view class="content">
		
	</view>
</template>

<script>
	import { mapState, mapMutations, mapGetters } from 'vuex';
	export default {
		data() {
			return {
			}
		},
		mounted(){
			this.$nextTick(function(){
				this.loadExecution();
			})
		},
		computed:{
			...mapGetters(['token'])
		},
		methods: {
			loadExecution(){
				console.log("this.token: " + this.token);
				if(!this.token){
					uni.redirectTo({
						url: '../login/index'
					})
				}else{
					uni.redirectTo({
						url: './index'
					});
				}
			},
			// loadExecution: function(){
			// 	console.log("this.token: " + this.token);
			// 	/**
			// 	 * 获取本地存储中launchFlag的值
			// 	 * 若存在，说明不是首次启动，直接进入首页；
			// 	 * 若不存在，说明是首次启动，进入引导页；
			// 	 */
			// 	try {
			// 	    let value;
			// 		uni.getStorage({
			// 		    key: 'launchFlag',
			// 		    success: function (res) {
			// 		        console.log(res.data);
			// 				value = res.data;
			// 		    }
			// 		});
			// 	    if (value) {
			// 	        if (value == true) {
			// 				if(!this.token){
			// 					uni.redirectTo({
			// 						url: '../login/index'
			// 					})
			// 				}else{
			// 					uni.redirectTo({
			// 						url: './index'
			// 					});
			// 				}
			// 	        } else {
			// 	            uni.redirectTo({
			// 	                url: './guide'
			// 	            });
			// 	        }
			// 	    } else {
			// 	        uni.setStorage({
			// 	            key: 'launchFlag',
			// 	            data: true,
			// 	            success: function() {
			// 					console.log('存储launchFlag');
			// 				}
			// 	        });
			// 	        uni.redirectTo({
			// 	            url: './guide'
			// 	        });
			// 	    }
			// 	} catch(e) { 
			// 		// error 
			// 		uni.setStorage({ 
			// 			key: 'launchFlag', 
			// 			data: true, 
			// 			success: function () {
			// 				console.log('error时存储launchFlag');
			// 			} 
			// 		}); 
			// 		if(!this.token){
			// 			uni.redirectTo({
			// 				url: '../login/index'
			// 			})
			// 		}else{
			// 			uni.redirectTo({
			// 				url: './index'
			// 			});
			// 		}
			// 	}
			// 	return;
			// 	if(!this.token){
			// 		uni.redirectTo({
			// 			url: '../login/index'
			// 		})
			// 	}else{
			// 		uni.redirectTo({
			// 			url: './index'
			// 		});
			// 	}
			// }
		}
	}
</script>
<style>
	
</style>
