<template>
  <div class="wrapper">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
      <div class="invite-content">
        <div class="invite-header">
          <dl>
            <dt>
              <img :src="avatar" alt="">
            </dt>
            <dd v-text="business.business_name"></dd>
          </dl>
          <!-- <router-link
            tag="div"
            to="/cooperate"
            class="invite-count-btn"
            @click.native="cnzzTrackEvent('玩游戏赚现金-首页-数据统计')"
          ></router-link> -->
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
        <img src="../assets/images/title-yqfl.png" alt="">邀请赚钱
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
          <img src="../assets/images/title-yqgz.png" alt="">邀请规则
        </div>
        <div class="invite-rule-main">
          <ul>
            <li>
              <i>1</i>
              <span>通过您分享的链接、二维码等官方邀请好友方式注册的手游宝盒H5新用户，视为您邀请的好友;</span>
            </li>
            <li>
              <i>2</i>
              <span>您邀请的好友每充值10元，您将获得2元，满10元就可实时提现;</span>
            </li>
            <li>
              <i>3</i>
              <span>自己邀请自己将视为违规，一经查实我们将有权利冻结你的账号;</span>
            </li>
            <li>
              <i>4</i>
              <span>手游宝盒H5有在法律允许范围内对规则进行修改的权利;</span>
            </li>
            <li>
              <i>5</i>
              <span>最终解释权归手游宝盒H5所有;</span>
            </li>
            <li class="text-red">
              <i>6</i>
              <span>邀请赚钱仅限手游宝盒H5公众号中的游戏;</span>
            </li>
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
      if(this.$store.getters.getLoginStatus === false){
        this.$router.push('/');
        return;
      }
    });
  },
  activated() {
    this.$nextTick(function() {
      this.getData();
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
    getData() {
      this.$ajax
        .get("/xdcoop/business/index")
        .then(response => {
          var msg = response.data.msg;
          if (response.data.code != 1) {
            // this.$vux.toast.text(msg);
            return;
          } else {
            let data = response.data.data;
            this.business = data.business;
            this.avatar = this.business.head_pic;
            this.avatar = "" ? "../assets/images/avatar-df.png" : this.avatar;
          }
        })
        .catch(error => {
          console.log("error", error);
          this.$vux.toast.text("服务器错误，请稍后重试");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  background-color: #fff;
}
.invite-content {
  // padding: 0 0.15rem;

  .invite-header {
    padding: 0 0.35rem;
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
    width: 7.44rem;
    height: 2.59rem;
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
        width: 1.11rem;
        height: 0.38rem;
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
  padding: 0 0.25rem 0.4rem;
  dt {
    width: 7rem;
    height: 2.06rem;
  }

  dd {
    display: flex;
    justify-content: space-between;
    margin-top: 0.15rem;
    div {
      width: 3.41rem;
      height: 1.85rem;
    }
  }

  img {
    height: 100%;
  }
}

.invite-rule {
  padding: 0.2rem 0.1rem;
  border-top: 0.14rem solid #f8f8f8;

  .invite-rule-main {
    margin: 0 auto;
    width: 7rem;
    height: 5.65rem;
    padding: 0.27rem 0.5rem 0;

    li {
      font-size: 0.24rem;
      color: #959595;
      line-height: 0.38rem;
      margin-bottom: 0.2rem;
      display: flex;
      i {
        margin-right: 0.08rem;
        display: inline-block;
        text-align: center;
        background: #fdd717;
        color: #fff;
        font-size: 12px;
        flex: 0 0 16px;
        height: 16px;
        line-height: 16px;
        border-radius: 8px;
        background-clip: padding-box;
        vertical-align: middle;
      }
      span,i{
        display: inline-block;
        vertical-align: middle;
      }
    }
    &.text-red {
      color: red;
    }
  }
}
</style>
