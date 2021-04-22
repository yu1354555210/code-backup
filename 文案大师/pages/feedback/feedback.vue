<template>
	<view class="content">
		<view class="feedback-title">问题和意见</view>
		<view class="textarea">
			<u-input
				@input="descInput"
				v-model="value"
				:clearable="false"
				:type="type"
				placeholder="和我们分享最戳你的那段文案"
				:height="height"
				:auto-height="autoHeight"
				maxlength="100"
			/>
			<view class="total-num">
				<text v-text="remnant"></text>
				/100
			</view>
		</view>
		<view class="feedback-title">图片</view>
		<u-upload ref="uUpload" :action="action" :auto-upload="false" width="110" height="110" :upload-text="null" del-bg-color="#00a6ac" max-count="1"></u-upload>
		<u-button type="default" shape="circle" :ripple="true" :custom-style="customStyle" @click="submit">提交</u-button>
		<view class="customer">
			客服QQ：3195478525
			<text @click="copy">点击复制QQ</text>
		</view>
	</view>
</template>

<script>
import uniCopy from '@/js_sdk/xb-copy/uni-copy.js';
export default {
	data() {
		return {
			value: '',
			type: 'textarea',
			height: 436,
			autoHeight: true,
			remnant: 0,
			action: '',
			customStyle: {
				color: 'white',
				backgroundColor: '#00a6ac',
				width: '460rpx',
				marginBottom: '80rpx',
				marginTop: '150rpx'
			},
			lists: "",
		};
	},
	methods: {
		descInput(e) {
			this.remnant = e.length;
		},
		uploadImage(img) {
			console.log("img: ",img);
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					//参数可查看官方文档
					url: 'https://app1-api.qianr.com/api/master/v1/do_opinion',
					filePath: img.toString(),
					name: 'image',
					header: {
						"Content-Type": "multipart/form-data",
						"accept": 'application/json'
					},
					formData:{
						token: this.vuex_token,
						text: this.value,
						version: this.vuex_version,
					},
					success: (res) => {
						console.log("res: ",res);
						//因为我用的三方存储，所以将存储后的返回路径做了存储，
						//可能不同的accept返回的数据格式不同，所以处理数据的方式也不同
						//我在此处将上传三方库成功返回的路径进行了压栈存储
						//uploadImgs.push(JSON.parse(res.data).data.code)
						resolve(res)
						
						uni.showToast({
							title: '意见反馈成功!',
							icon: 'none'
						})
						setTimeout(()=>{
							uni.navigateBack();
						}, 800);
					},
					fail: (err) =>{
						console.log("err: ",err);
						reject();
					}
				})
				
			})
		},
		submit() {
			// let files = [];
			// // 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
			// files = this.$refs.uUpload.lists.filter(val => {
			// 	return val.progress == 100;
			// });
			// 如果您不需要进行太多的处理，直接如下即可
			// files = this.$refs.uUpload.lists;
			
			
			this.lists = this.$refs.uUpload.lists || "";
			if(this.value == ''){
				uni.showToast({
					title: '请输入反馈内容',
					icon: 'none'
				})
			}else if(this.lists.length == 0){
				uni.showToast({
					title: '请输入反馈图片',
					icon: 'none'
				})
			}else{
				this.uploadImage(this.lists[0].url);
				// this.lists.forEach((value)=>{  //如果需要上传多张图片  小程序需要循环上传单张图片
				// 	this.uploadImage(value.url);
				// })
			}
			
		},
		copy() {
			uniCopy({
				content: '3195478525',
				success: res => {
					uni.showToast({
						title: res,
						icon: 'none'
					});
				},
				error: e => {
					uni.showToast({
						title: e,
						icon: 'none',
						duration: 3000
					});
				}
			});
		}
	}
};
</script>

<style lang="stylus">
.content
	padding 41rpx
	.feedback-title
		font-size 28rpx
		color #313331
		margin-bottom 24rpx
		display flex
		align-items center
		&::after
			content '*'
			font-size 24rpx
			color #fe5116
			margin-left 10rpx
	.textarea
		position relative
		margin-bottom 40rpx
		.u-input__textarea
			font-size 24rpx
			color #99A3A4
			background-color #ffffff
			border-radius 42rpx
			padding 32rpx
			font-size 24rpx
		.total-num
			position absolute
			right 26rpx
			bottom 23rpx
			font-size 24rpx
			color #99A3A4
	.u-list-item
		background-color #ffffff !important
		overflow visible !important
		border 1rpx dashed #99a3a4 !important
		.u-add-tips
			margin-top 0
		.u-delete-icon
			width 32rpx
			height 32rpx
			top -10rpx
			right -10rpx
			.uicon-close
				font-size 18rpx !important
	.customer
		text-align center
		font-size 24rpx
		color #4A4C4C
		text
			text-decoration underline
			color #00A6AC
			margin-left 10rpx
</style>
