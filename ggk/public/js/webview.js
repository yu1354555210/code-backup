console.log('进入webview js')

// uniapp内的webview
if(!window.WebViewJavascriptBridge) {
	document.addEventListener('UniAppJSBridgeReady', function() {});
}

var plusReady = function(callback) {
	if(window.plus) {
		callback();
	} else {
		document.addEventListener('plusready', callback);
	}
};

function bridgeLog(logContent) {
	console.log(logContent)
}

function setupWebViewJavascriptBridge(callback) {
	if(window.WebViewJavascriptBridge) {
		return callback(WebViewJavascriptBridge);
	}
	if(window.WVJBCallbacks) {
		return window.WVJBCallbacks.push(callback);
	}
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() {
		document.documentElement.removeChild(WVJBIframe)
	}, 0)
}
setupWebViewJavascriptBridge(function(bridge) {
	/* Initialize your app here */
	bridge.registerHandler('endAd', function(id, responseCallback) {
		console.log('广告播完了 ');
		console.log('id', id);
		// $(".loading").hide(); //隐藏loading,显示刮刮卡
		ajaxEndAd(id);
		responseCallback(id);
	});
	bridge.registerHandler('errorAd', function(data, responseCallback) {
		console.log('广告播放失败了 ');
		window.history.back(); //返回上一页
		responseCallback(data);
	});
})

//兼容安卓调用
function endAd(id) {
	console.log('广告播完了 ');
	ajaxEndAd(id);
}

function ajaxEndAd(id) {
	var apiName = 'update_ios_scratch_card_log';
	var plat = 1;
	if(isAndroid) {
		apiName = 'update_az_scratch_card_log';
		plat = 2;
	}
	$.ajax({
		type: "post",
		url: apiUrl + "/api/huser/api",
		dataType: 'json',
		data: {
			api_name: apiName,
			token: localStorage.getItem('token'),
			scratch_id: id,
			plat: plat
		},
		success: function(res) {
			console.log(res)
		},
		error: function(err) {
			console.log(err)
		},
		complete: function() {
			$(".loading").hide(); //隐藏loading,显示刮刮卡
		}
	});
}

function errorAd() {
	console.log('广告播放失败了 ');
	window.history.back(); //返回上一页
}

//邀请分享
function shareDialog() {
	window.WebViewJavascriptBridge.callHandler('shareDialog', {}, function responseCallback(responseData) {
		bridgeLog(responseData);
	})
}

//评价
function evaluate() {
	window.WebViewJavascriptBridge.callHandler('evaluate', {}, function responseCallback(responseData) {
		bridgeLog(responseData);
	})
}

//看广告
function seeAd(type, id) {
	window.WebViewJavascriptBridge.callHandler('seeAd', {
		'type': type,
		'id': id
	}, function responseCallback(responseData) {
		bridgeLog(responseData);
	})
}

//去登录
function jumpLogin() {
	if(window.WebViewJavascriptBridge) {
		window.WebViewJavascriptBridge.callHandler('jumpLogin', {}, function responseCallback(responseData) {
			bridgeLog(responseData);
		})
	} else {
		uni.redirectTo({
			url: '../login/index'
		})
	}
}

//关闭当前webview
function closeWebview() {
	if(window.WebViewJavascriptBridge) {
		window.WebViewJavascriptBridge.callHandler('closeWebview', {}, function responseCallback(responseData) {
			bridgeLog(responseData);
		})
	} else {
		uni.redirectTo({
			url: '../index/index'
		});
	}

}

//返回上一页
function backWebview() {
	if(window.WebViewJavascriptBridge) {
		window.WebViewJavascriptBridge.callHandler('closeWebview', {}, function responseCallback(responseData) {
			bridgeLog(responseData);
		})
	} else {
		uni.navigateBack();
	}

}

//跳转到首页
function jumpHome() {
	if(window.WebViewJavascriptBridge) {
		window.WebViewJavascriptBridge.callHandler('jumpHome', {}, function responseCallback(responseData) {
			bridgeLog(responseData);
		})
	} else {
		uni.redirectTo({
			url: '../index/index'
		});
	}
}

//跳转到我的页
function jumpMe() {
	if(window.WebViewJavascriptBridge) {
		window.WebViewJavascriptBridge.callHandler('jumpMe', {}, function responseCallback(responseData) {
			bridgeLog(responseData);
		})
	} else {
		uni.redirectTo({
			url: '../mine/index'
		});
	}
}

//跳转到设置页
function jumpSet() {
	if(window.WebViewJavascriptBridge) {
		window.WebViewJavascriptBridge.callHandler('jumpSet', {}, function responseCallback(responseData) {
			bridgeLog(responseData);
		})
	} else {
		uni.redirectTo({
			url: '../setting/index'
		});
	}

}

//跳转到微信
function jumpWechat(data) {
	if(window.WebViewJavascriptBridge) {
		window.WebViewJavascriptBridge.callHandler('jumpWechat', {
			'data': data
		}, function responseCallback(responseData) {
			bridgeLog(responseData);
		})
	} else {
		plusReady(function() {
			launchApp();
		});
	}
}

//跳转到面对面邀请
function jumpUrl(url) {
	if(window.WebViewJavascriptBridge) {
		window.WebViewJavascriptBridge.callHandler('jumpUrl', {
			'url': url
		}, function responseCallback(responseData) {
			bridgeLog(responseData);
		})
	} else {
		uni.navigateTo({
			url: '../webview/index?url=' + url
		});
	}
}

//QQ分享呼起QQ
function shareQQ(url) {
	window.WebViewJavascriptBridge.callHandler('shareQQ', {}, function responseCallback(responseData) {
		bridgeLog(responseData);
	})
}

//打开该应用的AppStore页面
function jumpAppUpdate(url) {
	window.WebViewJavascriptBridge.callHandler('jumpAppUpdate', {}, function responseCallback(responseData) {
		bridgeLog(responseData);
	})
}

function launchApp() {
	if(plus.os.name == "Android") {
		plus.runtime.launchApplication({
			pname: "com.tencent.mm",
			extra: {
				url: "com.tencent.mm.ui.LauncherUI"
			}
		}, function(e) {
			alert("Open system default browser failed: " + e.message);
		});
	} else if(plus.os.name == "iOS") {
		plus.runtime.launchApplication({
			action: "weixin://"
		}, function(e) {
			alert("Open system default browser failed: " + e.message);
		});
	}
}