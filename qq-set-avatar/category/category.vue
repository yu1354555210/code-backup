<template>
	<view class="content">
		<avatar-list :dataList="dataList"></avatar-list>
		<bg-repeat v-if="isShowLoading"></bg-repeat>
	</view>
</template>

<script>
import md5 from 'js-md5';
import bgRepeat from './bg-repeat/bg-repeat.vue';
import avatarList from '@/components/list/list.vue';
export default {
	data() {
		return {
			isShowLoading: true,
			dataList: [],
			title: ''
		};
	},
	methods: {},
	onLoad(options) {
		this.title = options.title;
	},
	onReady() {
		uni.setNavigationBarTitle({
		    title: this.title
		});
	},
	mounted() {
		this.$nextTick(function(){
			let sign = md5(this.signKey);
			uni.request({
				url: this.apiUrl + '/cp_v1/index/match',
				data: {
					sign: sign
				},
				success: data => {
					data = data.data;
					// 接口返回的当前页数据列表 (数组)
					this.dataList = data.data;
					setTimeout(() => {
						this.isShowLoading = false;
					}, 2500);
				},
				fail: () => {
					uni.showToast({
						title: '请求失败',
						icon: 'none'
					});
				}
			});
		})
	},
	onShow() {},
	components: {
		bgRepeat,
		avatarList
	}
};
</script>
