<template>
	<view>
		<!-- <view class="status-bar"></view> -->
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="right">
				<view class="action">
					<navigator url="../HM-search/HM-search">
						<text class="cuIcon-search"></text>
					</navigator>
				</view>
			</block>
		</cu-custom>
		<view class="main">
			<view class="this-title this-title-big"><text class="title-info">消息</text></view>
			<view class="message-list">
				<view class="message-item solid-bottom" v-for="(item,index) in messageList" :key="index">
					<view class="message-image">
						<image src="../../static/message.png" mode="aspectFill"></image>
					</view>
					<view class="message-info">
						<text class="message-title">系统消息</text>
						<text class="message-time" v-text="item.create_time"></text>
						<text class="message-desc" v-text="item.msg"></text>
					</view>
				</view>
			</view>
			
		</view>
		<no-data :title="noDataText" v-if="isNoData"></no-data>
	</view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			isNoData: false,
			noDataText: '',
			messageList: []
		};
	},
	components: {
	},
	mounted() {
		this.$nextTick(function() {
			this.getData();
		});
	},
	computed: {
		...mapGetters(['token'])
	},
	methods: {
		getData() {
			this.$http
				.get('/v1/msg/index', {
					params: {
						token: this.token
					}
				})
				.then(res => {
					if (res.data.code == 1) {
						let data = res.data.data;
						if(data.length > 0){
							this.messageList = data;
						}else{
							this.isNoData = true;
							this.noDataText = '还未出现消息，快去查看兼职获取更多消息';
						}
					}
				})
				.catch(err => {});
		}
	}
};
</script>

<style lang="less">
	.message-item{
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		.message-image {
			margin-right: 20rpx;
			image{
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
			}
		}
		.message-info{
			display: flex;
			flex-direction: column;
			justify-content: center;
			.message-title{
				font-size: 30rpx;
				font-weight: bold;
			}
			.message-time{
				line-height: 40rpx;
				color:rgba(164,164,167,1);
				font-size: 20rpx;
			}
			.message-desc{
				font-size: 24rpx;
				color:rgba(153,153,153,1);
			}
		}
		
	}
</style>
