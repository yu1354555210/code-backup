(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/all-award/index"],{"0728":function(n,t,e){"use strict";e.r(t);var i=e("8044"),o=e.n(i);for(var a in i)"default"!==a&&function(n){e.d(t,n,function(){return i[n]})}(a);t["default"]=o.a},"0d31":function(n,t,e){},"1d5b":function(n,t,e){"use strict";var i=function(){var n=this,t=n.$createElement;n._self._c},o=[];e.d(t,"a",function(){return i}),e.d(t,"b",function(){return o})},"38aa":function(n,t,e){"use strict";var i=e("0d31"),o=e.n(i);o.a},"4f60":function(n,t,e){"use strict";(function(n){e("c81d"),e("921b");i(e("66fd"));var t=i(e("6b59"));function i(n){return n&&n.__esModule?n:{default:n}}n(t.default)}).call(this,e("543d")["createPage"])},"6b59":function(n,t,e){"use strict";e.r(t);var i=e("1d5b"),o=e("0728");for(var a in o)"default"!==a&&function(n){e.d(t,n,function(){return o[n]})}(a);e("38aa");var c=e("2877"),u=Object(c["a"])(o["default"],i["a"],i["b"],!1,null,null,null);t["default"]=u.exports},8044:function(n,t,e){"use strict";(function(n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=function(){return Promise.all([e.e("common/vendor"),e.e("components/mescroll-uni/mescroll-uni")]).then(e.bind(null,"a07d"))},o=function(){return e.e("components/pd-list").then(e.bind(null,"89ef"))},a={components:{MescrollUni:i,PdList:o},data:function(){return{mescroll:null,upOption:{noMoreSize:4,empty:{use:!0,icon:"../../static/images/no-data.png",tip:"抽奖尚在进行中，大奖在等你哦！",btnText:"去抽奖",fixed:!0,top:"0",zIndex:9999},textNoMore:"已全部加载"},pdList:[],tabType:0,isShowFinish:!1,apiName:"my_going_choujiang_list"}},onShow:function(){this.mescroll.resetUpScroll()},methods:{mescrollInit:function(n){this.mescroll=n},upCallback:function(t){var e=this,i=t.num,o=t.size;n.request({url:getApp().globalData.apiUrl+"api/pchoujiang/api",method:"POST",header:{"content-type":"application/x-www-form-urlencoded"},data:{page:i,pageSize:o,api_name:this.apiName,token:n.getStorageSync("token")},success:function(n){console.log(n.data);var i=n.data.data;n.xxx,n.xxx,n.xxx;1==t.num&&(e.pdList=[]),e.pdList=e.pdList.concat(i),t.endSuccess(i.length),e.$nextTick(function(){t.endSuccess(i.length)})},fail:function(){t.endErr()}})},emptyClick:function(t){n.switchTab({url:"../index/index"})},changeTab:function(n){this.tabType!==n&&(this.tabType=n,this.isShowFinish=!1,this.apiName="my_going_choujiang_list",1==n&&(this.isShowFinish=!0,this.apiName="my_over_choujiang_list"),this.pdList=[],this.mescroll.resetUpScroll())}}};t.default=a}).call(this,e("543d")["default"])}},[["4f60","common/runtime","common/vendor"]]]);