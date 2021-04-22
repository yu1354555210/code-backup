<template>
	<view>
		<view class="list">
			<block v-for="(data, index) in dataList" :key="index">
				<view class="item">
					<view class="text-info" v-html="brightenKeyword(AES.Decrypt(data.name), keyword)"></view>
					<view class="item-bottom">
						<view class="text-tag-box">
							<view class="text-tag" v-for="(item, i) in data.all_cat" :key="i" @click="toDetail(item)">#{{ item.name }}</view>
						</view>
						<view class="item-btn">
							<view class="copy-btn" @click="clip(AES.Decrypt(data.name))"><image src="../../static/icon-copy.png" mode="aspectFill"></image></view>
							<view class="like-btn">
								<image v-if="data.prise == 2" src="../../static/icon-like.png" mode="aspectFill" @click="tapThumbs(1, data, index)"></image>
								<image v-if="data.prise == 1" src="../../static/icon-like-cur.png" mode="aspectFill" @click="tapThumbs(2, data, index)"></image>
								{{ data.thumbs_count }}
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		dataList: {
			// 数据列表
			type: Array,
			default() {
				return [];
			}
		},
		keyword: {
			type: String || Number
		}
	},
	methods: {
		clip(data) {
			uni.setClipboardData({
				data: data,
				success: function() {
					uni.showToast({
						title: '复制成功'
					});
				},
				fail: function() {
					uni.showToast({
						title: '复制失败'
					});
				}
			});
		},
		tapThumbs(type, data, index) {
			uni.request({
				url: this.apiUrl + '/api/master/v1/talk_like',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					type: type,
					content_id: data.id || data.content_id,
					token: this.$store.getters.getInfo.token
				},
				success: res => {
					if (res.data.status == 200) {
						let list = this.dataList[index];
						if (type == 1) {
							list.thumbs_count += 1;
							list.prise = 1;
						} else {
							list.thumbs_count -= 1;
							list.prise = 2;
						}
						// if(this.$parent){
						// 	// this.$parent.mescroll.resetUpScroll();
						// }
					} else {
						uni.showToast({
							title: res.data.msg
						});
					}
				},
				fail: () => {},
				complete: () => {}
			});
		},
		toDetail(item) {
			uni.navigateTo({
				url: `../../pages/detail/detail?id=${item.cat_id}&title=${item.name}`
			});
		},
		brightenKeyword(val, keyword) {
			val = val + '';
			if (val.indexOf(keyword) !== -1 && keyword !== '') {
				return val.replace(keyword, '<font color="#FD2421">' + keyword + '</font>');
			} else {
				return val;
			}
		}
	}
};
</script>

<style lang="stylus">
.list
	padding 0 0 50rpx
.item
	padding 30rpx
	background rgba(255, 255, 255, 1)
	box-shadow -1px 3px 21px 3px rgba(0, 0, 0, 0.09)
	border-radius 30rpx
	margin-bottom 30rpx
	font-size 30rpx
	font-weight 500
	.text-info
		flex 1
		line-height 36rpx
		font-size 30rpx
		.text-tag
			width 160rpx
			height 44rpx
			background rgba(255, 255, 255, 1)
			border 1rpx solid rgba(153, 153, 153, 1)
			border-radius 22rpx
			font-size 26rpx
			color #999999
			line-height 44rpx
			text-align center
			margin-top 30rpx
			font-weight 500
	.item-bottom
		display flex
		align-items center
		justify-content space-between
		margin-top 20rpx
	.item-btn
		display flex
		justify-content center
		align-items center
		height 60rpx
		image
			width 60rpx
			height 60rpx
		.like-btn
			display flex
			align-items center
			margin-left 30rpx
			font-weight bold
			font-size 26rpx
			color #FF5C46
			width 120rpx
			image
				margin-right 10rpx
	.text-tag-box
		display flex
		align-items center
		.text-tag
			height 40rpx
			background rgba(255, 255, 255, 1)
			border 2rpx solid rgba(255, 205, 0, 1)
			border-radius 20rpx
			display flex
			justify-content center
			align-items center
			font-size 24rpx
			color rgba(255, 205, 0, 1)
			padding 0 20rpx
			font-weight 500
			margin-right 20rpx
</style>
