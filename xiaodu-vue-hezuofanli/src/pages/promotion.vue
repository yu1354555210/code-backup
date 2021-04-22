<template>
    <div class="wrapper">
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
            <x-header :left-options="{backText: ''}">推广链接</x-header>
            <div class="content">
                <div class="info">
                    <span>重要:</span>
                    用户通过您的推广链接成功注册后，所有的充值都会给您对应比例的分成
                </div>
                <div class="card-item promotion">
                    <div class="promotion-top">
                        <div class="screen-select screen-select-name" @click="showPopupPicker=true">
                            <popup-picker :show.sync="showPopupPicker" :data="list1" v-model="value0" @on-change="change" ref="picker"></popup-picker>
                            <i class="icon-arrow-down"></i>
                        </div>
                    </div>
                    <div class="this-title">整站推广<span>玩家在站内所有游戏中充值您都有分成</span></div>
                    <div v-for="item in channel_statis" v-if="item.id==xch_id">
                        <div class="promotion-list">
                            <div class="promotion-item">
                                <div class="promotion-name">小度游戏集合</div>
                                <div class="promotion-btn-box">
                                    <x-button type="warn" class="radius copy-btn" :data-clipboard-text="item.link" mini action-type="button"  @click.native="cnzzTrackEvent('商户合作-推广链接-整站推广-复制链接')">复制链接</x-button>
                                    <x-button type="primary" class="qrcode-btn radius" mini action-type="button" @click.native="setQrcode(item)">二维码</x-button>
                                </div>
                            </div>
                        </div>
                        <div class="this-title">独立游戏推广<span>定向群体适用，推广指定游戏</span></div>
                        <div class="promotion-list">
                            <div class="promotion-item" v-for="i in item.games">
                                <div class="promotion-name" v-text="i.title"></div>
                                <div class="promotion-btn-box">
                                    <x-button type="warn" class="radius copy-btn" mini action-type="button" :data-clipboard-text="i.link">复制链接</x-button>
                                    <x-button type="primary" class="qrcode-btn radius" mini action-type="button" @click.native="setQrcode(item)">二维码</x-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="qrcode-winpop-container" v-if="isQrcode" @click.self="isQrcode=false">
                <div class="qrcode-winpop-wrapper">
                    <div class="qrcode-winpop-title">长按“保存图片”在相册中使用</div>
                    <div class="qrcode-winpop-image">
                        <!-- <img src="../assets/images/home-icon1.png" alt=""> -->
                        <vue-qr :logoSrc="qrcodeLogo" :text="qrcodeLink" :size="200" :margin="0"></vue-qr>
                    </div>
                    <x-button type="primary" class="qrcode-btn" action-type="button" @click.native="isQrcode=false">关闭</x-button>
                </div>
            </div>
        </mescroll-vue>
    </div>
</template>

<script>
import { XHeader, XButton, PopupPicker } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import Clipboard from "clipboard";
import VueQr from 'vue-qr';
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
    data () {
        return {
            value0: [[]],
            showPopupPicker: false,
            list1: [[]],      
            isQrcode: false,
            channel_statis: [],
            xch_id: 1,
            qrcodeLogo: require("../assets/images/home-logo.png"),
            qrcodeLink: "",
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
        PopupPicker,
        VueQr,
        MescrollVue
    },
    mounted() {
        var clipboard = new Clipboard(".copy-btn");
        clipboard.on("success", e => {
            this.$vux.toast.text("复制成功");
        });

        this.$nextTick(function(){
            this.getChannelStatis();
        })
        
    },
    computed:{
        ...mapGetters(["getLoginStatus","getUserInfo"]),
    },
    methods: {
        change (value) {
            if(this.list1.length != 0){
                let data = this.list1[0].filter(function(item){
                    return item.name == value[0]; 
                })
                if(data.length != 0){
                    this.xch_id = data[0].id;
                }
            }
        },
        channelList(){
            this.list1 = [[]];
            for(var i of this.channel_statis){
                this.list1[0].push({
                    name: i.channel_name,
                    value: i.channel_name,
                    id: i.id
                })
            }
        },
        getChannelStatis(){
            this.$ajax
              .get("/xdcoop/link/index")
              .then(response => {
                if (response.data.code == 403) {
                    window.location.href = this.toUrl;
                    return;
                }
                var msg = response.data.msg;
                if(msg == "请注册商户"){
                    this.$router.push('/');
                    return;
                }
                let data = response.data.data;
                this.channel_statis = data.channel;
                this.xch_id = this.channel_statis[0].id;
                this.value0.push(this.channel_statis[0].channel_name);
                this.channelList();
              })
              .catch(error => {
                this.$vux.toast.text("服务器错误，请稍后重试");
              });
        },
        setQrcode(item){
            this.isQrcode = true;
            this.qrcodeLink = item.link;
            this.cnzzTrackEvent(`商户合作-推广链接-${item.title}-二维码`)
        }

    }
}
</script>

<style lang="stylus" scoped>
    .qrcode-winpop-container
        width 100%
        height 100%
        position fixed
        left 0%
        top 0%
        z-index 88
        background-color rgba(0,0,0,.5)
        .qrcode-winpop-wrapper
            width 4.2rem
            height 5.2rem
            position fixed
            left 50%
            top 50%
            transform translate(-50%,-50%)
            background-color #fff
            border-radius .1rem
            display flex
            flex-direction column
            align-items center
            .qrcode-winpop-title
                text-align center
                font-size .24rem
                color #333333
                padding .4rem 0
            .qrcode-winpop-image
                width 2.6rem
                height 2.6rem
                background-color #f7f6f6
                padding .1rem
                margin-bottom  .35rem
            .qrcode-btn
                width 35%
                font-size .26rem

    .info
        color #333333
        padding 0 .2rem 0.2rem
        line-height .38rem
        font-size .24rem
        span
            color #ff0000
    .this-title
        padding .38rem 0
    .promotion
        padding .4rem .25rem
        .promotion-top
            display flex
            flex-direction column
            justify-content center
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
        .promotion-list
            border-radius .1rem
            border 1px solid #f0f0f0
            margin-bottom .2rem
            &:last-child
                margin-bottom 0
        .promotion-item
            margin 0 .24rem
            padding .3rem 0
            display flex
            justify-content space-between
            align-items center
            border-bottom 1px solid #f0f0f0
            &:last-child
                border-bottom 0
            .promotion-name
                color #636363
                font-size .3rem
                white-space nowrap
                overflow hidden
                flex 0.9
            .promotion-btn-box
                display flex
                align-items center
                .weui-btn
                    margin 0
                    &:first-child
                        margin-right .2rem
                .weui-btn_warn
                    background-color #ff5363
    .qrcode-btn
        background-color #53c6ff
    .home-title
        padding .38rem 0
</style>
