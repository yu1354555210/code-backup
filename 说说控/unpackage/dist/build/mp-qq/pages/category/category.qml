<view class="content"><block qq:for="{{dataList}}" qq:for-item="item" qq:for-index="index" qq:key="index"><view class="category-wrapper"><view class="title">{{item.title}}</view><view class="category-list"><block qq:for="{{item.cat}}" qq:for-item="it" qq:for-index="i" qq:key="i"><view data-event-opts="{{[['tap',[['toDetail',['$0'],[[['dataList','',index],['cat','',i]]]]]]]}}" class="category-item" bindtap="__e"><image src="{{it.image}}" mode="aspectFill"></image></view></block></view></view></block></view>