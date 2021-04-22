# 小du-Api

[TOC]

## pub

- 测试域名: x
- 渠道id: 1

## 用户注册登陆

### 登陆:  `/login/ajax`

- lname: 登陆名
- lpwd: 密码
- lgid: 游戏id
- lcid: 包id 1

## 注册

### 注册:  `/reg/ajax`
- rname:用户名
- rpwd:密码
- rpwd2:验证密码
- rchannel: 包id 1
- rgid: 游戏id 

### 手机注册: `/reg/ajax2`

- rname: 手机号
- rpwd: 密码
- rcode: 短信
- rchannel: 包id 1
- rgid: 游戏id

### 手机注册发送短信: `/reg/send-sms` _method: POST_

- phone_num: 手机号码


### 自动注册: `/auto-login/ajax` _get_

- ch_id: 渠道id
- game_id: 游戏id


### 退出登陆 `/login/out`

## 找回/重置密码

### 登陆状态下, 根据旧密码设置新密码 `/reset-pwd/index` _method: post_

- opwd: 旧密码
- npwd: 新密码
- npwd2: 新密码验证


### 手机号码修改密码 `/phone-reset-pwd/index2` _method:post_

- phone_number: 手机号
- sms:短信
- pwd:新密码

### 手机号码修改密码-发送短信 `/phone-reset-pwd/send-sms`

- phone_number:手机号

## 绑定手机

### 绑定手机  `/bind-phone/index` _method: post_


- phone_num: 手机号码
- sms: 短信

### 发送短信 `/bind-phone/send-sms` _method:post_

- phone_num: 手机号码


### 修改/绑定 账号密码: `set-account-pwd/index` _post_
前提: 用户登陆状态
- account:新账号
- password: 新密码
- repassword: 新重复密码


## 用户中心/信息接口 `/xd-api/player-info`

- 未登陆,status == 403
- 登陆成功,返回用户信息

## 用户礼包列表 `/xd-api/player-gift`

- 未登陆,status == 403
- 参数: page[1-n]

## 页面

### 游戏首页
- `/xd-api/game-page`	
- 没有参数

### 最热游戏列表
- `/xd-api/hot-game-list` 
- get: 
    - page页码 1-n

### 最新游戏列表
- `/xd-api/new-game-list` 
- get: 
    - page页码 1-n

### 已开服务列表
- `/xd-api/before-kf`
- get
    - page [1-n] 
     
### 未开服务列表
- `/xd-api/after-kf`
- get
    - page [1-n] 

### 游戏内容
- `/xd-api/game-content`
- get: 
    - game_id 例如game_id=2

### 文章列表
`/xd-api/article-list` 
- get: 
    - type_id类型id(0为全部)
    - page页码[1-n] 

### 文章内容
- `/xd-api/article-content` 
- -get: 
    - id文章id,例如id=1

### 礼包列表
- `/xd-api/gift-list`
- page页码[1-n]