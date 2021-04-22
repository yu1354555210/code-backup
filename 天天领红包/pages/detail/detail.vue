<template>
	<view>
		<view class="content">
			<view class="title">{{ title }}</view>
			<view class="other">{{ ctime }}</view>
			<rich-text :nodes="html | formatRichText"></rich-text>
			<view class="ad-box">
				<ad unit-id="adunit-49338f1bcd60024d"></ad>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			text: '',
			author: '',
			ctime: '',
			isFooter: false,
			wx_qrcode: [],
			game_title: '',
			icon: '',
			isFloatShow: true,
			appid: '',
			path: '',
			extra: '',
			source_type: '',
			html: ''
		};
	},

	components: {},
	props: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var that = this;
		uni.showLoading({
			title: '加载中',
			mask: true
		});
		setTimeout(function() {
			wx.hideLoading();
		}, 1000);
		uni.request({
			url: 'https://mini-gl.binglue.com/article/content',
			data: {
				id: options.id
			},
			success: res => {
				let data = res.data;
				console.log("data: ",data);
				this.html = data.content;
				this.title = data.title;
				this.ctime = data.create_time;
			},
			fail: res => {
				uni.showToast({
					title: res.data.msg
				});
			},
			complete: () => {}
		});
	},
	
	filters: {
		/**
		 * 处理富文本里的图片宽度自适应
		 * 1.去掉img标签里的style、width、height属性
		 * 2.img标签添加style属性：max-width:100%;height:auto
		 * 3.修改所有style里的width属性为max-width:100%
		 * 4.去掉<br/>标签
		 * @param html
		 * @returns {void|string|*}
		 */
		formatRichText (html) { //控制小程序中图片大小
				let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
						match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
						match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
						match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
						return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
						match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
						return match;
				});
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
				return newContent;
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function(res) {
		// console.log(res)
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log('来自页面内转发按钮');
		}

		return {
			title: this.title,
			// path: '/pages/detail/detail',
			success: function(res) {
				// console.log("转发成功")
				// 转发成功
			},
			fail: function(res) {
				console.log('转发失败'); // 转发失败
			}
		};
	},
	methods: {
	}
};
</script>

<style lang="stylus">
page
	background-color #fff
img, image
	width 100%
.fixed-top
	position fixed
	bottom 0
	left 0
	width 100%
	height 140rpx
	border-top 1rpx solid #d1d1d1
	background #fff
	z-index 33
	display -webkit-box
	display -webkit-flex
	display -ms-flexbox
	display flex
	-webkit-box-pack justify
	-webkit-justify-content space-between
	-ms-flex-pack justify
	justify-content space-between
	-webkit-box-align center
	-webkit-align-items center
	-ms-flex-align center
	align-items center
	box-sizing border-box
	padding 20rpx 30rpx
	background-color #fff
.fixed-top .fixed-fl
	display -webkit-box
	display -webkit-flex
	display -ms-flexbox
	display flex
	-webkit-box-align center
	-webkit-align-items center
	-ms-flex-align center
	align-items center
.fixed-top .fixed-fl .fixed-image
	width 100rpx
	height 100rpx
	overflow hidden
	border-radius 10rpx
.fixed-top .fixed-fl .fixed-name
	font-size 30rpx
	color #333
	margin-left 30rpx
	overflow hidden
	text-overflow ellipsis
	white-space nowrap
	max-width 350rpx
.fixed-top .fixed-fl .fixed-image image
	height 100%
.fixed-top p
	color #8a8a8a
	font-size 22rpx
.fixed-top .total-shop
	margin-top 30rpx
	color #333
	font-size 24rpx
	display block
.fixed-top .total-shop span
	font-size 55rpx
	color #e04c4a
	margin 15rpx
.fixed-top .down-icon
	width 60rpx
	height 71rpx
.content
	padding 30rpx 30rpx 100rpx
.title
	font-size 42rpx
.text
	font-size 26rpx
	line-height 55rpx
	margin 40rpx 0
	color #181818
.images
	margin 30rpx 0
	object-fit cover
.fixed-bottom
	position fixed
	bottom 25rpx
	width 365rpx
	height 70rpx
	line-height 70rpx
	border-radius 35rpx
	left 50%
	transform translateX(-50%)
	text-align center
	color #fff
	font-size 30rpx
	background #e25755
	box-shadow 0 5rpx 10rpx rgba(224, 76, 74, 0.5)
.other
	font-size 26rpx
	margin 20rpx 0
	color #c7c7c7
	display -webkit-box
	display -webkit-flex
	display -ms-flexbox
	display flex
	-webkit-box-align center
	-webkit-align-items center
	-ms-flex-align center
	align-items center
.other span
	margin-left 30rpx
.footer
	font-size 22rpx
	color #bbb
	padding-bottom 100rpx
	line-height 35rpx
.begin-btn
	width 160rpx
	height 60rpx
	line-height 60rpx
	background-color #fff
	border 1rpx solid #077ffc
	color #077ffc
	font-size 30rpx
	border-radius 5rpx
.begin-btn:after
	border none
.code-winpop-container
	width 100%
	height 100%
	position fixed
	left 0
	top 0
	background-color rgba(0, 0, 0, 0.5)
	z-index 333
.code-winpop-main
	width 500rpx
	height 600rpx
	background-color #fff
	position fixed
	left 50%
	top 50%
	transform translate(-50%, -50%)
	-webkit-transform translate(-50%, -50%)
	border-radius 20rpx
	overflow hidden
.code-winpop-main .code-colse
	width 34rpx
	height 34rpx
	top 30rpx
	right 30rpx
	position absolute
.code-winpop-main .code-colse image
	height 100%
	display block
.code-winpop-main .dl
	width 100%
	margin-top 112rpx
	display -webkit-box
	display -webkit-flex
	display -ms-flexbox
	display flex
	flex-direction column
	-webkit-box-align center
	-webkit-align-items center
	-ms-flex-align center
	align-items center
.code-winpop-main .dl .dt
	width 280rpx
	height 280rpx
.code-winpop-main .dl .dt image
	height 100%
.code-winpop-main .dl .dd
	margin-top 85rpx
	color #333333
	font-size 28rpx
	text-align center
.p_class
	font-size 28rpx
.ad-box
	margin-top 30rpx
</style>
