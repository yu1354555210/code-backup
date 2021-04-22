<view class="content"><view class="notice-box"><notice vue-id="1" isHome="{{true}}" bind:__l="__l"></notice></view><view class="focus"><image src="../../static/focus.jpg" mode="aspectFill"></image></view><block wx:if="{{newPersonGift}}"><view class="section"><view class="home-title"><view class="title-fl"><image src="../../static/icon-gift.png" mode="aspectFill"></image><text>新手福利</text></view><view class="title-fr">{{''+hour+"小时"+min+"分"+second+'秒后福利失效'}}</view></view><view class="list"><block wx:for="{{newPersonList}}" wx:for-item="item" wx:for-index="index" wx:key="index"><view class="item"><view class="item-fl"><image src="{{item.prize_image}}" mode="aspectFill"></image></view><view class="item-fr"><view class="item-title">{{item.name}}</view><block wx:if="{{item.bargain_status==1}}"><block><view class="progress-box"><progress percent="{{item.bargain_per}}" active stroke-width="8" border-radius="4" activeColor="#ff5754" backgroundColor="#d9d9d9"></progress></view><view class="item-bottom"><view class="percent">{{'已砍'+item.bargain_per+'%'}}</view><view class="outtime"><down-time vue-id="{{'2-'+index}}" endTime="{{item.expire_time}}" startTime="{{$root.g0}}" endMsg="{{砍价结束}}" bind:__l="__l"></down-time></view><button class="item-btn" type="primary" data-event-opts="{{[['tap',[['toDetail',['$0'],[[['newPersonList','',index,'id']]]]]]]}}" bindtap="__e">继续砍价</button></view></block></block><block wx:else><view class="item-bottom"><view class="user-num">{{item.own_user_number+"人已成功领取"}}</view><view class="pos-r"><block wx:if="{{!getLoginStatus}}"><button class="getuser-btn" type="primary" open-type="getUserInfo" data-router="detail" data-id="{{item.id}}" data-event-opts="{{[['getuserinfo',[['bindGetUserInfo',['$event']]]]]}}" bindgetuserinfo="__e"></button></block><button class="item-btn active" type="primary" data-event-opts="{{[['tap',[['toDetail',['$0'],[[['newPersonList','',index,'id']]]]]]]}}" bindtap="__e">点击免费拿</button></view></view></block></view></view></block></view></view></block><view class="section"><view class="home-title"><view class="title-fl"><image src="../../static/icon-kanjia.png" mode="aspectFill"></image><text>热门砍价</text></view></view><view class="list"><block wx:for="{{hotList}}" wx:for-item="item" wx:for-index="index" wx:key="index"><view class="item"><view class="item-fl"><image src="{{item.prize_image}}" mode="aspectFill"></image></view><view class="item-fr"><view class="item-title">{{item.name}}</view><block wx:if="{{item.bargain_status==1}}"><block><view class="progress-box"><progress percent="{{item.bargain_per}}" active stroke-width="8" border-radius="4" activeColor="#ff5754" backgroundColor="#d9d9d9"></progress></view><view class="item-bottom"><view class="percent">{{'已砍'+item.bargain_per+'%'}}</view><view class="outtime"><down-time vue-id="{{'3-'+index}}" endTime="{{item.expire_time}}" startTime="{{$root.g1}}" endMsg="{{砍价结束}}" bind:__l="__l"></down-time></view><button class="item-btn" type="primary" data-event-opts="{{[['tap',[['toDetail',['$0'],[[['hotList','',index,'id']]]]]]]}}" bindtap="__e">继续砍价</button></view></block></block><block wx:else><view class="item-bottom"><view class="user-num">{{item.own_user_number+"人已成功领取"}}</view><view class="pos-r"><block wx:if="{{!getLoginStatus}}"><button class="getuser-btn" type="primary" open-type="getUserInfo" data-router="detail" data-id="{{item.id}}" data-event-opts="{{[['getuserinfo',[['bindGetUserInfo',['$event']]]]]}}" bindgetuserinfo="__e"></button></block><button class="item-btn active" type="primary" data-event-opts="{{[['tap',[['toDetail',['$0'],[[['hotList','',index,'id']]]]]]]}}" bindtap="__e">点击免费拿</button></view></view></block></view></view></block></view></view><view class="fix-redbags swing"><image src="../../static/fix-redbags.png" mode="aspectFill" data-event-opts="{{[['tap',[['toLottery',['$event']]]]]}}" bindtap="__e"></image><block wx:if="{{!getLoginStatus}}"><button class="getuser-btn" type="primary" open-type="getUserInfo" data-router="lottery" data-event-opts="{{[['getuserinfo',[['bindGetUserInfo',['$event']]]]]}}" bindgetuserinfo="__e"></button></block></view><uni-popup class="vue-ref" vue-id="4" type="center" data-ref="redbagsPopup" bind:__l="__l" vue-slots="{{['default']}}"><view class="redbags-popup-wrapper"><image class="icon-close" src="../../static/icon-close.png" mode="aspectFill" data-event-opts="{{[['tap',[['e0',['$event']]]]]}}" bindtap="__e"></image><image class="redbags-popup" src="../../static/redbags-popup.png" mode="aspectFill" data-event-opts="{{[['tap',[['newPersonRedbags',['$0'],['newPersonData.id']]]]]}}" bindtap="__e"></image><block wx:if="{{!getLoginStatus}}"><button class="getuser-btn" type="primary" open-type="getUserInfo" data-router="detail" data-id="{{newPersonData.id}}" data-event-opts="{{[['getuserinfo',[['bindGetUserInfo',['$event']]]]]}}" bindgetuserinfo="__e"></button></block></view></uni-popup><uni-popup class="vue-ref" vue-id="5" type="center" data-ref="isWinPopup" bind:__l="__l" vue-slots="{{['default']}}"><view class="success-wrapper"><image class="icon-close" src="../../static/close.png" mode="aspectFill" data-event-opts="{{[['tap',[['e1',['$event']]]]]}}" bindtap="__e"></image><view class="success-award-info"><view><text>{{bargainData.name}}</text></view><view>砍价成功，快去领奖吧</view></view><image class="sucess-image" src="../../static/success-img.png" mode="aspectFill"></image><image class="success-btn" src="../../static/success-btn.png" mode="aspectFill" data-event-opts="{{[['tap',[['toAwardsPage',['$0'],['bargainData.id']]]]]}}" bindtap="__e"></image></view></uni-popup></view>