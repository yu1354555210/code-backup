<template>
	<div class="bg_whife">
		<div class="wrapper">
			<header class="header">
				<a @click="$router.back()" class="back header_left"></a>
				<div class="tabs">
					<ul>
						<li class="cur"><span>娃娃详情</span></li>
						<li><span>抓中记录</span></li>
					</ul>
				</div>
			</header>
			<div id="mescroll" class="mescroll">
				<div class="swiper-container">
					<div class="swiper-wrapper" id="dataList">
						<div class="swiper-slide gift_detail_list">
							<ul>
								<li v-for="item in imgList">
									<img :src="item" />
								</li>
							</ul>
						</div>
						<div class="swiper-slide gift_detail_list">
							<div class="no_address" v-if="isRecordList">
								<dl>
									<dt><img src="http://wawah5-1252571264.file.myqcloud.com/newimg/no_add.png"/></dt>
									<dd>还没有数据哦</dd>
								</dl>
								<div class="user_btn_box">
									<a href="#/" class="this_btn">赶快去抓娃娃</a>
								</div>
							</div>
							<div class="goods_wawalist" v-else>
								<ul>
									<li class="vux-1px-b" v-for="item in recordList">
										<dl>
											<dt><img :src="item.avatar_thumb"/></dt>
											<dd>
												<div class="goods_name" v-text="item.user_nicename"></div>
												<div class="goods_num" v-text="dateDiff(item.ctime)"></div>
											</dd>
										</dl>
										<div class="wawa_detail_video" v-if="item.video != ''" @click="toVideoRoom(item)"></div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
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
				imgList: [],
				recordList: [],
				mescroll: null,
				isRecordList: false
			}
		},
		mounted: function() {
			var self = this;
			var token = getCookie("token");
			this.$nextTick(function() {
				var img = this.$route.query.img;
				var rid = this.$route.query.rid;
				this.imgList = JSON.parse(img);
				var tabsSwiper;

				setTimeout(function() {
					tabsSwiper = new Swiper('.swiper-container', {
						autoHeight: true,
						onSlideChangeStart: function(swiper) {
							$(".tabs .cur").removeClass('cur')
							$(".tabs li").eq(swiper.activeIndex).addClass('cur');
						}
					})
				}, 100)

				self.mescroll = new MeScroll("mescroll", {
					down: {
						use: false,
						isBounce: false,
					},
					up: {
						use: false,
						isBounce: false,
					}
				});
				
				$.ajax({
					type: "get",
					url: apiUrl + "api/room/api?token=" + token,
					data: {
						api_name: 'room_history',
						room_id: rid
					},
					success: function(res) {
						var data = JSON.parse(res);
						self.recordList = data.data;
						if(self.recordList.length == 0) {
							self.isRecordList = true
						}
					}
				});

				$(".tabs li").on('click', function(e) {
					$(".tabs .cur").removeClass('cur')
					$(this).addClass('cur')
					tabsSwiper.slideTo($(this).index())
				});

			});
		},
		methods: {
			toVideoRoom(item){
				this.$router.push({
					path: "/room_play_video",
					query: {
						url: item.video
					}
				})
			}
		}
	}
</script>

<style lang="less">
	@import '~vux/src/styles/1px.less';
	.wawa_detail_video {
		width: .6rem;
		height: .6rem;
		background: url(http://wawah5-1252571264.file.myqcloud.com//newimg/detail_video.png);
		background-size: 100%;
	}
	
	.gift_detail_list {
		padding: 0.38rem 0.3rem;
		li {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			img {
				border-radius: 0.2rem !important;
			}
		}
	}
	
	.tabs {
		width: 100%;
		padding: 0 1.9rem;
		ul {
			display: flex;
			justify-content: center;
			li {
				flex: 1;
				span {
					width: 1.3rem;
					margin: 0 auto;
					display: block;
					font-size: 0.32rem;
					color: #777;
					border-bottom: 0.04rem solid transparent;
				}
				&.cur {
					span {
						border-bottom-color: #FE5F52;
						color: #FE5F52;
					}
				}
			}
		}
	}
</style>