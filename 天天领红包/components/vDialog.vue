<template>
	<view class="cu-modal" :class="getDialogStatus?'show':''" @touchmove.stop.prevent @click="setDialogStatus(false)">
		<view class="dialog-wrapper" @click.stop="">
			<!-- <image src="../static/image/dialog-img.png" mode="aspectFill"></image> -->
			<slot></slot>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			isShowDialog: false
		};
	},
	computed: {
		...mapGetters(['getDialogStatus'])
	},
	methods: {
		...mapMutations(['setDialogStatus']),
	}
};
</script>

<style lang="stylus">
	
</style>
