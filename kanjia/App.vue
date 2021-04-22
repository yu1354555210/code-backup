<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData:{
			imageUrl: 'http://hybrid-static.75757.com/img/share-image.png',
			shareInfo: [
				'@我，就差你了，帮我砍一刀就能拿到188元',
				'亲来帮我点一下呗～马上我就能拿到2888的王者荣耀点券了',
				'@我，发红包啦～88元起，限量领取赶紧来吧～',
				'是朋友的帮我点一下啊～不是朋友的也帮我点一下啊～88红包马上领'
			]
		}
	}
</script>

<style>
	@import "animation.css";
	/*每个页面公共css */
	view,image,text {
		box-sizing: border-box;
	}

	image {
		width: 100%;
		max-width: 100%;
	}
</style>
