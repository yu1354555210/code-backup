<template>
	<view class="content">
		<view class="category-sticky">
			<u-tabs
				:list="list"
				height="96"
				:is-scroll="false"
				:show-bar="false"
				bg-color="#f7f8f8"
				active-color="#00a6ac"
				font-size="28"
				inactive-color="#696A69"
				:current="current"
				@change="change"
				id="tabs"
			></u-tabs>
			<view class="category-top">
				<text>排名</text>
				<text>用户</text>
				<text>名牌</text>
				<text>文案数量</text>
			</view>
		</view>
		<view class="category-box">
			<view class="category-list">
				<view class="category-item" v-for="(item,index) in dataList" :key="index">
					<view class="ranking-num">
						<image src="../../static/ic_top1.png" v-if="item.rank == 1" mode="aspectFill"></image>
						<image src="../../static/ic_top2.png" v-else-if="item.rank == 2" mode="aspectFill"></image>
						<image src="../../static/ic_top3.png" v-else-if="item.rank == 3" mode="aspectFill"></image>
						<text v-text="item.rank" v-else></text>
					</view>
					<view class="username" v-text="item.user_name"></view>
					<view class="top-tags">
						<u-tag :text="item.mark" v-if="tagsType === 1" mode="dark" shape="circle" size="mini" bg-color="#FFB351" class="utag" />
						<u-tag :text="item.mark" v-else mode="dark" shape="circle" size="mini" bg-color="#33cc00" class="utag" />
					</view>
					<view class="num" v-text="item.num"></view>
				</view>
			</view>
		</view>
		<u-tabbar :list="vuex_tabbar" :mid-button="true" :border-top="false" active-color="#00A6AC" inactive-color="#c4c4c4"></u-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					name: '文案榜'
				},
				{
					name: '获赞榜'
				}
			],
			current: 0,
			type: 1,
			dataList: '',
			tagsType: 1
		};
	},
	onLoad() {
	},
	mounted() {
		this.$nextTick(function(){
			this.getData();
		})
	},
	methods: {
		change(index) {
			this.current = index;
			this.type = this.current + 1;
			this.getData();
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
		},
		getData(){
			let sign = this.md5Libs.md5(`${this.type}${this.signKey}`);
			this.$u
				.get('/api/master/v1/applets_rank', {
					token: this.vuex_token,
					sign: sign,
					type: this.type
				})
				.then(res => {
					this.dataList = res;
					this.tagsType = this.type;
				})
				.catch(err => {
					console.log(err);
				});
		}
	},
};
</script>

<style lang="stylus">
page
	background-color #FFFFFF
.category-sticky
	width 100%
	position fixed
	top 0
	background-color #f7f8f8
.category-box
	background-color #FFFFFF
	margin-top 175rpx
.category-top
	background-color #FFFFFF
	display flex
	align-items center
	justify-content center
	font-size 24rpx
	height 80rpx
	border-radius 40rpx 40rpx 0 0
	overflow hidden
	color #8FA2A6
	text
		flex 1
		text-align center
		&:first-child
			flex 0 0 20%
.category-list
	.category-item
		display flex
		align-items center
		text-align center
		// padding 25rpx 0
		height 95rpx
		&>view
			flex 1
		.ranking-num
			flex 0 0 20%
			font-size 28rpx
			color #8FA2A6
			font-weight bold
			image
				width 60rpx
				height 72rpx
		.username
			font-size 30rpx
			color #333333
		.num
			font-size 30rpx
			color #333333
</style>
