<template>
	<div class="bg_whife">
		<header class="header">
			<a class="back header_left" @click="$router.back()"></a>
			<h1 class="header_title" v-text="title"></h1>
		</header>

		<div id="mescroll" class="mescroll">
			<div v-html="content" class="content"></div>
		</div>
	</div>
</template>

<script>
	import Clipboard from 'clipboard'
	import global_ from '../components/Global.vue'
	var apiUrl = global_.apiUrl;
	export default {
		name: 'app',
		data() {
			return {
				content: '',
				title:'',
				mescroll: null
			}
		},
		methods: {
		},
		created: function() {},
		mounted: function() {
			var self = this;
			this.content = this.$route.query.content;
			this.title = this.$route.query.title;
			$('.mescroll').height($(window).height()-$(".header").height());
			this.mescroll = new MeScroll("mescroll", {
				down: {
					use: false,
					isBounce: false,
				},
				up: {
					use: false,
					isBounce: false,
				}
			});
		}
	}
</script>

<style lang="less">
	[v-cloak] {
		display: none;
	}
	
	.content{
		padding: 0.2rem;
	}
	
</style>