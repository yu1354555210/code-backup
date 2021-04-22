<template>
	<view class="content">
		
		<mescroll-body ref="mescrollRef" @init="mescrollInit" top="20" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
			<!-- 数据列表 -->
			<view class="thumbs-item" v-for="(item, index) in goods" :key="index">
				<view>
					<view class="thumbs-top">
						<image :src="item.user_image" mode="aspectFill" class="work-avatar"></image>
						<text v-text="item.user_name"></text>
					</view>
				</view>
				<view class="thumbs-title">赞了你的文案</view>
				<view class="thumbs-content">
					<view class="thumbs-content-tit" v-text="AES.Decrypt(item.title)"></view>
					<view class="thumbs-content-text u-line-2"></view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
export default {
	mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
	data() {
		return {
			upOption: {
				// page: {
				// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
				// 	size: 10 // 每页数据的数量
				// },
				noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
				empty: {
					icon: false,
					tip: '~ 无数据 ~' // 提示
				}
			},
			type: 1,
			goods: [], //列表数据
		};
	},
	methods: {
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		upCallback(page) {
			//联网加载数据
			let sign = this.md5Libs.md5(`${page.num}${page.size}${this.type}${this.signKey}`);
			this.$u
				.get('/api/master/v1/fac_prise', {
					token: this.vuex_token,
					page: page.num,
					limit: page.size,
					sign: sign,
					type: this.type
				})
				.then(curPageData => {
					curPageData = curPageData.data;
					this.mescroll.endSuccess(curPageData.length);
					//如果是第一页需手动制空列表
					if (page.num == 1) this.goods = [];
					//追加新数据
					this.goods = this.goods.concat(curPageData);
				})
				.catch(err => {
					console.log(err);
					this.mescroll.endErr();
				});
			
		},
		//点击空布局按钮的回调
		emptyClick() {
			uni.showToast({
				title: '点击了按钮,具体逻辑自行实现'
			});
		},
	}
};
</script>

<style lang="stylus">
.content
	padding 0 24rpx
.thumbs-item
	padding 30rpx 0
	border-bottom 2rpx solid #DADCDB
	&:last-child
		border-bottom none
	.thumbs-title
		font-size: 24rpx;
		color: #FF490B;
		padding-left 80rpx
		margin-bottom: 25rpx;
	.thumbs-info
		font-size 24rpx
		color #4A4C4C
		padding-left 24rpx
		margin 15rpx 0
	.thumbs-content
		min-height 100rpx
		background #FFFFFF
		border-radius 42rpx
		padding 20rpx 29rpx
		.thumbs-content-tit
			font-size 26rpx
			color #313331
		.thumbs-content-text
			font-size 24rpx
			color #4A4C4C
	.thumbs-top
		display flex
		align-items center
		margin-bottom 10rpx
		&>text
			font-size 28rpx
			color #999999
		.utag
			margin-left 20rpx
		.work-avatar
			width 58rpx
			height 58rpx
			margin-right 20rpx
			border-radius 50%
</style>
