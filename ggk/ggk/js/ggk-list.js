//创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
var mescroll = new MeScroll("body", { //id固定"body"
	//上拉加载的配置项
	up: {
		auto: false,
		callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
		noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
		empty: {
			warpId: "dataList",
			icon: "../cash/static/images/no-data.png", //图标,默认null
			tip: "刮刮卡刮完啦，下个时间段再来吧~", //提示
		},
		lazyLoad: {
			use: true
		},
		warpId: 'nodata',
		htmlNodata: '已全部加载'
	},
	down: {
		use: false
	}
});

/*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
function getListData(page) {
	//联网加载数据
	getListDataFromNet(page.num, page.size, function(curPageData) {
		//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
		//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
		// console.log("page.num=" + page.num + ", page.size=" + page.size + ", curPageData.length=" + curPageData.length);

		//方法一(推荐): 后台接口有返回列表的总页数 totalPage
		//mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

		//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
		//mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

		//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
		//mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

		//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
		mescroll.endSuccess(curPageData[0].ggk.length);

		//提示:curPageData.length必传的原因:
		// 1.判断是否有下一页的首要依据: 当传的值小于page.size时,则一定会认为无更多数据.
		// 2.比传入的totalPage, totalSize, hasNext具有更高的判断优先级
		// 3.使配置的noMoreSize生效

		//设置列表数据
		setListData(curPageData);
	}, function() {
		//联网失败的回调,隐藏下拉刷新和上拉加载的状态;
		mescroll.endErr();
	});
}

/*设置列表数据*/
function setListData(data) {
	$.each(data, function(idx, it) {
		$("#coin").text(it.user_coin);
		$("#money").text((it.user_money / 100).toFixed(2));
		if(it.identification == 1) {
			$("#bindTouristDialog").show(); //游客登录
		}
		// ggkList.data.isBindPhone = data.bing_status;
		$.each(it.ggk, function(index, item) {
			if(item.scratch_card_type != 5) {
				$(".ggk-list").append('<div class="ggk-item" data-type="' + item.scratch_card_type + '" data-id="' + item.id + '" data-isphone="' + item.bing_status + '"><div class="ggk-tag"></div><img src="' + item.scratch_card_img + '" /><p class="ggk-name">' + item.scratch_card_name + '</p></div>')
			}
		});
		$('.ggk-item').each(function(i) {
			var type = $(this).data('type');
			if(type != 1) {
				$(this).find(".ggk-tag").hide().siblings('.ggk-name').hide();
			}
		});
	});
}

/*联网加载列表数据
 在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
 * */
function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
	var api_name = 'scratch_card_ios_list';
	// console.log('index token:  ', token);
	// console.log('localStorage token ', localStorage.getItem('token'));
	console.log(ggkList.data.token);
	if(!ggkList.data.token) {
		$("#bindLoginDialog").show();
		return;
	}
	if(isAndroid) {
		//这个是安卓操作系统
		api_name = 'scratch_card_az_list';
	}
	$.ajax({
		type: 'post',
		url: apiUrl + '/api/hscratchcard/api',
		data: {
			token: ggkList.data.token,
			api_name: api_name,
			page: pageNum,
			package_name: ggkList.data.package_name
		},
		dataType: 'json',
		success: function(res) {
			if(res.code == 101){
				// showNotice('token错误,请重新登录');
				$("#bindLoginDialog").show();
				return;
			}
			var listData = [];
			var data = res.data;
			listData.push(data);

			//回调
			successCallback(listData);
		},
		error: errorCallback
	});
}

var plat = 1;
var endTime = "";
if(isAndroid) {
	plat = 2;
}

//刷新时间倒计时
function countTime() {
	//获取当前时间  
	var date = new Date();
	var now = date.getTime();
	//设置截止时间  
	// var str = "2019/10/10 14:12:00";
	// var endDate = new Date(str);
	var end = endTime;
	//时间差  
	var leftTime = end - now;
	//定义变量 h,m,s保存倒计时的时间  
	var h, m, s;
	if(leftTime >= 0) {
		h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
		m = Math.floor(leftTime / 1000 / 60 % 60);
		s = Math.floor(leftTime / 1000 % 60);
	} else {
		$(".dialog-refresh-list ul").html("");
		window.location.reload();
	}
	//将0-9的数字前面加上0，例1变为01
	h = checkTime(h);
	m = checkTime(m);
	s = checkTime(s);

	function checkTime(i) {
		if(i < 10) {
			i = "0" + i;
		}
		return i;
	}
	//将倒计时赋值到div中  
	$("#_h").html(h);
	$("#_m").html(m);
	$("#_s").html(s);
	//递归每秒调用countTime方法，显示动态时间效果  
	setTimeout(countTime, 1000);

}

var ggkList = {
	data: {
		isBindPhone: 0,
		token: '',
		package_name: ''
	},
	init: function(token, package_name) {
		this.data.token = token;
		this.data.package_name = package_name;
		this.getRollData();
		this.getRefreshData();
		this.isFirstLogin();
		mescroll.resetUpScroll();
	},
	getRollData: function() {
		$.ajax({
			type: "post",
			url: apiUrl + "/api/huser/api",
			dataType: 'json',
			data: {
				token: this.data.token,
				api_name: 'get_roll_record',
				package_name: this.data.package_name
			},
			success: function(res) {
				var data = res.data;
				if(res.code == 1 && data.length > 9) {
					$.each(data, function(index, item) {
						$("#noticeList").append('<div class="swiper-slide"><div class="notice-avatar"><img src="' + item.avatar + '" /></div><div class="notice-info">刮中 <span>' + item.card_num / 100 + '</span> 元</div></div>');
					});
					$(".notice-list").show();

					var mySwiper = new Swiper('.swiper-container', {
						autoplay: 1, //自动滚动
						autoplayDisableOnInteraction: false,
						loop: true, //循环
						speed: 5000, //滚动速度
						slidesPerView: 4, //slide可见数量
						// spaceBetween : 10
					});
				}

			},
			error: function(err) {
				console.log(err)
			}
		});
	},
	getRefreshData: function() {
		$.ajax({
			type: "post",
			url: apiUrl + "/api/hscratchcard/api",
			dataType: 'json',
			data: {
				token: this.data.token,
				api_name: 'ios_refresh_time'
			},
			success: function(res) {
				var data = res.data;
				if(res.code == 1) {
					endTime = parseInt(data.refreshed) * 1000;
					countTime();
					var list = $(".dialog-refresh-list ul");
					$.each(data.refresh_time, function(index, item) {
						list.append('<li><span>' + item.ts + '</span><span>' + item.card_count + '</span></li>');
						if(item.jjsx == 1) {
							list.find('li').eq(index).addClass('refresh-tag');
						}
						if(item.is_expire == 1) {
							list.find('li').eq(index).addClass('refresh-cur');
						}
					});
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	},
	isFirstLogin: function() {
		var _this = this;
		$.ajax({
			type: "post",
			url: apiUrl + "/api/hscratchcard/api",
			dataType: 'json',
			data: {
				token: this.data.token,
				api_name: 'is_show_newer',
				package_name: this.data.package_name
			},
			success: function(res) {
				var data = res.data;
				if(res.code == 1) {
					_this.firstLogin();
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	},
	firstLogin: function() {
		$.ajax({
			type: "post",
			url: apiUrl + "/api/hscratchcard/api",
			dataType: 'json',
			data: {
				token: this.data.token,
				api_name: 'save_register_log',
				package_name: this.data.package_name
			},
			success: function(res) {
				var data = res.data;
				if(res.code == 1) {
					$(".dialog-reward-info").text(data.info);
					$(".dialog-reward-num label").text(data.money / 100);
					$("#bindRewardDialog").fadeIn('fast');
					mescroll.resetUpScroll();
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}

}
$(document).on('click', '.ggk-item', function() {
	var type = $(this).data('type');
	var id = $(this).data('id');
	var title = $(this).find('p').text();
	var isBindPhone = $(this).data('isphone');
	if(isBindPhone == 0) {
		$("#bindPhoneDialog").show();
		return;
	}
	var resData = {
		cratch_card_id: id,
		plat: plat,
		title: title,
		package_name: ggkList.data.package_name
	}
	resData = JSON.stringify(resData);
	switch(type) {
		case 1:
			// window.location.href = "ggk.html?data=" + resData + '&time=' + new Date().getTime();
			window.location.href = "ggk.html?data=" + resData;
			break;
		case 2:
			console.log('去往邀请')
			window.location.href = "../invite/index.html";
			break;
		case 3:
			jumpWechat();
			break;
		case 4:
			evaluate();
			console.log('app好评')
			break;
		default:
			break;
	}
});

$("#goToLogin").click(function() {
	jumpLogin();
});

$("#goToMine").click(function() {
	jumpSet();
});

//规则弹窗
$(".time-box").click(function() {
	$("#refreshDialog").fadeIn('fast');
});

//确认退出弹窗
$(".icon-close").click(function() {
	$("#exitDialog").fadeIn('fast');
});

$.preloadImages = function() {
	for(var i = 0; i < arguments.length; i++) {
		$('<img>').attr('src', arguments[i]);
	}
};
$.preloadImages('../ggk/img/loading.jpg', '../ggk/img/dialog-result-bg.png');