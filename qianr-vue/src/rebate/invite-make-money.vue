<template>
  <div class="wrapper">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
      <x-header :left-options="{backText: ''}">立即赚钱</x-header>
      <div class="invite-make-money-content">
        <div class="invite-make-money-bg">
          <img src="../assets/images/zq-bg.jpg" alt="">
        </div>
        <div class="invite-make-money-header">
          <dl>
            <dt>
              <img :src="getUserInfo.logo" alt="">
            </dt>
            <dd v-text="getUserInfo.nick_name"></dd>
          </dl>
          <div class="invite-select" @click="cnzzTrackEvent('玩游戏赚现金-立即赚钱页-右上角渠道切换')">
            <i class="icon-select-img"></i>
            <popup-picker
              class="invite-select-text"
              :show.sync="showPopupPicker"
              :data="list1"
              v-model="value0"
              @on-change="change"
              ref="picker"
            ></popup-picker>
            <i class="icon-select-arrow"></i>
          </div>
        </div>
        <div class="invite-card">
          <div class="invite-card-title">
            邀请好友 · 赚现金 · 收入无上限
          </div>
          <div class="invite-step">
            <img src="../assets/images/yqhy-step.png" alt="">
          </div>
        </div>
        <div v-for="item in channel" v-if="item.id==xch_id">
          <div class="invite-card">
            <div class="invite-card-title">
              个性邀请
            </div>
            <div class="invite-info">邀请好友来玩游戏，TA充值你赚钱</div>
            <div class="invite-card-btn invite-card-long-btn">
              <x-button class="radius copy-btn" :data-clipboard-text="item.link">链接推广</x-button>
              <x-button @click.native="toXdQrcode(item.link)" class="radius">二维码推广</x-button>
            </div>
          </div>
          <div class="invite-card">
            <div class="invite-card-title">
              游戏邀请
            </div>
            <div class="invite-info">好友喜欢玩什么游戏就用什么内容邀请，成功率超高</div>
            <ul class="invite-game-list">
              <li v-for="game in item.games">
                <div class="invite-game-name" v-text="game.title"></div>
                <div class="invite-card-btn">
                  <x-button class="radius copy-btn" :data-clipboard-text="game.link">链接推广</x-button>
                  <x-button class="radius" @click.native="toGxQrcode(game)">二维码推广</x-button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import { XButton, XHeader, PopupPicker } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
import Clipboard from "clipboard";
export default {
  components: {
    XButton,
    XHeader,
    PopupPicker,
    MescrollVue
  },
  mounted() {
    this.$nextTick(function() {
      this.getData();
      var clipboard = new Clipboard(".copy-btn");
      clipboard.on("success", e => {
        this.$vux.toast.text("复制成功");
      });
    });
  },
  computed: {
    ...mapGetters(["getLoginStatus", "getUserInfo"])
  },
  data() {
    return {
      showPopupPicker: false,
      channel: [],
      xch_id: 1,
      list1: [[]],
      value0: [[]],
      avatar: "",
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        use: false,
        isBounce: false
      }
    };
  },
  methods: {
    toXdQrcode(link) {
      this.cnzzTrackEvent("玩游戏赚现金-立即赚钱页-个性邀请");
      this.$router.push({
        path: "/inviteXdQrcode",
        query: {
          link: link,
          avatar: this.avatar
        }
      });
    },
    toGxQrcode(item) {
      this.cnzzTrackEvent(`玩游戏赚现金-立即赚钱页-${item.title}-游戏邀请`);
      this.$router.push({
        path: "/inviteGxQrcode",
        query: {
          link: item.link,
          logo: item.logo,
          avatar: this.avatar
        }
      });
    },
    change(value) {
      if (this.list1.length != 0) {
        let data = this.list1[0].filter(function(item) {
          return item.name == value[0];
        });
        if (data.length != 0) {
          this.xch_id = data[0].id;
        }
      }
    },
    channelList() {
      this.list1 = [[]];
      for (var i of this.channel) {
        this.list1[0].push({
          name: i.channel_name,
          value: i.channel_name,
          id: i.id
        });
      }
    },
    getData() {
      this.$ajax
        .get("/xdcoop/link/index")
        .then(response => {
          if (response.data.code != 1) {
            this.$vux.toast.text(msg);
            return;
          } else {
            let data = response.data.data;
            this.channel = data.channel;
            this.xch_id = this.channel[0].id;
            this.value0 = [[]];
            this.value0.push(this.channel[0].channel_name);
            this.channelList();
            this.avatar = data.user.headpic + "?" + new Date().getTime();
          }
        })
        .catch(error => {
          this.$vux.toast.text("服务器错误，请稍后重试");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  background: #ffffff;
}
.invite-make-money-content {
  position: relative;

  .invite-make-money-bg {
    position: absolute;
  }

  .invite-make-money-header {
    position: relative;
    z-index: 3;
    height: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.35rem;

    dl {
      display: flex;
      align-items: center;
      margin-left: 0.3rem;

      dt {
        margin-right: 0.13rem;
        width: 0.65rem;
        height: 0.65rem;
        overflow: hidden;

        img {
          border-radius: 50%;
          border: 0.04rem solid #fff;
        }
      }

      dd {
        color: #ffffff;
        font-size: 0.28rem;
      }
    }

    .invite-select {
      height: 0.45rem;
      display: flex;
      color: #fff;
      position: relative;
      align-items: center;
      background-color: rgba(0,0,0,.5);
      padding: 0 0.3rem;

      .icon-select-img {
        width: 0.45rem;
        height: 0.45rem;
        background-image: url("../assets/images/icon-select-img.png");
        position: absolute;
        left: -0.15rem;
        top: 0;
      }

      .invite-select-text {
        font-size: 0.18rem;
        color: #ffffff;
        margin: 0 0.1rem;
      }

      .icon-select-arrow {
        width: 0.12rem;
        height: 0.1rem;
        background-image: url("../assets/images/icon-select-arrow.png");
      }
    }
  }

  .invite-card {
    position: relative;
    z-index: 3;
    padding: 0 0.42rem;
    overflow: hidden;
    background-color: #fff;
    border-radius: 0.15rem;
    margin: 0 0.25rem 0.35rem;
    box-shadow: 0 0 0.13rem rgba(194, 194, 194, 0.35);
  }

  .invite-step {
    width: 5.52rem;
    height: 1.37rem;
    margin: 0.5rem auto;

    img {
      height: 100%;
    }
  }

  .invite-info {
    color: #767676;
    font-size: 0.24rem;
    text-align: center;
    height: 0.56rem;
    line-height: 0.56rem;
    border-radius: 0.28rem;
    background-color: #f0f0f0;
  }

  .invite-card-btn {
    display: flex;
    align-items: center;
    button {
      background-color: #eb636d;
      color: #fff;
      font-size: 0.24rem;
      margin: 0;
      width: auto;

      &::after,
      &::before {
        display: none;
      }

      &:active {
        color: #fff;
        background-color: #d15962;
      }

      &.copy-btn{
        background-color: #7bc674;
        margin-right: .2rem;
        &:active {
          background-color: #7bc674;
        }
      }
    }

    &.invite-card-long-btn {
      padding: 0 0.6rem;
      margin: 0.5rem 0;
      justify-content: center;

      button {
        height: 0.7rem;
        width: 100%;
      }
    }
  }

  .radius {
    border-radius: 99px;
  }

  .invite-game-list {
    margin-top: 0.58rem;

    li {
      margin-bottom: 0.46rem;
      width: 100%;
      border-radius: 99px;
      height: 0.56rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(
        to right,
        rgba(253, 253, 255, 0.8) 0%,
        rgba(248, 248, 248, 0.8) 100%
      );

      .invite-game-name {
        padding-left: 0.25rem;
        color: #eb636d;
        font-size: 0.28rem;
      }
    }
  }

  .invite-card-title{
    text-align: center;
    font-weight: bold;
    color: #5a5a66;
    font-size: .3rem;
    margin: .35rem 0 .15rem;
  }
}
</style>
