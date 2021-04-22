// var apiUrl = "http://wjz.paopaoren.cn";
var apiUrl = "https://ubase.qianr.com";
var u = navigator.userAgent,
	app = navigator.appVersion;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

$(".close-arrow").click(function() {
	$("#closeWebviewDialog").show();
});

$("#closeWebviewBtn,#touristCloseWebview").click(function() {
	closeWebview();
});

$("#backWebviewBtn").click(function() {
	backWebview();
});

$(".left-arrow").click(function() {
	window.history.back();
});

$(".dialog-public,.dialog-close,.dialog-cancel-btn,.dialog-cancel").click(function() {
	$('.dialog-container.dialog-public').fadeOut('fast');
});

$("#goBindPhone").click(function() {
	window.location.href = "../cash/index.html#/bind-phone";
});

$(".dialog-wrapper").click(function(e) {
	e.stopPropagation();
});

$("#tabbarGgk").click(function() {
	location.href = '../ggk/ggk-list.html?v=' + Math.random();
});

$("#tabbarLottery").click(function() {
	location.href = '../lottery/lottery.html?v=' + Math.random();
});

$("#tabbarInvite").click(function() {
	location.href = '../invite/index.html?v=' + Math.random();
});

$("#tabbarCash").click(function() {
	location.href = '../cash/index.html?v=' + Math.random();
});

// 弹出提示框
function showNotice(msg) {
	$('#noticeDiv').html(msg);
	$('#noticeDiv').show();
	$('#noticeDiv').delay(2000).fadeOut();
}

/**判断屏幕大小 */
function judgeBigScreen() { //，这里根据返回值 true 或false ,返回true的话 则为全面屏 
	var result = false;
	var rate = window.screen.height / window.screen.width;
	var limit = window.screen.height == window.screen.availHeight ? 1.8 : 1.65; // 临界判断值  

	// window.screen.height为屏幕高度
	//  window.screen.availHeight 为浏览器 可用高度

	if(rate > limit) {
		result = true;
	}
	return result;
};

//自动执行匿名函数
(function() {
	$().ready(function() {
		judgeBigScreen(); //判断手机是否为全面屏
	});
})();

// 获取url中的参数
function getQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return decodeURI(r[2]);
	return null;
}

var cnzz_protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
document.write(unescape("%3Cspan id='cnzz_stat_icon_1278162250'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s9.cnzz.com/z_stat.php%3Fid%3D1278162250' type='text/javascript'%3E%3C/script%3E"));

document.getElementById("cnzz_stat_icon_1278162250").style.display = "none"; // 隐藏统计小图标