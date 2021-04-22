<template>
	<div class="bg_whife">
		<header class="header">
			<a class="back header_left" @click="$router.back()"></a>
			<h1 class="header_title">用户协议</h1>
		</header>
		<div id="mescroll" class="mescroll">
			<div v-html="content" class="protocol"></div>
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
				content: '',
				mescroll: null
			}
		},
		methods: {

		},
		created: function() {},
		mounted: function() {
			var token = getCookie("token");
			this.$vux.loading.show({
				text: '加载中'
			})
			$('.mescroll').height($(window).height() - $(".header").height());
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
			this.$nextTick(function() {
				var self = this;
				$.ajax({
					type: "get",
					url: apiUrl + "api/set/api?token=" + token,
					data: {
						api_name: "get_user_agreement"
					},
					dataType: "json",
					success: function(res) {
						self.content = res.data
						setTimeout(function(){
							self.$vux.loading.hide()
						},500);
					}
				});
				
			})

		}
	}
</script>

<style lang="less">
	[v-cloak] {
		display: none;
	}
	
	.protocol {
		padding: 0.3rem 0.2rem;
		strong {
			margin: 0.15rem 0;
			display: block;
		}
		p {
			line-height: 0.4rem;
		}
	}
</style>