<template>
    <div class="wrapper">
        <header class="header">
            <dl>
                <dt><img src="../assets/images/home-logo.png" alt=""></dt>
                <dd>
                    <h2>小度微游</h2>
                    <p>期待您的加入</p>
                </dd>
            </dl>
        </header>
        <div class="this-title">我们的优势</div>
        <div class="home-list">
            <dl class="home-item">
                <dt><img src="../assets/images/home-icon1.png" alt=""></dt>
                <dd>
                    <h3>零门槛</h3>
                    <p>零门槛，大小平台皆可合作，享受同等的优质服务。</p>
                </dd>
            </dl>
            <dl class="home-item">
                <dt><img src="../assets/images/home-icon2.png" alt=""></dt>
                <dd>
                    <h3>急速接入</h3>
                    <p>3分钟即可完成整个接入流程，一旦接入将无需再操心。</p>
                </dd>
            </dl>
            <dl class="home-item">
                <dt><img src="../assets/images/home-icon3.png" alt=""></dt>
                <dd>
                    <h3>高品质游戏</h3>
                    <p>小度旗下拥有多款可供合作的高品质游戏，满足您所有的游戏需求。</p>
                </dd>
            </dl>
            <dl class="home-item">
                <dt><img src="../assets/images/home-icon4.png" alt=""></dt>
                <dd>
                    <h3>强大的实时结算系统</h3>
                    <p>收入随时可查，清楚透明。分成随时可提，安全快速。</p>
                </dd>
            </dl>
        </div>
        <div class="this-title">联系我们<span>仅支持商务合作方面咨询</span></div>
        <div class="contact-list">
            <div class="contact-item">
                <div class="contact-main">
                    <div class="contact-name">loki<badge text="商务"></badge></div>
                    <div class="contact-info">
                        <p>QQ：3195478525 <span class="copy-btn" data-clipboard-text="3195478525">复制</span></p>
                        <p>微信/手机：13940150107 <span class="copy-btn" data-clipboard-text="13940150107">复制</span></p>
                    </div>
                </div>
                <div class="contact-qrcode">
                    <img src="../assets/images/home-qrcode.jpg" alt="">
                    <p>扫码加好友</p>
                </div>
            </div>
            <div class="contact-item">
                <div class="contact-main">
                    <div class="contact-name">Karen<badge text="商务"></badge></div>
                    <div class="contact-info">
                        <p>QQ：2646439971 <span class="copy-btn" data-clipboard-text="2646439971">复制</span></p>
                        <p>微信/手机：17640081705 <span class="copy-btn" data-clipboard-text="17640081705">复制</span></p>
                    </div>
                </div>
                <div class="contact-qrcode">
                    <img src="../assets/images/home-qrcode2.jpg" alt="">
                    <p>扫码加好友</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Badge } from "vux";
import Clipboard from "clipboard";
const isPro = Object.is(process.env.NODE_ENV, 'production')
export default {
    components: {
        Badge
    },
    data () {
        return {
            datalist: []
        }
    },
    mounted() {
        var clipboard = new Clipboard(".copy-btn");
        clipboard.on("success", e => {
            this.$vux.toast.text("复制成功");
        });

        this.$nextTick(function(){
        })


    }
}
</script>

<style lang="stylus" scoped>
.wrapper
    padding-bottom .5rem
    background-color #fff
    .vux-badge
        background-color #42b9f5
        padding 0 10px
        height 20px
        line-height 20px
        border-radius 10px
        margin-left .2rem
.this-title
    padding 0 .43rem
.header
    background url(../assets/images/home-bg.jpg) no-repeat center top
    background-size 7.5rem 4rem
    height 3.5rem
    padding .38rem 0.25rem
    dl
        display flex
        align-items center
        dt
            width 1.08rem
            height 1.08rem
            border 0.07rem solid #fff
            position relative
            border-radius 50%
            margin-right .3rem
            img
                height 100%
                display block
        dd
            color #fff
            h2
                font-size .45rem
                font-weight normal
            p
                font-size .3rem

.home-list
    padding 0 .25rem
    .home-item
        padding .4rem .18rem
        display flex
        align-items center
        dt
            flex 0 0 1.4rem
            height 1.4rem
            margin-right .5rem
            img
                height 100%
        dd
            h3
                color #636363
                font-size .36rem
                font-weight normal
            p
                font-size .24rem
                color #909090
.contact-list
    padding 0 .25rem
    .contact-item
        background-color #d2f0ff
        border-radius .2rem
        padding .2rem
        margin-top .36rem
        display flex
        justify-content space-between
        align-items center
        .contact-main
            padding 0 .2rem
            .contact-name
                color #636363
                font-size .4rem
                display flex
                align-items center
                margin-bottom  .5rem
            .contact-info
                font-size .3rem
                color #909090
                p
                    margin-bottom .2rem
                span
                    color #42b9f5
                    text-decoration underline
        .contact-qrcode
            width 1.88rem
            height 2.4rem
            background-color #42b9f5
            background  #42b9f5
            border-radius .1rem
            text-align center
            color #fff
            font-size .24rem
            padding .1rem
            img
                width 1.68rem
                height 1.68rem
            p
                line-height .46rem

</style>
