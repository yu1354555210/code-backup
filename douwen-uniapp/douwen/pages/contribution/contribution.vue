<template>
	<view class="content">
		<view class="status-bar"></view>
		<view class="title">
			<text>贡献</text>
		</view>
		<view class="item">
			<view class="select">
				<picker @change="bindPickerChange" :value="index" :range="array" class="select-picker">
					<!-- <view class="uni-input">{{index>-1?array[index]:'请选择分类'}}</view> -->
					<view class="uni-input">{{array[index]}}</view>
				</picker>
			</view>
		</view>
		<view class="item">
			<textarea v-model="textareaVal" placeholder="请填写内容" maxlength="100" placeholder-style="color:#333" class="this-textarea" @input="descInput"/>
			<view class="count-num">{{txtVal}}/100</view>
		</view>
		<view class="item">
			<view class="rule">
				<view class="rule-title"><image src="../../static/icon-rule.png" mode="aspectFill"></image>注意:</view>
				<view><text>1.字数不得超过100个汉字</text></view>
				<view><text>2.审核通过后话术将出现在对应的分类中</text></view>
				<view><text>2.审核时间约为1-2个工作日</text></view>
			</view>
		</view>
		<view class="item">
			<button type="primary" class="sub-btn" @click="postData"><image src="../../static/sub-btn.png" mode="aspectFill"></image></button>
		</view>
		<view class="cu-tabbar-height"></view>
	</view>
</template>

<script>
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
export default {
	data() {
		return {
			array: ['请选择分类', '抖音', '恋爱', '扎心','励志','自拍','风景','美食','聚会','节日','购物','伤感','开心','幽默','社会','友谊','亲情','古风'],
			index: 0,
			textareaVal: '',
			txtVal: 0
		};
	},
	components:{
		uniIcons
	},
	methods: {
		bindPickerChange: function(e) {
			// console.log('picker发送选择改变，携带值为', e.target.value);
			this.index = e.target.value;
		},
		descInput(){
			setTimeout(() => { this.txtVal = this.textareaVal.length }, 0)
		},
		postData(){
			let title;
			if(this.index == 0){
				title = '请选择分类'
			}else if(this.textareaVal == ''){
				title = '内容不能为空'
			}else{
				title = '提交成功'
			}
			uni.showToast({
				icon: 'none',
				title: title
			})
		}
	}
};
</script>

<style lang="stylus">
.content
	padding 30rpx 18rpx
.title
	margin-bottom 50rpx
	color #333333
	font-size 50rpx
	font-weight bold
	display flex
	justify-content space-between
	align-items center
.item
	margin-bottom 30rpx
.select
	height:80rpx;
	box-shadow:0px 4rpx 32rpx 0px rgba(255,51,75,0.08);
	border-radius:20rpx;
	width 100%
	padding 0 30rpx
	font-size 28rpx
	color #999999
	display flex
	align-items center
	justify-content space-between
	font-size 30rpx
	color #333333
	&::before
		content ''
		display inline-block
		width:6rpx;
		height:30rpx;
		background:linear-gradient(180deg,rgba(255,95,90,1),rgba(252,11,10,1));
		border-radius:3rpx;
		margin-right 10rpx
	&::after
		content ''
		display inline-block
		font-size 40rpx
		width 24rpx
		height 24rpx
		background-image url(../../static/select-arrow.png)
		background-size 100% 100%
		transform rotate(-90deg)
	.select-picker
		width 100%
.this-textarea
	width 100%
	height 337rpx
	padding 20rpx 30rpx
	box-shadow:0px 4rpx 32rpx 0px rgba(255,51,75,0.08);
	border-radius 20rpx
	font-weight 500
	font-size 30rpx
	color #333
.count-num
	width 100%
	text-align right
	font-size:24rpx;
	font-weight:500;
	margin-top 30rpx
	color:rgba(153,153,153,1);
.rule
	font-size 28rpx
	color #aaa
	.rule-title
		font-size 34rpx
		color #333333
		margin-bottom 20rpx
		image
			width 30rpx
			height 27rpx
			display inline-block
			margin-right 10rpx
	view>text
		padding-left 40rpx
		font-size 30rpx
		color #333333
		display block
		margin-bottom 15rpx
.sub-btn
	width:652rpx;
	height:90rpx;
	background-color transparent
	border none
	padding 0
	margin-top 70rpx
	&::after
		display none
	image
		width 100%
		height 100%
</style>
