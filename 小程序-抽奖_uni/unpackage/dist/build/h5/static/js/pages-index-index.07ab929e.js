(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-index-index"],{"1b0d":function(e,t,a){var i=a("6639");"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var o=a("4f06").default;o("6190232c",i,!0,{sourceMap:!1,shadowMode:!1})},"4c5a":function(e,t,a){"use strict";var i=a("288e");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("28a5");var o=i(a("a4bb"));a("ac6a"),a("7f7f");var n=98,s={data:function(){return{list:"",recommend:"",id:"",page:1,hasMore:!0,hiddenLoad:!0,pageFlag:!0,indicatorDots:!0,indicatorColor:"#fff",indicatorActiveColor:"#d2d2d2",autoplay:!0,interval:3e3,duration:500,focusImgs:"",flexQrcodes:[],onlineStatus:!1,closeTitle:"传奇单机-关闭按钮",appid1:"wx79ade44c39cefc7f",path1:"?chid=2068&subchid=CQLE_DJ",appid2:"wxefe8997276c7a7d4",path2:"?from=1473",btnList:[],contents:"小度微游",isDialog:!1,focusQrcodes:"",clientHeight:"",isHide:!1}},components:{},props:{},onLoad:function(e){var t=this;this.timer()>=0?(this.setData({onlineStatus:!0}),wx.getSetting({success:function(e){e.authSetting["scope.userInfo"]?wx.getUserInfo({success:function(e){console.log(e),uni.switchTab({url:"../list/index"}),wx.login({success:function(e){console.log("用户的code:"+e.code)}})}}):t.setData({isHide:!0})}})):(wx.showLoading({title:"加载中...",mask:!0}),wx.request({url:"https://mini-gl.binglue.com/article/list",data:{id:n,page:t.page,pageSize:10},header:{"content-type":"application/json"},success:function(e){1===e.data.code?(t.setData({list:e.data.data,page:t.page+1}),setTimeout(function(){wx.hideLoading()},500)):console.log("没有新的数据")}})),wx.request({url:"https://mini-gl.binglue.com/focus/list",data:{id:n},header:{"content-type":"application/json"},success:function(e){var a=e.data.data;for(var i in console.log(a),t.setData({focusImgs:a}),a)t.setData({focusQrcodes:a[i].wx_qrcode.concat(t.focusQrcodes)});1==t.focusImgs.length&&t.setData({indicatorDots:!1})}}),wx.getSystemInfo({success:function(e){t.setData({clientHeight:e.windowHeight})}})},onShareAppMessage:function(e){return"button"===e.from&&console.log(e.target),{title:"副本进度99%，快来砍一刀！",path:"/pages/list/list",imageUrl:"/images/share.jpg"}},methods:{bindGetUserInfo:function(e){if(e.detail.userInfo){var t=this;console.log("用户的信息如下："),console.log(e.detail.userInfo),t.setData({isHide:!1})}else wx.showModal({title:"警告",content:"您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!",showCancel:!1,confirmText:"返回授权",success:function(e){e.confirm&&console.log("用户点击了“返回授权”")}})},beginGame:function(e){var t=e.currentTarget.dataset.appid,a=e.currentTarget.dataset.path,i=e.currentTarget.dataset.name;wx.navigateToMiniProgram({appId:t,path:a,success:function(e){}}),getApp().globalData.aldstat.sendEvent("点击",{"按钮点击统计":i})},music:function(){var e=wx.createInnerAudioContext();e.autoplay=!0,e.loop=!0,e.src="http://wawa.binglue.com/xiaochengxu/chuanqi/chuanqi.mp3?1",e.onPlay(function(){console.log("开始播放")}),e.onError(function(e){})},timer:function(){var e=new Date,t=new Date("2019-10-11 18:00:00");return e-t},toDetail:function(e){wx.navigateTo({url:"../detail/detail?url=".concat(e.currentTarget.dataset.contentid)})},previewImage:function(e){var t=e.currentTarget.dataset.src;wx.previewImage({urls:t})},previewFlexImage:function(e){wx.previewImage({urls:this.focusQrcodes})},copyText:function(e){console.log(e),wx.setClipboardData({data:e.currentTarget.dataset.text,success:function(e){wx.getClipboardData({success:function(e){wx.showToast({title:"复制成功"})}})}})},showDialog:function(){this.setData({isDialog:!0})},hideDialog:function(){this.setData({isDialog:!1})},loadMore:function(e){var t=this;if(t.pageFlag){t.setData({pageFlag:!1});var a="https://mini-gl.binglue.com/article/list";wx.request({url:a,data:{id:n,page:t.page,pageSize:10},header:{"content-type":"application/json"},success:function(e){console.log(e),1===e.data.code&&t.setData({list:t.list.concat(e.data.data),page:t.page+1,pageFlag:!0}),0!==e.data.code||t.setData({hasMore:!1})}})}},setData:function(e){var t,a,i=this,n=[];(0,o.default)(e).forEach(function(o){n=o.split("."),t=e[o],a=i.$data,n.forEach(function(e,o){o+1==n.length?i.$set(a,e,t):a[e]||i.$set(a,e,{}),a=a[e]})})}}};t.default=s},"593c":function(e,t,a){"use strict";a.r(t);var i=a("67f8"),o=a("bd81");for(var n in o)"default"!==n&&function(e){a.d(t,e,function(){return o[e]})}(n);a("9cad");var s=a("2877"),l=Object(s["a"])(o["default"],i["a"],i["b"],!1,null,"e910bd32",null);t["default"]=l.exports},6639:function(e,t,a){t=e.exports=a("2350")(!1),t.push([e.i,'.top-img[data-v-e910bd32]{width:100%;height:%?350?%;position:relative;overflow:hidden}.swiper-box[data-v-e910bd32]{margin-bottom:%?13?%}.top-img uni-image[data-v-e910bd32]{height:100%}.top-img uni-text[data-v-e910bd32]{position:absolute;left:0;bottom:0;-webkit-box-sizing:border-box;box-sizing:border-box;padding:%?20?% %?40?%;font-size:%?28?%;color:#fff;width:100%;display:block;background-color:rgba(0,0,0,.5)}.news-list[data-v-e910bd32]{overflow:hidden}.news-item[data-v-e910bd32]{padding:%?38?% %?30?%;background-color:#fff;margin-bottom:%?12?%;border:%?1?% solid #e7e7e6;border-width:1px 0;-webkit-box-orient:vertical;-webkit-box-direction:reverse;-webkit-flex-direction:column-reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.new-oneimg-item[data-v-e910bd32]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.new-oneimg-item .news-img[data-v-e910bd32]{\n  /* width: 220rpx; */-webkit-box-flex:0;-webkit-flex:0 0 %?220?%;-ms-flex:0 0 %?220?%;flex:0 0 %?220?%;margin-right:%?20?%}.new-oneimg-item .news-title[data-v-e910bd32]{\n  /* width: 445rpx; */-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.news-list .news-title[data-v-e910bd32]{font-size:%?32?%;color:#313036;\n  /* font-weight: bold; */margin-bottom:%?15?%}.news-list .news-title .time[data-v-e910bd32]{font-size:%?22?%;color:#b3b3b3;display:block;font-weight:400;margin-top:%?15?%}.news-list .news-summary[data-v-e910bd32]{font-size:%?24?%;line-height:%?40?%;color:#787878;padding:%?20?% 0}.news-list .news-img[data-v-e910bd32]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.news-list .news-img uni-image[data-v-e910bd32]{width:%?220?%;height:%?136?%;-o-object-fit:cover;object-fit:cover}.tips[data-v-e910bd32]{text-align:center;font-size:%?24?%;padding:%?30?% 0;color:#aaa}.flex-icon[data-v-e910bd32]{position:fixed;right:%?50?%;bottom:20%;width:%?94?%;height:%?94?%}.flex-icon uni-image[data-v-e910bd32]{height:100%}.loading[data-v-e910bd32]{\n  /* width: 140px; */position:fixed;width:100%;height:100%;z-index:33;text-align:center;background:#fff;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;font-size:%?24?%;color:#df4948}.cssload-loader[data-v-e910bd32]{width:%?40?%;height:%?40?%;border-radius:50%;display:inline-block;position:relative;overflow:visible;margin-bottom:%?20?%}.cssload-loader[data-v-e910bd32],.cssload-loader[data-v-e910bd32]:after,.cssload-loader[data-v-e910bd32]:before{animation:.9s infinite ease-in-out;-webkit-animation:.9s infinite ease-in-out}.cssload-loader[data-v-e910bd32]:after,.cssload-loader[data-v-e910bd32]:before{width:100%;height:100%;border-radius:50%;position:absolute;top:0;left:0}.cssload-loader[data-v-e910bd32]:after,.cssload-loader[data-v-e910bd32]:before{content:""}.cssload-loader[data-v-e910bd32]:before{border:1px solid red;top:-1px;left:-1px;opacity:0;animation-name:cssload-pulse-data-v-e910bd32;-webkit-animation-name:cssload-pulse-data-v-e910bd32}.cssload-loader[data-v-e910bd32]:after{background-color:red;animation-name:cssload-pulse-2-data-v-e910bd32;-webkit-animation-name:cssload-pulse-2-data-v-e910bd32}@keyframes cssload-pulse-data-v-e910bd32{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}50%{-webkit-transform:scale(1.3);transform:scale(1.3);opacity:0}to{-webkit-transform:scale(1.3);transform:scale(1.3);opacity:0}}@-webkit-keyframes cssload-pulse-data-v-e910bd32{0%{-webkit-transform:scale(1);opacity:1}50%{-webkit-transform:scale(1.3);opacity:0}to{-webkit-transform:scale(1.3);opacity:0}}@keyframes cssload-pulse-2-data-v-e910bd32{0%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(.7);transform:scale(.7)}to{-webkit-transform:scale(1);transform:scale(1)}}@-webkit-keyframes cssload-pulse-2-data-v-e910bd32{0%{-webkit-transform:scale(1)}50%{-webkit-transform:scale(.7)}to{-webkit-transform:scale(1)}}.login-bg[data-v-e910bd32]{width:%?750?%;height:%?1334?%;position:fixed;background-size:100% 100%;z-index:-1;overflow:hidden}.login-btn[data-v-e910bd32]{width:%?566?%;height:%?146?%;position:absolute;top:%?997?%;left:50%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);display:block;padding:0;border:0!important}.login-btn uni-image[data-v-e910bd32]{height:100%}',""])},"67f8":function(e,t,a){"use strict";var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",[e.onlineStatus?e._e():a("v-uni-scroll-view",{style:"height: "+e.clientHeight+"px;",attrs:{"scroll-y":"true"},on:{scrolltolower:function(t){t=e.$handleEvent(t),e.loadMore(t)}}},[a("v-uni-view",{staticClass:"news-list"},e._l(e.list,function(t,i){return a("v-uni-view",{key:i,class:"news-item "+(1==t.thumbs.length?"new-oneimg-item":""),attrs:{"data-contentid":t.id},on:{click:function(t){t=e.$handleEvent(t),e.toDetail(t)}}},[a("v-uni-view",{staticClass:"news-img"},e._l(t.thumbs,function(e,t){return a("v-uni-image",{key:t,attrs:{src:e}})}),1),a("v-uni-view",{staticClass:"news-title"},[e._v(e._s(t.title)),1==t.thumbs.length?a("v-uni-text",{staticClass:"time"},[e._v(e._s(t.create_time))]):e._e()],1)],1)}),1),a("v-uni-view",{staticClass:"tips"},[e.hasMore?a("v-uni-view",[a("v-uni-text",[e._v("玩命的加载中...")])],1):a("v-uni-view",[a("v-uni-text",[e._v("没有更多内容")])],1)],1)],1),e.onlineStatus?a("v-uni-view",{style:"height: "+e.clientHeight+"px;"},[a("v-uni-image",{staticClass:"login-bg",attrs:{src:"/static/images/login-bg.jpg",mode:"aspectFill"}}),a("v-uni-button",{staticClass:"login-btn",attrs:{type:"primary","open-type":"getUserInfo",lang:"zh_CN",bindgetuserinfo:"bindGetUserInfo",plain:"true"}},[a("v-uni-image",{attrs:{src:"/static/images/login-btn.png",mode:"aspectFill"}})],1)],1):e._e()],1)},o=[];a.d(t,"a",function(){return i}),a.d(t,"b",function(){return o})},"9cad":function(e,t,a){"use strict";var i=a("1b0d"),o=a.n(i);o.a},bd81:function(e,t,a){"use strict";a.r(t);var i=a("4c5a"),o=a.n(i);for(var n in i)"default"!==n&&function(e){a.d(t,e,function(){return i[e]})}(n);t["default"]=o.a}}]);