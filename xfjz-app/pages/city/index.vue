<template>
	<view class="container">
		<view class="status-bar"></view>
		<ss-select-city :hotCitys="hotCitys" :value="getCity" @on-select="selectCity" />
	</view>
</template>

<script>
import ssSelectCity from '@/components/ss-select-city/ss-select-city.vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			hotCitys: ['杭州', '沈阳', '北京', '上海', '深圳', '广州', '成都', '重庆', '厦门'],
		};
	},
	computed:{
		...mapState(['city']),
		...mapGetters(['getCity']),
	},
	mounted() {
	},
	components: {
		ssSelectCity
	},
	methods: {
		...mapMutations(['setCity']),
		selectCity(city) {
			this.setCity(city);
			uni.redirectTo({
				url: '../index/index'
			});
		}
	}
};
</script>

<style>
	.container{
		padding: 30rpx 0;
	}
</style>
