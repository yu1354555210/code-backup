<template>
	<view class="content">
		<view class="status-bar"></view>
			<view class="title">
				<text>{{title}}</text>
				<navigator url="../search/list-search" hover-class="none" class="search">
					<image src="../../static/search.png" mode="aspectFill"></image>
				</navigator>
			</view>
			<view class="classify-body">
				<view class="classify-section classify-hlv1">
					<view @click="toDetail(1,'抖音')" class="classify-item">
						<image src="../../static/dy.png" mode="aspectFill"></image>
					</view>
					<view class="flex flex-v flex-pack-justify classify-item">
						<view class="ver-item" @click="toDetail(7,'美食')">
							<image src="../../static/ms.png" mode="aspectFill"></image>
						</view>
						<view class="ver-item" @click="toDetail(6,'风景')">
							<image src="../../static/fj.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<view class="classify-section classify-hlv3">
					<view class="classify-item" @click="toDetail(8,'聚会美拍')">
						<image src="../../static/jhmp.png" mode="aspectFill"></image>
					</view>
					<view class="flex flex-pack-justify classify-item classify-hlv3">
						<view class="classify-item" @click="toDetail(9,'节日')">
							<image src="../../static/jr.png" mode="aspectFill"></image>
						</view>
						<view class="classify-item" @click="toDetail(10,'购物')">
							<image src="../../static/gw.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<view class="classify-section classify-hlv3">
					<view @click="toDetail(5,'自拍')" class="classify-item">
						<image src="../../static/zp.png" mode="aspectFill"></image>
					</view>
					<!-- <view class="classify-item" @click="toDetail(11,'伤感')">
						<image src="../../static/sg.png" mode="aspectFill"></image>
					</view> -->
					<view class="classify-item" @click="toDetail(12,'开心')">
						<image src="../../static/kx.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="classify-section classify-hlv1">
					<view class="classify-item" @click="toDetail(14,'社会')">
						<image src="../../static/sh.png" mode="aspectFill"></image>
					</view>
					<view class="flex flex-v flex-pack-justify classify-item">
						<view class="ver-item" @click="toDetail(3,'扎心')">
							<image src="../../static/zx.png" mode="aspectFill"></image>
						</view>
						<view class="ver-item" @click="toDetail(15,'友谊')">
							<image src="../../static/yy.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<view class="classify-section classify-hlv3">
					<view class="classify-item" @click="toDetail(2,'恋爱')">
						<image src="../../static/la.png" mode="aspectFill"></image>
					</view>
					<view class="classify-item" @click="toDetail(16,'亲情')">
						<image src="../../static/qq.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="classify-section classify-hlv3">
					<view class="classify-item" @click="toDetail(4,'励志')">
						<image src="../../static/lz.png" mode="aspectFill"></image>
					</view>
					<view class="classify-item" @click="toDetail(17,'古风')">
						<image src="../../static/gf.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
	</view>
			
</template>

<script>
	export default {
		data() {
			return {
				title: '抖文'
			}
		},
		onLoad() {

		},
		methods: {
			toDetail(id,title){
				uni.navigateTo({
					url: `../detail/detail?id=${id}&title=${title}`
				})
			}
		}
	}
</script>

<style lang="stylus">
.flex
	display flex
.flex-pack-center
	justify-content center
.flex-pack-justify
	justify-content space-between
.flex-align-center
	align-items center
.flex-wrap
	flex-wrap wrap
.flex-v
	flex-direction column
.flex-1
	flex 1
	
	
.content
	padding 30rpx 18rpx
.title
	color #333333
	font-size 50rpx
	font-weight bold
	display flex
	justify-content space-between
	align-items center
	.search
		height 44rpx
		image
			width 44rpx
			height 44rpx
.classify-body
	display flex
	flex-wrap wrap
	margin-top 40rpx
	.classify-hlv1
		height 350rpx
	.classify-hlv2
		height 200rpx
	.classify-hlv3
		height 160rpx
	.classify-hlv4
		height 150rpx
	.ver-item
		height 160rpx
.classify-section
	width 100%
	margin-bottom 30rpx
	display flex
	justify-content space-between
	.classify-item
		width 342rpx
		color: #FFFFFF;
		text-align center
		&>.classify-item
			width 156rpx
		image
			width 100%
			height 100%
</style>
