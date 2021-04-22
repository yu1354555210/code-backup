var urls = "https://wawa.paopaoren.cn/"; //测试地址
// var urls = "https://wawash.paopaoren.cn/"; //正式地址
var timeOne = 0; //内部计时器1
var timeTwo = 0; //内部计时器2
var tipStr = '距截止：'; //时间字符头
var btnTips = 0; //选项按钮标识
var page = 1;
var pagesize = 20;
window.localStorage.removeItem('btnType');
window.localStorage.removeItem('btnHight');
window.localStorage.removeItem('timeOpen');
//全包
var beg = [
	//全包
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
	//大
	[14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
	//小
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
	//单
	[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27],
	//双
	[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26],
	//大双
	[14, 16, 18, 20, 22, 24, 26],
	//大单
	[15, 17, 19, 21, 23, 25, 27],
	//小单
	[1, 3, 5, 7, 9, 11, 13],
	//小双
	[0, 2, 4, 6, 8, 10, 12]
];
var table = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1];
var items = ['全包', '大', '小', '单', '双', '大双', '大单', '小单', '小双', '随机'];
var mult = [0.5, 2, 5];
var choseBeg = [];
var token = window.localStorage.getItem('tokens');
var openid = window.localStorage.getItem('openid');

function isWeixinBrowser() {
	var agent = navigator.userAgent.toLowerCase();
	if(agent.match(/MicroMessenger/i) == "micromessenger") {
		return true;
	} else {
		return false;
	}
}

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

if(isWeixinBrowser() == false){
	if(token==null ||token=='')   window.location.href='./login.html';
}

function loadData(page, url, sendData, fn) {
	sendData.api_name = page;
	sendData.token = window.localStorage.getItem('tokens');
	$.ajax({
		type: 'POST',
		url: urls + url,
		data: sendData,
		success: function(e) {
			console.log('--------------------------------');
			console.log(e);
			console.log('--------------------------------');
			fn(e)
		},
		dataType: 'json'
	});
}

//自定义时间格式获取
function timestampToTime(timestamp, type) {
	var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	D = date.getDate() + ' ';
	h = date.getHours();
	m = date.getMinutes();
	m = m > 9 ? m : "0" + m;
	s = date.getSeconds();
	if(type == 'hm') return h + ':' + m;
	if(type == 'ymd') return Y + ':' + M + ':' + D;
	return Y + M + D + h + m + s;
}

//秒数转换 时-分-秒
function formatSeconds(value) {

	var secondTime = parseInt(value); // 秒
	var minuteTime = 0; // 分
	var hourTime = 0; // 小时

	if(secondTime > 60) { //如果秒数大于60，将秒数转换成整数
		//获取分钟，除以60取整数，得到整数分钟
		minuteTime = parseInt(secondTime / 60);
		//获取秒数，秒数取佘，得到整数秒数
		secondTime = parseInt(secondTime % 60);
		//如果分钟大于60，将分钟转换成小时
		if(minuteTime > 60) {
			//获取小时，获取分钟除以60，得到整数小时
			hourTime = parseInt(minuteTime / 60);
			//获取小时后取佘的分，获取分钟除以60取佘的分
			minuteTime = parseInt(minuteTime % 60);
		}
	}

	var result = [];
	if(secondTime > 0) {
		result[2] = parseInt(secondTime);
	} else {
		result[2] = 0;
	}
	if(minuteTime > 0) {
		minuteTime = parseInt(minuteTime);

		result[1] = parseInt(minuteTime > 9 ? minuteTime : "0" + minuteTime);
	} else {
		result[1] = 0;
	}
	if(hourTime > 0) {
		result = parseInt(hourTime);
	} else {
		result[0] = 0;
	}
	return result;
}

//h5存储
function save(type, title, arr) {
	if(type == 's') window.localStorage.setItem(title, JSON.stringify(arr));
	if(type == 'g') return window.localStorage.getItem(title);
	if(type == 'r') window.localStorage.removeItem(title);
}

//更新用户金币
function getGold() {
	loadData('info', 'index.php?g=lucky&m=api&a=api', {
		token: window.localStorage.getItem('tokens')
	}, function(e) {
		if(e.code != 1) {
			parent.layer.msg('获取用户信息失败', {
				shade: 0.3
			})
		} else if(e.data.lucky_status == 1) {
			parent.layer.msg('用户已被冻结，请联系QQ客服：2780575722', {
				shade: 0.3
			});
		} else {
			if(e.data.lucky_gold == null || e.data.lucky_gold == "0") e.data.lucky_gold = 0;
			$("#beantext").text(e.data.lucky_gold);
			window.localStorage.setItem('gold', e.data.lucky_gold);
		}
	});
}
//去小数0
function killerZero(num) {
	if(num.toString().indexOf('.') != -1) {
		var str = num.toString().split('.');

		if(str[1].length > 2) {
			if(parseInt(str[1][1]) == 0) str[1][1] = 1;
			return str[0] + '.' + str[1][0] + str[1][1];
		}
		if(str[1] = '00') return str[0];

		for(var i = 1; i < 10; i++) {
			if(str[1] = i + '0') return str[0] + '.' + i;
		}
	} else {
		return num
	}
}