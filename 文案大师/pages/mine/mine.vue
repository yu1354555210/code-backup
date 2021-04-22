<template>
	<view class="content">
		<view class="mine-topbar">
			<view class="message" v-if="vuex_is_login" @click="routeTo('/pages/notify/notify')">
				<image src="../../static/ic_notify.png" mode="aspectFill"></image>
				<u-badge type="error" :count="mineData.mess_count || 0" :offset="[-20, -30]" size="mini"></u-badge>
			</view>
		</view>
		<view class="mine-header">
			<u-avatar :src="vuex_user.avatar" mode="circle" size="150"></u-avatar>
			<view class="mine-header-body">
				<block>
					<text v-text="'请登录'" v-if="!vuex_is_login" @click="routeTo('/pages/login/login')"></text>
					<text v-else v-text="vuex_user.nickname"></text>
				</block>
				<view class="mine-header-tags">
					<u-tag :text="vuex_user.copy_mark" v-if="mineData.copy_mark" mode="dark" shape="circle" size="mini" bg-color="#FFB351" class="utag" />
					<u-tag :text="vuex_user.thumb_mark" v-if="mineData.thumb_mark" mode="dark" shape="circle" size="mini" bg-color="#33cc00" class="utag" />
				</view>
			</view>
		</view>
		<view class="mine-total" v-if="vuex_is_login">
			<view class="mine-total-item" @click="routeTo('/pages/my-paperwork/my-paperwork')">
				<view class="num" v-text="mineData.copy_count || 0"></view>
				<text>文案</text>
			</view>
			<view class="mine-total-item" @click="routeTo('/pages/get-thumbs/get-thumbs')">
				<view class="num">
					{{ mineData.receive_count || 0}}
					<u-badge type="error" :count="mineData.receive_count_new || 0" size="mini" :offset="[-20, -30]"></u-badge>
				</view>
				<text>收到的赞</text>
			</view>
		</view>
		<view class="mine-menu" v-if="vuex_is_login">
			<view class="mine-menu-item" @click="routeTo('/pages/my-thumbs/my-thumbs')">
				<view class="mine-menu-icon"><image src="../../static/ic_my_prise.png" mode="aspectFill" class="thumbs-image"></image></view>
				<text>我的赞</text>
			</view>
			<!-- <view class="mine-menu-item">
				<view class="mine-menu-icon">
					<image src="../../static/ic_post_comment.png" mode="widthFix"></image>
				</view>
				<text>发出的评论</text>
			</view> -->
			<view class="mine-menu-item" @click="routeTo('/pages/my-collect/my-collect')">
				<view class="mine-menu-icon"><image src="../../static/ic_collect.png" mode="widthFix" style="width: 63rpx; height: 62rpx;"></image></view>
				<text>收藏</text>
			</view>
			<button class="mine-menu-item u-reset-button" open-type="share">
				<view class="mine-menu-icon"><image src="../../static/ic_share.png" mode="widthFix"></image></view>
				<text>分享</text>
			</button>
			<view class="mine-menu-item" @click="routeTo('/pages/feedback/feedback')">
				<view class="mine-menu-icon"><image src="../../static/ic_feedback.png" mode="widthFix"></image></view>
				<text>意见反馈</text>
			</view>
			<view class="mine-menu-item">
				<view class="mine-menu-icon"><view class="version" v-text="vuex_version"></view></view>
				<text>版本</text>
			</view>
		</view>
		<view class="logout" v-if="vuex_is_login"><u-button type="default" :hair-line="false" shape="circle" :ripple="true" :custom-style="customStyle" @click="logout">退出登录</u-button></view>
		<view class="agreement-box" v-if="vuex_is_login">
			<navigator url="../agreement/agreement">《使用协议》</navigator>
			丨
			<navigator url="../privacy/privacy">《隐私政策》</navigator>
		</view>
		
		<view class="ad">
			<ad unit-id="adunit-967339a1b7990eb7"></ad>
		</view>

		<u-tabbar :list="vuex_tabbar" :mid-button="true" :border-top="false" active-color="#00A6AC" inactive-color="#c4c4c4"></u-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			customStyle: {
				color: '#FF4D3B',
				fontSize: '26rpx',
				border: 0
			},
			src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
			mineData: []
		};
	},
	onLoad() {},
	mounted() {
		this.$nextTick(function() {
			
		});
	},
	onShow() {
		if(this.vuex_is_login){
			this.getData();
		}
	},
	methods: {
		getData() {
			let sign = this.md5Libs.md5(`${this.signKey}`);
			this.$u
				.get('/api/master/v1/fac_mess', {
					token: this.vuex_token,
					sign: sign
				})
				.then(res => {
					this.mineData = res;
				})
				.catch(err => {
					console.log(err);
				});
		},
		routeTo(page) {
			this.$u.route(page);
		},
		logout(){
			uni.showModal({
				title: '确认退出?',
				content: '',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						this.$u.vuex('vuex_user', {});
						this.$u.vuex('vuex_token', '');
						this.$u.vuex('vuex_is_login', false);
						this.$u.vuex('isLoginUrl', 'applets_');
						uni.clearStorageSync();
						this.$u.route({
							url: '/pages/login/login',
							type: 'reLaunch'
						});
					}
				},
				fail: () => {},
				complete: () => {}
			});
			
		}
	}
};
</script>

<style lang="stylus">
.mine-topbar
	padding 40rpx 65rpx
	display flex
	justify-content flex-end
	align-items center
	.message
		position relative
		width 33rpx
		height 37rpx
		image
			width 33rpx
			height 37rpx
.mine-total
	background-color #FFFFFF
	margin 23rpx 24rpx 32rpx
	height 164rpx
	display flex
	justify-content center
	align-items center
	border-radius 42rpx
	.mine-total-item
		text-align center
		flex 1
		position relative
		font-size 32rpx
		.num
			font-size 32rpx
			font-weight bold
			color #4A4C4C
			position relative
			display inline-block
		text
			font-size 24rpx
			color #99A3A4
			display block
		&:first-child
			&::after
				content ''
				display block
				position absolute
				right 0
				top 50%
				transform translateY(-50%)
				height 70%
				width 1rpx
				background-color #E4E7ED
.mine-menu
	padding 0 57rpx
	display flex
	justify-content space-between
	flex-wrap wrap
	.mine-menu-item
		width 196rpx
		height 196rpx
		background-color #FFFFFF
		border-radius 42rpx
		margin 0 0 24rpx
		display flex
		flex-direction column
		align-items center
		justify-content center
		.version
			font-size 32rpx
			color #00A6AC
		.mine-menu-icon
			height 58rpx
			display flex
			align-items flex-end
		image
			width 58rpx
		.thumbs-image
			height 56rpx
		text
			font-size 24rpx
			color #4A4C4C
			margin-top 30rpx
	&::after
		content ''
		width 196rpx
.logout
	padding 40rpx 172rpx 60rpx
.agreement-box
	text-align center
	display flex
	justify-content center
	font-size 24rpx
	color #C0C4CC
	navigator
		color #AAAAAA
		margin 0 10rpx
.ad
	padding 0 24rpx
	margin-top 60rpx
</style>
