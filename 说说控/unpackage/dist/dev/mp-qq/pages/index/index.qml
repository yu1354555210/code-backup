<view><image class="nav-to-top" src="../../static/nav-top.png" mode="aspectFill" data-event-opts="{{[['tap',[['toNavigateToMiniProgram']]]]}}" bindtap="__e"></image><view class="content"><view class="index-tab"><block qq:for="{{tabList}}" qq:for-item="item" qq:for-index="index" qq:key="index"><view data-event-opts="{{[['tap',[['selectTab',[index]]]]]}}" class="{{[tabIndex==index?'cur':'']}}" bindtap="__e">{{item}}</view></block></view><navigator class="search" url="../search/list-search" hover-class="none"><image src="../../static/search.png" mode="aspectFill"></image>搜索</navigator><t-list vue-id="57282994-1" dataList="{{dataList}}" bind:__l="__l"></t-list></view></view>