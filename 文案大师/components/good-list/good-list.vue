<!-- 商品列表组件 <good-list :list="xx"></good-list> -->
<template>
	<!-- <view class="good-list">
		<view :id="'good'+good.id" class="good-li" v-for="good in list" :key="good.id">
			<image class="good-img" :src="good.goodImg" mode="widthFix"/>
			<view class="flex-item">
				<view class="good-name">{{good.goodName}}</view>
				<text class="good-price">{{good.goodPrice}} 元</text>
				<text class="good-sold">已售{{good.goodSold}}件</text>
			</view>
		</view>
	</view> -->
	<view class="work-list">
		<view class="work-item" v-for="(item, index) in list" :key="index">
			<view class="work-top">
				<block v-if="mineUser">
					<image :src="vuex_user.avatar" mode="aspectFill" class="work-avatar"></image>
					<text v-text="vuex_user.nickname"></text>
				</block>
				<block v-else>
					<image @click="toOtherIndex(item)" :src="item.avatar" mode="aspectFill" class="work-avatar"></image>
					<text @click="toOtherIndex(item)" v-text="item.origin"></text>
				</block>
				<block>
					<u-tag v-if="item.copy_mark" :text="item.copy_mark" mode="dark" shape="circle" size="mini" bg-color="#FFB351" class="utag" />
					<u-tag v-if="item.thumb_mark" :text="item.thumb_mark" mode="dark" shape="circle" size="mini" bg-color="#33CC00" class="utag" />
				</block>
			</view>
			<view class="work-main">
				<view class="work-body">
					<view class="work-tags"><view class="tags" v-for="(it, i) in item.all_cat" v-text="it.name" :key="i"></view></view>
					<view class="work-content">
						<u-read-more :toggle="true" show-height="200" :shadow-style="shadowStyle" close-text="全文" text-indent="0" color="#00A6AC">
							<rich-text :nodes="AES.Decrypt(item.name)"></rich-text>
						</u-read-more>
					</view>
					<view class="work-bottom">
						<view class="copy work-bottom-item" @click="copy(AES.Decrypt(item.name))"></view>
						<collect class="work-bottom-item" :item="item" :index="index" @handleCollect="handleCollect"></collect>
						<likes class="work-bottom-item" :item="item" :index="index" @handleLike="handleLike"></likes>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniCopy from '@/js_sdk/xb-copy/uni-copy.js';
export default {
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		mineUser: {
			default: false,
			type: Boolean
		},
		isOther: { //是否是他人主页
			default: false,
			type: Boolean
		},
		type: { //只有在点赞tab下才能继续进入他人主页
			type: Number
		}
	},
	data() {
		return {
			content: '',
			shadowStyle: {
				backgroundImage: 'none',
				paddingTop: '0',
				marginTop: '20rpx'
			}
		};
	},
	methods: {
		toOtherIndex(item){
			if(this.isOther && this.type == 1) return
			this.$u.route('/pages/other-index/other-index', {
				name: item.origin,
				id: item.id,
				avatar: encodeURIComponent(item.avatar),
				copy_mark: item.copy_mark,
				thumb_mark: item.thumb_mark
			});
			
		},
		handleLike(type, id, index) {
			uni.showLoading({
				title: '请求中'
			});
			this.$u
				.post('/api/master/v1/like', {
					token: this.vuex_token,
					type: type,
					content_id: id
				})
				.then(res => {
					uni.hideLoading();
					let curItem = this.list[index];
					curItem.prise = type;
		
					if (type === 1) {
						curItem.thumbs_count ++;
					} else {
						curItem.thumbs_count --;
					}
				})
				.catch(err => {
					uni.hideLoading();
					console.log(err);
				});
		},
		handleCollect(type, id, index) {
			uni.showLoading({
				title: '请求中'
			});
			this.$u
				.post('/api/master/v1/coll', {
					token: this.vuex_token,
					type: type,
					copy_id: id
				})
				.then(res => {
					uni.hideLoading();
					let curItem = this.list[index];
					curItem.is_coll = type;
				})
				.catch(err => {
					uni.hideLoading();
					console.log(err);
				});
		},
		copy(content) {
			if(!this.vuex_is_login){
				this.$u.route({
					url: '/pages/login/login',
					type: 'reLaunch'
				})
				return
			}
			uniCopy({
				content: content,
				success: res => {
					uni.showToast({
						title: res,
						icon: 'none'
					});
				},
				error: e => {
					uni.showToast({
						title: e,
						icon: 'none',
						duration: 3000
					});
				}
			});
		}
	}
};
</script>

<style lang="stylus">
.work-list
	padding 30rpx 24rpx
.work-item
	margin-bottom 50rpx
.like
	.icon-like, .icon-like-active
		margin-right 14rpx
		width 32rpx
		height 31rpx
		background-size 100% 100%
	.like-active
		color #FF490B
.work-top
	display flex
	align-items center
	&>text
		font-size 28rpx
		color #999999
	.utag
		margin-left 20rpx
	.work-avatar
		width 58rpx
		height 58rpx
		margin-right 20rpx
		border-radius 50%
.work-main
	border-radius 42rpx
	background-color #FFFFFF
	margin-top 24rpx
	display flex
	flex-direction column
	justify-content space-between
	position relative
	&::after
		content ''
		display block
		position absolute
		width 0
		height 0
		border-left 20rpx solid transparent
		border-right 20rpx solid transparent
		border-bottom 30rpx solid #FFFFFF
		top -30rpx
		left 114rpx
	.work-body
		.work-tags
			padding 0 30rpx
			height 60rpx
			display flex
			align-items center
			justify-content flex-end
			.tags
				width 84rpx
				height 32rpx
				background-size 100% 100%
				display flex
				justify-content center
				align-items center
				color #FFFFFF
				font-size 24rpx
				padding-left 20rpx
				margin-left 24rpx
		.work-content
			padding 20rpx 30rpx
			min-height 120rpx
			font-size 26rpx
			color #4A4C4C
		.work-bottom
			height 60rpx
			display flex
			align-items center
			font-size 24rpx
			border-top 2rpx solid #F7F8F8
			color #00A6AC
			.work-bottom-item
				flex 1
				display flex
				align-items center
				justify-content center
				&:last-child
					justify-content flex-start
			.copy
				width 32rpx
				height 32rpx
				background-repeat no-repeat
				background-position center center
				background-size contain
</style>
<style lang="scss">
.tags {
	background-image: $tags-base64-code;
}
.copy {
	background-image: $copy-base64-code;
}
.icon-comment {
	background-image: $comment-base64-code;
}
.good-list {
	background-color: #fff;

	.good-li {
		display: flex;
		align-items: center;
		padding: 20upx;
		border-bottom: 1upx solid #eee;

		.good-img {
			width: 160upx;
			height: 160upx;
			margin-right: 20rpx;
		}

		.flex-item {
			flex: 1;

			.good-name {
				font-size: 26upx;
				line-height: 40upx;
				height: 80upx;
				margin-bottom: 20upx;
				overflow: hidden;
			}
			.good-price {
				font-size: 26upx;
				color: red;
			}
			.good-sold {
				font-size: 24upx;
				margin-left: 16upx;
				color: gray;
			}
		}
	}
}
</style>
