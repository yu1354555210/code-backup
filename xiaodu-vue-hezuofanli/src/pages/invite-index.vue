<template>
  <div class="wrapper">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
      <x-header :left-options="{backText: ''}">玩游戏·赚现金</x-header>
      <div class="invite-content">
        <div class="invite-header">
          <dl>
            <dt>
              <img :src="avatar" alt="">
            </dt>
            <dd v-text="business.business_name"></dd>
          </dl>
          <router-link
            tag="div"
            to="/cooperate"
            class="invite-count-btn"
            @click.native="cnzzTrackEvent('玩游戏赚现金-首页-数据统计')"
          ></router-link>
        </div>
        <div class="invite-conunt">
          <dl>
            <dt>收入余额
              <router-link
                to="/inviteCash"
                tag="div"
                class="invite-tx-btn"
                @click.native="cnzzTrackEvent('玩游戏赚现金-首页-提现')"
              ></router-link>
            </dt>
            <dd>{{business.amount}}元</dd>
          </dl>
          <dl>
            <dt>邀请总人数</dt>
            <dd>{{business.member_num}}人</dd>
          </dl>
        </div>
      </div>
      <div class="invite-title invite-title-yqfl">
        <img src="../assets/images/title-yqfl.png" alt="">
      </div>
      <div class="invite-nav">
        <dl>
          <router-link
            to="/inviteMakeMoney"
            tag="dt"
            @click.native="cnzzTrackEvent('玩游戏赚现金-首页-立即赚钱去邀请')"
          >
            <img src="../assets/images/nav-yq-img1.png" alt="">
          </router-link>
          <dd>
            <router-link
              to="/inviteRecord"
              tag="div"
              @click.native="cnzzTrackEvent('玩游戏赚现金-首页-邀请记录')"
            >
              <img src="../assets/images/nav-yq-img2.png" alt="">
            </router-link>
            <router-link
              to="/inviteIncomeRecord"
              tag="div"
              @click.native="cnzzTrackEvent('玩游戏赚现金-首页-收支记录')"
            >
              <img src="../assets/images/nav-yq-img3.png" alt="">
            </router-link>
          </dd>
        </dl>
      </div>
      <div class="invite-rule">
        <div class="invite-title invite-title-yqgz">
          <img src="../assets/images/title-yqgz.png" alt="">
        </div>
        <div class="invite-rule-main">
          <ul>
            <li>1、通过您分享的链接、二维码等官方邀请好友方式注册的小度微游新用户，视为您邀请的好友;</li>
            <li>2、您邀请的好友每充值10元，将给您返利2元，满10元就可实时提现;</li>
            <li>3、您和邀请的好友如有任何违规行为对应的帐号将会被冻结;</li>
            <li>4、小度微游有在法律允许范围内对规则进行修改的权利;</li>
            <li>5、最终解释权归小度微游所有;</li>
            <li>6、<span class="text-red">邀请返利仅限小度微游公众号中的游戏;</span></li>
          </ul>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import { XButton, XHeader, base64 } from "vux";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    XButton,
    XHeader,
    MescrollVue
  },
  mounted() {
    this.$nextTick(function() {
      this.delayGetData();
    });
  },
  activated() {
    this.$nextTick(function() {
      if(this.flag){
        this.getData();
      }
    });
  },
  data() {
    return {
      business: [],
      avatar: "",
      flag: false,
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        use: false
      }
    };
  },
  methods: {
    delayGetData() {
      setTimeout(() => {
        this.getData();
        this.flag = true;
      }, 800);
    },
    getData() {

      let nzha_login = window.localStorage.getItem("nzha_login");
      // console.log("nzha_login",nzha_login)
      // console.log("nzha_login_typeof",typeof nzha_login)
      if (nzha_login == 1) {
        this.$ajax
          .get("/xdcoop/business/index")
          .then(response => {
            // console.log(response.data)
            // console.log(response.data.code)
            if (response.data.code == 403) {
              window.location.href = this.toUrl;
              return;
            }
            var msg = response.data.msg;
            if (response.data.code != 1) {
              this.$vux.toast.text(msg);
              return;
            } else {
              let data = response.data.data;
              this.business = data.business;
              this.avatar = this.business.head_pic;
              this.avatar = "" ? "../assets/images/avatar-df.png" : this.avatar;
            }
          })
          .catch(error => {
            console.log("error",error)
            this.$vux.toast.text("服务器错误，请稍后重试");
          });
      } else {
        window.location.href = this.toUrl;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  background-color: #fff;
}
.invite-content {
  padding: 0 0.15rem;

  .invite-header {
    padding: 0 0.2rem;
    height: 1.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    dl {
      display: flex;
      align-items: center;

      dt {
        margin-right: 0.13rem;
        width: 0.65rem;
        height: 0.65rem;
        overflow: hidden;
        border-radius: 50%;
      }

      dd {
        color: #454553;
        font-size: 0.28rem;
      }
    }

    .invite-count-btn {
      background-image: url("../assets/images/data-count.png");
      background-size: 100% 100%;
      width: 1.67rem;
      height: 0.4rem;
    }
  }

  .invite-conunt {
    width: 7.22rem;
    height: 2.37rem;
    background-image: url("../assets/images/tx-top-bg.png");
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem 0 0.8rem;

    dl {
      display: flex;
      justify-content: center;
      flex-direction: column;
      flex: 0 0 3rem;

      &:last-child {
        padding-left: 0.8rem;
      }
    }

    dt {
      display: flex;
      align-items: center;
      font-size: 0.28rem;
      color: #d6e8fb;
      height: 0.68rem;

      .invite-tx-btn {
        margin-left: 0.12rem;
        width: 1.39rem;
        height: 0.68rem;
        background-image: url("../assets/images/tx-btn.png");
        background-size: 100% 100%;
      }
    }

    dd {
      width: 100%;
      color: #ffffff;
      font-size: 0.48rem;
      font-weight: bold;
    }
  }
}
.invite-nav {
  padding-bottom: 0.4rem;

  dt {
    margin: 0 auto;
    width: 7.3rem;
    height: 2.36rem;
  }

  dd {
    display: flex;
    justify-content: space-between;
    padding: 0 0.1rem;
  }

  img {
    height: 100%;
  }
}

.invite-rule {
  padding: 0.2rem 0.1rem;
  border-top: 0.14rem solid #f8f8f8;

  .invite-rule-main {
    background-image: url("../assets/images/yq-rule-bg.png");
    margin: 0 auto;
    background-size: 100% 100%;
    width: 7rem;
    height: 5.65rem;
    padding: 0.57rem 0.5rem 0;

    li {
      font-size: 0.24rem;
      color: #959595;
      line-height: 0.38rem;
      margin-bottom: 0.2rem;
    }
    .text-red{
      color: red;
    }
  }
}
</style>
