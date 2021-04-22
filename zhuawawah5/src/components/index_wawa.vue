<template>
	<div id="wawa_room" style="height: 100%;width:100%;margin: 0 auto;overflow: hidden;position: fixed;">
		<input id="room_id" type="hidden" value="" />

		<div id="placeholder" class="placeholder"></div>
		<div class="ctrl_pannel_box">
			<!--操作区域-->
			<div id="ctrl_pannel1" class="ctrl_pannel1" style="display: ;">
				<!--<div id="room_chat" class="room_chat"></div>-->
				<div id="room_detail" class="room_detail" @click="toRoomDetail"></div>
				<div id="startgame" class="startgame">
					<div>
						<i class="gold_icon"></i>
						<span id="spendcoin" class="spendcoin"></span>
					</div>
					<span class="stargame_text" v-text="startgameText"></span>
				</div>
				<div id="room_recharge" class="room_recharge">
					<a href="#/userpage_shop"></a>
				</div>
				<!--<div id="room_share" class="room_share" @click="isShowShare = true"></div>-->

				<div class="total_coin_box" @click="toShop">
					<i class="gold_icon"></i><span id="totalcoin" class="totalcoin"></span>
				</div>
			</div>

			<!--操作条-->
			<div id="ctrl_pannel2" class="ctrl_pannel2" style="display: none;">
				<div id="ctrl_left" class="ctrl_left ctrl_btn"></div>
				<div id="ctrl_up" class="ctrl_up ctrl_btn"></div>
				<div id="ctrl_down" class="ctrl_down ctrl_btn"></div>
				<div id="ctrl_right" class="ctrl_right ctrl_btn"></div>
				<div class="ctrl_grab_box">
					<div class="ctrl_grab" id="ctrl_grab"></div>
					<div class="time">倒计时<span id="time"></span>秒</div>
				</div>
			</div>
		</div>
		<div class="placeholderImgBox" v-if="isPh">
			<div class="placeholderImg"></div>
		</div>

		<!--弹幕区域-->
		<canvas id="chat_content"></canvas>

		<!--观众头像-->
		<div class="people_list">
			<ul>
				<li v-for="item in peopleList"><img :src="item.avatar" /></li>
			</ul>
		</div>

		<!--退出房间-->
		<div>
			<a id="room_close" class="room_close"></a>
			<div id="headimgdiv" class="headimg"><img src="" /></div>
		</div>
		<div>
			<a href="javascript:;" id="room_user_list" class="people_total">
				<span id="usertotal" v-text="total"></span>人围观
			</a>
		</div>

		<!--切换摄像头-->
		<a href="javascript:;" id="switchCamera" class="room_video"></a>

		<!--聊天区域-->
		<div id="chat_pannel">
			<div class="chat_btn_list">
				<button class="quite_send" v-for="item in sendList" v-cloak>{{item}}</button>
			</div>
			<div class="chat_input_list">
				<input id="send_content" type="text" value="" placeholder="" />
				<button id="send">发送</button>
			</div>
		</div>

		<!--失败弹窗-->
		<div class="public_mask" id="fdialog" style="display: none;">
			<div class="fail_winpop status_winpop">
				<div class="winpop_close" id="fdialog_close"></div>
				<dl>
					<dt>
						<img src="http://wawah5-1252571264.file.myqcloud.com/newimg/fail_status.png"/>
					</dt>
					<dd>
						<a href="javascript:;" id="playagain" class="this_btn">再玩一次(<span id="time1">6</span>)</a>
					</dd>
				</dl>
			</div>
		</div>

		<!--成功弹窗-->
		<div class="public_mask" id="sdialog" style="display: none;">
			<div class="success_winpop status_winpop">
				<div class="winpop_close" id="sdialog_close"></div>
				<dl>
					<dt>
						<div class="success_title"></div>
						<div class="success_gift">
							<img id="success_gift_img" src=""/>
						</div>
					</dt>
					<dd>
						<a href="javascript:;" class="this_btn share_btn" @click="isShowShare = true">炫耀一下</a>
						<a href="javascript:;" class="this_btn" id="playagain2">再玩一次(<span id="time2">6</span>)</a>
					</dd>
				</dl>
			</div>
		</div>

		<!--请充值弹窗-->
		<div class="public_mask fadeIn animated" id="rcharge_dialog" @click.self="rchargeAlert" v-if="isShowRcAlert">
			<div class="rcharge_winpop winpop">
				<div class="winpop_close" @click="rchargeAlert"></div>
				<div class="winpop_main">
					<dl>
						<dt>
							<img src="http://wawah5-1252571264.file.myqcloud.com/newimg/coin_not.png"/>
							<p>娃娃币不足，充点小钱继续抓</p>
						</dt>
						<dd>
							<a href="#/userpage_shop" class="this_btn">立即充值</a>
						</dd>
					</dl>
				</div>
			</div>
		</div>

		<div class="grab_dialog" style="display: none;">已下抓,结果计算中</div>
		<!--分享图片-->
		<div class="share_mask" v-if="isShowShare" @click="isShowShare = false"><img src="http://wawah5-1252571264.file.myqcloud.com/newimg/share.png" /></div>
	</div>

</template>

<script>
	var timer = null;
	var countdown;
	var playing = false;
	var i = 6;
	var my_wait_rownum;
	var now_user;
	var now_game;
	var token = getCookie("token");
	var isStart = '0';
	var defaultHeadImg = "http://wawah5-1252571264.file.myqcloud.com/newimg/default_img.png";
	var direction;
	var videoCanvas_front = true;
	var where = 'noinput';
	var downUrl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.musketeers.wawalaile&channel=0002160650432d595942&fromcase=60001"; //下载app地址

	countdown = countdown || 30;

	import global_ from '../components/Global.vue'
	import Vue from 'vue'
	var apiUrl = global_.apiUrl;

	export default {
		name: 'app',
		methods: {
			roominit(rid, txrid, frontlive, sidelive, video_sig, userid, usersig, xtoken, uname) {
				var txroomId = txrid;
				var videoSig = video_sig;
				var uid = userid;
				var usig = usersig;
				var roomid = rid;
				var isshowchatpannel = false;
				var isshowchatcontent = true;
				var time_music = document.getElementById('time_music');
				var bg_music = document.getElementById('bg_music');
				var user_img = localStorage.getItem("user_img");
				var is_time_music;
				var _this = this;

				//webim配置
				var selType = webim.SESSION_TYPE.GROUP;
				var selToID = avChatRoomId;
				var selSess = null;
				var accountMode = 0;
				var sdkAppID = 1400055660;
				var accountType = 20488;
				var avChatRoomId = '0';
				var selSessHeadUrl = '';
				var isLogOn = true;
				var options = {
					'isAccessFormalEnv': isAccessFormalEnv,
					'isLogOn': isLogOn
				};
				var curPlayAudio = null;
				var openEmotionFlag = false;
				if(webim.Tool.getQueryString("groupid")) {
					avChatRoomId = webim.Tool.getQueryString("groupid");
				}

				var loginInfo = {
					'sdkAppID': sdkAppID,
					'appIDAt3rd': sdkAppID,
					'accountType': accountType,
					'identifier': uid,
					'identifierNick': "null",
					'userSig': usig,
					'headurl': ''
				};

				//监听 申请加群 系统消息

				function onApplyJoinGroupRequestNotify(notify) {
					webim.Log.warn("执行 加群申请 回调：" + JSON.stringify(notify));
					var timestamp = notify.MsgTime;
					var reportTypeCh = "[申请加群]";
					var content = notify.Operator_Account + "申请加入你的群";
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, timestamp);
				}

				//监听 申请加群被同意 系统消息

				function onApplyJoinGroupAcceptNotify(notify) {
					webim.Log.warn("执行 申请加群被同意 回调：" + JSON.stringify(notify));
					var reportTypeCh = "[申请加群被同意]";
					var content = notify.Operator_Account + "同意你的加群申请，附言：" + notify.RemarkInfo;
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
				}
				//监听 申请加群被拒绝 系统消息

				function onApplyJoinGroupRefuseNotify(notify) {
					webim.Log.warn("执行 申请加群被拒绝 回调：" + JSON.stringify(notify));
					var reportTypeCh = "[申请加群被拒绝]";
					var content = notify.Operator_Account + "拒绝了你的加群申请，附言：" + notify.RemarkInfo;
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
				}
				//监听 被踢出群 系统消息

				function onKickedGroupNotify(notify) {
					webim.Log.warn("执行 被踢出群  回调：" + JSON.stringify(notify));
					var reportTypeCh = "[被踢出群]";
					var content = "你被管理员" + notify.Operator_Account + "踢出该群";
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
				}
				//监听 解散群 系统消息

				function onDestoryGroupNotify(notify) {
					webim.Log.warn("执行 解散群 回调：" + JSON.stringify(notify));
					var reportTypeCh = "[群被解散]";
					var content = "群主" + notify.Operator_Account + "已解散该群";
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
				}
				//监听 创建群 系统消息

				function onCreateGroupNotify(notify) {
					webim.Log.warn("执行 创建群 回调：" + JSON.stringify(notify));
					var reportTypeCh = "[创建群]";
					var content = "你创建了该群";
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
				}
				//监听 被邀请加群 系统消息

				function onInvitedJoinGroupNotify(notify) {
					webim.Log.warn("执行 被邀请加群  回调: " + JSON.stringify(notify));
					var reportTypeCh = "[被邀请加群]";
					var content = "你被管理员" + notify.Operator_Account + "邀请加入该群";
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
				}
				//监听 主动退群 系统消息

				function onQuitGroupNotify(notify) {
					webim.Log.warn("执行 主动退群  回调： " + JSON.stringify(notify));
					var reportTypeCh = "[主动退群]";
					var content = "你退出了该群";
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
				}
				//监听 被设置为管理员 系统消息

				function onSetedGroupAdminNotify(notify) {
					webim.Log.warn("执行 被设置为管理员  回调：" + JSON.stringify(notify));
					var reportTypeCh = "[被设置为管理员]";
					var content = "你被群主" + notify.Operator_Account + "设置为管理员";
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
				}
				//监听 被取消管理员 系统消息

				function onCanceledGroupAdminNotify(notify) {
					webim.Log.warn("执行 被取消管理员 回调：" + JSON.stringify(notify));
					var reportTypeCh = "[被取消管理员]";
					var content = "你被群主" + notify.Operator_Account + "取消了管理员资格";
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
				}
				//监听 群被回收 系统消息

				function onRevokeGroupNotify(notify) {
					webim.Log.warn("执行 群被回收 回调：" + JSON.stringify(notify));
					var reportTypeCh = "[群被回收]";
					var content = "该群已被回收";
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
				}
				//监听 用户自定义 群系统消息

				function onCustomGroupNotify(notify) {
					webim.Log.warn("执行 用户自定义系统消息 回调：" + JSON.stringify(notify));
					var reportTypeCh = "[用户自定义系统消息]";
					var content = notify.UserDefinedField; //群自定义消息数据
					showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
				}

				//监听 群资料变化 群提示消息

				function onGroupInfoChangeNotify(groupInfo) {
					webim.Log.warn("执行 群资料变化 回调： " + JSON.stringify(groupInfo));
					var groupId = groupInfo.GroupId;
					var newFaceUrl = groupInfo.GroupFaceUrl; //新群组图标, 为空，则表示没有变化
					var newName = groupInfo.GroupName; //新群名称, 为空，则表示没有变化
					var newOwner = groupInfo.OwnerAccount; //新的群主id, 为空，则表示没有变化
					var newNotification = groupInfo.GroupNotification; //新的群公告, 为空，则表示没有变化
					var newIntroduction = groupInfo.GroupIntroduction; //新的群简介, 为空，则表示没有变化

					if(newName) {
						//更新群组列表的群名称
						//To do
						webim.Log.warn("群id=" + groupId + "的新名称为：" + newName);
					}
				}

				//显示一条群组系统消息

				function showGroupSystemMsg(type, typeCh, group_id, group_name, msg_content, msg_time) {
					var sysMsgStr = "收到一条群系统消息: type=" + type + ", typeCh=" + typeCh + ",群ID=" + group_id + ", 群名称=" + group_name + ", 内容=" + msg_content + ", 时间=" + webim.Tool.formatTimeStamp(msg_time);
					webim.Log.warn(sysMsgStr);
					// alert(sysMsgStr);
				}

				var onGroupSystemNotifys = {
					"1": onApplyJoinGroupRequestNotify, //申请加群请求（只有管理员会收到,暂不支持）
					"2": onApplyJoinGroupAcceptNotify, //申请加群被同意（只有申请人能够收到,暂不支持）
					"3": onApplyJoinGroupRefuseNotify, //申请加群被拒绝（只有申请人能够收到,暂不支持）
					"4": onKickedGroupNotify, //被管理员踢出群(只有被踢者接收到,暂不支持)
					"5": onDestoryGroupNotify, //群被解散(全员接收)
					"6": onCreateGroupNotify, //创建群(创建者接收,暂不支持)
					"7": onInvitedJoinGroupNotify, //邀请加群(被邀请者接收,暂不支持)
					"8": onQuitGroupNotify, //主动退群(主动退出者接收,暂不支持)
					"9": onSetedGroupAdminNotify, //设置管理员(被设置者接收,暂不支持)
					"10": onCanceledGroupAdminNotify, //取消管理员(被取消者接收,暂不支持)
					"11": onRevokeGroupNotify, //群已被回收(全员接收)
					"255": onCustomGroupNotify //用户自定义通知(默认全员接收)
				};

				function onKickedEventCall() {
					console.log("其他地方登录，被T了");
					//					sdkLogin();
				}

				var onConnNotify = function(resp) {
					switch(resp.ErrorCode) {
						case webim.CONNECTION_STATUS.ON:
							// console.log('连接状态正常...');
							break;
						case webim.CONNECTION_STATUS.OFF:
							console.log('连接已断开，无法收到新消息，请检查下你的网络是否正常');
							break;
						default:
							console.log('未知连接状态,status=' + resp.ErrorCode);
							break;
					}
				};

				var listeners = {
					"onConnNotify": onConnNotify,
					"jsonpCallback": jsonpCallback,
					"onBigGroupMsgNotify": onBigGroupMsgNotify,
					"onMsgNotify": onMsgNotify,
					"onGroupSystemNotifys": onGroupSystemNotifys,
					"onGroupInfoChangeNotify": onGroupInfoChangeNotify,
					"onKickedEventCall": onKickedEventCall //被其他登录实例踢下线
				};

				var isAccessFormalEnv = true;
				if(webim.Tool.getQueryString("isAccessFormalEnv") == "false") {
					isAccessFormalEnv = false;
				}

				function sdkLogin() {
					webim.login(loginInfo, listeners, options,
						function(identifierNick) {
							applyJoinBigGroup(rid); //房间群
							applyJoinBigGroup(avChatRoomId); //0群
						},
						function(err) {
							alert(err.ErrorInfo);
						}
					);
				}

				function settime() {
					clearTimeout(timer);
					if(countdown < 0) {
						time_music.pause();
						time_music.currentTime = 0.0;
						clearTimeout(timer);
						countdown = 30;
						return;
					} else {
						if(countdown == 16) {
							var yx = localStorage.getItem("yx");
							if(yx == '1' && is_time_music != "1") {
								time_music.play();
							}
						}
						$("#time").text(countdown);
						countdown--;
					}
					timer = setTimeout(function() {
						settime()
					}, 1000);
				}
				//视频-
				function onFailure(code, errmsg, err) {
					// alert(code);
					// alert(errmsg);
				}

				// 开始游戏后，由于在iPhone上加载低延时的jsmpeg需要额外传递videoSig,故由此回调传入
				function onNeedVideoSig(sigCallback) {
					sigCallback(videoSig);
				}

				function onSideVideoPlay(delay) {}

				function onJsmpegInfo(info) {
					// alert(info)
				}

				function onFrontVideoPlay(delay) {
					//视频播放了
					if (delay === PDWaWaJi.VideoPlayListener.LowDelay) {
	                    console.log("连麦视频播放")
	                } else if (delay === PDWaWaJi.VideoPlayListener.HightDelay) {
	                	console.log("旁路视频播放")
	                }
					Vue.$vux.loading.hide();
					_this.isPh = false;
					$(".placeholderImgBox").hide();
					sdkLogin();
					_this.getPelList(); //观众列表
					_this.getPelInfo(); //个人信息
					_this.getTicket();
				}
				let videoListener = {
					onFailure: onFailure,
					onSideVideoPlay: onSideVideoPlay,
					onNeedVideoSig: onNeedVideoSig,
					onFrontVideoPlay: onFrontVideoPlay,
					onJsmpegInfo: onJsmpegInfo
				};

				let playerListener = {
					onGameWebsocketConnected: function() {
						console.log('game websocket connected');
					},
					onGameWebsocketClose: function() {
						console.log('game websocket closed');
					},
					onGameWebsocketError: function() {
						console.error('game websocket error close');
					},
					onGameError: function(code, errmsg, err) {
						// 游戏异常
						console.error('game error');
					},
					onGameRoomReady: function(gameTime) {
						// ws 连接成功，房间处于准备状态，加入排队队列
						PDWaWaJi.Player.startQueue();
					},
					onGamePrepared: function(leftTime) {
						console.log('开始游戏等待时长' + leftTime);
					},
					onGameWaitRestart: function(leftTime) {
						console.log('等待重新开始倒计时' + leftTime);
					},
					onGameQueueKickOff: function() {
						console.log('排队结束或等待重新开始结束，踢出队列');
					},
					onGameQueueUp: function() {
						console.log('排队成功');
					},
					onGameQueueCancle: function() {
						console.log('取消排队成功');
					},
					onRoomQueueInfo: function(queueInfo, position) {
						console.log('队列信息' + JSON.stringify(queueInfo));
						console.log('用户当前队列' + position);
						// 配置hightQuality为false时，业务上可以在这里指定排队的前多少位可以提前连麦，加载低延时视频
						if(position < 2) {
							PDWaWaJi.Video.upToVideoMember(function() {
								console.log('排队前列连麦成功');
							})
						}
					},
					onGameStarted: function(sessionId) {
						// 游戏开始
						console.log("游戏开始")
					},
					onGameReconnect: function(reconnectInfo) {
						console.log('游戏重连成功，剩余时间' + reconnectInfo.time);
					},
					onGameResult: function(success) {
						console.log('游戏结果' + success);
					}
				}
				PDWaWaJi.init({
					container_id: 'placeholder',
					hightQuality: true,
					enqueue: false,
					sdkAppId: "1400055660",
					accountType: "20488",
					userId: uid,
					userSig: usig,
					jsmpegRenderType: 0,
					room: {
						roomId: txroomId,
						frontId: 'wowgotcha_' + txroomId + '_1',
						sideId: 'wowgotcha_' + txroomId + '_2',
						frontLive: frontlive + ".m3u8",
						sideLive: sidelive + ".m3u8"
					},
					coverPic: {
						front: '',
						side: '',
					},
					videoListener: videoListener,
					playerListener: playerListener
				});
				// 打印娃娃机信息
				PDWaWaJi.enableLog()

				//云通讯------
				function jsonpCallback(rspData) {
					//设置接口返回的数据
					webim.setJsonpLastRspData(rspData);
				}

				function tojson(msg) {
					var html = "",
						elems, elem, type, content;
					elems = msg.getElems();
					for(var i in elems) {
						elem = elems[i];
						type = elem.getType();
						content = elem.getContent();
						switch(type) {
							case webim.MSG_ELEMENT_TYPE.TEXT:
								html += convertTextMsgToHtml(content);
								break;
							case webim.MSG_ELEMENT_TYPE.FACE:
								break;
							case webim.MSG_ELEMENT_TYPE.IMAGE:
								break;
							case webim.MSG_ELEMENT_TYPE.SOUND:
								break;
							case webim.MSG_ELEMENT_TYPE.FILE:
								break;
							case webim.MSG_ELEMENT_TYPE.LOCATION:
								break;
							case webim.MSG_ELEMENT_TYPE.CUSTOM:
								break;
							case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
								break;
							default:
								//console.log('未知消息元素类型: elemType=' + type);
								break;
						}
					}
					return html;
				}

				String.prototype.replaceAll = function(s1, s2) {
					return this.replace(new RegExp(s1, "gm"), s2);
				}

				function convertTextMsgToHtml(content) {
					var jsonstr = content.getText().replaceAll('&quot;', '"');
					return jsonstr;
				}

				//操作---------
				$(document).off("click").on("click", ".quite_send", function(e) {
					e.stopPropagation();
					var text = $(this).html();
					$("#chat_pannel").hide();
					where = "input";
					run_example(text);
				});

				//屏蔽脏话
				function cleansing(input, arr) {
					input = input.replace(/\s+/g, "");
					for(var i = 0; i < arr.length; i++) {
						var ch = input.includes(arr[i]);
						if(ch) {
							input = input.replace(arr[i], '*');
						}
					}
					return input;
				}

				//发送弹幕
				$("#send").click(function(e) {
					e.stopPropagation();
					var arr = _this.keyWordList;
					var chat_content = $("#send_content").val();
					var val = cleansing(chat_content, arr);
					$("#send_content").val("");
					$("#chat_pannel").hide();
					where = "input";
					run_example(val);
				});

				//弹幕
				function run_example(chat_content) {
					if(chat_content != "") {
						onSendMsg(chat_content);
					}
					return false;
				}
				//随机选择成功或失败描述文字
				function getRadomFromArr(arr) {
					return arr[Math.floor(Math.random() * arr.length)];
				}

				//监听大群新消息
				function onBigGroupMsgNotify(msgList) {
					// type = 1 普通聊天
					// type = 3 用户进入房间
					// type = 4 用户退出房间
					// type = 10 用户控制消息
					// type = 12 新的公告
					// type = 13 服务器要求进行刷新房间信息
					// type = 14 服务器通知所有用户房间可以玩了
					// type = 15 房间信息变化
					// type = 16 房间信息变化(新)

					for(var i = msgList.length - 1; i >= 0; i--) {
						var msg = msgList[i];
						try {
							var jsstr = tojson(msg);
							if(jsstr != "") {
								var msgobj = JSON.parse(jsstr);
								var name = msgobj.name;
								if(msgobj.type == 2) {
									var avatar = msgobj.avatar;
									if(avatar == "" || avatar == apiUrl) {
										avatar = defaultHeadImg;
									}
									_this.startGameNotStatus();
									$("#headimgdiv").show();
									$("#headimgdiv img").attr("src", avatar);
									my_wait_rownum = '0';
								}
								if(msgobj.type == 3) {
									var user_id = msgobj.user_id;
									var name;
									$.ajax({
										type: "get",
										url: apiUrl + "api/mywawa/api?token=" + token,
										data: {
											api_name: 'game_audience',
											room_id: _this.rid
										},
										success: function(res) {
											var data = JSON.parse(res);
											self.peopleList = data.data;
											self.total = data.total;
											for(var i in self.peopleList) {
												if(self.peopleList[i].avatar == "" || self.peopleList[i].avatar == apiUrl) {
													self.peopleList[i].avatar = defaultHeadImg;
												}
												if(self.peopleList[i].user_id == user_id) {
													name = self.peopleList[i].user_nicename
													if(name == null || name == "　" || name == "") return;
												}
											}
											var message = "进入了房间";
											$("#chat_content").barrager([{
												"msg": name + message
											}]);
										}
									});
								}
								if(msgobj.type == 4) {
									_this.getPelList();
								}
								if(msgobj.type == 10) {
									var id = userid.replace("wawaji_", "");
									var user_nicename = msgobj.user_nicename;
									if(msgobj.success == 0) {
										var randomArr = ['差一点就抓到了~', '没抓到，好可惜~', '没有抓到~'];
										var arrInfo = getRadomFromArr(randomArr);
										$("#chat_content").barrager([{
											"msg": user_nicename + arrInfo
										}]);
										if(msgobj.user_id == id) {
											faileddialog();
											where = 'noinput';
											my_wait_rownum = '1';
											_this.startGameYesStatus();
											$("#ctrl_pannel1").show();
											$("#ctrl_pannel2").hide();
											//解禁按钮
											playing = false;
										}
									} else {
										var randomArr = ['有如神助,成功抓到啦~', '运气爆棚,轻轻松松抓到一个~', '手气666,又抓到一个~'];
										var arrInfo = getRadomFromArr(randomArr);
										$("#chat_content").barrager([{
											"msg": user_nicename + arrInfo
										}]);
										if(msgobj.user_id == id) {
											successdialog();
											where = 'noinput';
											my_wait_rownum = '1';
											_this.startGameYesStatus();
											$("#ctrl_pannel1").show();
											$("#ctrl_pannel2").hide();

											//解禁按钮
											playing = false;
										}
									}
								}
								if(msgobj.type == 1) {
									//聊天
									var message = msgobj.message;
									var name = msgobj.name;
									// var userid = userid.replace("wawaji_", "");
									// if(where == 'input') {
									// if(msgobj.user_id == userid) {
									// message = "我:" + message
									// } else {
									// message = name + ":" + message
									// }
									// }
									$("#chat_content").barrager([{
										"msg": name + ":" + message
									}]);
								}

								if(msgobj.type == 16) {
									var obj = msgobj.room_status;
									// console.log(msgobj)
									// Object.keys(obj).forEach(function(key) {
									// if(key == rid && obj[key] == 3) {
									// //游戏中
									// 
									// }
									// });
								}
								if(msgobj.type == 14) {
									// console.log(msgobj)
									//游戏结束，没人抢,清空头像
									$("#headimgdiv img").attr("src", "");
									$("#headimgdiv").hide();
									_this.startGameYesStatus();
									my_wait_rownum = '1';
									isStart = "0";
									time_music.pause();
									time_music.currentTime = 0.0;
								}
								// if(msgobj.type == 15) {
								// if(msgobj.status == 3) {
								// 
								// }
								// }

							}
						} catch(error) {
							//alert(jsstr);
						} finally {

						}
					}

				}

				function onMsgNotify(newMsgList) {
					var newMsg;
					for(var j in newMsgList) {
						newMsg = newMsgList[j];
						handlderMsg(newMsg);
					}
				}

				function handlderMsg(msg) {
					var fromAccount, fromAccountNick, sessType, subType, contentHtml;

					fromAccount = msg.getFromAccount();
					if(!fromAccount) {
						fromAccount = '';
					}
					fromAccountNick = msg.getFromAccountNick();
					if(!fromAccountNick) {
						fromAccountNick = fromAccount;
					}
					sessType = msg.getSession().type();
					subType = msg.getSubType();

					switch(sessType) {
						case webim.SESSION_TYPE.C2C:
							switch(subType) {
								case webim.C2C_MSG_SUB_TYPE.COMMON:
									contentHtml = tojson(msg);
									var opts = {
										'To_Account': fromAccount,
										'LastedMsgTime': msg.getTime()
									};
									webim.c2CMsgReaded(opts);
									break;
							}
							break;
						case webim.SESSION_TYPE.GROUP:
							break;
					}
				}

				//进入大群
				function applyJoinBigGroup(groupId) {
					var options = {
						'GroupId': groupId //群id
					};
					webim.applyJoinBigGroup(
						options,
						function(resp) {
							if(resp.JoinedStatus && resp.JoinedStatus == 'JoinedSuccess') {
								selToID = groupId;
								if(selToID != 0) {
									onSendMsg(null, 3);
								}
							} else {
								// alert('进房间失败');
							}
						},
						function(err) {
							// alert("房间内" + err.ErrorInfo);
						}
					);
				}

				//发送消息(普通消息)
				function onSendMsg(text, type, game_id) {
					if(type == "" || type == undefined || type == null) {
						type = 1;
					}
					if(game_id == undefined) {
						game_id = null
					}
					if(!loginInfo.identifier) {
						if(accountMode == 1) {
							webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
							tlsLogin();
						} else {}
						return;
					}

					if(!selToID) {
						return;
					}

					var uid = getCookie("uid");
					var json = {
						"type": type,
						"user_id": uid,
						"name": uname,
						"message": text,
						"avatar": user_img,
						"game_id": game_id
					};

					var msgtosend = JSON.stringify(json);
					var msgLen = webim.Tool.getStrBytes(msgtosend);

					if(msgtosend.length < 1) {
						return;
					}

					var maxLen, errInfo;
					if(selType == webim.SESSION_TYPE.GROUP) {
						maxLen = webim.MSG_MAX_LENGTH.GROUP;
						errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
					} else {
						maxLen = webim.MSG_MAX_LENGTH.C2C;
						errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
					}
					if(msgLen > maxLen) {
						return;
					}

					if(!selSess) {
						selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
					}
					var isSend = true;
					var seq = -1;
					var random = Math.round(Math.random() * 4294967296);
					var msgTime = Math.round(new Date().getTime() / 1000);
					var subType;
					if(selType == webim.SESSION_TYPE.GROUP) {
						subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
					} else {
						subType = webim.C2C_MSG_SUB_TYPE.COMMON;
					}
					var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
					var expr = /\[[^[\]]{1,3}\]/mg;
					var emotions = msgtosend.match(expr);
					var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
					if(!emotions || emotions.length < 1) {
						text_obj = new webim.Msg.Elem.Text(msgtosend);
						msg.addText(text_obj);
					} else {
						for(var i = 0; i < emotions.length; i++) {
							tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
							if(tmsg) {
								text_obj = new webim.Msg.Elem.Text(tmsg);
								msg.addText(text_obj);
							}
							emotionIndex = webim.EmotionDataIndexs[emotions[i]];
							emotion = webim.Emotions[emotionIndex];
							if(emotion) {
								face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
								msg.addFace(face_obj);
							} else {
								text_obj = new webim.Msg.Elem.Text(emotions[i]);
								msg.addText(text_obj);
							}
							restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
							msgtosend = msgtosend.substring(restMsgIndex);
						}
						if(msgtosend) {
							text_obj = new webim.Msg.Elem.Text(msgtosend);
							msg.addText(text_obj);
						}
					}

					webim.sendMsg(msg, function(resp) {}, function(err) {});
				}

				function logout() {
					onSendMsg(null, 4);
				}

				function room_tool_dialog() {
					$('#room_tool_dialog').fadeIn('fast');
					$('#room_tool_dialog_close').on('click', function() {
						$('#room_tool_dialog').fadeOut('fast');
					});
				}

				$("#room_tool").click(function() {
					room_tool_dialog();
				})

				$("#switchCamera").click(function() {
					PDWaWaJi.Video.switchCamera();
					videoCanvas_front == true ? videoCanvas_front = false : videoCanvas_front = true;
				})

				$("#startgame").on("click", function() {
					Vue.$vux.loading.show({
						text: '加载中'
					})
					var url = apiUrl + "api/room/api?token=" + xtoken + "&room_id=" + roomid + "&api_name=room_game_start";
					var start_music = document.getElementById('start_music');
					var uid = getCookie("uid");
					var self = this;

					$.get(url, function(data) {

						var data = JSON.parse(data);
						var game_id = data.data.id;
						if(data.code == '1') {
							isStart = '1';
						}

						if(my_wait_rownum == '1') {
							var yx = localStorage.getItem("yx");
							//娃娃币总数
							var totalcoin = $("#totalcoin").html();
							var spendcoin = $("#spendcoin").html();
							var itotalcoin = parseInt(totalcoin);
							var ispendcoin = parseInt(spendcoin);
							var coin = itotalcoin - ispendcoin;
							$("#chat_pannel").hide();
							if(data.code == '-1004') {
								// 娃娃币不足
								_this.isShowRcAlert = true
							} else if(data.code == '1') {
								if(yx == '1') {
									start_music.play();
								}
								startGame() //启动直播视频
								//倒计时
								countdown = 30;
								settime();
								$("#totalcoin").html(coin);
								$("#ctrl_pannel1").hide();
								$("#ctrl_pannel2").show();
								onSendMsg("开始游戏", 2, game_id);
							} else {
								Vue.$vux.toast.show({
									text: '游戏中,请稍等',
									type: "text",
									position: 'bottom'
								})
							}
						}
						if(my_wait_rownum == '0') {
							Vue.$vux.toast.show({
								text: '游戏中,请稍等',
								type: "text",
								position: 'bottom'
							})
						}

						Vue.$vux.loading.hide()

					});

				});

				$("#room_chat").click(function() {

					if(isshowchatpannel) {
						$("#chat_pannel").hide();
						isshowchatpannel = false;
						$("#send_content")[0].blur();
					} else {
						$("#chat_pannel").show();
						isshowchatpannel = true;
						$("#send_content")[0].focus();

					}
				});

				var stopUrl = apiUrl + "api/room/api?cmd=stop&token=" + token + "&room_id=" + roomid + "&api_name=room_game_cmd";
				$("#ctrl_left").on("touchstart", function() {
					if(!playing) {
						var myAuto = document.getElementById('btn_music');
						var yx = localStorage.getItem("yx");
						if(yx == '1') {
							myAuto.play();
						}
						if(videoCanvas_front == true) {
							direction = 'left';
						} else {
							direction = 'down';
						}
						var url = apiUrl + "api/room/api?cmd=" + direction + "&token=" + token + "&room_id=" + roomid + "&api_name=room_game_cmd";
						$.get(url, function(data) {
							var data = JSON.parse(data);
							if(data.code == 1) {
								$.get(stopUrl, function(data) {});
							}
						});
					}
				});
				$("#ctrl_right").on("touchstart", function() {
					if(!playing) {
						var myAuto = document.getElementById('btn_music');
						var yx = localStorage.getItem("yx");

						if(yx == '1') {
							myAuto.play();
						}
						if(videoCanvas_front == true) {
							direction = 'right';
						} else {
							direction = 'up';
						}
						var url = apiUrl + "api/room/api?cmd=" + direction + "&token=" + token + "&room_id=" + roomid + "&api_name=room_game_cmd";
						$.get(url, function(data) {
							var data = JSON.parse(data);
							if(data.code == 1) {
								$.get(stopUrl, function(data) {});
							}
						});
					}
				});

				$("#ctrl_down").on("touchstart", function() {
					if(!playing) {
						var myAuto = document.getElementById('btn_music');
						var yx = localStorage.getItem("yx");

						if(yx == '1') {
							myAuto.play();
						}
						if(videoCanvas_front == true) {
							direction = 'down';
						} else {
							direction = 'right';
						}
						var url = apiUrl + "api/room/api?cmd=" + direction + "&token=" + token + "&room_id=" + roomid + "&api_name=room_game_cmd";
						$.get(url, function(data) {
							var data = JSON.parse(data);
							if(data.code == 1) {
								$.get(stopUrl, function(data) {});
							}
						});
					}
				});

				$("#ctrl_up").on("touchstart", function() {
					if(!playing) {
						var myAuto = document.getElementById('btn_music');
						var yx = localStorage.getItem("yx");

						if(yx == '1') {
							myAuto.play();
						}
						if(videoCanvas_front == true) {
							direction = 'up';
						} else {
							direction = 'left';
						}
						var url = apiUrl + "api/room/api?cmd=" + direction + "&token=" + token + "&room_id=" + roomid + "&api_name=room_game_cmd";
						$.get(url, function(data) {
							var data = JSON.parse(data);
							if(data.code == 1) {
								$.get(stopUrl, function(data) {});
							}
						});
					}
				});

				$("#ctrl_grab").on("touchstart", function() {
					if(!playing) {
						var myAuto = document.getElementById('grab_music');
						var yx = localStorage.getItem("yx");
						if(yx == '1') {
							myAuto.play();
						}
						$(".grab_dialog").show();
						time_music.pause();
						time_music.currentTime = 0.0;
						is_time_music = "1";
						// countdown = 0;
						// $("#time").text(countdown);
						playing = true;
						var url = apiUrl + "api/room/api?cmd=grab&token=" + token + "&room_id=" + roomid + "&api_name=room_game_cmd";
						$.get(url, function(data) {});
					}
				});

				function startGame() {
					PDWaWaJi.Player.startGame();
				}

				function endGame() {
					PDWaWaJi.videoPlay(VideoPlayStatus.GameOver);
				}

				function closeGame() {
//					WebRTCAPI.quit();
				}
				//后退键退出
				$(window).off("popstate").on("popstate", function(e) {
					exit();
					logout();
					//退出房间接口
					_this.getAjaxExitRoom();
				});

				function exit() {
					//关闭声音
					bg_music.pause();
					bg_music.currentTime = 0.0;
					time_music.pause();
					time_music.currentTime = 0.0;
					// countdown = 30;
					playing = false;
					i = 6;
					//关闭连接
					closeGame();
					//清空头像
					$("#headimgdiv img").attr("src", "");
					$("#headimgdiv").hide();
					Vue.$vux.loading.hide();
				}
				$("#room_close").click(function() {
					//个人信息
					if(isStart == "1") {
						Vue.$vux.confirm.show({
							title: "游戏进行中，是否退出房间？",
							theme: "android",
							onConfirm() {
								_this.getAjaxExitRoom();
								_this.$router.back();
								exit();
							}
						})
					} else {
						_this.getAjaxExitRoom();
						_this.$router.back();
						exit();
					}
				});

				function settime1() {
					var timer2;
					clearTimeout(timer2);
					if(i == 0) {
						i = 6;
						$("#fdialog").hide();
						_this.startGameYesStatus();
						return;
					} else {
						i--;
						$("#time1").text(i);
					}
					timer2 = setTimeout(function() {
						settime1()
					}, 1000);
				}

				function settime2() {
					var timer3;
					clearTimeout(timer3);
					if(i == 0) {
						i = 6;
						$("#sdialog").hide();
						_this.startGameYesStatus();

						return;
					} else {
						i--;
						$("#time2").text(i);
					}
					timer3 = setTimeout(function() {
						settime2()
					}, 1000);
				}

				function faileddialog() {
					$('#fdialog').fadeIn('fast');
					$('#fdialog').show();
					isStart = "0";
					$("#headimgdiv img").attr("src", "");
					$("#headimgdiv").hide();
					$(".grab_dialog").hide();

					$('#fdialog').off("click").on('click', function(e) {
						$(this).fadeOut('fast');
						$(this).hide();
					});

					$('#playagain').off("click").on('click', function(e) {
						e.stopPropagation();
						$('#fdialog').fadeOut('fast');
						$('#fdialog').hide();
						Vue.$vux.loading.show({
							text: '加载中'
						})
						var url = apiUrl + "api/room/api?token=" + token + "&room_id=" + roomid + "&api_name=room_game_start";
						$.get(url, function(data) {
							var data = JSON.parse(data);
							var game_id = data.data.id;
							if(data.code == '1') {
								isStart = '1';
							}
							if(my_wait_rownum == '1') {
								var yx = localStorage.getItem("yx");
								//娃娃币总数
								var totalcoin = $("#totalcoin").html();
								var spendcoin = $("#spendcoin").html();
								var itotalcoin = parseInt(totalcoin);
								var ispendcoin = parseInt(spendcoin);
								var coin = itotalcoin - ispendcoin;
								$("#chat_pannel").hide();
								if(data.code == '-1004') {
									// 娃娃币不足
									_this.isShowRcAlert = true
								}
								if(data.code == '1') {
									if(yx == '1') {
										start_music.play();
									}
									startGame() //启动直播视频
									//倒计时
									countdown = 30;
									settime();
									$("#totalcoin").html(coin);
									$("#ctrl_pannel1").hide();
									$("#ctrl_pannel2").show();
									onSendMsg("开始游戏", 2, game_id);
								}
							}

							Vue.$vux.loading.hide()

						});

					});

					//播放音乐
					var fail_music = document.getElementById('fail_music');
					fail_music.play();
					settime1();
					return false;
				}

				function successdialog() {
					$('#sdialog').fadeIn('fast');
					$('#sdialog').show();
					isStart = "0";
					$("#headimgdiv img").attr("src", "");
					$("#headimgdiv").hide();
					$(".grab_dialog").hide();

					$('#sdialog').off("click").on('click', function() {
						$(this).fadeOut('fast');
						$(this).hide();
					});
					$('#playagain2').off("click").on('click', function(event) {
						event.stopPropagation();
						$('#sdialog').fadeOut('fast');
						$('#sdialog').hide();
						Vue.$vux.loading.show({
							text: '加载中'
						})
						var url = apiUrl + "api/room/api?token=" + token + "&room_id=" + roomid + "&api_name=room_game_start";
						var self = this;
						$.get(url, function(data) {
							var data = JSON.parse(data);
							var game_id = data.data.id;
							if(data.code == '1') {
								isStart = '1';
							}
							if(my_wait_rownum == '1') {
								var yx = localStorage.getItem("yx");
								//娃娃币总数
								var totalcoin = $("#totalcoin").html();
								var spendcoin = $("#spendcoin").html();
								var itotalcoin = parseInt(totalcoin);
								var ispendcoin = parseInt(spendcoin);
								var coin = itotalcoin - ispendcoin;
								$("#chat_pannel").hide();
								if(data.code == '-1004') {
									// 娃娃币不足
									_this.isShowRcAlert = true
								}
								if(data.code == '1') {
									if(yx == '1') {
										start_music.play();
									}
									startGame() //启动直播视频
									//倒计时
									countdown = 30;
									settime();
									$("#totalcoin").html(coin);
									$("#ctrl_pannel1").hide();
									$("#ctrl_pannel2").show();
									onSendMsg("开始游戏", 2, game_id);
								}
							}

							Vue.$vux.loading.hide()

						});

					});

					//播放音乐
					var success_music = document.getElementById('success_music');
					success_music.play();
					settime2();
				}

			},

			getAjaxExitRoom() {
				var self = this;
				$.ajax({
					type: "get",
					url: apiUrl + "api/room/api",
					data: {
						api_name: 'exit_room',
						room_id: self.rid,
						token: token
					},
					success: function(res) {}
				});
			},

			toRoomDetail() {
				this.$router.push({
					path: "/index_wawa_detail/",
					query: {
						img: this.imgDetails,
						rid: this.rid
					}
				})
			},
			toShop() {
				this.$router.push({
					path: "/userpage_shop/"
				})
			},

			rchargeAlert() {
				this.isShowRcAlert = false
			},

			startGameNotStatus() {
				$(".startgame").addClass("not_startgame");
				this.startgameText = "等待开始";
			},
			startGameYesStatus() {
				$(".startgame").removeClass("not_startgame");
				this.startgameText = "开始游戏";
			},
			getPelList() {
				//观众列表
				var self = this;
				$.ajax({
					type: "get",
					url: apiUrl + "api/mywawa/api?token=" + token,
					data: {
						api_name: 'game_audience',
						room_id: self.rid
					},
					success: function(res) {
						var data = JSON.parse(res);
						self.peopleList = data.data;
						self.total = data.total;
						for(var i in self.peopleList) {
							if(self.peopleList[i].avatar == "" || self.peopleList[i].avatar == apiUrl) {
								self.peopleList[i].avatar = defaultHeadImg;
							}
						}
					}
				});
			},
			getPelInfo() {
				var uid = getCookie("uid");
				//个人信息
				$.ajax({
					type: "get",
					url: apiUrl + "api/public/?service=User.getBaseInfo",
					data: {
						token: token,
						uid: uid
					},
					success: function(res) {
						var coin = res.data.coin;
						$("#totalcoin").html(coin);
					}
				});
			},
			getTicket() { //获取ticket
				var nowUrl = window.location.href;
				if(window.location.hash.length) {
					nowUrl = nowUrl.substr(0, nowUrl.indexOf(window.location.hash));
				}
				$.ajax({
					type: "post",
					url: apiUrl + "api/usercode/get_ticket",
					data: {
						token: token,
					},
					success: function(res) {
						var data = JSON.parse(res);
						var timestamp = (new Date().getTime() / 1000).toFixed(0);
						var nonceStr = Math.random().toString(36).substr(2);
						var ticket = wx_js();
						var bgmusic = localStorage.getItem("bgmusic");
						var bg_music = document.getElementById('bg_music');
						wx.config({
							// 配置信息
							debug: false,
							appId: 'wxa5547e3852c868cc',
							timestamp: timestamp,
							nonceStr: nonceStr,
							signature: ticket,
							jsApiList: ['onMenuShareAppMessage']
						});

						wx.ready(function() {
							if(bgmusic == '1') {
								// 解决ios音乐不自动播放的问题
								bg_music.play();
							}

							wx.onMenuShareAppMessage({
								title: '娃娃来了', // 分享标题
								desc: '在线实景抓娃娃，抓到还能包邮到家', // 分享描述
								link: '', // 分享链接
								imgUrl: 'http://wawah5-1252571264.file.myqcloud.com/newimg/login_logo.png', // 分享图标
								success: function() {
									// 用户确认分享后执行的回调函数
								},
								cancel: function() {
									// 用户取消分享后执行的回调函数
								}
							});
						});

						function wx_js(signature) {
							var a = data.data;
							var b = nonceStr;
							var c = timestamp;
							var d = nowUrl;
							var e = decodeURIComponent('jsapi_ticket=' + a + '&noncestr=' + b + '&timestamp=' + c + '&url=' + d + '').split("#")[0],
								s = new jsSHA(e, "TEXT"),
								signature = s.getHash("SHA-1", "HEX");

							return signature;
						}
					}

				});

				//签名加密算法
				(function(D) {
					function p(b, e, c) {
						var a = 0,
							d = [0],
							f = "",
							g = null,
							f = c || "UTF8";
						if("UTF8" !== f && "UTF16" !== f) throw "encoding must be UTF8 or UTF16";
						if("HEX" === e) {
							if(0 !== b.length % 2) throw "srcString of HEX type must be in byte increments";
							g = v(b);
							a = g.binLen;
							d = g.value
						} else if("TEXT" === e) g = w(b, f), a = g.binLen, d = g.value;
						else if("B64" === e) g = x(b), a = g.binLen, d = g.value;
						else if("BYTES" === e) g = y(b), a = g.binLen, d = g.value;
						else throw "inputFormat must be HEX, TEXT, B64, or BYTES";
						this.getHash = function(b, f, c, e) {
							var g = null,
								h = d.slice(),
								l = a,
								n;
							3 === arguments.length ? "number" !== typeof c && (e = c, c = 1) : 2 === arguments.length && (c = 1);
							if(c !== parseInt(c, 10) || 1 > c) throw "numRounds must a integer >= 1";
							switch(f) {
								case "HEX":
									g = z;
									break;
								case "B64":
									g = A;
									break;
								case "BYTES":
									g = B;
									break;
								default:
									throw "format must be HEX, B64, or BYTES";
							}
							if("SHA-1" === b)
								for(n = 0; n < c; n += 1) h = s(h, l), l = 160;
							else throw "Chosen SHA variant is not supported";
							return g(h, C(e))
						};
						this.getHMAC = function(c, b, e, g, q) {
							var h, l, n, r, p = [],
								t = [];
							h = null;
							switch(g) {
								case "HEX":
									g = z;
									break;
								case "B64":
									g =
										A;
									break;
								case "BYTES":
									g = B;
									break;
								default:
									throw "outputFormat must be HEX, B64, or BYTES";
							}
							if("SHA-1" === e) l = 64, r = 160;
							else throw "Chosen SHA variant is not supported";
							if("HEX" === b) h = v(c), n = h.binLen, h = h.value;
							else if("TEXT" === b) h = w(c, f), n = h.binLen, h = h.value;
							else if("B64" === b) h = x(c), n = h.binLen, h = h.value;
							else if("BYTES" === b) h = y(c), n = h.binLen, h = h.value;
							else throw "inputFormat must be HEX, TEXT, B64, or BYTES";
							c = 8 * l;
							b = l / 4 - 1;
							if(l < n / 8) {
								if("SHA-1" === e) h = s(h, n);
								else throw "Unexpected error in HMAC implementation";
								h[b] &= 4294967040
							} else l > n / 8 && (h[b] &= 4294967040);
							for(l = 0; l <= b; l += 1) p[l] = h[l] ^ 909522486, t[l] = h[l] ^ 1549556828;
							if("SHA-1" === e) e = s(t.concat(s(p.concat(d), c + a)), c + r);
							else throw "Unexpected error in HMAC implementation";
							return g(e, C(q))
						}
					}

					function w(b, e) {
						var c = [],
							a, d = [],
							f = 0,
							g;
						if("UTF8" === e)
							for(g = 0; g < b.length; g += 1)
								for(a = b.charCodeAt(g), d = [], 128 > a ? d.push(a) : 2048 > a ? (d.push(192 | a >>> 6), d.push(128 | a & 63)) : 55296 > a || 57344 <= a ? d.push(224 | a >>> 12, 128 | a >>> 6 & 63, 128 | a & 63) : (g += 1, a = 65536 + ((a & 1023) << 10 | b.charCodeAt(g) & 1023),
										d.push(240 | a >>> 18, 128 | a >>> 12 & 63, 128 | a >>> 6 & 63, 128 | a & 63)), a = 0; a < d.length; a += 1)(f >>> 2) + 1 > c.length && c.push(0), c[f >>> 2] |= d[a] << 24 - f % 4 * 8, f += 1;
						else if("UTF16" === e)
							for(g = 0; g < b.length; g += 1)(f >>> 2) + 1 > c.length && c.push(0), c[f >>> 2] |= b.charCodeAt(g) << 16 - f % 4 * 8, f += 2;
						return {
							value: c,
							binLen: 8 * f
						}
					}

					function v(b) {
						var e = [],
							c = b.length,
							a, d;
						if(0 !== c % 2) throw "String of HEX type must be in byte increments";
						for(a = 0; a < c; a += 2) {
							d = parseInt(b.substr(a, 2), 16);
							if(isNaN(d)) throw "String of HEX type contains invalid characters";
							e[a >>> 3] |=
								d << 24 - a % 8 * 4
						}
						return {
							value: e,
							binLen: 4 * c
						}
					}

					function y(b) {
						var e = [],
							c, a;
						for(a = 0; a < b.length; a += 1) c = b.charCodeAt(a), (a >>> 2) + 1 > e.length && e.push(0), e[a >>> 2] |= c << 24 - a % 4 * 8;
						return {
							value: e,
							binLen: 8 * b.length
						}
					}

					function x(b) {
						var e = [],
							c = 0,
							a, d, f, g, m;
						if(-1 === b.search(/^[a-zA-Z0-9=+\/]+$/)) throw "Invalid character in base-64 string";
						a = b.indexOf("=");
						b = b.replace(/\=/g, "");
						if(-1 !== a && a < b.length) throw "Invalid '=' found in base-64 string";
						for(d = 0; d < b.length; d += 4) {
							m = b.substr(d, 4);
							for(f = g = 0; f < m.length; f += 1) a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(m[f]),
								g |= a << 18 - 6 * f;
							for(f = 0; f < m.length - 1; f += 1) e[c >> 2] |= (g >>> 16 - 8 * f & 255) << 24 - c % 4 * 8, c += 1
						}
						return {
							value: e,
							binLen: 8 * c
						}
					}

					function z(b, e) {
						var c = "",
							a = 4 * b.length,
							d, f;
						for(d = 0; d < a; d += 1) f = b[d >>> 2] >>> 8 * (3 - d % 4), c += "0123456789abcdef".charAt(f >>> 4 & 15) + "0123456789abcdef".charAt(f & 15);
						return e.outputUpper ? c.toUpperCase() : c
					}

					function A(b, e) {
						var c = "",
							a = 4 * b.length,
							d, f, g;
						for(d = 0; d < a; d += 3)
							for(g = (b[d >>> 2] >>> 8 * (3 - d % 4) & 255) << 16 | (b[d + 1 >>> 2] >>> 8 * (3 - (d + 1) % 4) & 255) << 8 | b[d + 2 >>> 2] >>> 8 * (3 - (d + 2) % 4) & 255, f = 0; 4 > f; f += 1) c = 8 * d + 6 * f <= 32 * b.length ? c +
								"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(g >>> 6 * (3 - f) & 63) : c + e.b64Pad;
						return c
					}

					function B(b) {
						var e = "",
							c = 4 * b.length,
							a, d;
						for(a = 0; a < c; a += 1) d = b[a >>> 2] >>> 8 * (3 - a % 4) & 255, e += String.fromCharCode(d);
						return e
					}

					function C(b) {
						var e = {
							outputUpper: !1,
							b64Pad: "="
						};
						try {
							b.hasOwnProperty("outputUpper") && (e.outputUpper = b.outputUpper), b.hasOwnProperty("b64Pad") && (e.b64Pad = b.b64Pad)
						} catch(c) {}
						if("boolean" !== typeof e.outputUpper) throw "Invalid outputUpper formatting option";
						if("string" !== typeof e.b64Pad) throw "Invalid b64Pad formatting option";
						return e
					}

					function q(b, e) {
						return b << e | b >>> 32 - e
					}

					function r(b, e) {
						var c = (b & 65535) + (e & 65535);
						return((b >>> 16) + (e >>> 16) + (c >>> 16) & 65535) << 16 | c & 65535
					}

					function t(b, e, c, a, d) {
						var f = (b & 65535) + (e & 65535) + (c & 65535) + (a & 65535) + (d & 65535);
						return((b >>> 16) + (e >>> 16) + (c >>> 16) + (a >>> 16) + (d >>> 16) + (f >>> 16) & 65535) << 16 | f & 65535
					}

					function s(b, e) {
						var c = [],
							a, d, f, g, m, p, u, k, s, h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
						b[e >>> 5] |= 128 << 24 - e % 32;
						b[(e + 65 >>> 9 << 4) + 15] = e;
						s = b.length;
						for(u = 0; u < s; u += 16) {
							a = h[0];
							d = h[1];
							f = h[2];
							g = h[3];
							m = h[4];
							for(k = 0; 80 > k; k += 1) c[k] = 16 > k ? b[k + u] : q(c[k - 3] ^ c[k - 8] ^ c[k - 14] ^ c[k - 16], 1), p = 20 > k ? t(q(a, 5), d & f ^ ~d & g, m, 1518500249, c[k]) : 40 > k ? t(q(a, 5), d ^ f ^ g, m, 1859775393, c[k]) : 60 > k ? t(q(a, 5), d & f ^ d & g ^ f & g, m, 2400959708, c[k]) : t(q(a, 5), d ^ f ^ g, m, 3395469782, c[k]), m = g, g = f, f = q(d, 30), d = a, a = p;
							h[0] = r(a, h[0]);
							h[1] = r(d, h[1]);
							h[2] = r(f, h[2]);
							h[3] = r(g, h[3]);
							h[4] = r(m, h[4])
						}
						return h
					}
					"function" === typeof define && define.amd ? define(function() {
							return p
						}) : "undefined" !== typeof exports ? "undefined" !== typeof module && module.exports ? module.exports =
						exports = p : exports = p : D.jsSHA = p
				})(window);
			}

		},
		data() {
			return {
				peopleList: [],
				imgDetails: [],
				isShowRcAlert: false,
				sendList: [],
				keyWordList: [],
				rid: this.$route.query.rid,
				startgameText: "开始游戏",
				isShowShare: false,
				isPh: true,
				total: 0,
			}
		},
		beforeDestroy: function() {
			PDWaWaJi.destroy();
			this.getAjaxExitRoom();
			Vue.$vux.loading.hide();
			webim.logout(
				function(resp) {
					console.log("房间退出了")
				},
				function(err) {
					console.log(err);
				}
			);

			//			var options = {
			//				'GroupId': this.rid, //群id
			//			};
			//			webim.quitBigGroup(
			//				options,
			//				function(resp) {
			//					console.log('房间退群成功');
			//				},
			//				function(err) {
			//					console.log("房间内操作   " + err.ErrorInfo)
			//					alert(err.ErrorInfo);
			//				}
			//			);

		},
		created: function() {

		},
		mounted: function() {

			//判断ios还是android
			var u = navigator.userAgent;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			if(isiOS) {
				var ver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
				ver = parseInt(ver[1], 10);
				if(ver < 10) {
					this.$vux.confirm.show({
						title: "网页版暂不支持iOS9及以下系统，您可以下载App进行游戏",
						theme: "android",
						confirmText: "下载APP",
						cancelText: "关闭",
						hideOnBlur: true,
						onConfirm() {
							window.location.href = downUrl;
						}
					})
					return;
				}
			}

			$("#chat_content").height($(window).width());

			this.$nextTick(function() {
				Vue.$vux.loading.show({
					text: '进入房间'
				});

				var picGiftIcon = this.$route.query.gifticon;
				if(picGiftIcon != undefined) {
					$(".placeholderImg").css("background-image", "url(" + picGiftIcon + ")");
				}

				var token = getCookie("token");
				var xroomid = this.$route.query.rid;
				var user_sig = getCookie("user_sig");
				var uid = getCookie("uid");
				$("#room_id").val(xroomid);
				var room_id = xroomid;
				var uname = localStorage.getItem("user_name");
				var self = this;
				var url = apiUrl + "api/room/api?token=" + token + "&room_id=" + room_id + "&api_name=room_info";

				$.get(url, function(res) {
					if(res != "") {
						var dataobj = JSON.parse(res);
						dataobj = dataobj.data;
						var txrid = dataobj.channel_no;
						var video_sig = dataobj.video_sig;
						var front_live = dataobj.front_live;
						var side_live = dataobj.side_live;
						var spendcoin = dataobj.spendcoin;
						var userlist = dataobj.userlist;
						var chargecoin = dataobj.needcoin;
						var imglist = dataobj.imglist;
						var grablist = dataobj.grablist;
						var servicelist = dataobj.servicelist;
						var xrechargelist = dataobj.rechargelist;
						var gifticon = dataobj.gifticon;

						var userid = 'wawaji_' + uid;
						self.roominit(room_id, txrid, front_live, side_live, video_sig, userid, user_sig, token, uname);

						if(picGiftIcon == undefined) {
							$(".placeholderImg").css("background-image", "url(" + gifticon + ")");
						}
						$("#bg_music").attr("src", dataobj.bgmusic);
						$("#spendcoin").html(spendcoin);
						$("#success_gift_img").attr("src", gifticon);
						$("#userlist").html(userlist);
						$("#chargecoin").html(chargecoin);
						$("#imglist").html(imglist);
						$("#grablist").html(grablist);
						$("#servicelist").html(servicelist);
						$("#rechargelist").html(xrechargelist);

						self.imgDetails = JSON.stringify(dataobj.img);

						now_user = dataobj.now_user;
						now_game = dataobj.now_game;

						// 设置自己退出房间后重新进入房间的倒计时时间
						if(now_game != null || now_game != undefined) {
							countdown = now_game.gametime - (parseInt(new Date() / 1000) - now_game.ctime);
						}

						my_wait_rownum = dataobj.my_wait_rownum;

						if(my_wait_rownum == '0') {
							self.startGameNotStatus();
							if(now_user != undefined || now_user != null) {
								$("#headimgdiv").show();
								$("#headimgdiv img").attr("src", now_user.avatar);
								if(now_user.id == uid) { //自己在玩
									isStart = "1";
									$("#ctrl_pannel1").hide();
									$("#ctrl_pannel2").show();
								}
							}
						}

					}
				});

				//聊天快捷短语
				// $.ajax({
				// type: "get",
				// url: apiUrl + "api/set/api",
				// data: {
				// token: token,
				// api_name: 'get_quick'
				// },
				// success: function(res) {
				// var data = JSON.parse(res);
				// self.sendList = data.data;
				// }
				// });

				//聊天屏蔽关键字
				// $.ajax({
				// type: "get",
				// url: apiUrl + "api/set/api",
				// data: {
				// token: token,
				// api_name: 'get_keyword'
				// },
				// success: function(res) {
				// var data = JSON.parse(res);
				// self.keyWordList = data.data;
				// }
				// });

			});

		}
	}
</script>

<style lang="less">
	[v-cloak] {
		display: none;
	}
	
	.room_close {
		width: 0.7rem;
		height: 0.7rem;
		background-size: 100% 100%;
		background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/close.png);
		position: absolute;
		left: 0.2rem;
		top: 0.3rem;
		display: block;
		z-index: 3;
	}
	
	.room_video {
		width: 0.9rem;
		height: 0.9rem;
		background-size: 100% 100%;
		background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/video_icon.png);
		position: absolute;
		top: 4rem;
		right: 0;
		display: block;
		z-index: 6666;
	}
	
	.ctrl_pannel_box {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/room_bg.png);
		background-size: 100% 100%;
		height: 3.15rem;
		& * {
			position: relative;
			z-index: 3;
		}
	}
	
	.gold_icon {
		width: 0.3rem;
		height: 0.32rem;
		background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/gold_icon.png);
		background-size: 100% 100%;
		margin-right: 0.1rem;
		display: inline-block;
		vertical-align: middle;
	}
	
	.ctrl_pannel1 {
		padding-top: 0.1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		&>div {
			width: 1.2rem;
			height: 1.2rem;
			background-size: 100% 100%;
			&.startgame {
				width: 2.36rem;
				height: 1.86rem;
				background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/begin.png);
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-content: center;
				text-align: center;
				.spendcoin {
					font-size: 0.36rem;
					color: #fff;
					display: inline-block;
					vertical-align: middle;
				}
				.stargame_text {
					color: #fff;
					font-size: 0.32rem;
				}
				&.not_startgame {
					background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/beigin_not.png);
					.gold_icon {
						background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/coin_grey.png);
					}
				}
			}
			&.room_chat {
				background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/say_icon.png);
			}
			&.room_detail {
				margin-left: 0.8rem;
				background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/detail_icon.png);
			}
			&.room_recharge {
				margin-right: 0.8rem;
				background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/recharge_icon.png);
				a {
					display: block;
					height: 100%;
				}
			}
			&.room_share {
				background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/share_icon.png);
			}
		}
		.total_coin_box {
			position: absolute;
			right: 0.2rem;
			top: 0.3rem;
			background-color: #fff;
			width: 1.7rem;
			height: 0.6rem;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 0.3rem;
			.totalcoin {
				font-size: 0.32rem;
				color: #FE5F52;
				display: inline-block;
				vertical-align: middle;
			}
		}
	}
	
	.ctrl_pannel2 {
		height: 100%;
		.ctrl_btn {
			-webkit-user-select: none;
			user-select: none;
			width: 1.3rem;
			height: 1.3rem;
			position: absolute;
			background-size: 100% 100%;
			&.ctrl_left {
				top: 1.06rem;
				left: 0.63rem;
				background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/left.png);
			}
			&.ctrl_right {
				top: 1.06rem;
				left: 3.4rem;
				background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/right.png);
			}
			&.ctrl_down {
				bottom: 0.15rem;
				left: 2.04rem;
				background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/down.png);
			}
			&.ctrl_up {
				top: 0.15rem;
				left: 2.04rem;
				background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/up.png);
			}
		}
		.ctrl_grab_box {
			position: absolute;
			right: 0.4rem;
			top: 0.4rem;
			text-align: center;
			width: 2.04rem;
			.ctrl_grab {
				width: 2.04rem;
				height: 2.04rem;
				background-size: 100% 100%;
				background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/start.png);
			}
			.time {
				color: #000;
				font-size: 0.28rem;
				span {
					color: #FD483A;
					margin: 0 0.03rem;
				}
			}
		}
	}
	
	.people_total {
		width: 2.2rem;
		position: absolute;
		text-align: center;
		top: 0.4rem;
		left: 50%;
		transform: translateX(-50%);
		color: #fff;
		font-size: 0.32rem;
	}
	
	.people_list {
		position: absolute;
		right: 0.2rem;
		top: 0.4rem;
		width: 2.33rem;
		height: 0.5rem;
		overflow: hidden;
		ul {
			width: 100%;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			li {
				width: 0.5rem;
				height: 0.5rem;
				border-radius: 50%;
				overflow: hidden;
				margin: 0 0.03rem;
			}
		}
	}
	
	.fail_winpop {
		height: 100%;
		dl {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 100%;
			dt {
				width: 4.32rem;
				height: 4.17rem;
			}
			dd {
				margin-top: 0.5rem;
				padding: 0 2.42rem;
				.this_btn {
					background-color: #FE5F52;
					font-size: 0.28rem;
					color: #fff;
				}
			}
		}
	}
	
	.status_winpop {
		.winpop_close {
			top: 1.42rem;
			right: 1.25rem;
		}
	}
	
	.success_winpop {
		height: 100%;
		dl {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 100%;
			dt {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.success_title {
					width: 4.92rem;
					height: 0.78rem;
					background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/win_title.png);
					background-size: 100% 100%;
					margin-top: 1.47rem;
				}
				.success_gift {
					width: 7.5rem;
					height: 7.37rem;
					background-image: url(http://wawah5-1252571264.file.myqcloud.com/newimg/win_status.png);
					background-size: 100% 100%;
					text-align: center;
					overflow: hidden;
					img {
						width: 4.5rem;
						height: 4.57rem;
						border-radius: 50%;
						margin-top: 1.42rem;
					}
				}
			}
			dd {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 0.8rem;
				width: 100%;
				.this_btn {
					background-color: #FE5F52;
					font-size: 0.28rem;
					color: #fff;
					padding: 0;
					width: 2.6rem;
					height: 0.8rem;
				}
				.share_btn {
					background-color: #9C35FF;
				}
			}
		}
	}
	
	.grab_dialog {
		width: 3rem;
		height: 0.5rem;
		line-height: 0.5rem;
		position: fixed;
		bottom: 3.6rem;
		left: 50%;
		text-align: center;
		color: #fff;
		font-size: 0.24rem;
		transform: translateX(-50%);
		border-radius: 0.25rem;
		background-color: rgba(0, 0, 0, .6);
	}
	
	.weui-dialog {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		padding: 0.8rem 0;
		max-width: 5.6rem;
		height: 3.2rem;
		border-radius: 0.2rem;
		.weui-dialog__hd {
			text-align: center;
			padding: 0 0.7rem;
		}
		.weui-dialog__bd {
			padding-top: 0.1rem;
			div {
				font-size: 0.26rem;
			}
		}
		.weui-dialog__title {
			font-size: 0.3rem;
		}
		.weui-dialog__ft {
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0;
			&:after {
				display: none;
			}
		}
		.weui-dialog__btn {
			width: auto;
			padding: 0 0.5rem;
			height: 0.8rem;
			border-radius: 0.4rem;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 0.28rem;
		}
		.weui-dialog__btn_default {
			background-color: #EBEBEB;
			margin-right: 0.3rem;
		}
		.weui-dialog__btn_primary {
			background-color: #FFEA7D;
			color: #000;
		}
		&.weui-skin_android {
			max-width: 5.6rem;
			height: 3.2rem;
			border-radius: 0.2rem;
			.weui-dialog__hd {
				text-align: center;
				padding: 0 0.3rem;
			}
			.weui-dialog__title {
				font-size: 0.28rem;
			}
			.weui-dialog__ft {
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0;
			}
			.weui-dialog__btn {
				width: 2rem;
				height: 0.8rem;
				border-radius: 0.4rem;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 0.28rem;
			}
			.weui-dialog__btn_default {
				background-color: #EBEBEB;
			}
			.weui-dialog__btn_primary {
				background-color: #FFEA7D;
				color: #000;
				margin-left: 0.3rem;
			}
		}
		.weui-dialog__btn {
			width: 2rem;
			padding: 0;
		}
	}
	
	.headimg {
		width: 0.7rem;
		height: 0.7rem;
		position: absolute;
		left: 1.14rem;
		top: 0.3rem;
		display: none;
		img {
			border-radius: 50%;
		}
	}
	
	.rcharge_winpop {
		display: block;
		background-color: #fff;
		.winpop_main {
			dl {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 100%;
				dt {
					img {
						width: 1.59rem;
						height: 1.5rem;
					}
					p {
						font-size: 0.28rem;
						color: #000;
						margin-top: 0.2rem;
					}
				}
				dd {
					margin-top: 0.4rem;
					.this_btn {
						width: 3.93rem;
					}
				}
			}
		}
	}
	
	#chat_pannel {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 9999;
		background-color: #ffffff;
		text-align: center;
		vertical-align: middle;
		display: none
	}
	
	.chat_btn_list {
		padding: 0.1rem;
		text-align: left;
		.quite_send {
			background-color: #fff;
			font-size: 0.22rem;
			border-radius: 0.25rem;
			height: 0.5rem;
			padding: 0 0.15rem;
			margin-right: 0.1rem;
			color: #000;
			outline: none;
			border: 1px solid #ffea7d;
			margin-bottom: 0.1rem;
		}
	}
	
	.chat_input_list {
		text-align: left;
		padding: 0.1rem;
		border-top: 1px solid #dadada;
		display: flex;
		justify-content: space-between;
		align-items: center;
		input[type=text] {
			width: 80%;
			border-radius: 0.2rem;
			border: 1px solid #DADADA;
			height: 0.5rem;
			line-height: 0.5rem;
			text-align: left;
			vertical-align: middle;
			padding-left: 0.1rem;
			outline: none;
			-webkit-appearance: none;
		}
		#send {
			background-color: #ffea7d;
			width: 18%;
			height: 0.5rem;
			border-radius: 0.25rem;
			border: none;
			color: #000;
			outline: none;
		}
	}
	
	.barrage {
		transform: translate3d(0, 0, 0);
	}
	
	.barrage_box div.p a {
		text-decoration: none;
		font-size: 0.26rem;
	}
	
	.placeholderImgBox {
		left: 0;
		top: 0;
		background-color: #dedede;
		position: fixed;
		width: 100%;
		height: calc(100% - 3.15rem);
		z-index: 111111;
	}
	
	.placeholderImg {
		filter: blur(0.3rem);
		background-size: 100% 100%;
		height: 100%;
		width: 100%;
		position: absolute;
	}
	
	.placeholder {
		height: 100%;
		width: 100%;
		margin: 0 auto;
		z-index: 0;
		position: fixed;
	}
	
	#chat_content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		top: 1rem;
		width: 100%;
		z-index: 1;
	}
</style>