<view class="{{['mescroll-empty',(option.fixed)?'empty-fixed':'']}}" style="{{'z-index:'+(option.zIndex)+';'+('top:'+(option.top)+';')}}"><view><block qq:if="{{icon}}"><image class="empty-icon" src="{{icon}}" mode="widthFix"></image></block></view><block qq:if="{{tip}}"><view class="empty-tip">{{tip}}</view></block><block qq:if="{{option.btnText}}"><view data-event-opts="{{[['tap',[['emptyClick',['$event']]]]]}}" class="empty-btn" bindtap="__e">{{option.btnText}}</view></block></view>