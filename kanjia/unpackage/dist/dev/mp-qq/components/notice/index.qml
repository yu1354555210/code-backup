<view class="notice-content"><block wx:if="{{isShowNoitce}}"><block><block wx:if="{{isLottery}}"><block><view class="notice notice-lottery"><scroll-view style="height:60rpx;" scroll-y="true"><swiper class="swiper" autoplay="{{autoplay}}" interval="{{interval}}" duration="{{duration}}" vertical="{{vertical}}"><block wx:for="{{swiperList}}" wx:for-item="item" wx:for-index="index" wx:key="index"><swiper-item><image src="{{item.avatar}}" mode="aspectFill"></image><view class="text-red">{{''+item.username+"成功领取"}}<text>{{item.prize_name}}</text></view></swiper-item></block></swiper></scroll-view></view></block></block><block wx:else><block><view class="{{['notice',isHome?'notice-home':'']}}"><scroll-view style="height:60rpx;" scroll-y="true"><swiper class="swiper" autoplay="{{autoplay}}" interval="{{interval}}" duration="{{duration}}" vertical="{{vertical}}"><block wx:for="{{swiperList}}" wx:for-item="item" wx:for-index="index" wx:key="index"><swiper-item><image src="{{item.avatar}}" mode="aspectFill"></image><view class="{{[isHome?'text-yellow':'']}}">{{''+item.username+"成功领取"}}<text>{{item.active_name}}</text></view></swiper-item></block></swiper></scroll-view></view></block></block></block></block></view>