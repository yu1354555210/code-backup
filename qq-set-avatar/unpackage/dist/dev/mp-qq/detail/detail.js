(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["detail/detail"],{215:
/*!*****************************************************************************!*\
  !*** D:/daima/2020/uniapp/qq-set-avatar/main.js?{"page":"detail%2Fdetail"} ***!
  \*****************************************************************************/
/*! no static exports found */function(t,e,n){"use strict";(function(t){n(/*! uni-pages */4);o(n(/*! vue */2));var e=o(n(/*! ./detail/detail.vue */216));function o(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n(/*! ./node_modules/@dcloudio/uni-mp-qq/dist/index.js */1)["createPage"])},216:
/*!************************************************************!*\
  !*** D:/daima/2020/uniapp/qq-set-avatar/detail/detail.vue ***!
  \************************************************************/
/*! no static exports found */function(t,e,n){"use strict";n.r(e);var o=n(/*! ./detail.vue?vue&type=template&id=574365b1& */217),i=n(/*! ./detail.vue?vue&type=script&lang=js& */219);for(var c in i)"default"!==c&&function(t){n.d(e,t,(function(){return i[t]}))}(c);n(/*! ./detail.vue?vue&type=style&index=0&lang=stylus& */221);var s,a=n(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */12),u=Object(a["default"])(i["default"],o["render"],o["staticRenderFns"],!1,null,null,null,!1,o["components"],s);u.options.__file="detail/detail.vue",e["default"]=u.exports},217:
/*!*******************************************************************************************!*\
  !*** D:/daima/2020/uniapp/qq-set-avatar/detail/detail.vue?vue&type=template&id=574365b1& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */function(t,e,n){"use strict";n.r(e);var o=n(/*! -!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./detail.vue?vue&type=template&id=574365b1& */218);n.d(e,"render",(function(){return o["render"]})),n.d(e,"staticRenderFns",(function(){return o["staticRenderFns"]})),n.d(e,"recyclableRender",(function(){return o["recyclableRender"]})),n.d(e,"components",(function(){return o["components"]}))},218:
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/daima/2020/uniapp/qq-set-avatar/detail/detail.vue?vue&type=template&id=574365b1& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */function(t,e,n){"use strict";var o;n.r(e),n.d(e,"render",(function(){return i})),n.d(e,"staticRenderFns",(function(){return s})),n.d(e,"recyclableRender",(function(){return c})),n.d(e,"components",(function(){return o}));var i=function(){var t=this,e=t.$createElement;t._self._c},c=!1,s=[];i._withStripped=!0},219:
/*!*************************************************************************************!*\
  !*** D:/daima/2020/uniapp/qq-set-avatar/detail/detail.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! no static exports found */function(t,e,n){"use strict";n.r(e);var o=n(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./detail.vue?vue&type=script&lang=js& */220),i=n.n(o);for(var c in o)"default"!==c&&function(t){n.d(e,t,(function(){return o[t]}))}(c);e["default"]=i.a},220:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/daima/2020/uniapp/qq-set-avatar/detail/detail.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={data:function(){return{ewmImg:"",baseImg:"",openSettingBtnHidden:!0}},onLoad:function(t){console.log(t),this.ewmImg=t.aesUrl,this.baseImg=t.baseUrl},methods:{handleSetting:function(t){t.detail.authSetting["scope.writePhotosAlbum"]?this.openSettingBtnHidden=!0:this.openSettingBtnHidden=!1},saveEwm:function(e){var n=this;t.getSetting({success:function(e){e.authSetting["scope.writePhotosAlbum"]?n.saveImgToLocal():t.authorize({scope:"scope.writePhotosAlbum",success:function(){n.saveImgToLocal()},fail:function(){n.openSettingBtnHidden=!1}})}})},saveImgToLocal:function(e){var n=this;t.showModal({title:"提示",content:"确定保存到相册吗",success:function(e){e.confirm?t.downloadFile({url:n.ewmImg,success:function(e){200===e.statusCode&&t.saveImageToPhotosAlbum({filePath:e.tempFilePath,success:function(){t.showToast({title:"保存成功",icon:"none"})},fail:function(){t.showToast({title:"保存失败",icon:"none"})}})}}):e.cancel}})},setAvatar:function(){var e=this;t.downloadFile({url:e.ewmImg,success:function(e){200===e.statusCode&&(console.log(e.tempFilePath),qq.setCustomDress({action:"uploadAvatar",path:e.tempFilePath,success:function(e){t.showToast({title:"设置成功",icon:"none"}),setTimeout((function(){t.navigateBack()}),1e3)},fail:function(e){console.log(e),t.showToast({title:"设置失败",icon:"none"})}}))}})},upServerImage:function(){var e=this;t.request({url:this.apiUrl+"/cp_v1/img/set",method:"POST",header:{"content-type":"application/x-www-form-urlencoded"},data:{url:this.baseImg},success:function(n){var o=n.data;0==o.errCode?e.setAvatar():t.showToast({title:n.errMsg})},fail:function(){},complete:function(){}})}}};e.default=n}).call(this,n(/*! ./node_modules/@dcloudio/uni-mp-qq/dist/index.js */1)["default"])},221:
/*!************************************************************************************************!*\
  !*** D:/daima/2020/uniapp/qq-set-avatar/detail/detail.vue?vue&type=style&index=0&lang=stylus& ***!
  \************************************************************************************************/
/*! no static exports found */function(t,e,n){"use strict";n.r(e);var o=n(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--11-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--11-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--11-oneOf-1-2!./node_modules/postcss-loader/src??ref--11-oneOf-1-3!./node_modules/stylus-loader??ref--11-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--11-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./detail.vue?vue&type=style&index=0&lang=stylus& */222),i=n.n(o);for(var c in o)"default"!==c&&function(t){n.d(e,t,(function(){return o[t]}))}(c);e["default"]=i.a},222:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--11-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--11-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--11-oneOf-1-2!./node_modules/postcss-loader/src??ref--11-oneOf-1-3!./node_modules/stylus-loader??ref--11-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--11-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/daima/2020/uniapp/qq-set-avatar/detail/detail.vue?vue&type=style&index=0&lang=stylus& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */function(t,e,n){}},[[215,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVuaS1hcHA6Ly8vbWFpbi5qcyIsIndlYnBhY2s6Ly8vRDovZGFpbWEvMjAyMC91bmlhcHAvcXEtc2V0LWF2YXRhci9kZXRhaWwvZGV0YWlsLnZ1ZT9mMzUzIiwid2VicGFjazovLy9EOi9kYWltYS8yMDIwL3VuaWFwcC9xcS1zZXQtYXZhdGFyL2RldGFpbC9kZXRhaWwudnVlPzYxMzIiLCJ3ZWJwYWNrOi8vL0Q6L2RhaW1hLzIwMjAvdW5pYXBwL3FxLXNldC1hdmF0YXIvZGV0YWlsL2RldGFpbC52dWU/MzYyYSIsIndlYnBhY2s6Ly8vRDovZGFpbWEvMjAyMC91bmlhcHAvcXEtc2V0LWF2YXRhci9kZXRhaWwvZGV0YWlsLnZ1ZT9mODA4IiwidW5pLWFwcDovLy9kZXRhaWwvZGV0YWlsLnZ1ZSIsIndlYnBhY2s6Ly8vRDovZGFpbWEvMjAyMC91bmlhcHAvcXEtc2V0LWF2YXRhci9kZXRhaWwvZGV0YWlsLnZ1ZT8wOTdmIl0sIm5hbWVzIjpbImNyZWF0ZVBhZ2UiLCJQYWdlIiwicmVuZGVyanMiLCJjb21wb25lbnQiLCJvcHRpb25zIiwiX19maWxlIiwiY29tcG9uZW50cyIsInJlbmRlciIsIl92bSIsInRoaXMiLCJfaCIsIiRjcmVhdGVFbGVtZW50IiwiX3NlbGYiLCJfYyIsInJlY3ljbGFibGVSZW5kZXIiLCJzdGF0aWNSZW5kZXJGbnMiLCJfd2l0aFN0cmlwcGVkIl0sIm1hcHBpbmdzIjoiOzs7O3dFQUFBLHFCQUNBLHNCQUNBLHNDLG1EQUNBQSxFQUFXQyxhOzs7OzJEQ0hYLDhRQUNJQyxFQURKLGlIQVNJQyxFQUFZLHFCQUNkLGFBQ0EsWUFDQSxzQkFDQSxFQUNBLEtBQ0EsS0FDQSxNQUNBLEVBQ0EsZ0JBQ0FELEdBR0ZDLEVBQVVDLFFBQVFDLE9BQVMsb0JBQ1osYUFBQUYsRTs7OzsyR0N2QmYsbXpCOzs7OzJHQ0FBLElBQUlHLEVBQUosMExBQ0EsSUFBSUMsRUFBUyxXQUNYLElBQUlDLEVBQU1DLEtBQ05DLEVBQUtGLEVBQUlHLGVBQ0pILEVBQUlJLE1BQU1DLElBRWpCQyxHQUFtQixFQUNuQkMsRUFBa0IsR0FDdEJSLEVBQU9TLGVBQWdCLEc7Ozs7MkRDUnZCLHVlQUF1cUIsZUFBRyxHOzs7O2dKQ2UxcUIsQ0FDQSxLQURBLFdBRUEsT0FDQSxVQUNBLFdBQ0EsMEJBR0EsT0FSQSxTQVFBLEdBQ0EsZUFDQSxxQkFDQSx3QkFFQSxTQUNBLGNBREEsU0FDQSxHQUNBLCtDQUdBLDZCQUZBLDhCQUtBLG9CQUVBLFdBQ0EsY0FDQSxRQURBLFNBQ0EsR0FDQSx3Q0FjQSxtQkFiQSxhQUNBLCtCQUNBLFFBRkEsV0FJQSxvQkFFQSxLQU5BLFdBUUEsaUNBVUEsMkJBQ0EsV0FDQSxhQUNBLFdBQ0EsbUJBQ0Esb0JBQ0EsVUFDQSxnQkFDQSxhQUNBLG9CQUNBLG9CQUNBLDBCQUNBLHdCQUNBLG1CQUNBLGFBQ0EsYUFDQSxlQUdBLGdCQUNBLGFBQ0EsYUFDQSxvQkFPQSxhQUtBLFVBbEVBLFdBbUVBLFdBQ0EsZ0JBQ0EsYUFDQSxvQkFDQSxxQkFDQSw0QkFDQSxtQkFDQSxzQkFDQSxvQkFDQSxRQUhBLFNBR0EsR0FDQSxhQUNBLGFBQ0EsY0FFQSx1QkFDQSxtQkFDQSxNQUVBLEtBWkEsU0FZQSxHQUNBLGVBQ0EsYUFDQSxhQUNBLHNCQVFBLGNBakdBLFdBaUdBLFdBQ0EsV0FDQSxpQ0FDQSxjQUNBLFFBQ0Esb0RBRUEsTUFDQSxrQkFFQSxvQkFDQSxhQUNBLGFBQ0EsY0FFQSxhQUNBLGtCQUlBLGtCQUNBLDJCOzs7OzJEQ2xKQSxxMEJBQTJ0QyxlQUFHLEciLCJmaWxlIjoiZGV0YWlsL2RldGFpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAndW5pLXBhZ2VzJztcbmltcG9ydCBWdWUgZnJvbSAndnVlJ1xuaW1wb3J0IFBhZ2UgZnJvbSAnLi9kZXRhaWwvZGV0YWlsLnZ1ZSdcbmNyZWF0ZVBhZ2UoUGFnZSkiLCJpbXBvcnQgeyByZW5kZXIsIHN0YXRpY1JlbmRlckZucywgcmVjeWNsYWJsZVJlbmRlciwgY29tcG9uZW50cyB9IGZyb20gXCIuL2RldGFpbC52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9NTc0MzY1YjEmXCJcbnZhciByZW5kZXJqc1xuaW1wb3J0IHNjcmlwdCBmcm9tIFwiLi9kZXRhaWwudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzJlwiXG5leHBvcnQgKiBmcm9tIFwiLi9kZXRhaWwudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzJlwiXG5pbXBvcnQgc3R5bGUwIGZyb20gXCIuL2RldGFpbC52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXN0eWx1cyZcIlxuXG5cbi8qIG5vcm1hbGl6ZSBjb21wb25lbnQgKi9cbmltcG9ydCBub3JtYWxpemVyIGZyb20gXCIhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXEBkY2xvdWRpb1xcXFx2dWUtY2xpLXBsdWdpbi11bmlcXFxccGFja2FnZXNcXFxcdnVlLWxvYWRlclxcXFxsaWJcXFxccnVudGltZVxcXFxjb21wb25lbnROb3JtYWxpemVyLmpzXCJcbnZhciBjb21wb25lbnQgPSBub3JtYWxpemVyKFxuICBzY3JpcHQsXG4gIHJlbmRlcixcbiAgc3RhdGljUmVuZGVyRm5zLFxuICBmYWxzZSxcbiAgbnVsbCxcbiAgbnVsbCxcbiAgbnVsbCxcbiAgZmFsc2UsXG4gIGNvbXBvbmVudHMsXG4gIHJlbmRlcmpzXG4pXG5cbmNvbXBvbmVudC5vcHRpb25zLl9fZmlsZSA9IFwiZGV0YWlsL2RldGFpbC52dWVcIlxuZXhwb3J0IGRlZmF1bHQgY29tcG9uZW50LmV4cG9ydHMiLCJleHBvcnQgKiBmcm9tIFwiLSFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcQGRjbG91ZGlvXFxcXHZ1ZS1jbGktcGx1Z2luLXVuaVxcXFxwYWNrYWdlc1xcXFx2dWUtbG9hZGVyXFxcXGxpYlxcXFxsb2FkZXJzXFxcXHRlbXBsYXRlTG9hZGVyLmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXEBkY2xvdWRpb1xcXFx2dWUtY2xpLXBsdWdpbi11bmlcXFxccGFja2FnZXNcXFxcd2VicGFjay1wcmVwcm9jZXNzLWxvYWRlclxcXFxpbmRleC5qcz8/cmVmLS0xNi0wIUU6XFxcXGhidWlsZGVyWFxcXFxIQnVpbGRlclhcXFxccGx1Z2luc1xcXFx1bmlhcHAtY2xpXFxcXG5vZGVfbW9kdWxlc1xcXFxAZGNsb3VkaW9cXFxcd2VicGFjay11bmktbXAtbG9hZGVyXFxcXGxpYlxcXFx0ZW1wbGF0ZS5qcyFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcQGRjbG91ZGlvXFxcXHZ1ZS1jbGktcGx1Z2luLXVuaVxcXFxwYWNrYWdlc1xcXFx3ZWJwYWNrLXVuaS1hcHAtbG9hZGVyXFxcXHBhZ2UtbWV0YS5qcyFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcQGRjbG91ZGlvXFxcXHZ1ZS1jbGktcGx1Z2luLXVuaVxcXFxwYWNrYWdlc1xcXFx2dWUtbG9hZGVyXFxcXGxpYlxcXFxpbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIUU6XFxcXGhidWlsZGVyWFxcXFxIQnVpbGRlclhcXFxccGx1Z2luc1xcXFx1bmlhcHAtY2xpXFxcXG5vZGVfbW9kdWxlc1xcXFxAZGNsb3VkaW9cXFxcd2VicGFjay11bmktbXAtbG9hZGVyXFxcXGxpYlxcXFxzdHlsZS5qcyEuL2RldGFpbC52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9NTc0MzY1YjEmXCIiLCJ2YXIgY29tcG9uZW50c1xudmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgX3ZtID0gdGhpc1xuICB2YXIgX2ggPSBfdm0uJGNyZWF0ZUVsZW1lbnRcbiAgdmFyIF9jID0gX3ZtLl9zZWxmLl9jIHx8IF9oXG59XG52YXIgcmVjeWNsYWJsZVJlbmRlciA9IGZhbHNlXG52YXIgc3RhdGljUmVuZGVyRm5zID0gW11cbnJlbmRlci5fd2l0aFN0cmlwcGVkID0gdHJ1ZVxuXG5leHBvcnQgeyByZW5kZXIsIHN0YXRpY1JlbmRlckZucywgcmVjeWNsYWJsZVJlbmRlciwgY29tcG9uZW50cyB9IiwiaW1wb3J0IG1vZCBmcm9tIFwiLSFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcYmFiZWwtbG9hZGVyXFxcXGxpYlxcXFxpbmRleC5qcyFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcQGRjbG91ZGlvXFxcXHZ1ZS1jbGktcGx1Z2luLXVuaVxcXFxwYWNrYWdlc1xcXFx3ZWJwYWNrLXByZXByb2Nlc3MtbG9hZGVyXFxcXGluZGV4LmpzPz9yZWYtLTEyLTEhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXEBkY2xvdWRpb1xcXFx3ZWJwYWNrLXVuaS1tcC1sb2FkZXJcXFxcbGliXFxcXHNjcmlwdC5qcyFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcQGRjbG91ZGlvXFxcXHZ1ZS1jbGktcGx1Z2luLXVuaVxcXFxwYWNrYWdlc1xcXFx2dWUtbG9hZGVyXFxcXGxpYlxcXFxpbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIUU6XFxcXGhidWlsZGVyWFxcXFxIQnVpbGRlclhcXFxccGx1Z2luc1xcXFx1bmlhcHAtY2xpXFxcXG5vZGVfbW9kdWxlc1xcXFxAZGNsb3VkaW9cXFxcd2VicGFjay11bmktbXAtbG9hZGVyXFxcXGxpYlxcXFxzdHlsZS5qcyEuL2RldGFpbC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anMmXCI7IGV4cG9ydCBkZWZhdWx0IG1vZDsgZXhwb3J0ICogZnJvbSBcIi0hRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXGJhYmVsLWxvYWRlclxcXFxsaWJcXFxcaW5kZXguanMhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXEBkY2xvdWRpb1xcXFx2dWUtY2xpLXBsdWdpbi11bmlcXFxccGFja2FnZXNcXFxcd2VicGFjay1wcmVwcm9jZXNzLWxvYWRlclxcXFxpbmRleC5qcz8/cmVmLS0xMi0xIUU6XFxcXGhidWlsZGVyWFxcXFxIQnVpbGRlclhcXFxccGx1Z2luc1xcXFx1bmlhcHAtY2xpXFxcXG5vZGVfbW9kdWxlc1xcXFxAZGNsb3VkaW9cXFxcd2VicGFjay11bmktbXAtbG9hZGVyXFxcXGxpYlxcXFxzY3JpcHQuanMhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXEBkY2xvdWRpb1xcXFx2dWUtY2xpLXBsdWdpbi11bmlcXFxccGFja2FnZXNcXFxcdnVlLWxvYWRlclxcXFxsaWJcXFxcaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcQGRjbG91ZGlvXFxcXHdlYnBhY2stdW5pLW1wLWxvYWRlclxcXFxsaWJcXFxcc3R5bGUuanMhLi9kZXRhaWwudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzJlwiIiwiPHRlbXBsYXRlPlxyXG5cdDx2aWV3IGNsYXNzPVwiY29udGVudFwiPlxyXG5cdFx0PHZpZXcgY2xhc3M9XCJkZXRhaWwtYXZhdGFyXCI+XHJcblx0XHRcdDx2aWV3IGNsYXNzPVwiYXZhdGFyXCI+PGltYWdlIDpzcmM9XCJld21JbWdcIiBtb2RlPVwiYXNwZWN0RmlsbFwiPjwvaW1hZ2U+PC92aWV3PlxyXG5cdFx0XHQ8dmlldyBjbGFzcz1cImF2YXRhciBhdmF0YXItcmFkaXVzXCI+PGltYWdlIDpzcmM9XCJld21JbWdcIiBtb2RlPVwiYXNwZWN0RmlsbFwiPjwvaW1hZ2U+PC92aWV3PlxyXG5cdFx0PC92aWV3PlxyXG5cdFx0PHZpZXcgY2xhc3M9XCJkZXRhaWwtYnRuXCI+XHJcblx0XHRcdDx2aWV3IHYtaWY9XCJvcGVuU2V0dGluZ0J0bkhpZGRlblwiIGNsYXNzPVwiYnRuXCIgQGNsaWNrPVwic2F2ZUV3bVwiPjxpbWFnZSBzcmM9XCIuLi9zdGF0aWMvc2F2ZS5wbmdcIiBtb2RlPVwiYXNwZWN0RmlsbFwiPjwvaW1hZ2U+PC92aWV3PlxyXG5cdFx0XHQ8YnV0dG9uIHYtZWxzZSBjbGFzcz1cImJ0blwiIGhvdmVyLWNsYXNzPVwibm9uZVwiIG9wZW4tdHlwZT1cIm9wZW5TZXR0aW5nXCIgQG9wZW5zZXR0aW5nPVwiaGFuZGxlU2V0dGluZ1wiPjxpbWFnZSBzcmM9XCIuLi9zdGF0aWMvc2F2ZS5wbmdcIiBtb2RlPVwiYXNwZWN0RmlsbFwiPjwvaW1hZ2U+PC9idXR0b24+XHJcblx0XHRcdDxidXR0b24gY2xhc3M9XCJidG5cIiBAY2xpY2s9XCJ1cFNlcnZlckltYWdlXCIgaG92ZXItY2xhc3M9XCJub25lXCI+PGltYWdlIHNyYz1cIi4uL3N0YXRpYy9zZXQucG5nXCIgbW9kZT1cImFzcGVjdEZpbGxcIj48L2ltYWdlPjwvYnV0dG9uPlxyXG5cdFx0PC92aWV3PlxyXG5cdDwvdmlldz5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuXHRkYXRhKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZXdtSW1nOiAnJyxcclxuXHRcdFx0YmFzZUltZzogJycsXHJcblx0XHRcdG9wZW5TZXR0aW5nQnRuSGlkZGVuOiB0cnVlIC8v5piv5ZCm5o6I5p2DXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0b25Mb2FkKG9wdGlvbnMpIHtcclxuXHRcdGNvbnNvbGUubG9nKG9wdGlvbnMpO1xyXG5cdFx0dGhpcy5ld21JbWcgPSBvcHRpb25zLmFlc1VybDtcclxuXHRcdHRoaXMuYmFzZUltZyA9IG9wdGlvbnMuYmFzZVVybDtcclxuXHR9LFxyXG5cdG1ldGhvZHM6IHtcclxuXHRcdGhhbmRsZVNldHRpbmcoZSkge1xyXG5cdFx0XHRpZiAoIWUuZGV0YWlsLmF1dGhTZXR0aW5nWydzY29wZS53cml0ZVBob3Rvc0FsYnVtJ10pIHtcclxuXHRcdFx0XHR0aGlzLm9wZW5TZXR0aW5nQnRuSGlkZGVuID0gZmFsc2U7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5vcGVuU2V0dGluZ0J0bkhpZGRlbiA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRzYXZlRXdtOiBmdW5jdGlvbihlKSB7XHJcblx0XHRcdC8v6I635Y+W55u45YaM5o6I5p2DXHJcblx0XHRcdHZhciBfc2VsZiA9IHRoaXM7XHJcblx0XHRcdHVuaS5nZXRTZXR0aW5nKHtcclxuXHRcdFx0XHRzdWNjZXNzKHJlcykge1xyXG5cdFx0XHRcdFx0aWYgKCFyZXMuYXV0aFNldHRpbmdbJ3Njb3BlLndyaXRlUGhvdG9zQWxidW0nXSkge1xyXG5cdFx0XHRcdFx0XHR1bmkuYXV0aG9yaXplKHtcclxuXHRcdFx0XHRcdFx0XHRzY29wZTogJ3Njb3BlLndyaXRlUGhvdG9zQWxidW0nLFxyXG5cdFx0XHRcdFx0XHRcdHN1Y2Nlc3MoKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+i/memHjOaYr+eUqOaIt+WQjOaEj+aOiOadg+WQjueahOWbnuiwg1xyXG5cdFx0XHRcdFx0XHRcdFx0X3NlbGYuc2F2ZUltZ1RvTG9jYWwoKTtcclxuXHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdGZhaWwoKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+i/memHjOaYr+eUqOaIt+aLkue7neaOiOadg+WQjueahOWbnuiwg1xyXG5cdFx0XHRcdFx0XHRcdFx0X3NlbGYub3BlblNldHRpbmdCdG5IaWRkZW4gPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly/nlKjmiLflt7Lnu4/mjojmnYPov4fkuoZcclxuXHRcdFx0XHRcdFx0X3NlbGYuc2F2ZUltZ1RvTG9jYWwoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdHNhdmVJbWdUb0xvY2FsOiBmdW5jdGlvbihlKSB7XHJcblx0XHRcdGxldCBfc2VsZiA9IHRoaXM7XHJcblx0XHRcdHVuaS5zaG93TW9kYWwoe1xyXG5cdFx0XHRcdHRpdGxlOiAn5o+Q56S6JyxcclxuXHRcdFx0XHRjb250ZW50OiAn56Gu5a6a5L+d5a2Y5Yiw55u45YaM5ZCXJyxcclxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHRcdGlmIChyZXMuY29uZmlybSkge1xyXG5cdFx0XHRcdFx0XHR1bmkuZG93bmxvYWRGaWxlKHtcclxuXHRcdFx0XHRcdFx0XHR1cmw6IF9zZWxmLmV3bUltZywgLy/lm77niYflnLDlnYBcclxuXHRcdFx0XHRcdFx0XHRzdWNjZXNzOiByZXMgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5zdGF0dXNDb2RlID09PSAyMDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dW5pLnNhdmVJbWFnZVRvUGhvdG9zQWxidW0oe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZpbGVQYXRoOiByZXMudGVtcEZpbGVQYXRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pLnNob3dUb2FzdCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAn5L+d5a2Y5oiQ5YqfJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogJ25vbmUnXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZhaWw6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pLnNob3dUb2FzdCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAn5L+d5a2Y5aSx6LSlJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWNvbjogJ25vbmUnXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHJlcy5jYW5jZWwpIHtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdHNldEF2YXRhcigpIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcztcclxuXHRcdFx0dW5pLmRvd25sb2FkRmlsZSh7XHJcblx0XHRcdFx0dXJsOiBfc2VsZi5ld21JbWcsIC8v5Zu+54mH5Zyw5Z2AXHJcblx0XHRcdFx0c3VjY2VzczogcmVzID0+IHtcclxuXHRcdFx0XHRcdGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlcy50ZW1wRmlsZVBhdGgpO1xyXG5cdFx0XHRcdFx0XHRxcS5zZXRDdXN0b21EcmVzcyh7XHJcblx0XHRcdFx0XHRcdCAgIGFjdGlvbjpcInVwbG9hZEF2YXRhclwiLFxyXG5cdFx0XHRcdFx0XHQgICBwYXRoOiByZXMudGVtcEZpbGVQYXRoLFxyXG5cdFx0XHRcdFx0XHQgICBzdWNjZXNzKHJlcyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHVuaS5zaG93VG9hc3Qoe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAn6K6+572u5oiQ5YqfJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpY29uOiAnbm9uZSdcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR1bmkubmF2aWdhdGVCYWNrKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0sMTAwMCk7XHJcblx0XHRcdFx0XHRcdCAgIH0sXHJcblx0XHRcdFx0XHRcdCAgIGZhaWwocmVzKXtcclxuXHRcdFx0XHRcdFx0ICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dW5pLnNob3dUb2FzdCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6ICforr7nva7lpLHotKUnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGljb246ICdub25lJ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0ICAgfVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0dXBTZXJ2ZXJJbWFnZSgpe1xyXG5cdFx0XHR1bmkucmVxdWVzdCh7XHJcblx0XHRcdFx0dXJsOiB0aGlzLmFwaVVybCArICcvY3BfdjEvaW1nL3NldCcsXHJcblx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdFx0aGVhZGVyOntcclxuXHRcdFx0XHRcdCdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJywgXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHR1cmw6IHRoaXMuYmFzZUltZ1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0c3VjY2VzczogcmVzID0+IHtcclxuXHRcdFx0XHRcdGxldCBkYXRhID0gcmVzLmRhdGE7XHJcblx0XHRcdFx0XHRpZihkYXRhLmVyckNvZGUgPT0gMCl7XHJcblx0XHRcdFx0XHRcdHRoaXMuc2V0QXZhdGFyKCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0dW5pLnNob3dUb2FzdCh7XHJcblx0XHRcdFx0XHRcdFx0dGl0bGU6IHJlcy5lcnJNc2dcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGZhaWw6ICgpID0+IHt9LFxyXG5cdFx0XHRcdGNvbXBsZXRlOiAoKSA9PiB7fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cbi5jb250ZW50XG5cdHBhZGRpbmcgMCAzN3JweFxuLmRldGFpbC1hdmF0YXJcblx0bWFyZ2luIDIwMHJweCAwIDIwMHJweFxuXHRkaXNwbGF5IGZsZXhcblx0anVzdGlmeS1jb250ZW50IHNwYWNlLWJldHdlZW5cbi5hdmF0YXJcblx0aW1hZ2Vcblx0XHR3aWR0aCAzMjBycHhcblx0XHRoZWlnaHQgMzIwcnB4XG5cdFx0Ym9yZGVyLXJhZGl1cyAyMHJweFxuXHRcdGJvcmRlciAycHggc29saWQgI0ZDNTU3NVxuXHQmLmF2YXRhci1yYWRpdXNcblx0XHRpbWFnZVxuXHRcdFx0Ym9yZGVyLXJhZGl1cyA1MCVcbi5kZXRhaWwtYnRuXG5cdGRpc3BsYXkgZmxleFxuXHRqdXN0aWZ5LWNvbnRlbnQgc3BhY2UtYmV0d2VlblxuXHQuYnRuXG5cdFx0cGFkZGluZyAwXG5cdGltYWdlXG5cdFx0d2lkdGggMzAwcnB4XG5cdFx0aGVpZ2h0IDkwcnB4XG48L3N0eWxlPlxuIiwiaW1wb3J0IG1vZCBmcm9tIFwiLSFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cXFxcZGlzdFxcXFxsb2FkZXIuanM/P3JlZi0tMTEtb25lT2YtMS0wIUU6XFxcXGhidWlsZGVyWFxcXFxIQnVpbGRlclhcXFxccGx1Z2luc1xcXFx1bmlhcHAtY2xpXFxcXG5vZGVfbW9kdWxlc1xcXFxjc3MtbG9hZGVyXFxcXGRpc3RcXFxcY2pzLmpzPz9yZWYtLTExLW9uZU9mLTEtMSFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcQGRjbG91ZGlvXFxcXHZ1ZS1jbGktcGx1Z2luLXVuaVxcXFxwYWNrYWdlc1xcXFx2dWUtbG9hZGVyXFxcXGxpYlxcXFxsb2FkZXJzXFxcXHN0eWxlUG9zdExvYWRlci5qcyFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcQGRjbG91ZGlvXFxcXHZ1ZS1jbGktcGx1Z2luLXVuaVxcXFxwYWNrYWdlc1xcXFx3ZWJwYWNrLXByZXByb2Nlc3MtbG9hZGVyXFxcXGluZGV4LmpzPz9yZWYtLTExLW9uZU9mLTEtMiFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxccG9zdGNzcy1sb2FkZXJcXFxcc3JjXFxcXGluZGV4LmpzPz9yZWYtLTExLW9uZU9mLTEtMyFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcc3R5bHVzLWxvYWRlclxcXFxpbmRleC5qcz8/cmVmLS0xMS1vbmVPZi0xLTQhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXEBkY2xvdWRpb1xcXFx2dWUtY2xpLXBsdWdpbi11bmlcXFxccGFja2FnZXNcXFxcd2VicGFjay1wcmVwcm9jZXNzLWxvYWRlclxcXFxpbmRleC5qcz8/cmVmLS0xMS1vbmVPZi0xLTUhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXEBkY2xvdWRpb1xcXFx2dWUtY2xpLXBsdWdpbi11bmlcXFxccGFja2FnZXNcXFxcdnVlLWxvYWRlclxcXFxsaWJcXFxcaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcQGRjbG91ZGlvXFxcXHdlYnBhY2stdW5pLW1wLWxvYWRlclxcXFxsaWJcXFxcc3R5bGUuanMhLi9kZXRhaWwudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmbGFuZz1zdHlsdXMmXCI7IGV4cG9ydCBkZWZhdWx0IG1vZDsgZXhwb3J0ICogZnJvbSBcIi0hRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXFxcXGRpc3RcXFxcbG9hZGVyLmpzPz9yZWYtLTExLW9uZU9mLTEtMCFFOlxcXFxoYnVpbGRlclhcXFxcSEJ1aWxkZXJYXFxcXHBsdWdpbnNcXFxcdW5pYXBwLWNsaVxcXFxub2RlX21vZHVsZXNcXFxcY3NzLWxvYWRlclxcXFxkaXN0XFxcXGNqcy5qcz8/cmVmLS0xMS1vbmVPZi0xLTEhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXEBkY2xvdWRpb1xcXFx2dWUtY2xpLXBsdWdpbi11bmlcXFxccGFja2FnZXNcXFxcdnVlLWxvYWRlclxcXFxsaWJcXFxcbG9hZGVyc1xcXFxzdHlsZVBvc3RMb2FkZXIuanMhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXEBkY2xvdWRpb1xcXFx2dWUtY2xpLXBsdWdpbi11bmlcXFxccGFja2FnZXNcXFxcd2VicGFjay1wcmVwcm9jZXNzLWxvYWRlclxcXFxpbmRleC5qcz8/cmVmLS0xMS1vbmVPZi0xLTIhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXHBvc3Rjc3MtbG9hZGVyXFxcXHNyY1xcXFxpbmRleC5qcz8/cmVmLS0xMS1vbmVPZi0xLTMhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXHN0eWx1cy1sb2FkZXJcXFxcaW5kZXguanM/P3JlZi0tMTEtb25lT2YtMS00IUU6XFxcXGhidWlsZGVyWFxcXFxIQnVpbGRlclhcXFxccGx1Z2luc1xcXFx1bmlhcHAtY2xpXFxcXG5vZGVfbW9kdWxlc1xcXFxAZGNsb3VkaW9cXFxcdnVlLWNsaS1wbHVnaW4tdW5pXFxcXHBhY2thZ2VzXFxcXHdlYnBhY2stcHJlcHJvY2Vzcy1sb2FkZXJcXFxcaW5kZXguanM/P3JlZi0tMTEtb25lT2YtMS01IUU6XFxcXGhidWlsZGVyWFxcXFxIQnVpbGRlclhcXFxccGx1Z2luc1xcXFx1bmlhcHAtY2xpXFxcXG5vZGVfbW9kdWxlc1xcXFxAZGNsb3VkaW9cXFxcdnVlLWNsaS1wbHVnaW4tdW5pXFxcXHBhY2thZ2VzXFxcXHZ1ZS1sb2FkZXJcXFxcbGliXFxcXGluZGV4LmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhRTpcXFxcaGJ1aWxkZXJYXFxcXEhCdWlsZGVyWFxcXFxwbHVnaW5zXFxcXHVuaWFwcC1jbGlcXFxcbm9kZV9tb2R1bGVzXFxcXEBkY2xvdWRpb1xcXFx3ZWJwYWNrLXVuaS1tcC1sb2FkZXJcXFxcbGliXFxcXHN0eWxlLmpzIS4vZGV0YWlsLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmxhbmc9c3R5bHVzJlwiIl0sInNvdXJjZVJvb3QiOiIifQ==