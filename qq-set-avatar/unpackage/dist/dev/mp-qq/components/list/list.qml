<view><view class="avatar-list"><block qq:for="{{$root.l0}}" qq:for-item="item" qq:for-index="index" qq:key="index"><view class="avatar-item"><view data-event-opts="{{[['tap',[['toDetail',['$0'],[[['dataList','',index,'img_a']]]]]]]}}" class="avatar-left avatar" bindtap="__e"><image src="{{item.g0}}" mode="aspectFill"></image></view><view class="avatar-heart"><image src="../../static/heart.png" mode="aspectFill"></image></view><view data-event-opts="{{[['tap',[['toDetail',['$0'],[[['dataList','',index,'img_b']]]]]]]}}" class="avatar-right avatar" bindtap="__e"><image src="{{item.g1}}" mode="aspectFill"></image></view></view></block></view></view>