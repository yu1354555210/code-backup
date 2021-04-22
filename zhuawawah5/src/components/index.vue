<template>
	<div class="bg_whife">
		<div class="wrapper">
			<!--头部-->
			<header class="header">
				<a href="#/userpage" class="index_user header_left"></a>
				<h1 class="header_title">娃娃来了</h1>
				<a href="#/userpage_shop" class="index_shop header_right"></a>
			</header>
			<div class="mescroll" id="mescroll">
				<!--抓到娃娃后系统通知-->
				<public-notice></public-notice>
				<!--焦点图-->
				<div class="slide_box">
					<div class="swiper-container">
						<div class="swiper-wrapper">
							<div class='swiper-slide' v-for="item in imginfo">
								<a @click="swiperToDetail(item)" href="javascript:;"><img class="slide_img" :src='item.slide_pic' /></a>
							</div>
						</div>
						<div class="swiper-pagination"></div>
					</div>
				</div>
				<!--导航-->
				<div class="navbar">
					<ul>
						<li v-for="item in navList">
							<a href="javascript:;" @click="toNavRoom(item)">
								<img :src="item.img" />
								<span v-text="item.title"></span>
							</a>
						</li>
					</ul>
				</div>
				<!--房间列表-->
				<div class="room_list">
					<ul id="dataList">
						<li v-for="item in pdlist">
							<a @click.stop="toRoom(item)" href="javascript:;">
								<dl>
									<dt>
										<span class="room_num" v-if="item.rooms>1" v-cloak>{{item.free_rooms}}/{{item.rooms}}</span>
										<span v-if="item.status == 0" class="room_status">空闲中</span>
										<span v-else-if="item.status == 1" class="room_status room_status_maintain">补货中</span>
										<span v-else-if="item.status == 2" class="room_status room_status_maintain">维护中</span>
										<span v-else-if="item.status == 3" class="room_status room_status_ing">游戏中</span>
										<span v-else="item.status == 4" class="room_status room_status_maintain">维护中</span>
										<img :src="item.gifticon"/>
									</dt>
									<dd>
										<div class="room_price"><span v-cloak>{{item.spendcoin}}币/次</span></div>
										<div class="room_award" v-text="item.giftname"></div>
									</dd>
								</dl>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<!--签到领取娃娃币弹窗-->
			<div class="public_mask fadeIn animated" v-if="isShowWinpop" @click.self="hideWinpop">
				<div class="winpop winpop_red" style="display: block;">
					<div class="winpop_close" @click="hideWinpop"></div>
					<div class="winpop_main">
						<div class="winpop_title">
							<p>签到领娃娃币</p>
							<p>今日可领</p>
						</div>
						<div class="winpop_icon" v-cloak>
							<i class="winpop_gold_icon"></i>
							<span>{{signCoin}}<label v-if="recently != ''">{{extraparam}}</label></span>
						</div>
						<a href="javascript:;" class="winpop_btn" @click="toRoomSigned">去领取</a>
					</div>
				</div>
			</div>
			<!--周卡/月卡领取娃娃币弹窗-->
			<div class="public_mask fadeIn animated" v-show="isShowCardWinpop" @click.self="hideCardWinpop">
				<div class="winpop winpop_purple" style="display: block;">
					<div class="winpop_close" @click="hideCardWinpop"></div>
					<div class="winpop_main">
						<div class="winpop_title" v-if="charge_id == '-101'">周卡每日领取娃娃币</div>
						<div class="winpop_title" v-else>月卡每日领取娃娃币</div>
						<div class="winpop_icon">
							<i class="winpop_gold_icon"></i>
							<span v-text="give_coin"></span>
						</div>
						<a href="javascript:;" @click="postDrawCard" class="winpop_btn">领取</a>
						<p v-cloak>剩余有效时间{{remain}}天</p>
					</div>
				</div>
			</div>
			<!--新用户注册送币,只显示一次-->
			<div class="public_mask fadeIn animated" v-if="isNewPelShowWinpop" @click.self="hideNewPelWinpop">
				<div class="winpop winpop_red" style="display: block;">
					<div class="winpop_close" @click="hideNewPelWinpop"></div>
					<div class="winpop_main">
						<div class="winpop_title">
							<p>首次注册送币</p>
						</div>
						<div class="winpop_icon">
							<i class="winpop_gold_icon"></i>
							<span v-cloak>{{newPelCoin}}</span>
						</div>
						<a href="javascript:;" class="winpop_btn" @click="hideNewPelWinpop">关闭</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import global_ from '../components/Global.vue'
	import publicNotice from '../components/public_notice.vue'
	var apiUrl = global_.apiUrl;

	function getListDataFromNet(ctx, pageNum, pageSize, successCallback, errorCallback) {
		try {
			var token = getCookie("token");
			var uid = getCookie("uid");
			var url = apiUrl + "api/mywawa/api?token=" + token + "&uid=" + uid + "&size=" + pageSize + "&page=" + pageNum + "&api_name=wawa_index";
			$.get(url, function(datax) {
				var data = JSON.parse(datax);
				var data = data.data;
				successCallback && successCallback(data); //成功回调
			});
		} catch(e) {
			errorCallback && errorCallback();
		}

	}

	function successCallback(data) {}
	
	var isDrawedC;
	export default {
		name: 'app',
		data() {
			return {
				noticeinfo: '',
				imginfo: '',
				ranrid: '',
				mescroll: null,
				pdlist: [],
				navList: [],
				isShowWinpop: false,
				isShowCardWinpop: false,
				isNewPelShowWinpop: false,
				cursignstate: 1,
				signCoin: 0,
				extraparam: "",
				isDrawed: 0, //是否有月卡周卡
				newPelCoin: "", //首次注册送币
				charge_id: "", //月卡或者周卡
				give_coin: "", //可领取娃娃币数
				remain: "", //第一张月卡周卡的剩余天数,
			}
		},
		components: {
			publicNotice
		},
		watch: {
			imginfo: function() {
				this.$nextTick(function() {
					$(".swiper-container").swiper({
						loop: true,
						autoplay: 3000,
						autoplayDisableOnInteraction: false,
					});
				});
			}
		},
		activated: function() {
			this.getCardInfo();
			setTimeout(()=>{
				this.getTicket();
			},1000);
		},
		mounted: function() {
			var token = getCookie("token");
			var uid = getCookie("uid");
			var self = this;
			this.$nextTick(function() {

				self.getSwiper();
				self.getNavList();
				self.getVer();
				self.getNewPelWinpop();
				isDrawedC = this.isDrawed;
				self.mescroll = new MeScroll("mescroll", {
					up: {
						callback: self.upCallback,
						isBounce: false,
						empty: {
							warpId: "dataList",
						},
					}
				});

			});

		},

		methods: {
			upCallback: function(page) {
				var self = this;
				getListDataFromNet(self, page.num, page.size, function(curPageData) {
					if(page.num == 1) self.pdlist = [];
					self.pdlist = self.pdlist.concat(curPageData);
					self.mescroll.endSuccess(curPageData.length);

				}, function() {
					self.mescroll.endErr();
				});
			},
			toRoom: function(item) {

				var self = this;
				if(item.rooms > 1) {
					self.$router.push("/room_list/" + item.wawa_id)
				} else {
					if(item.status == "1" || item.status == "2" || item.status == "4") {
						self.$vux.toast.show({
							text: '机器正在维护中',
							type: "text",
							position: "bottom",
						});
					} else {
						self.$router.push({
							path: "index_wawa/" + item.room_id,
							query: {
								rid: item.room_id,
								gifticon: item.gifticon,
							}
						})
					}
				}
			},
			swiperToDetail: function(item) {
				var self = this;
				var entrance = $.trim(item.slide_url);
				var room_id = "";
				var labelId;
				entrance = entrance.replace(/^wawa(\:\/\/\/)/g, "");
				if(entrance.indexOf('http://') == -1 || entrance.indexOf('https://') == -1) {
					if(entrance == 'signIn') {
						entrance = 'room_signed'
						self.$router.push({
							path: entrance
						})
					} else if(entrance == 'recharge') {
						entrance = 'userpage_shop'
						self.$router.push({
							path: entrance
						})
					} else if(entrance.indexOf('category') == 0) {
						labelId = entrance.split("id=")[1];
						entrance = "category_list";
						self.$router.push({
							path: entrance + "/" + labelId,
							query: {
								labelId: labelId,
								title: item.title
							}
						})
					} else if(entrance.indexOf('room') == 0) {
						room_id = entrance.split("id=")[1];
						entrance = "index_wawa";
						self.$router.push({
							path: entrance + "/" + room_id,
							query: {
								rid: room_id
							}
						})
					} else if(entrance == "") {
						entrance = "slide_detail";
						self.$router.push({
							path: entrance,
							query: {
								content: item.slide_content,
								title: item.slide_name
							}
						})
					} else {
						window.location.href = entrance;
					}
				}
			},
			//焦点图请求
			getSwiper: function() {
				var self = this;
				$.ajax({
					url: apiUrl + "api/public/?service=Home.getHot",
					// data: {
						// call: 1
					// },
					type: "get",
					// dataType: "jsonp", // 返回的数据类型，设置为JSONP方式
					// jsonp: 'callback', //指定一个查询参数名称来覆盖默认的 jsonp 回调参数名 callback
					// jsonpCallback: 'successCallback', //设置回调函数名
					success: function(res) {
						self.imginfo = res.data.slide;
					},
					error: function() {
						// console.log('fail');
					}
				});
			},
			//首页入口请求
			getNavList: function() {
				var self = this;
				$.ajax({
					type: "get",
					url: apiUrl + "api/mywawa/api?token=" + token,
					data: {
						api_name: "entrance"
					},
					dataType: "json",
					success: function(res) {
						var data = res.data;
						for(var i in data){
							if(data[i].title == "低价好物"){
								data[i].url = "wawa:///category?id=2";
								data[i].type = '1';
								data[i].title = "爆款";
								data[i].img = "http://wawah5-1252571264.file.myqcloud.com/newimg/nav_icon_10.png";
							}
							if(data[i].title == "抢口红"){
								data[i].url = "wawa:///category?id=12";
								data[i].type = '1';
								data[i].title = "周边";
							}
						}
						self.navList = data;
					}
				});
			},
			// 首页入口跳转
			toNavRoom(item) {
				var self = this;
				var entrance = $.trim(item.url);
				var room_id = "";
				var labelId;
				entrance = entrance.replace(/^wawa(\:\/\/\/)/g, "");
				if(item.type == '1') {
					if(entrance == 'signIn') {
						entrance = 'room_signed'
						self.$router.push({
							path: entrance
						})
					} else if(entrance == 'recharge') {
						entrance = 'userpage_shop'
						self.$router.push({
							path: entrance
						})
					} else if(entrance.indexOf('category') == 0) {
						labelId = entrance.split("id=")[1];
						entrance = "category_list";
						self.$router.push({
							path: entrance + "/" + labelId,
							query: {
								labelId: labelId,
								title: item.title
							}
						})
					} else if(entrance.indexOf('room') == 0) {
						room_id = entrance.split("id=")[1];
						entrance = "index_wawa";
						self.$router.push({
							path: entrance + "/" + room_id,
							query: {
								rid: room_id
							}
						})
					}
				} else {
					window.location.href = entrance;
				}
			},
			//获取版本号
			getVer: function() {
				var url = apiUrl + "api/usercode/api?api_name=get_version";
				var self = this;
				this.$ajax.get(url).then(res => {
					localStorage.setItem("ver", res.data.data.ipa_ver);
				}).catch(error => console.log(error));
			},
			//获得月卡周卡信息
			getCardInfo() {
				var self = this;
				var token = getCookie("token");
				var uid = getCookie("uid");
				var ver = localStorage.getItem("ver");
				var bundle_name = getCookie("bundle_name");
				var isNewPel = getCookie("isNewPel");
				$.ajax({
					type: "get",
					url: apiUrl + "/api/public/?service=UserSign.getDrawInfo",
					data: {
						'token': token,
						'uid': uid,
						'bundle_name': bundle_name,
						'channel': 'h5',
						'version': ver,
					},
					dataType: "json",
					success: function(res) {
						isDrawedC = res.data.is_drawed;
						if(isDrawedC == 1) {
							var info = res.data.info;
							if(info != "") {
								self.charge_id = info.charge_id;
								self.give_coin = info.give_coin;
								self.remain = info.remain;
								self.isShowCardWinpop = true;
							}
						}
						//获取签到信息
						$.ajax({
							type: "get",
							url: apiUrl + "/api/public/?service=UserSign.getLatestSign",
							data: {
								token: token,
								uid: uid,
								appversion: ver,
								sign_ver: 1,
							},
							dataType: "json",
							success: function(res) {
								var isClose = getCookie("isClose");
								var data = res.data;
								var sign_score = data.sign_score;
								self.cursignstate = data.sign_info.cursignstate;
								if(self.cursignstate == 1) {
									if(isNewPel == 'no' && isDrawedC != 1 && isClose != 'yes' && self.isShowCardWinpop == false) {
										setTimeout(function() {
											self.isShowWinpop = true
										}, 500)
									}
								}
								for(let i in sign_score) {
									if(sign_score[i].signstate == 1) {
										self.signCoin = sign_score[i].score;
										self.extraparam = sign_score[i].extraparam;
									}
								}
							}
						});
					}
				});
			},
			//提交领取信息
			postDrawCard() {
				var self = this;
				var token = getCookie("token");
				var uid = getCookie("uid");
				var isClose = getCookie("isClose");
				$.ajax({
					type: "get",
					url: apiUrl + "/api/public/?service=UserSign.draw",
					data: {
						'token': token,
						'uid': uid,
					},
					dataType: "json",
					success: function(res) {
						self.isShowCardWinpop = false;
						self.$vux.toast.show({
							text: '领取成功',
							type: "text",
							position: "bottom"
						});

						if(self.cursignstate == 1) { //没签到
							if(isClose == 'yes') {
								self.isShowWinpop = false
							} else {
								setTimeout(function() {
									self.isShowWinpop = true
								}, 500)
							}
						} else {
							self.isShowWinpop = false
						}
					}
				});
			},
			// 首次登录送币
			getNewPelWinpop() {
				var self = this;
				var isNewPel = getCookie("isNewPel");
				if(isNewPel != 'no' && isNewPel != undefined && isNewPel != null) {
					this.isNewPelShowWinpop = true;
					this.newPelCoin = isNewPel;
				} else {
					this.isNewPelShowWinpop = false;
				}
			},
			//跳转签到页
			toRoomSigned() {
				setTimeout(() => {
					this.hideWinpop();
				}, 500);
				this.$router.push({
					path: "room_signed"
				});
			},
			setCookie(name, value) {
				// 设置cookie到当天24点失效
				var curDate = new Date();
				//当前时间戳  
				var curTamp = curDate.getTime();
				//当前日期
				var curDay = curDate.toLocaleDateString();
				var brow = $.browser;
				var curWeeHours = 0;
				//当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态  
				curWeeHours = new Date(curDay).getTime() + (8 * 60 * 60 * 1000) - 1;
				//当日已经过去的时间（毫秒）  
				var passedTamp = curTamp - curWeeHours;
				//当日剩余时间  
				var leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
				var leftTime = new Date();
				leftTime.setTime(leftTamp + curTamp);
				//创建cookie  
				document.cookie = name + "=" + value + ";expires=" + leftTime.toGMTString();
			},
			hideWinpop() {
				this.isShowWinpop = false;
				this.setCookie("isClose", 'yes');
			},
			hideNewPelWinpop() {
				var self = this;
				this.isNewPelShowWinpop = false;
				this.setCookie("isNewPel", 'no');
				if(self.cursignstate == 1) { //没签到
					setTimeout(function() {
						self.isShowWinpop = true
					}, 500)
				}
			},
			hideCardWinpop() {
				this.isShowCardWinpop = false;
				var isClose = getCookie("isClose");
				var self = this;
				if(self.cursignstate == 1) { //没签到
					if(isClose == 'yes') {
						self.isShowWinpop = false
					} else {
						setTimeout(function() {
							self.isShowWinpop = true
						}, 500)
					}
				} else {
					self.isShowWinpop = false
				}
			},
			getTicket(){ //获取ticket
				var token = getCookie("token");
				var nowUrl = window.location.href;
				if (window.location.hash.length) {
				    nowUrl = nowUrl.substr(0, nowUrl.indexOf(window.location.hash));
				}
				$.ajax({
					type: "post",
					url: apiUrl + "api/usercode/get_ticket",
					data: {
						token: token,
					},
					success: function(res) {
						var data = JSON.parse(res);
						var timestamp = (new Date().getTime() / 1000).toFixed(0);
						var nonceStr = Math.random().toString(36).substr(2);
						var ticket = wx_js();
						wx.config({
							// 配置信息
							debug: false,
							appId: 'wxa5547e3852c868cc',
							timestamp: timestamp,
							nonceStr: nonceStr,
							signature: ticket,
							jsApiList: ['onMenuShareAppMessage']
						});

						wx.ready(function() {
							wx.onMenuShareAppMessage({
								title: '娃娃来了', // 分享标题
								desc: '在线实景抓娃娃，抓到还能包邮到家', // 分享描述
								link: '', // 分享链接
								imgUrl: 'http://wawah5-1252571264.file.myqcloud.com/newimg/login_logo.png', // 分享图标
								success: function() {
									// 用户确认分享后执行的回调函数
								},
								cancel: function() {
									// 用户取消分享后执行的回调函数
								}
							});
						});
						
						
						function wx_js(signature){
							var a= data.data;
							var b= nonceStr;
							var c= timestamp;
							var d= nowUrl;
							var e=decodeURIComponent('jsapi_ticket='+a+'&noncestr='+b+'&timestamp='+c+'&url='+d+'').split("#")[0],s=new jsSHA(e,"TEXT"),signature=s.getHash("SHA-1","HEX");
						
							return signature;
						}
					}
					
				});
				
				
				//签名加密算法
				(function(D){function p(b,e,c){var a=0,d=[0],f="",g=null,f=c||"UTF8";if("UTF8"!==f&&"UTF16"!==f)throw"encoding must be UTF8 or UTF16";if("HEX"===e){if(0!==b.length%2)throw"srcString of HEX type must be in byte increments";g=v(b);a=g.binLen;d=g.value}else if("TEXT"===e)g=w(b,f),a=g.binLen,d=g.value;else if("B64"===e)g=x(b),a=g.binLen,d=g.value;else if("BYTES"===e)g=y(b),a=g.binLen,d=g.value;else throw"inputFormat must be HEX, TEXT, B64, or BYTES";this.getHash=function(b,f,c,e){var g=null,
h=d.slice(),l=a,n;3===arguments.length?"number"!==typeof c&&(e=c,c=1):2===arguments.length&&(c=1);if(c!==parseInt(c,10)||1>c)throw"numRounds must a integer >= 1";switch(f){case "HEX":g=z;break;case "B64":g=A;break;case "BYTES":g=B;break;default:throw"format must be HEX, B64, or BYTES";}if("SHA-1"===b)for(n=0;n<c;n+=1)h=s(h,l),l=160;else throw"Chosen SHA variant is not supported";return g(h,C(e))};this.getHMAC=function(c,b,e,g,q){var h,l,n,r,p=[],t=[];h=null;switch(g){case "HEX":g=z;break;case "B64":g=
A;break;case "BYTES":g=B;break;default:throw"outputFormat must be HEX, B64, or BYTES";}if("SHA-1"===e)l=64,r=160;else throw"Chosen SHA variant is not supported";if("HEX"===b)h=v(c),n=h.binLen,h=h.value;else if("TEXT"===b)h=w(c,f),n=h.binLen,h=h.value;else if("B64"===b)h=x(c),n=h.binLen,h=h.value;else if("BYTES"===b)h=y(c),n=h.binLen,h=h.value;else throw"inputFormat must be HEX, TEXT, B64, or BYTES";c=8*l;b=l/4-1;if(l<n/8){if("SHA-1"===e)h=s(h,n);else throw"Unexpected error in HMAC implementation";
h[b]&=4294967040}else l>n/8&&(h[b]&=4294967040);for(l=0;l<=b;l+=1)p[l]=h[l]^909522486,t[l]=h[l]^1549556828;if("SHA-1"===e)e=s(t.concat(s(p.concat(d),c+a)),c+r);else throw"Unexpected error in HMAC implementation";return g(e,C(q))}}function w(b,e){var c=[],a,d=[],f=0,g;if("UTF8"===e)for(g=0;g<b.length;g+=1)for(a=b.charCodeAt(g),d=[],128>a?d.push(a):2048>a?(d.push(192|a>>>6),d.push(128|a&63)):55296>a||57344<=a?d.push(224|a>>>12,128|a>>>6&63,128|a&63):(g+=1,a=65536+((a&1023)<<10|b.charCodeAt(g)&1023),
d.push(240|a>>>18,128|a>>>12&63,128|a>>>6&63,128|a&63)),a=0;a<d.length;a+=1)(f>>>2)+1>c.length&&c.push(0),c[f>>>2]|=d[a]<<24-f%4*8,f+=1;else if("UTF16"===e)for(g=0;g<b.length;g+=1)(f>>>2)+1>c.length&&c.push(0),c[f>>>2]|=b.charCodeAt(g)<<16-f%4*8,f+=2;return{value:c,binLen:8*f}}function v(b){var e=[],c=b.length,a,d;if(0!==c%2)throw"String of HEX type must be in byte increments";for(a=0;a<c;a+=2){d=parseInt(b.substr(a,2),16);if(isNaN(d))throw"String of HEX type contains invalid characters";e[a>>>3]|=
d<<24-a%8*4}return{value:e,binLen:4*c}}function y(b){var e=[],c,a;for(a=0;a<b.length;a+=1)c=b.charCodeAt(a),(a>>>2)+1>e.length&&e.push(0),e[a>>>2]|=c<<24-a%4*8;return{value:e,binLen:8*b.length}}function x(b){var e=[],c=0,a,d,f,g,m;if(-1===b.search(/^[a-zA-Z0-9=+\/]+$/))throw"Invalid character in base-64 string";a=b.indexOf("=");b=b.replace(/\=/g,"");if(-1!==a&&a<b.length)throw"Invalid '=' found in base-64 string";for(d=0;d<b.length;d+=4){m=b.substr(d,4);for(f=g=0;f<m.length;f+=1)a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(m[f]),
g|=a<<18-6*f;for(f=0;f<m.length-1;f+=1)e[c>>2]|=(g>>>16-8*f&255)<<24-c%4*8,c+=1}return{value:e,binLen:8*c}}function z(b,e){var c="",a=4*b.length,d,f;for(d=0;d<a;d+=1)f=b[d>>>2]>>>8*(3-d%4),c+="0123456789abcdef".charAt(f>>>4&15)+"0123456789abcdef".charAt(f&15);return e.outputUpper?c.toUpperCase():c}function A(b,e){var c="",a=4*b.length,d,f,g;for(d=0;d<a;d+=3)for(g=(b[d>>>2]>>>8*(3-d%4)&255)<<16|(b[d+1>>>2]>>>8*(3-(d+1)%4)&255)<<8|b[d+2>>>2]>>>8*(3-(d+2)%4)&255,f=0;4>f;f+=1)c=8*d+6*f<=32*b.length?c+
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(g>>>6*(3-f)&63):c+e.b64Pad;return c}function B(b){var e="",c=4*b.length,a,d;for(a=0;a<c;a+=1)d=b[a>>>2]>>>8*(3-a%4)&255,e+=String.fromCharCode(d);return e}function C(b){var e={outputUpper:!1,b64Pad:"="};try{b.hasOwnProperty("outputUpper")&&(e.outputUpper=b.outputUpper),b.hasOwnProperty("b64Pad")&&(e.b64Pad=b.b64Pad)}catch(c){}if("boolean"!==typeof e.outputUpper)throw"Invalid outputUpper formatting option";if("string"!==typeof e.b64Pad)throw"Invalid b64Pad formatting option";
return e}function q(b,e){return b<<e|b>>>32-e}function r(b,e){var c=(b&65535)+(e&65535);return((b>>>16)+(e>>>16)+(c>>>16)&65535)<<16|c&65535}function t(b,e,c,a,d){var f=(b&65535)+(e&65535)+(c&65535)+(a&65535)+(d&65535);return((b>>>16)+(e>>>16)+(c>>>16)+(a>>>16)+(d>>>16)+(f>>>16)&65535)<<16|f&65535}function s(b,e){var c=[],a,d,f,g,m,p,u,k,s,h=[1732584193,4023233417,2562383102,271733878,3285377520];b[e>>>5]|=128<<24-e%32;b[(e+65>>>9<<4)+15]=e;s=b.length;for(u=0;u<s;u+=16){a=h[0];d=h[1];f=h[2];g=h[3];
m=h[4];for(k=0;80>k;k+=1)c[k]=16>k?b[k+u]:q(c[k-3]^c[k-8]^c[k-14]^c[k-16],1),p=20>k?t(q(a,5),d&f^~d&g,m,1518500249,c[k]):40>k?t(q(a,5),d^f^g,m,1859775393,c[k]):60>k?t(q(a,5),d&f^d&g^f&g,m,2400959708,c[k]):t(q(a,5),d^f^g,m,3395469782,c[k]),m=g,g=f,f=q(d,30),d=a,a=p;h[0]=r(a,h[0]);h[1]=r(d,h[1]);h[2]=r(f,h[2]);h[3]=r(g,h[3]);h[4]=r(m,h[4])}return h}"function"===typeof define&&define.amd?define(function(){return p}):"undefined"!==typeof exports?"undefined"!==typeof module&&module.exports?module.exports=
exports=p:exports=p:D.jsSHA=p})(window);
			}
		}
	}
</script>

<style scoped>
	.public_mask {
		z-index: 66666;
	}
</style>
<style lang="less">
	.swiper-container .swiper-slide .slide_img {
		height: 100% !important;
		border-radius: 0 !important;
	}
	
	.mescroll-downwarp {
		background-color: #FFEA7D;
	}
	
	.animated {
		animation-duration: .3s;
	}
	
	[v-cloak] {
		display: none;
	}
	
	.room_list ul li a {
		position: relative;
		z-index: 55;
	}
</style>