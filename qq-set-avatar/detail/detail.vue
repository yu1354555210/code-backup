<template>
	<view class="content">
		<view class="detail-avatar">
			<view class="avatar"><image :src="ewmImg" mode="aspectFill"></image></view>
			<view class="avatar avatar-radius"><image :src="ewmImg" mode="aspectFill"></image></view>
		</view>
		<view class="detail-btn">
			<view v-if="openSettingBtnHidden" class="btn" @click="saveEwm"><image src="../static/save.png" mode="aspectFill"></image></view>
			<button v-else class="btn" hover-class="none" open-type="openSetting" @opensetting="handleSetting"><image src="../static/save.png" mode="aspectFill"></image></button>
			<button class="btn" @click="upServerImage" hover-class="none"><image src="../static/set.png" mode="aspectFill"></image></button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			ewmImg: '',
			baseImg: '',
			openSettingBtnHidden: true //是否授权
		};
	},
	onLoad(options) {
		console.log(options);
		this.ewmImg = options.aesUrl;
		this.baseImg = options.baseUrl;
	},
	methods: {
		handleSetting(e) {
			if (!e.detail.authSetting['scope.writePhotosAlbum']) {
				this.openSettingBtnHidden = false;
			} else {
				this.openSettingBtnHidden = true;
			}
		},
		saveEwm: function(e) {
			//获取相册授权
			var _self = this;
			uni.getSetting({
				success(res) {
					if (!res.authSetting['scope.writePhotosAlbum']) {
						uni.authorize({
							scope: 'scope.writePhotosAlbum',
							success() {
								//这里是用户同意授权后的回调
								_self.saveImgToLocal();
							},
							fail() {
								//这里是用户拒绝授权后的回调
								_self.openSettingBtnHidden = false;
							}
						});
					} else {
						//用户已经授权过了
						_self.saveImgToLocal();
					}
				}
			});
		},
		saveImgToLocal: function(e) {
			let _self = this;
			uni.showModal({
				title: '提示',
				content: '确定保存到相册吗',
				success: function(res) {
					if (res.confirm) {
						uni.downloadFile({
							url: _self.ewmImg, //图片地址
							success: res => {
								if (res.statusCode === 200) {
									uni.saveImageToPhotosAlbum({
										filePath: res.tempFilePath,
										success: function() {
											uni.showToast({
												title: '保存成功',
												icon: 'none'
											});
										},
										fail: function() {
											uni.showToast({
												title: '保存失败',
												icon: 'none'
											});
										}
									});
								}
							}
						});
					} else if (res.cancel) {
					}
				}
			});
		},
		setAvatar() {
			var _self = this;
			uni.downloadFile({
				url: _self.ewmImg, //图片地址
				success: res => {
					if (res.statusCode === 200) {
						console.log(res.tempFilePath);
						qq.setCustomDress({
						   action:"uploadAvatar",
						   path: res.tempFilePath,
						   success(res){
									uni.showToast({
										title: '设置成功',
										icon: 'none'
									});
									setTimeout(()=>{
										uni.navigateBack();
									},1000);
						   },
						   fail(res){
						      console.log(res);
									uni.showToast({
										title: '设置失败',
										icon: 'none'
									});
						   }
						})
					}
				}
			});
		},
		upServerImage(){
			uni.request({
				url: this.apiUrl + '/cp_v1/img/set',
				method: 'POST',
				header:{
					'content-type': 'application/x-www-form-urlencoded', 
				},
				data: {
					url: this.baseImg
				},
				success: res => {
					let data = res.data;
					if(data.errCode == 0){
						this.setAvatar();
					}else{
						uni.showToast({
							title: res.errMsg
						})
					}
				},
				fail: () => {},
				complete: () => {}
			});
		}
	}
};
</script>

<style lang="stylus">
.content
	padding 0 37rpx
.detail-avatar
	margin 200rpx 0 200rpx
	display flex
	justify-content space-between
.avatar
	image
		width 320rpx
		height 320rpx
		border-radius 20rpx
		border 2px solid #FC5575
	&.avatar-radius
		image
			border-radius 50%
.detail-btn
	display flex
	justify-content space-between
	.btn
		padding 0
	image
		width 300rpx
		height 90rpx
</style>
