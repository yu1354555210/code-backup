<template>
	<view class="address-container">
		<view class="address-body">
			<image class="address-bg" src="../../static/images/address-bg.png" mode="aspectFill"></image>
			<view class="address-list">
				<view class="address-item">
					<text>收件人:</text>
					<input type="text" value="" v-model="username" />
				</view>
				<view class="address-item">
					<text>手机号:</text>
					<input type="number" value="" v-model="mobile" maxlength="11"/>
				</view>
				<view class="address-item address-arrow" @click="showPicker">
					<text>所在地区:</text>
					<input type="text" :value="addr" disabled />
				</view>
				<view class="address-item">
					<text>详细地址:</text>
					<input type="text" value="" v-model="addr_info" />
				</view>
			</view>
		</view>
		<view class="address-tips">
			<image src="../../static/images/tips-icon.png" mode="aspectFill"></image>
			<text>注意：香港、澳门、台湾、新疆、西藏地区暂不发货</text>
		</view>
		<button type="primary" class="public-btn" @click="postData">保存</button>
		<w-picker
		    mode="region"
		    @confirm="onConfirm" 
		    ref="region" 
		    themeColor="#f00">
		</w-picker>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		data() {
			return {
				username: '',
				mobile: '',
				addr: [],
				addr_info: ''
			}
		},
		onLoad(option) {
			if(option.userInfo){
				let userInfo = JSON.parse(decodeURIComponent(option.userInfo));
				this.username = userInfo.username;
				this.mobile = userInfo.mobile;
				this.addr = userInfo.addr.replace(/-/gi,',');
				this.addr_info = userInfo.addr_info;
			}
		},
	    components:{
	        wPicker
	    },
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内分享按钮
				console.log(res.target);
			}
			return {
				title: '大奖天天抽',
				path: '/pages/index/index'
			};
		},
		methods: {
			showPicker() {
				this.$refs.region.show()
			},
			onConfirm(e){
				this.addr = e.checkArr;
			},
			postData(){
				let addr;
				if(typeof this.addr == 'string'){
					addr = this.addr.split(',').join('-');
				}else{
					addr = this.addr.join('-');
				}
				uni.request({
					url: getApp().globalData.apiUrl + 'api/paddress/api',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data: {
						token: uni.getStorageSync('token'),
						api_name: 'save_address',
						username: this.username,
						mobile: this.mobile,
						addr: addr,
						addr_info: this.addr_info
					},
					success: res => {
						uni.showToast({
							title: res.data.msg
						});
						if(res.data.code == 1){
							setTimeout(function() {
								uni.navigateBack();
							}, 1000);
						}
					},
					fail: res => {
						uni.showToast({
							title: res.data.msg
						});
					},
					complete: () => {}
				});
			}
		},
	}
</script>

<style lang="less">
</style>
