// plat 平台
// scratch_card_id 所选择的刮刮卡id

var ggk = {
	data: {
		cardId: ''
	},
	init: function(resData) {
		var _this = this;
		$.ajax({
			type: "post",
			url: apiUrl + "/api/hscratchcard/api",
			dataType: 'json',
			data: {
				api_name: 'newer_scratch_card',
				token: localStorage.getItem('token'),
				scratch_card_id: resData.cratch_card_id,
				plat: resData.plat,
				package_name: localStorage.getItem('package_name')
			},
			success: function(res) {
				console.log(res)
				var data = res.data;
				if(res.code == -1){
					window.location.href = "./ggk-list.html";
					return;
				}
				if(res.code == 1) {
					$("#title,#resultAward").text(resData.title);
					$("#money").text((data.user_real_price / 100).toFixed(2));
					$("#coin").text(data.coin);
					$("#resultSrc").attr('src', data.title_icon);
					_this.data.cardId = resData.cratch_card_id;

					//获取抽奖结果图片
					var li = "";
					for(var i in data.ggk) {
						li += '<li><img src=' + data.ggk[i].img + '></img></li>';
					}
					setTimeout(function() {
						$("#J-result").html(li);
					}, 300);

					//抽奖结果数目
					var textType = data.type;
					var cardNum = data.card_num;
					if(textType == 1) {
						textType = "现金";
						cardNum /= 100;
					} else {
						textType = "金币";
					}
					$("#cardNum").text(cardNum);
					$("#cardType").text(textType);
					if(data.is_see_ad == 0){
						//不看广告
						setTimeout(function(){
							$(".loading").hide();
						},1000);
					}else{
						console.log('看广告')
						console.log('type: ', data.ad_type)
						console.log('id: ', resData.cratch_card_id)
						seeAd(data.ad_type,resData.cratch_card_id);
					}

				}

			},
			error: function(err) {
				console.log(err)
			}
		});
	},
	over: function() {
		var _this = this;
		
		$.ajax({
			type: "post",
			url: apiUrl + "/api/huser/api",
			dataType: 'json',
			data: {
				api_name: 'update_scratch_card_record',
				token: localStorage.getItem('token'),
				scratch_id: _this.data.cardId
			},
			success: function(res) {
				console.log(res)
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
}


// resData = {
	// token: '2cdf04d2a580e485ef1a935ff7034b5b',
	// plat: 1,
	// scratch_card_id: 1
// };
// ggk.init(resData);


