<template>
	<div class="bg_whife">
		<div class="wrapper bg_grey">
			<header class="header">
				<a class="back header_left" href="#/"></a>
				<h1 class="header_title">我的</h1>
			</header>
			<!--抓到娃娃后系统通知-->
			<public-notice></public-notice>
			<div id="mescroll" class="mescroll">
				<div class="user_top">
					<dl>
						<dt>
		    			<i class="sex_icon" :class='user_gender==1 ? "" : sex_icon_women'></i>
		    			<img :src="user_img"/>
	    			</dt>
						<dd>
							<span v-text="user_name"></span>
							<em v-cloak>ID:{{uid}}</em>
						</dd>
					</dl>
				</div>
				<div class="mine_cells">
					<a class="mine_cell" href="#/userpage_mywawa" id="user_mywawa">
						<div class="mine_cell_hd">
							<div class="icon_mine_box">
								<span class="icon_mine"></span>
							</div>
							<span>我的娃娃</span>
						</div>
						<div class="mine_cell_bd">
							<!--<span class="mine_cell_num" v-text="wawaCount"></span>-->
						</div>
					</a>
					<a class="mine_cell" href="#/userpage_shop">
						<div class="mine_cell_hd">
							<div class="icon_mine_box">
								<span class="icon_mine_gold"></span>
							</div>
							<span>我的娃娃币</span>
						</div>
						<div class="mine_cell_bd">
							<span class="mine_cell_text">充值</span>
						</div>
						<span class="mine_cell_middle" v-text="coin"></span>
					</a>
				</div>
				<!--<div class="mine_cells">
					<a class="mine_cell" href="#/userpage_my_incode">
						<div class="mine_cell_hd">
							<div class="icon_mine_box">
								<span class="icon_yaoqing"></span>
							</div>
							<span>邀请奖励</span>
						</div>
						<div class="mine_cell_bd">
							<span class="mine_cell_text" v-cloak>最高可获得{{incodeNum}}娃娃币</span>
						</div>
					</a>
				</div>-->
				<div class="mine_cells">
					<a class="mine_cell" href="#/userpage_news">
						<div class="mine_cell_hd">
							<div class="icon_mine_box">
								<span class="icon_msg"></span>
							</div>
							<span>消息</span>
						</div>
						<div class="mine_cell_bd">
							<div class="mine_cell_text"></div>
						</div>
					</a>
					<a class="mine_cell" href="#/userpage_user_faq">
						<div class="mine_cell_hd">
							<div class="icon_mine_box">
								<span class="icon_call"></span>
							</div>
							<span>联系客服</span>
						</div>
						<div class="mine_cell_bd"></div>
					</a>
					<a class="mine_cell" href="#/welfare_code">
						<div class="mine_cell_hd">
							<div class="icon_mine_box">
								<span class="icon_gift"></span>
							</div>
							<span>福利码</span>
						</div>
						<div class="mine_cell_bd"></div>
					</a>
				</div>
				<div class="mine_cells" v-for="ad in adList" v-if="isAd">
					<div class="mine_ad" @click="goAd(ad.android,ad.ios)">
						<div class="mine_ad_close" @click.stop="isAd=false"></div>
						<dl>
							<dt><img :src="ad.img"/></dt>
							<dd>
								<h3 v-text="ad.title"></h3>
								<p v-text="ad.content"></p>
							</dd>
						</dl>
					</div>
				</div>
				<div class="mine_cells">
					<a class="mine_cell" href="#/userpage_setting">
						<div class="mine_cell_hd">
							<div class="icon_mine_box">
								<span class="icon_set"></span>
							</div>
							<span>设置</span>
						</div>
						<div class="mine_cell_bd"></div>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import global_ from '../components/Global.vue'
	import publicNotice from '../components/public_notice.vue'
	var apiUrl = global_.apiUrl;
	export default {
		name: 'app',
		data() {
			return {
				user_img: '',
				user_gender: '',
				user_name: '',
				uid: '',
				isAd: true,
				wawaCount: "", //娃娃个数
				coin: "", //娃娃币
				adList: [],
				noread: "",
				incodeNum: "",
				mescroll: null
			}
		},
		components: {
			publicNotice
		},
		activated: function() {
			setTimeout(()=>{
				this.getTicket();
			},1000);
		},
		mounted: function() {
			var token = getCookie("token");
			var user_img = localStorage.getItem("user_img");
			user_img = user_img || "http://wawah5-1252571264.file.myqcloud.com/newimg/default_img.png";
			var user_gender = localStorage.getItem("user_gender");
			var user_name = localStorage.getItem("user_name");
			var uid = localStorage.getItem("uid");
			this.user_img = user_img;
			this.user_gender = user_gender;
			this.user_name = user_name;
			this.uid = uid;

			var self = this;
			this.$nextTick(function() {
				$('.mescroll').height($(window).height()-$(".header").height());
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

				// 个人信息
				$.ajax({
					type: "post",
					url: apiUrl + "api/public/?service=User.getBaseInfo",
					data: {
						"token": token,
						"uid": uid
					},
					dataType: 'json',
					success: function(res) {
						if(res.code == 1) {
							self.wawaCount = res.data.wawa_count;
							self.coin = res.data.coin;
							self.noread = res.data.noread;
						}
					}
				});
				// 我的广告
				$.ajax({
					type: "get",
					url: apiUrl + "index.php?g=Api&m=Mywawa&a=api",
					data: {
						"token": token,
						"api_name": "myadv",
						"channel": "h5"
					},
					dataType: 'json',
					success: function(res) {
						self.adList = res.data;
					}
				});
				//邀请规则信息
				//规则信息
				$.ajax({
					type: "get",
					url: apiUrl + "api/usercode/api",
					data: {
						api_name: "get_code_config",
					},
					dataType: "json",
					success: function(res) {
						self.incodeNum = res.data.max;
					}
				});
			});

		},
		methods: {
			goAd: function(android, ios) {
				var ua = navigator.userAgent.toLowerCase();
				if(/iphone|ipad|ipod/.test(ua)) {
					window.location.href = ios;
				} else if(/android/.test(ua)) {
					window.location.href = android;
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

<style>
	[v-cloak] {
		display: none;
	}
	.mine_cell_middle{
		left: 0;
		top: 0;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>