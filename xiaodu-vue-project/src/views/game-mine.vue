<template>
    <div class="wrapper">
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
            <div class="person-info">
                <div class="person-info-img">
                    <img :src="info.logo" alt="">
                </div>
                <div class="person-info-main">
                    <div class="person-info-name" v-text="info.nick_name"></div>
                    <div class="person-info-id">UID:{{info.id}}</div>
                </div>
                <!-- <x-icon type="ios-arrow-right" size="40" class="person-arrow-right"></x-icon> -->
            </div>
            <!-- <div class="person-invite" @click="toInviteIndex">
              <dl>
                <dt>玩游戏·赚现金</dt>
                <dd>和好友玩游戏，轻松赚现金，秒提现~</dd>
              </dl>
              <div class="person-invite-money">
                <b>余额<span>{{business_amount}}元</span></b>
              </div>
            </div> -->
            <div class="person-list-body">
                <ul class="person-list">
                    <!-- <li>
                    <router-link to="bind-user-name">
                        <i class="icon-person"></i>
                        <span>绑定账号</span>
                    </router-link>
                    </li>-->
                    <li>
                        <router-link to="my-diamond" @click.native="cnzzTrackEvent('我的页-我的金豆')">
                            <i class="icon-jd"></i>
                            <span>我的金豆</span>
                            <em v-text="getDiamond"></em>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="my-orders" @click.native="cnzzTrackEvent('我的页-我的奖品')">
                            <i class="icon-gift"></i>
                            <span>我的奖品</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="my-gift" @click.native="cnzzTrackEvent('我的页-游戏礼包')">
                            <i class="icon-hb"></i>
                            <span>游戏礼包</span>
                        </router-link>
                    </li>
                </ul>
                <ul class="person-list">
                    <li>
                        <router-link to="my-focus" @click.native="cnzzTrackEvent('我的页-我关注的游戏')">
                            <i class="icon-game"></i>
                            <span>我关注的游戏</span>
                        </router-link>
                    </li>
                </ul>
                <ul class="person-list">
                    <li>
                        <router-link to="real-name" @click.native="cnzzTrackEvent('我的页-实名认证')">
                            <i class="icon-safe"></i>
                            <span>实名认证</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="fcm" @click.native="cnzzTrackEvent('我的页-防沉迷说明')">
                            <i class="icon-indulge"></i>
                            <span>防沉迷说明</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="service-content" @click.native="cnzzTrackEvent('我的页-联系客服')">
                            <i class="icon-service"></i>
                            <span>联系客服</span>
                        </router-link>
                    </li>
                </ul>
                <ul class="person-list">
                    <li>
                        <router-link to="game-setting" @click.native="cnzzTrackEvent('我的页-设置')">
                            <i class="icon-setting"></i>
                            <span>设置</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </mescroll-vue>
    </div>
</template>

<script>
import { XButton, XHeader } from "vux";
import { mapGetters } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    XButton,
    XHeader,
    MescrollVue
  },
  computed: {
    ...mapGetters(["getUserInfo", "getDiamond"])
  },
  watch: {
    getUserInfo(val) {
      this.info = val;
    }
  },
  mounted() {
    this.$nextTick(function() {
      var playerInfo = this.getUserInfo;
      if (playerInfo != null && playerInfo != "[]") {
        this.info = playerInfo;
      } else {
        this.$store.dispatch("LoginInfo");
      }

      if (this.getDiamond == null) {
        this.$store.dispatch("myDiamond");
      }

      this.$ajax
        .get("/xdcoop/player/info")
        .then(res => {
          let data = res.data;
          if (data.length == 0) return;
          this.code = data.code;
          this.business_amount = data.business_amount;
        })
        .catch(error => {
          console.log(error);
        });
    });
  },
  data() {
    return {
      info: [],
      mescroll: null,
      business_amount: '',
      code: '',
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        use: false
      }
    };
  },
  methods: {
    toInviteIndex(){
      this.cnzzTrackEvent('我的页-玩游戏赚现金宣传位');
      const isPro = Object.is(process.env.NODE_ENV, 'production');
      let url = isPro ? "http://h5.nzha.com/xd_nzha_hzfl/index.html" : "http://172.16.2.248:8080";
      window.location.href =  url;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
