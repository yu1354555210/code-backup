<view class="content"><view class="task-header"><text>{{"可领红包个数："+totalNum}}</text><view data-event-opts="{{[['tap',[['e0',['$event']]]]]}}" class="task-rule-btn btn" bindtap="__e"><text>任务规则</text><image src="https://app1-api.qianr.com/static/bonus/icon-help.png" mode="aspectFill"></image></view></view><block qq:if="{{dataList.length>0}}"><view class="task-video-box"><image class="image-bg" src="https://app1-api.qianr.com/static/bonus/task-video-bg.png" mode="aspectFill"></image><view class="task-video-title">看视频</view><view class="task-video-step"><block qq:for="{{imgList}}" qq:for-item="item" qq:for-index="index" qq:key="index"><image src="{{index<videoNum?'https://app1-api.qianr.com/static/bonus/task-video-ok.png':'https://app1-api.qianr.com/static/bonus/'+(index+1)+'.png'}}" mode="aspectFill"></image></block></view><view data-event-opts="{{[['tap',[['tapVideoAd']]]]}}" hidden="{{!(!isCountDown)}}" class="btn video-btn" bindtap="__e">{{videoNum==10?'已完成':'去完成'}}</view><view hidden="{{!(isCountDown)}}" class="btn video-btn countdown-btn"><countdown-timer generic:scoped-slots-default="task-countdown-timer-default" class="vue-ref" vue-id="96a68720-1" time="{{getTime}}" data-ref="countdown" data-event-opts="{{[['^finish',[['onFinish']]]]}}" bind:finish="__e" bind:__l="__l" vue-slots="{{['default']}}"></countdown-timer></view></view></block><view class="task-other-list"><block qq:for="{{$root.l0}}" qq:for-item="item" qq:for-index="index" qq:key="index"><block><block qq:if="{{item.$orig.name=='签到'}}"><view class="task-other-item"><image class="image-bg" src="https://app1-api.qianr.com/static/bonus/task-item-img1.png" mode="aspectFill"></image><view class="title">每日签到</view><view data-event-opts="{{[['tap',[['signIn',['$0'],[[['dataList','',index,'status']]]]]]]}}" class="{{['btn',item.$orig.status==1?'cur':'']}}" bindtap="__e">{{item.m0}}</view></view></block><block qq:if="{{item.$orig.name=='邀请好友'}}"><view class="task-other-item"><image class="image-bg" src="https://app1-api.qianr.com/static/bonus/task-item-img2.png" mode="aspectFill"></image><view class="title">新用户助力</view><block qq:if="{{getLoginStatus}}"><button class="{{['btn',item.$orig.status==1?'cur':'']}}" open-type="share" data-event-opts="{{[['tap',[['e1',['$event']]]]]}}" bindtap="__e">{{item.m1}}</button></block><block qq:else><view data-event-opts="{{[['tap',[['inviteShare']]]]}}" class="{{['btn',item.$orig.status==1?'cur':'']}}" bindtap="__e">{{item.m2}}</view></block></view></block><block qq:if="{{item.$orig.name=='分享群聊'}}"><view class="task-other-item"><image class="image-bg" src="https://app1-api.qianr.com/static/bonus/task-item-img3.png" mode="aspectFill"></image><view class="title">告诉朋友们</view><block><block qq:if="{{item.$orig.status==1}}"><view data-event-opts="{{[['tap',[['shareDialog']]]]}}" class="btn cur" bindtap="__e">{{item.m3}}</view></block><block qq:else><view data-event-opts="{{[['tap',[['tellFriend']]]]}}" class="btn" bindtap="__e">{{item.m4}}</view></block></block></view></block></block></block></view><view class="ad-view"><ad unit-id="adunit-77fa0902d43cd522"></ad></view><v-dialog data-custom-hidden="{{!(dialogType==1)}}" vue-id="96a68720-2" bind:__l="__l" vue-slots="{{['default']}}"><view class="dialog-rule"><view class="rule-title">规则</view><view class="rule-list"><text>1.完成当日任务，随机掉落红包次数</text><text>2.每日任务可能不同</text><text>3.新用户助力：只有邀请新用户才算哦</text></view></view></v-dialog><v-dialog data-custom-hidden="{{!(dialogType==2)}}" vue-id="96a68720-3" bind:__l="__l" vue-slots="{{['default']}}"><view class="dialog-text"><text>发送到群聊才有效哦~</text></view><button class="dialog-btn" open-type="share" data-event-opts="{{[['tap',[['e2',['$event']]]]]}}" bindtap="__e">去发送</button></v-dialog><view class="{{['cu-modal',isShowToast?'show':'']}}"><view class="toast-wrapper"><text>{{"完成"+taskName+"任务"}}</text><text>{{"可领取红包个数+"+bonus}}</text></view></view><v-login-model vue-id="96a68720-4" bind:__l="__l"></v-login-model></view>