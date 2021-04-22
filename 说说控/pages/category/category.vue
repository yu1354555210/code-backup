<template>
	<view class="content">
		<view class="category-wrapper" v-for="(item, index) in dataList" :key="index">
			<view class="title" v-text="item.title"></view>
			<view class="category-list">
				<view class="category-item" v-for="(it,i) in item.cat" :key="i" @click="toDetail(it)"><image :src="it.image" mode="aspectFill"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
import md5 from 'js-md5';
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			dataList: []
		};
	},
	computed:{
		...mapGetters(['getInfo'])
	},
	onLoad() {},
	mounted() {
		this.$nextTick(function(){
			this.getData();
		})
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log(res.target)
		}
		// #ifdef MP-QQ
			qq.showShareMenu({
				showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
			})
		// #endif
		return {
			title: '这条说说说的就是你吧？',
			path: '/pages/index/index'
		}
	},
	methods: {
		toDetail(it) {
			uni.navigateTo({
				url: `../detail/detail?id=${it.id}&title=${it.name}`
			});
		},
		getData(){
			uni.showLoading({
				title:'加载中'
			});
			let sign = md5(this.signKey);
			uni.request({
				url: this.apiUrl + '/api/master/v1/cat_list',
				method: 'GET',
				data: {
					token: this.getInfo.token,
					sign: sign
				},
				success: res => {
					let data = res.data.data;
					if(res.data.status == 200){
						this.dataList = data;
					}
				},
				fail: () => {},
				complete: () => {
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style lang="stylus">
image
	width 100%
	height 100%
.category-wrapper
	.title
		font-size 30rpx
		font-weight 400
		margin 30rpx 0
		color rgba(143, 162, 166, 1)
	.category-list
		display flex
		flex-wrap wrap
		justify-content space-between
		.category-item
			width 218rpx
			height 120rpx
			border-radius 20rpx
			overflow hidden
			margin-bottom 30rpx
</style>
