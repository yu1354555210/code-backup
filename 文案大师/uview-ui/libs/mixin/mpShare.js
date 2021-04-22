module.exports = {
	onLoad() {
		// 设置默认的转发参数
		this.$u.mpShare = {
			title: '这条文案说的不就是你吗？', // 默认为小程序名称
			path: '/pages/index/index', // 默认为当前页面路径
			imageUrl: '/static/share.png' // 默认为当前页面的截图
		}
	},
	onShareAppMessage() {
		return this.$u.mpShare
	},
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		return this.$u.mpShare
	}
	// #endif
}
