<template>
	<div class="bg_whife">
		<header class="header">
			<a class="back header_left" @click="$router.back()"></a>
			<h1 class="header_title">联系客服</h1>
		</header>

		<div id="mescroll" class="mescroll">
			<div v-html="content" class="protocol"></div>
			<div class="kfqq">
				<dl>
					<dt>
					<img src="http://wawah5-1252571264.file.myqcloud.com/newimg/kfqq.png"/>
					<div>客服QQ：<span id="qq_code">2780575722</span></div>
				</dt>
					<dd>
						<a href="javascript:;" class="this_btn" data-clipboard-target="#qq_code" @click="copy">复制QQ号</a>
					</dd>
				</dl>
			</div>
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
				mescroll: null
			}
		},
		methods: {
			copy() {
				var self = this;
				var clipboard = new Clipboard('.this_btn')
				clipboard.on('success', e => {
					self.$vux.toast.show({
						text: '复制成功',
						type: "text",
						position: 'bottom'
					})
					// 释放内存  
					clipboard.destroy()
				})
				clipboard.on('error', e => {
					// 不支持复制  
					self.$vux.toast.show({
						text: '复制失败,请手动复制',
						type: "text",
						position: 'bottom'
					})
					// 释放内存  
					clipboard.destroy()
				})
			}
		},
		created: function() {},
		mounted: function() {
			this.$vux.loading.show({
				text: '加载中'
			})
			var self = this;
			var token = getCookie("token");
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
			this.$nextTick(function() {
				$.ajax({
					type: "post",
					url: apiUrl + "api/set/api?token=" + token,
					data: {
						api_name: "get_faq"
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
	
	.kfqq {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 0.1rem 0.3rem;
		background-color: #fff;
		dl {
			display: flex;
			justify-content: space-between;
			align-items: center;
			dt {
				font-size: 0.24rem;
				color: #4a4a4a;
				display: flex;
				align-items: center;
				span {
					color: #FE5F52;
				}
				img {
					margin-right: 0.25rem;
					width: 0.34rem;
					height: 0.39rem;
				}
			}
			dd {
				.this_btn {
					width: 1.72rem;
					padding: 0;
					height: 0.6rem;
					font-size: 0.24rem;
				}
			}
		}
	}
</style>