(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/HM-search/HM-search"],{"0181":function(t,e,o){},"18a7":function(t,e,o){"use strict";var a=o("0181"),n=o.n(a);n.a},"1fe7":function(t,e,o){"use strict";o.r(e);var a=o("5ada"),n=o.n(a);for(var r in a)"default"!==r&&function(t){o.d(e,t,function(){return a[t]})}(r);e["default"]=n.a},"2fb8":function(t,e,o){"use strict";(function(t){o("1567"),o("921b");a(o("66fd"));var e=a(o("8313"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,o("6e42")["createPage"])},"4f9f":function(t,e,o){"use strict";var a,n=function(){var t=this,e=t.$createElement;t._self._c},r=[];o.d(e,"b",function(){return n}),o.d(e,"c",function(){return r}),o.d(e,"a",function(){return a})},"5ada":function(t,e,o){"use strict";(function(t,a){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=function(){return o.e("components/mehaotian-search-revision/mehaotian-search-revision").then(o.bind(null,"7516"))},r=function(){return o.e("components/jobs-item").then(o.bind(null,"7d47"))},s={data:function(){return{isNoData:!1,noDataText:"",listIsStyle:"vertical",jobsList:[],defaultKeyword:"",keyword:"",oldKeywordList:[],hotKeywordList:[],keywordList:[],forbid:"",isShowKeywordList:!1}},onLoad:function(){this.init()},components:{mSearch:n,jobsItem:r},methods:{init:function(){this.loadDefaultKeyword(),this.loadOldKeyword(),this.loadHotKeyword()},blur:function(){t.hideKeyboard()},loadDefaultKeyword:function(){this.defaultKeyword="搜索"},loadOldKeyword:function(){var e=this;t.getStorage({key:"OldKeys",success:function(t){var o=JSON.parse(t.data);e.oldKeywordList=o}})},loadHotKeyword:function(){this.hotKeywordList=["键盘","鼠标","显示器","电脑主机","蓝牙音箱","笔记本电脑","鼠标垫","USB","USB3.0"]},inputChange:function(e){var o=this,a=e.detail?e.detail.value:e;if(!a)return this.keywordList=[],void(this.isShowKeywordList=!1);this.isShowKeywordList=!0,t.request({url:"https://suggest.taobao.com/sug?code=utf-8&q="+a,success:function(t){o.keywordList=o.drawCorrelativeKeyword(t.data.result,a)}})},drawCorrelativeKeyword:function(t,e){for(var o=t.length,a=[],n=0;n<o;n++){var r=t[n],s=r[0].replace(e,"<span style='color: #9f9f9f;'>"+e+"</span>");s="<div>"+s+"</div>";var i={keyword:r[0],htmlStr:s};a.push(i)}return a},setkeyword:function(t){this.keyword=t.keyword},oldDelete:function(){var e=this;t.showModal({content:"确定清除历史搜索记录？",success:function(o){o.confirm?(console.log(a("用户点击确定"," at pages\\HM-search\\HM-search.vue:172")),e.oldKeywordList=[],t.removeStorage({key:"OldKeys"})):o.cancel&&console.log(a("用户点击取消"," at pages\\HM-search\\HM-search.vue:178"))}})},hotToggle:function(){this.forbid=this.forbid?"":"_forbid"},doSearch:function(t){var e=this;t=t||(this.keyword?this.keyword:this.defaultKeyword),this.keyword=t,this.saveKeyword(t),this.$http.get("/v1/job/search",{params:{city:this.$store.getters.getCity,search:t}}).then(function(t){var o=t.data.data;o.length>0?(e.jobsList=o,e.isNoData=!1):(e.jobsList=[],e.isNoData=!0,e.noDataText="未搜索到相应职务，快去查看更多兼职")}).catch(function(t){})},saveKeyword:function(e){var o=this;t.getStorage({key:"OldKeys",success:function(n){console.log(a(n.data," at pages\\HM-search\\HM-search.vue:222"));var r=JSON.parse(n.data),s=r.indexOf(e);-1==s?r.unshift(e):(r.splice(s,1),r.unshift(e)),r.length>10&&r.pop(),t.setStorage({key:"OldKeys",data:JSON.stringify(r)}),o.oldKeywordList=r},fail:function(a){var n=[e];t.setStorage({key:"OldKeys",data:JSON.stringify(n)}),o.oldKeywordList=n}})}}};e.default=s}).call(this,o("6e42")["default"],o("0de9")["default"])},8313:function(t,e,o){"use strict";o.r(e);var a=o("4f9f"),n=o("1fe7");for(var r in n)"default"!==r&&function(t){o.d(e,t,function(){return n[t]})}(r);o("18a7");var s,i=o("f0c5"),d=Object(i["a"])(n["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],s);e["default"]=d.exports}},[["2fb8","common/runtime","common/vendor"]]]);