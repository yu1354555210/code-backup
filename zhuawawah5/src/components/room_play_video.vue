<template>
	<div class="bg_whife">
		<header class="header">
			<a class="back header_left" @click="$router.back()"></a>
			<h1 class="header_title">抓娃娃</h1>
		</header>
		<div class="video_play">
			<video :src="videoUrl" autoplay controls></video>
		</div>
	</div>
</template>

<script>
	import global_ from '../components/Global.vue'
	var apiUrl = global_.apiUrl;
	export default {
		name: 'app',
		data() {
			return {
				videoUrl: ""
			}
		},
		methods: {
			
		},
		created: function() {},
		mounted: function() {
			this.videoUrl = this.$route.query.url;
			this.$nextTick(function() {
				$(".video_play").height($(window).height());
			})

		}
	}
</script>

<style lang="less">
	[v-cloak] {
		display: none;
	}
	.video_play{
		padding: 0.5rem 0;
		video{
			width: 100%;
			height: 80%;
		}
	}
</style>