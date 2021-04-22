<template>
	<view class="mine-container">
		<view class="award-info">
			<view class="award-info-top">
				<image src="../../static/images/mine-bg.png" class="award-info-bg" mode="aspectFill"></image>
				<view class="mine-avatar">
					<image :src="avatar" mode="aspectFill" class="avatar-image"></image>	
					<image :src="sex == 1 ? '../../static/images/man-icon.png' : '../../static/images/woman-icon.png'" class="mine-sex" mode="aspectFill"></image>
				</view>
				<text class="mine-nickname">{{user_show_name|Base64Decode}}</text>
			</view>
			<view class="award-info-bottom">
				<navigator url="../my-address/index" class="award-link">
					<image src="../../static/images/address-icon.png" mode="aspectFill"></image>
					<text>收货地址</text>
				</navigator>
				<navigator url="../agreement/index" class="award-link">
					<image src="../../static/images/agreement-icon.png" mode="aspectFill"></image>
					<text>用户协议</text>
				</navigator>
			</view>
		</view>
		<view class="mine-nav">
			<navigator url="../all-award/index">
				<image src="../../static/images/mine-item1.png" mode="aspectFill"></image>
				<view>
					<text class="mine-total-num" v-text="cj_counts"></text>
					<text class="mine-nav-info">全部抽奖</text>
				</view>
			</navigator>
			<navigator url="../record/index">
				<image src="../../static/images/mine-item2.png" mode="aspectFill"></image>
				<view>
					<text class="mine-total-num" v-text="zj_counts"></text>
					<text class="mine-nav-info">中奖记录</text>
				</view>
			</navigator>
		</view>
		<view class="mine-ad">
			<ad unit-id="adunit-88c7e5d481dc6241"></ad>
		</view>
		<button type="primary" class="logout-btn" @click="logout">退出登录</button>
	</view>
</template>

<script>
	import { Base64 } from 'js-base64';
	export default {
		data() {
			return {
				zj_counts: 0,
				cj_counts: 0,
				nickName: '',
				avatar: '',
				user_show_name:'',
				sex: 1
			};
		},
		onShow() {
			this.getData();
		},
		filters: {
			Base64Decode(value){
				return Base64.decode(value)
			}
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
			getData() {
				uni.showLoading({
					title: '加载中'
				})
				uni.request({
					url: getApp().globalData.apiUrl	+ 'api/pchoujiang/api',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					data: {
						token: uni.getStorageSync('token'),
						api_name: 'my_info'
					},
					success: res => {
						console.log(res.data)
						if(res.data.code == 1){
							this.zj_counts = res.data.data.zj_counts;
							this.cj_counts = res.data.data.cj_counts;
							this.nickName = res.data.data.user_nicename;
							this.user_show_name = res.data.data.user_show_name;
							this.avatar = res.data.data.avatar;
							this.sex = res.data.data.sex;
						}else{
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
						}
					},
					fail: (res) => {
						uni.showToast({
							title: res.data.msg
						});
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},
			logout(){
				this.$store.commit('logout');
			}
		},
	}
</script>

<style lang="less">
	.mine-container{
		padding: 20rpx 35rpx;
	}
	.award-info{
		.award-info-top{
			width: 100%;
			height: 200rpx;
			justify-content: initial;
			padding: 0 20rpx;
			.mine-avatar{
				width: 100rpx;
				height: 100rpx;
				border: 8rpx solid #FFFFFF;
				position: relative;
				border-radius: 50%;
				.avatar-image{
					border-radius: 50%;
				}
				.mine-sex{
					display: block;
					width: 35rpx;
					height: 35rpx;
					border-radius: 50%;
					overflow: hidden;
					position: absolute;
					bottom: -2rpx;
					right: -16rpx;
				}
				image{
					height: 100%;
				}
			}
			.mine-nickname{
				color: #FFFFFF;
				font-size: 30rpx;
				margin-left: 30rpx;
			}
		}
		.award-info-bottom{
			height: 90rpx;
		}
	}
	.award-link{
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		image{
			width: 36rpx;
			height: 36rpx;
			display: inline-block;
			vertical-align: middle;
			margin-right: 12rpx;
		}
		&:first-child{
			&:after{
				width: 1rpx;
				height: 60rpx;
				content: '';
				display: block;
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				background-color: #c0c0c0;
			}
		}
	}
	.mine-nav{
		margin: 30rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		navigator{
			position: relative;
			width: 342rpx;
			height: 202rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			color: #fff;
			font-size: 32rpx;
			padding-right: 55rpx;
			text-align: center;
			view{
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			image{
				position: absolute;
				z-index: -1;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
			}
			.mine-total-num{
				font-size: 60rpx;
			}
		}
	}
	
	.mine-ad{
		width: 100%;
	}
	
	.logout-btn{
		margin-top: 100rpx;
		background-color: #b6b6b6 !important;
		border-radius: 200rpx;
	}
	
</style>
