(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/login/index"],{"23fd":function(e,n,t){"use strict";var o=t("b862"),i=t.n(o);i.a},"4c7d":function(e,n,t){"use strict";var o,i=function(){var e=this,n=e.$createElement;e._self._c},u=[];t.d(n,"b",function(){return i}),t.d(n,"c",function(){return u}),t.d(n,"a",function(){return o})},6492:function(e,n,t){"use strict";t.r(n);var o=t("4c7d"),i=t("8e9f");for(var u in i)"default"!==u&&function(e){t.d(n,e,function(){return i[e]})}(u);t("23fd");var a,c=t("f0c5"),r=Object(c["a"])(i["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],a);n["default"]=r.exports},7346:function(e,n,t){"use strict";(function(e,o){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=t("2f62");function u(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},o=Object.keys(t);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.forEach(function(n){a(e,n,t[n])})}return e}function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}var c={data:function(){return{weixinCode:""}},onLoad:function(){},methods:u({},(0,i.mapMutations)(["login"]),{wechatLogin:function(n){var t=this,o=null;plus.oauth.getServices(function(i){if(console.log(e(i," at pages\\login\\index.vue:34")),i&&i.length){for(var u=0,a=i.length;u<a;u++)if("weixin"===i[u].id){o=i[u];break}if(!o)return void console.log(e("没有微信登录授权服务"," at pages\\login\\index.vue:43"));o.authorize(function(e){t.weixinCode=e.code,t.ajaxLogin(n)},function(n){console.error(e("authorize fail:"+JSON.stringify(n)," at pages\\login\\index.vue:54"))},{scope:"snsapi_userinfo",state:"authorize test"})}else console.log(e("无可用的登录授权服务"," at pages\\login\\index.vue:64"))},function(n){console.error(e("getServices fail:"+JSON.stringify(n)," at pages\\login\\index.vue:68"))})},ajaxLogin:function(n){var t=2,i=this;"ios"==o.getSystemInfoSync().platform&&(t=1),plus.device.getInfo({success:function(u){var a=JSON.parse(JSON.stringify(u));console.log(e("getDeviceInfo"+JSON.stringify(u)," at pages\\login\\index.vue:84")),console.log(e("getDeviceInfo success: uuid="+a.uuid," at pages\\login\\index.vue:85")),o.request({url:"http://ubase.qianr.com/api/public/?service=CommonLogin.userLogin",method:"POST",header:{"content-type":"application/x-www-form-urlencoded"},data:{code:i.weixinCode,version:i.$version,bundle_name:i.$package_name,sys:t,channel:"appstore",identification:n,type:"phone",uuid:a.uuid},success:function(n){console.log(e(n," at pages\\login\\index.vue:103")),i.login(n.data.data),o.setStorageSync("uuid",a.uuid)},fail:function(n){console.log(e(n," at pages\\login\\index.vue:108"))},complete:function(){}})},fail:function(n){console.log(e("getDeviceInfo failed: "+JSON.stringify(n)," at pages\\login\\index.vue:114"))}})}})};n.default=c}).call(this,t("0de9")["default"],t("6e42")["default"])},"8e9f":function(e,n,t){"use strict";t.r(n);var o=t("7346"),i=t.n(o);for(var u in o)"default"!==u&&function(e){t.d(n,e,function(){return o[e]})}(u);n["default"]=i.a},b862:function(e,n,t){},c5f3:function(e,n,t){"use strict";(function(e){t("1567"),t("921b");o(t("66fd"));var n=o(t("6492"));function o(e){return e&&e.__esModule?e:{default:e}}e(n.default)}).call(this,t("6e42")["createPage"])}},[["c5f3","common/runtime","common/vendor"]]]);