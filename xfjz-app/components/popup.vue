<template>
	<view>
		<view class="tips-popup-container" @click="switch_tips_dialog(false)">
			<view class="tips-popup-wrapper" @click.stop="switch_tips_dialog(true)">
				<image src="../../static/tips-popup-bg.png" mode="aspectFill" class="tips-popup-bg"></image>
				<text class="tips-text" v-text="title"></text>
				<view class="tips-bottom-text"><slot></slot></view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			isShowPopup: false
		};
	},
	props: {
		title: ''
	},
	methods:{
		...mapMutations(['switch_tips_dialog'])
	}
};
</script>

<style lang="less">

</style>
