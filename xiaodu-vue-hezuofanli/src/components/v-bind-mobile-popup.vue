<template>
  <div class="bind-mobile-popup-container" @click.self="switch_mobile_dialog(false)">
    <div class="bind-mobile-popup-wrapper">
      <div class="icon-close" @click="switch_mobile_dialog(false)"></div>
      <div class="bind-mobile-popup-title">提现必须绑定有效手机</div>
      <div class="bind-mobile-popup-form">
        <ul>
          <li class="bind-mobile-this-input">
            <x-input
              ref="valid_mobile"
              v-model.trim="mobile_val"
              placeholder="请输入手机号"
              required
              type="tel"
              :max="11"
              keyboard="number"
              is-type="china-mobile"
              @on-change="isWin"
            ></x-input>
          </li>
          <li class="bind-mobile-this-input">
            <x-input
              v-model.trim="code_val"
              placeholder="请输入验证码"
              ref="code_input"
              type="tel"
              required
              :max="8"
            ></x-input>
            <a
              href="javascript:;"
              class="bind-mobile-code-btn"
              v-if="countDownShow==false"
              @click="countDown"
            >获取验证码</a>
            <a href="#" class="bind-mobile-code-btn cur" v-else>
              <countdown v-show="countDownShow" v-model="time" :start="start" @on-finish="finish"></countdown>s重新发送
            </a>
          </li>
        </ul>
        <div class="bind-mobile-popup-btn-box">
          <a href="#" class="bind-mobile-popup-btn" @click="postData">绑定</a>
          <a
            href="javascript:;"
            class="bind-mobile-popup-btn tourist-btn"
            @click="switch_mobile_dialog(false)"
          >暂不绑定</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XInput, XButton, Countdown } from "vux";
import { mapMutations, mapActions } from "vuex";
export default {
  components: {
    XInput,
    XButton,
    Countdown
  },
  data() {
    return {
      code_val: "",
      mobile_val: "",
      countDownShow: false,
      time: 60,
      start: false,
      valid_mobile: false
    };
  },
  methods: {
    ...mapMutations(["switch_mobile_dialog"]),
    ...mapActions(["LoginInfo"]),
    finish(index) {
      this.start = false;
      this.countDownShow = false;
      this.time = 60;
    },
    countDown() {
      if (this.valid_mobile) {
        this.regSendSMS();
      } else {
        this.$vux.toast.text("请输入正确手机号");
      }
    },
    isWin() {
      this.valid_mobile = this.$refs.valid_mobile.valid;
    },
    regSendSMS() {
      //验证手机窗口内容
      let phone = this.mobile_val;
      let params = new URLSearchParams();
      params.append("phone_num", phone);
      //ajax请求
      this.$ajax({
        method: "post",
        url: "/bind-phone/send-sms",
        data: params
      })
        .then(response => {
          if (response.data.status == 1) {
            this.$vux.toast.text("发送成功");
            this.countDownShow = true;
            this.start = true;
          } else {
            this.$vux.toast.text(response.data.msg);
            return;
          }
        })
        .catch(error => {
          this.$vux.toast.text("发送失败，请稍后重试");
        });
    },
    postData() {
      if (this.$refs.valid_mobile.currentValue == "") {
        this.$vux.toast.text("手机号未填写");
        return;
      } else if (this.$refs.code_input.currentValue == "") {
        this.$vux.toast.text("验证码未填写");
        return;
      }
      if (this.valid_mobile) {
        // this.$vux.toast.text("绑定成功");
        let username = this.mobile_val;
        let code = this.code_val;
        let params = new URLSearchParams();
        params.append("phone_num", username);
        params.append("sms", code);
        this.$ajax({
          method: "post",
          url: "/bind-phone/index",
          data: params
        })
          .then(response => {
            if (response.data.status != 1) {
              this.$vux.toast.text(response.msg);
              return;
            }
            this.$vux.toast.text("绑定成功");
            this.LoginInfo();
            this.switch_mobile_dialog(false);
          })
          .catch(error => {
            this.$vux.toast.text("系统错误，请稍后重试");
          });
      } else {
        this.$vux.toast.text("请输入正确手机号");
        return;
      }
    }
  }
};
</script>

<style lang="less">
//绑定手机弹窗
.bind-mobile-popup-container {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 66;

  .bind-mobile-popup-wrapper {
    width: 5.8rem;
    height: 5.4rem;
    background-color: #fff;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0.9rem 0.48rem 0.7rem;
    border-radius: 0.1rem;

    .icon-close {
      position: absolute;
      top: 0.4rem;
      right: 0.5rem;
      background-image: url(../assets/images/icon-form-close.png);
      background-size: 100% 100%;
      width: .24rem;
      height: .24rem;
      display: inline-block;
      vertical-align: middle;
    }

    .bind-mobile-popup-title {
      text-align: center;
      font-size: 0.24rem;
      color: #8f8f8f;
    }

    .bind-mobile-this-input {
      height: 1.1rem;
      width: 100%;
      position: relative;
      border-bottom: 1px solid #e0e6ee;
      display: flex;
      align-items: flex-end;

      .weui-cell {
        padding: 0;
        width: 100%;
        line-height: normal;

        &::before {
          display: none;
        }
      }

      input {
        height: 0.88rem;
        line-height: 0.88rem;
        border: none;
        outline: none;
        width: 100%;
        -webkit-appearance: none;
        font-size: 0.3rem;
        color: #333;
      }

      input::-webkit-input-placeholder {
        color: #c8c8c8;
      }

      .bind-mobile-code-btn {
        width: 1.7rem;
        height: 0.58rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 0.25rem;
        background-color: #ff5363;
        border-radius: 0.1rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        right: 0;

        &.cur {
          background-color: #ccc;
        }
      }
    }

    .bind-mobile-popup-btn-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.6rem;

      .bind-mobile-popup-btn {
        width: 2.3rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 0.28rem;
        background-color: #53c6ff;
        border-radius: 0.1rem;
        height: 0.74rem;
        position: relative;

        &:active {
          background-color: #55b0dc;
        }

        &.tourist-btn {
          background-color: #7395ec;

          &:active {
            background-color: #728fbd;
          }
        }
      }
    }
  }
}
</style>
