<template>
    <div class="wrapper">
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
            <x-header :left-options="{backText: ''}">数据统计</x-header>
            <div class="content">
                <div class="card-item firm margin-bottom-sm">
                    <div class="firm-top vux-1px-b">
                        <div class="firm-top-main">
                            <img :src="avatar" alt="">
                            <div class="firm-name" v-text="business.business_name"></div>
                            <div class="firm-id">( {{business.player_id}} )</div>
                        </div>
                        <router-link tag="div" to="/promotion" class="firm-top-url" @click.native="cnzzTrackEvent('商户合作-首页-推广链接')">
                            <i class="icon-url"></i>
                            <span>推广链接</span>
                        </router-link>
                    </div>
                    <div class="firm-main">
                        <dl>
                            <dt>我的余额 <router-link tag="span" to="/income" @click.native="cnzzTrackEvent('商户合作-首页-我的余额明细')">明细></router-link></dt>
                            <dd v-text="business.amount"></dd>
                        </dl>
                        <x-button type="primary" class="tx-btn radius" mini action-type="button" @click.native="toInviteCash">提现</x-button>
                    </div>
                </div>
                <div class="card-item total margin-bottom-sm">
                    <ul>
                        <li class="vux-1px-r">
                            <p class="total-th">今日总收益</p>
                            <p v-text="business_statis.amount"></p>
                        </li>
                        <li class="vux-1px-r">
                            <p class="total-th">今日总付费人数</p>
                            <p v-text="business_statis.pay"></p>
                        </li>
                        <li class="vux-1px-r">
                            <p class="total-th">今日总新增</p>
                            <p v-text="business_statis.new"></p>
                        </li>
                        <li>
                            <p class="total-th">今日总活跃</p>
                            <p v-text="business_statis.active"></p>
                        </li>
                    </ul>
                </div>
                <div class="card-item screen">
                    <div class="screen-top">
                        <div class="screen-select screen-select-name" @click="showPopupPicker=true">
                            <popup-picker :show.sync="showPopupPicker" :data="list1" v-model="value0" @on-change="change" ref="picker"></popup-picker>
                            <i class="icon-arrow-down"></i>
                        </div>
                        <div class="screen-select-box">
                            <div class="screen-select">
                                <datetime v-model="value1" @on-change="change1" :min-year="2019" :max-year="new Date().getFullYear()" format="YYYY-MM">
                                    <span v-text="value1"></span>
                                    <i class="icon-arrow-down"></i>
                                </datetime>
                            </div>
                        </div>
                    </div>
                    <div class="screen-main">
                        <div class="screen-table" v-show="isNodata" v-cloak>
                            <x-table style="background-color:#fff;">
                                <thead>
                                    <tr>
                                        <th>日期</th>
                                        <th>充值金额</th>
                                        <th>充值人数</th>
                                        <th>新增人数</th>
                                        <th>活跃人数</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in channel_statis">
                                        <td v-text="item.s_day_format"></td>
                                        <td v-text="item.amount"></td>
                                        <td v-text="item.pay"></td>
                                        <td v-text="item.new"></td>
                                        <td v-text="item.active"></td>
                                    </tr>
                                </tbody>
                            </x-table>
                        </div>
                        <div class="no-data" v-show="!isNodata" v-cloak>
                            <img src="https://h5.binglue.com/xd_static/img/not-gift.png" alt="">
                            <p>暂无数据</p>
                        </div>
                    </div>
                </div>
            </div>
        </mescroll-vue>

        <!-- 弹窗 -->
        <!-- <div class="cooperate-winpop-container" v-if="isCooperate" @click.self="isCooperate=false">
            <div class="cooperate-winpop-wrapper" v-show="isCooperateForm">
                <div class="cooperate-winpop-title vux-1px-b">
                    <h3>提现</h3>
                    <div @click="isCooperateForm=false">
                        <i class="icon-help"></i>
                        <span>提现须知</span>
                    </div>
                </div>
                <div class="cooperate-winpop-form">
                    <div class="cooperate-winpop-input">
                        <label>账户余额：</label>
                        <div class="cooperate-winpop-input-info">
                            <span v-text="business.amount"></span>元
                        </div>
                    </div>
                    <div class="cooperate-winpop-input">
                        <label>提现金额：</label>
                        <div class="cooperate-winpop-input-info">
                            <input type="tel" name="" v-model.number="moneyNum" @input="oninput" placeholder="请填写提现金额" id="">
                        </div>
                    </div>
                    <div class="cooperate-winpop-input">
                        <label>提现到：</label>
                        <div class="cooperate-winpop-input-info">
                            <div class="purse">
                                <i class="icon-wechat"></i>
                                <span>微信钱包</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cooperate-winpop-btn">
                    <x-button type="primary" class="radius qrcode-btn" action-type="button" @click.native="postCooperate">确认提现</x-button>
                    <x-button type="primary" class="radius cancel-btn" action-type="button"  @click.native="isCooperate=false">取消</x-button>
                </div>
            </div>
            <div class="cooperate-winpop-wrapper" v-show="!isCooperateForm">
                <div class="cooperate-winpop-help-title">关于提现您需要了解以下信息</div>
                <ul class="cooperate-winpop-help-list">
                    <li>
                        <span>1</span>
                        <p>单笔提现不得小于10元</p>
                    </li>
                    <li>
                        <span>2</span>
                        <p>单个账户每日提现总金额上限为5000元</p>
                    </li>
                    <li>
                        <span>3</span>
                        <p>单个提现账户每笔提现金额上限为5000元</p>
                    </li>
                    <li>
                        <span>4</span>
                        <p>每日提现笔数不得超过100笔</p>
                    </li>
                    <li>
                        <span>5</span>
                        <p>如遇资金账户不足，请隔天提现</p>
                    </li>
                </ul>
                <div class="cooperate-winpop-btn">
                    <x-button type="primary" class="radius qrcode-btn" action-type="button"  @click.native="isCooperateForm=true">知道了</x-button>
                </div>
            </div>
        </div> -->

    </div>

</template>

<script>
import { XHeader, XButton, XTable, Datetime, Group, PopupPicker } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
    data () {
        return {
            business: "",
            business_statis: "",
            channel_statis: "",
            avatar: "",
            isCooperate: false,
            visibility: false,
            isCooperateForm: true,
            value0: [[]],
            value1: '',      
            showPopupPicker: false,
            list1: [[]],
            isNodata: true,
            xch_id: 1,
            moneyNum: "",
            today: "",
            lastYear: "",
            mescrollDown: {
                use: false
            },
            mescrollUp: {
                use: false,
                isBounce: false
            }
        }
    },
    components: {
        XHeader,
        XButton,
        XTable,
        Datetime,
        Group,
        PopupPicker,
        MescrollVue
    },
    watch:{
    },
    methods:{
        oninput(e) {
            var that = this
            // 通过正则过滤小数点后两位
            e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
            that.moneyNum = e.target.value;
        },
        toInviteCash(){
            this.cnzzTrackEvent('商户合作-首页-提现');
            this.$router.push('/inviteCash');
        },
        postCooperate(){
            if(this.moneyNum == ''){
                this.$vux.toast.text("请填写提现金额");
                return;
            }
            if(parseFloat(this.moneyNum) > 5000 || this.moneyNum == ''){
                this.$vux.toast.text("提现金额不允许大于5000");
                return;
            }
            if(parseInt(this.moneyNum) < 10){
                this.$vux.toast.text("提现金额不允许小于10");
                return;
            }
            this.$vux.loading.show({
                text: '请求中...'
            })
            this.$ajax
              .get("/xdcoop/rebate/save",{
                  params:{
                      amount: this.moneyNum,
                  }
              })
              .then(response => {
                let data = response.data.data;
                setTimeout(() => {
                    this.$vux.loading.hide()
                }, 800)
                if(response.data.code != 1){
                    setTimeout(() => {
                        this.$vux.toast.text(response.data.msg);
                    }, 1000)
                    this.moneyNum = '';
                    return;
                }else{
                    setTimeout(() => {
                        this.$vux.toast.text("提现成功");
                        this.isCooperate = false;
                        this.moneyNum = '';
                        this.getData();
                    }, 1000)
                }
              })
              .catch(error => {
                setTimeout(() => {
                    console.log(error)
                    this.$vux.toast.text("服务器错误，请稍后重试");
                }, 1000)
              });
        },
        getData(){
            this.$ajax
              .get("/xdcoop/business/index")
              .then(response => {

                if (response.data.code != 1) {
                  this.$vux.toast.text(msg);
                  return;
                }else{
                    let data = response.data.data;
                    this.business = data.business;
                    this.channel = data.channel;
                    this.xch_id = this.channel[0].id;
                    this.value0 = [[]];
                    this.value0.push(this.channel[0].channel_name);
                    this.avatar = this.business.head_pic;
                    this.avatar = "" ? "../assets/images/avatar-df.png" : this.avatar;
                    this.getStatis(this.timeFormat(this.value1));


                    if(data.business_statis.length == 0){
                        this.business_statis = {
                            amount: "0.00",
                            pay: 0,
                            new: 0,
                            active: 0
                        }
                    }else{
                        this.business_statis = data.business_statis;
                    }

                    this.channelList();

                }
                
              })
              .catch(error => {
                this.$vux.toast.text("服务器错误，请稍后重试");
              });
        },
        getStatis(month){
            this.$ajax
              .get("/xdcoop/channel-statis/index",{
                  params:{
                      xch_id: this.xch_id,
                      month: month,
                  }
              })
              .then(response => {
                let data = response.data.data;
                this.channel_statis = data;
                if(data.length == 0){
                    this.isNodata = false;
                }else{
                    this.isNodata = true;
                }
                
              })
              .catch(error => {
                this.$vux.toast.text("服务器错误，请稍后重试");
              });
        },
        change (value) {
            if(this.list1.length != 0){
                let data = this.list1[0].filter(function(item){
                    return item.name == value[0]; 
                })
                if(data.length != 0){
                    this.xch_id = data[0].id;
                    this.getStatis(this.timeFormat(this.value1));
                }
            }
        },
        change1 (value) {
            this.value1 = value;
            if(this.xch_id != 1){
                this.getStatis(this.timeFormat(this.value1));
            }
        },
        setMonth () {
            let now = new Date()
            let cmonth = now.getMonth() + 1
            let day = now.getDate()
            let old7day = now.setDate(now.getDate() - 6);
            if (cmonth < 10) cmonth = '0' + cmonth
            if (day < 10) day = '0' + day
            return now.getFullYear() + '-' + cmonth
        },
        timeFormat(obj){
            return obj.replace(/-/g,'');
        },
        channelList(){
            this.list1 = [[]];
            for(var i of this.channel){
                this.list1[0].push({
                    name: i.channel_name,
                    value: i.channel_name,
                    id: i.id
                })
            }
        }
    },
    mounted() {
        this.$nextTick(function(){
            this.value1 = this.setMonth();
            this.getData();
        });
    },
    computed:{
        ...mapGetters(["getLoginStatus","getUserInfo"]),
    }
}
</script>

<style>
[v-cloak]{
    display: none !important;
}
</style>

<style lang="stylus" scoped>

.wrapper
    .weui-btn_primary
        background-color #3cb371
        margin 0
        &.weui-btn_mini
            padding 0 2em
    .qrcode-btn
        background-color #53c6ff
        &:active
            background-color #55b0dc
    .cancel-btn
        background-color #7395ec
        &:active
            background-color #6986bd
    .vux-1px-r:after
        border-color #f0f0f0
    .weui-cell
        padding 0
.cooperate-winpop-container
    width 100%
    height 100%
    position fixed
    left 0
    top 0
    background-color rgba(0,0,0,.5)
    z-index 88
    .cooperate-winpop-wrapper
        width 5.85rem
        height 5.45rem
        background-color #fff
        border-radius .1rem
        position fixed
        left 50%
        top 50%
        transform translate(-50%,-50%)
        display flex
        align-items center
        flex-direction column
        padding 0 .4rem
        .cooperate-winpop-title
            display flex
            justify-content space-between
            align-items center
            height 1.2rem
            width 100%
            h3
                font-size .36rem
                color #333333
            div
                font-size .26rem
                color #42b9f5
                span
                    display inline-block
                    vertical-align middle
                .icon-help
                    background-image url(../assets/images/icon-help.png)
                    width .27rem
                    height .27rem
                    margin-right .05rem
        .cooperate-winpop-form
            width 100%
            padding .2rem 0
            .cooperate-winpop-input
                width 100%
                height .7rem
                display flex
                align-items center
                label
                    text-align right 
                    font-size .3rem
                    color #9fabbe
                    display inline-block
                    width 1.8rem
                .cooperate-winpop-input-info
                    font-size .3rem
                    color #636363
                    span
                        color #ff0000
                    input
                        width 3.2rem
                        height .6rem
                        line-height .6rem
                        font-size .24rem
                        color #afafaf
                        padding 0 0 0 .1rem
                        border 1px solid #dbe2eb
                        border-radius .1rem
                    .purse
                        span
                            display inline-block
                            vertical-align middle
                            color #636363
                            font-size .24rem
                        .icon-wechat
                            background-image url(../assets/images/wechat.png)
                            width .42rem
                            height .33rem
                    
        .cooperate-winpop-btn
            margin-top .2rem
            display flex
            align-items center
            justify-content center
            .weui-btn
                width 2rem
                padding .15rem 0
                line-height normal
                font-size .28rem
                &:not(.qrcode-btn)
                    margin-left .4rem
                &:after
                    display none
    .cooperate-winpop-help-title
        font-size .28rem
        color #53c6ff
        margin .5rem 0 .4rem
        text-align center
    .cooperate-winpop-help-list
        li
            font-size .24rem
            margin-bottom .18rem
            display flex
            align-items center
            span
                color #fff
                width 20px
                height 20px
                line-height 20px
                border-radius 50%
                background padding-box #53c6ff
                margin-right .1rem
                text-align center
                display inline-block
            p
                color #636363    

.content
    .screen
        .screen-top
            padding .3rem
            display flex
            align-items flex-start
        .screen-select    
            padding .1rem .15rem
            background-color #f9f9f9
            display inline-flex
            justify-content center
            align-items center
            border-radius 5000px
            span
                margin-right .1rem
                font-size .26rem
                color #42b9f5
            &.screen-select-name
                font-size .3rem
                margin-right .3rem
                span
                    margin-right .1rem
                .icon-arrow-down
                    width .24rem
                    height .14rem
                .vux-cell-box
                    margin-right: 0.1rem;
                    font-size: 0.26rem;
                    color: #42b9f5;
            .icon-arrow-down
                width .19rem
                height .11rem
                background-image url(../assets/images/icon-arrow-down.png)
        .screen-select-box
            display flex
            align-items center
            font-size .26rem
            color #636363
            .or
                margin 0 .2rem
        .screen-table
            .vux-table
                font-size .24rem
                th
                    color #333333
                td
                    color #909090

    .firm
        padding 0 .3rem
        .firm-top
            display flex
            align-items center
            justify-content space-between
            height .94rem
            .firm-top-main
                display flex
                align-items center
                justify-content center
                img
                    width .48rem
                    height .48rem
                    border-radius 50%
                .firm-name
                    margin 0 .25rem
                    color #333333
                    font-size .26rem
                .firm-id
                    font-size .24rem
                    color #909090
            .firm-top-url
                font-size .3rem
                color #42b9f5
                .icon-url
                    background-image  url(../assets/images/icon-link.png)
                    width .3rem
                    height .3rem
                    margin-left .1rem
        .firm-main
            padding .4rem 0
            display flex
            justify-content space-between
            align-items center
            width 100%
            dt
                font-size .3rem
                color #636363
                span
                    color #42b9f5
                    margin-left .3rem
            dd
                font-size .46rem
                color #333333
    .total
        ul
            width 100%
            height 1.5rem
            display flex
            align-items center
            li
                flex 1
                text-align center
                height 100%
                display flex
                align-items center
                justify-content center
                flex-direction column
                .total-th
                    font-size .24rem
                    color #909090
                p
                    color #333333
                    font-size .36rem








</style>
