<template name="classify">
	<view class="content">
		<view class="status-bar"></view>
		<view class="main">
			<view class="this-title this-title-big">
				<text class="title-info">分类</text>
				<navigator url="../city/index" class="title-right">
					<image src="../../static/cates-icon-location.png" mode="aspectFill" class="cates-location"></image>
					<text v-text="getCity"></text>
				</navigator>
			</view>
			<navigator class="search-bar" url="../HM-search/HM-search">
				<image src="../../static/icon-cates-search.png" mode="aspectFill"></image>
				<text>搜索您感兴趣的兼职</text>
			</navigator>
			<cates-item :list="catesList"></cates-item>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import catesItem from '../../components/cates-item.vue';
export default {
	components: {
		catesItem
	},
	data() {
		return {
			catesList: [],
		};
	},
	computed:{
		...mapGetters(['getCity'])
	},
	mounted() {
		this.$nextTick(function() {
			this.$http
				.get('/v1/site/cates')
				.then(res => {
					let data = res.data.data;
					this.catesList = data;
				})
				.catch(err => {});
		});
	}
};
</script>

<style lang="less">
.search-bar {
	width: 100%;
	height: 88rpx;
	background: #ffffff;
	box-shadow: 0px 3px 7px 0px rgba(104, 154, 255, 0.35);
	border-radius: 44px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 30rpx;
	image {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}
	text {
		color: rgba(153, 153, 153, 1);
		font-size: 26rpx;
	}
}
</style>
