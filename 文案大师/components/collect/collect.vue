<template>
	<view>
		<view class="collect" v-if="item.is_coll === 2" @click="handleCollect(1, item.id || item.content_id)"></view>
		<view class="collect-active" v-else @click="handleCollect(2, item.id || item.content_id)"></view>
	</view>
</template>

<script>
	export default {
		name:"collect",
		props:{
			item: {
				type: Object,
				default() {
					return {};
				}
			},
			index: {
				type: Number
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			handleCollect(type, id) {
				this.$emit('handleCollect', type, id, this.index);
			}
		}
	}
</script>

<style lang="stylus">
.collect,.collect-active
	width 36rpx
	height 36rpx
	background-repeat no-repeat
	background-position center center
	background-size contain
</style>
<style lang="scss">
.collect {
	background-image: $star-base64-code;
}
.collect-active {
	background-image: $star-active-base64-code;
}
</style>