<view data-event-opts="{{[['tap',[['setLoginDialogStatus',[false]]]]]}}" class="{{['cu-modal',getLoginDialogStatus?'show':'']}}" bindtap="__e"><view data-event-opts="{{[['tap',[['',['$event']]]]]}}" class="dialog-wrapper login-dialog-wrapper" catchtap="__e"><view class="login-dialog-title">请先登录</view><view class="login-dialog-btn"><button type="default" data-event-opts="{{[['tap',[['setLoginDialogStatus',[false]]]]]}}" catchtap="__e">取消</button><button type="primary" open-type="getUserInfo" lang="zh_CN" data-event-opts="{{[['getuserinfo',[['appLoginWeixin']]]]}}" bindgetuserinfo="__e">确定</button></view></view></view>