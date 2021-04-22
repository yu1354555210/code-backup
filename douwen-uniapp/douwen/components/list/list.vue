<template>
	<view>
		<view class="list">
			<view class="item" v-for="(data, index) in dataList" :key="index">
				<view class="text-info" v-html="brightenKeyword(AES.Decrypt(data.name),keyword)">
					<view class="text-tag" v-if="data.status == 2">
						网友贡献
					</view>
				</view>
				<view class="copy-btn" @click="clip(AES.Decrypt(data.name))"><image src="../../static/icon-copy.png" mode="aspectFill"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			dataList: { // 数据列表
				type: Array,
				default(){
					return []
				}
			},
			keyword: {
				type: String || Number
			}
		},
		methods: {
			clip(data){
				uni.setClipboardData({
				    data: data,
				    success: function () {
				        uni.showToast({
				        	title:'复制成功'
				        })
				    },
						fail: function(){
							uni.showToast({
								title:'复制失败'
							})
						}
				});
			},
			brightenKeyword(val, keyword) {
			   val = val + '';
			   if (val.indexOf(keyword) !== -1 && keyword !== '') {
			        return val.replace(keyword, '<font color="#FD2421">' + keyword + '</font>')
			   } else {
			      return val
			    }
			}
		}
	}
</script>

<style lang="stylus">
.list
	padding 50rpx 18rpx
.item
	padding 30rpx
	background:rgba(255,255,255,1);
	box-shadow:0px 12rpx 32rpx 0px rgba(255,51,75,0.08);
	border-radius:20rpx;
	margin-bottom 30rpx
	font-size 30rpx
	font-weight bold
	display flex
	align-items center
	justify-content space-between
	.text-info
		flex 1
		line-height 40rpx
		.text-tag
			width:160rpx;
			height:44rpx;
			background:rgba(255,255,255,1);
			border:1rpx solid rgba(153, 153, 153, 1);
			border-radius:22rpx;
			font-size 26rpx
			color #999999
			line-height 44rpx
			text-align center
			margin-top 30rpx
			font-weight 500
	.copy-btn
		width 100rpx
		display flex
		justify-content center
		image
			width 44rpx
			height 44rpx
</style>
