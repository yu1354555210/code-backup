<template>
	<div>
		<!--抓到娃娃后系统通知-->
		<div class="notice_public fadeInDown animated" v-show="isHasNotice">
			<div class="notice_user_img">
				<img :src="avatar_thumb" />
			</div>
			<div class="notice_info" v-text="content"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				avatar_len: "",
				avatar_thumb: "", //公告头像
				content: "", //公告内容,
				isHasNotice: false, //是否有公告
				noticeArr: []
			}
		},
		methods: {
			//监听公告
			NoticeWebIm() {
				var user_id = getCookie("uid");
				user_id = 'wawaji_' + user_id;
				var self = this;
				var uid = user_id;
				var usig = getCookie("user_sig");
				var isLogOn = false;
				var accountMode = 0;
				var sdkAppID = 1400055660;
				var accountType = 20488;
				var avChatRoomId = '0';
				var curPlayAudio = null;
				var openEmotionFlag = false;
				var isAccessFormalEnv = true;

				var options = {
					'isAccessFormalEnv': isAccessFormalEnv,
					'isLogOn': isLogOn
				};

				if(webim.Tool.getQueryString("isAccessFormalEnv") == "false") {
					isAccessFormalEnv = false;
				}

				var listeners = {
					"onConnNotify": onConnNotify,
					"jsonpCallback": jsonpCallback,
					"onBigGroupMsgNotify": onBigGroupMsgNotify,
					"onMsgNotify": onMsgNotify,
					"onGroupSystemNotifys": onGroupSystemNotifys,
					"onGroupInfoChangeNotify": onGroupInfoChangeNotify
				};

				var loginInfo = {
					'sdkAppID': sdkAppID,
					'appIDAt3rd': sdkAppID,
					'accountType': accountType,
					'identifier': uid,
					'identifierNick': "null",
					'userSig': usig,
					'headurl': ''
				};
//				sdkLogin();

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

				//监听大群新消息
				function onBigGroupMsgNotify(msgList) {
					for(var i = msgList.length - 1; i >= 0; i--) {
						var msg = msgList[i];

						try {
							var jsstr = tojson(msg);
							if(jsstr != "") {
								var msgobj = JSON.parse(jsstr);
								if(msgobj.type == 12) {
									$(".notice_public").removeClass("fadeOutDown").addClass("fadeInDown");
									if(self.noticeArr.length > 0) return;
									self.avatar_thumb = msgobj.new_notice.avatar_thumb;
									self.content = msgobj.new_notice.content;

									var obj = {
										"pic": self.avatar_thumb,
										"text": self.content
									}
									self.noticeArr.push(obj);
									self.isHasNotice = true;
									setTimeout(function() {
										$(".notice_public").removeClass("fadeInDown").addClass("fadeOutDown");
										self.noticeArr.length = 0;
									}, 1500)
								}

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

				function sdkLogin() {

					webim.login(loginInfo, listeners, options, function(identifierNick) {
							// webim.Log.info('webim登录成功');
							applyJoinBigGroup(avChatRoomId); //0群
						},
						function(err) {
							console.log("公告报错1" + err.ErrorInfo);
						}
					);
				}
				//进入大群
				function applyJoinBigGroup(groupId) {
					var options = {
						'GroupId': groupId //群id
					};
					webim.applyJoinBigGroup(options, function(resp) {
							if(resp.JoinedStatus && resp.JoinedStatus == 'JoinedSuccess') {
								selToID = groupId;
							} else {
								// alert('进群失败');
							}
						},
						function(err) {
							console.log("公告报错2" + err.ErrorInfo);
						}
					);
				}

				// function logout() {
				// webim.logout(
				// function(resp) {
				// // console.log('退出房间...');
				// }
				// );
				// }

				if(webim.Tool.getQueryString("groupid")) {
					avChatRoomId = webim.Tool.getQueryString("groupid");
				}

				var selType = webim.SESSION_TYPE.GROUP;
				var selToID = avChatRoomId;
				var selSess = null;

				var selSessHeadUrl = '';

				var onGroupSystemNotifys = {
					"5": onDestoryGroupNotify, //群被解散(全员接收)
					"11": onRevokeGroupNotify, //群已被回收(全员接收)
					"255": onCustomGroupNotify //用户自定义通知(默认全员接收)
				};

				var onConnNotify = function(resp) {
					switch(resp.ErrorCode) {
						case webim.CONNECTION_STATUS.ON:
							webim.Log.warn('连接状态正常...');
							break;
						case webim.CONNECTION_STATUS.OFF:
							webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
							break;
						default:
							webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
							break;
					}
				};
			}

		},
		beforeDestroy: function() {
//			var options = {
//				'GroupId': '0', //群id
//			};
//			webim.quitBigGroup(
//				options,
//				function(resp) {
//					console.log('首页退群成功');
//				},
//				function(err) {
//					console.log(err)
//					// alert(err.ErrorInfo);
//				}
//			);
			// webim.logout(
				// function(resp) {
					// console.log("首页退出了")
				// },
				// function(err) {
					// console.log(err)
				// }
			// );

		},
		destroyed: function() {

		},

		mounted: function() {
			var self = this;
			this.$nextTick(function() {
				self.NoticeWebIm();
			})

		}
	}
</script>

<style lang="less">
	[v-cloak] {
		display: none;
	}
	
	.animated {
		animation-duration: 0.5s;
	}
	
	.notice_user_img {
		overflow: hidden;
	}
</style>