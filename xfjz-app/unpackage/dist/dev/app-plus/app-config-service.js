
var isReady=false;var onReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/start","pages/index/index","pages/index/guide","pages/home/index","pages/classify/index","pages/mine/index","pages/perfect/index","pages/nav-list/index","pages/detail/index","pages/login/index","pages/message/index","pages/setting/index","pages/city/index","pages/HM-search/HM-search","pages/webview/index"],"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarTitleText":"uni-app","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8"},"splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"多彩兼职","compilerVersion":"2.5.1","entryPagePath":"pages/index/start","networkTimeout":{"request":6000,"connectSocket":6000,"uploadFile":6000,"downloadFile":6000}};
var __uniRoutes = [{"path":"/pages/index/start","meta":{"isQuit":true},"window":{}},{"path":"/pages/index/index","meta":{},"window":{"navigationBarTitleText":"多彩兼职"}},{"path":"/pages/index/guide","meta":{},"window":{"navigationBarTitleText":"","titleNView":false}},{"path":"/pages/home/index","meta":{},"window":{}},{"path":"/pages/classify/index","meta":{},"window":{}},{"path":"/pages/mine/index","meta":{},"window":{}},{"path":"/pages/perfect/index","meta":{},"window":{}},{"path":"/pages/nav-list/index","meta":{},"window":{}},{"path":"/pages/detail/index","meta":{},"window":{}},{"path":"/pages/login/index","meta":{},"window":{}},{"path":"/pages/message/index","meta":{},"window":{}},{"path":"/pages/setting/index","meta":{},"window":{}},{"path":"/pages/city/index","meta":{},"window":{}},{"path":"/pages/HM-search/HM-search","meta":{},"window":{}},{"path":"/pages/webview/index","meta":{},"window":{}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes}}}});
