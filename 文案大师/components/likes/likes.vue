<template>
	<view class="like">
		<block>
			<view class="icon-like-active" v-if="item.prise == 1" @click="handleLike(2, item.id || item.content_id)"></view>
			<view class="icon-like" v-else @click="handleLike(1, item.id || item.content_id)"></view>
		</block>
		<block>
			<text v-text="item.thumbs_count" v-if="item.prise == 1" class="like-active" @click="handleLike(2, item.id || item.content_id)"></text>
			<text v-text="item.thumbs_count" v-else @click="handleLike(1, item.id || item.content_id)"></text>
		</block>
	</view>
</template>

<script>
export default {
	name: 'likes',
	props: {
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
		return {};
	},
	methods: {
		handleLike(type, id) {
			this.$emit('handleLike', type, id, this.index);
		}
	}
};
</script>

<style lang="scss">
.icon-like-active {
	background-image: $like-active-base64-code;
}
.icon-like {
	background-image: $like-base64-code;
}
</style>
<style lang="stylus">
.like
	display flex
	align-items center
	padding-left 30%
	.icon-like, .icon-like-active
		margin-right 14rpx
		// width 32rpx
		flex 0 0 32rpx
		height 31rpx
		background-size 100% 100%
	.like-active
		color #FF490B
</style>
