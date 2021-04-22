<script>
import Vue from 'vue';
export default {
	onLaunch: function() {
		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				};
				// #endif
				// #ifdef MP-WEIXIN
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif
				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		});
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="less">
/*每个页面公共css */
@import 'colorui/main.css';
@import 'colorui/icon.css';
@import 'assets/style.less';
/* #ifdef H5 */
uni-page-head {
	display: none;
}
/* #endif */
.status-bar {
	height: var(--status-bar-height);
	width: 100%;
}
</style>
