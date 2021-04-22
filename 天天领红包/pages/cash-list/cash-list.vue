<template>
	<view>
		<v-list iconName="cash" :dataList="dataList"></v-list>
	</view>
</template>

<script>
import vList from '@/components/vList.vue';
export default {
	data() {
		return {
			dataList: ''
		};
	},
	mounted() {
		this.$nextTick(function(){
			this.getList();
		});
	},
	components: {
		vList
	},
	methods: {
		getList() {
			uni.showLoading({
				title: '加载中'
			});
			this.$http
				.get('/api/bonus/v1/draw', {
					params: {
						token: this.$store.getters.token,
						type: 1
					}
				})
				.then(res => {
					if (res.data.status == 200) {
						let data = res.data.data;
						this.dataList = data;
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
					}
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '系统错误，请稍后重试'
					});
				});
		}
	},
};

</script>

<style lang="stylus">

</style>
