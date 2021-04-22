var jgg = {
	el: {
		cjBtn: $(".cjbtn"),
		cjCoin: $("#cjCoin"),
		isCan: $("#isCan"),
		isTel: $("#isTel"),
		syNum: $("#syNum"),
		errorMsg: $("#errorMsg"),
		money: $("#money"),
		coin: $("#coin")
	},
	setData: function(data) {
		this.el.cjBtn.find('span').text(data.choujiang_coin + '金币');
		this.el.cjCoin.val(data.choujiang_coin);
		this.el.isCan.val(data.is_can_choujiang);
		this.el.isTel.val(data.is_bing_tel);
		this.el.syNum.val(data.sy_num);
		this.el.errorMsg.val(data.info);
		this.el.money.text((data.user_real_price / 100).toFixed(2));
		this.el.coin.text(data.coin);
	},
	init: function() {
		var _this = this;
		$.ajax({
			type: "post",
			url: apiUrl + "/api/wjzchoujiang/api",
			dataType: 'json',
			data: {
				api_name: 'choujiang_list',
				token: localStorage.getItem('token'),
			},
			success: function(res) {
				var data = res.data;
				if(res.code == 1) {

					//获取抽奖图片
					function list(i) {
						return '<img src=' + data.choujiang_list[i].img + '></img><span>' + data.choujiang_list[i].name + '</span>';
					}

					for(var i in data.choujiang_list) {
						//按顺序插入数据
						$("#lotteryIndex" + i).html(list(i));
					}

					//保存数据
					_this.setData(data);
					//安装转盘
					if(lottery) {
						lottery._setup();
					}

				}

			},
			error: function(err) {
				console.log(err)
			}
		});
	}
}


