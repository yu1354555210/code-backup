(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/pd-list"],{"71ff":function(t,n,e){"use strict";var u=function(){var t=this,n=t.$createElement;t._self._c},i=[];e.d(n,"a",function(){return u}),e.d(n,"b",function(){return i})},"89ef":function(t,n,e){"use strict";e.r(n);var u=e("71ff"),i=e("9086");for(var r in i)"default"!==r&&function(t){e.d(n,t,function(){return i[t]})}(r);var a=e("2877"),o=Object(a["a"])(i["default"],u["a"],u["b"],!1,null,null,null);n["default"]=o.exports},9086:function(t,n,e){"use strict";e.r(n);var u=e("c85f"),i=e.n(u);for(var r in u)"default"!==r&&function(t){e.d(n,t,function(){return u[t]})}(r);n["default"]=i.a},c85f:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={props:{list:{type:Array,default:function(){return[]}},isShowBottom:{type:Boolean,default:function(){return!1}},isShowFinish:{type:Boolean,default:function(){return!1}},btnText:{type:String,default:function(){return"去抽奖"}}},methods:{emptyClick:function(n){t.switchTab({url:"../index/index"})},toAward:function(n){var e="../award/index";this.isShowFinish&&(e="../award-finish/index"),t.navigateTo({url:"".concat(e,"?id=").concat(n)})}}};n.default=e}).call(this,e("543d")["default"])}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/pd-list-create-component',
    {
        'components/pd-list-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("89ef"))
        })
    },
    [['components/pd-list-create-component']]
]);                
