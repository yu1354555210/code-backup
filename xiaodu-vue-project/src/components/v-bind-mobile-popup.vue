<template>
    <div class="bind-mobile-popup-container" @click.self="switch_mobile_dialog(false)">
        <div class="bind-mobile-popup-wrapper">
            <div class="icon-close" @click="switch_mobile_dialog(false)"></div>
            <div class="bind-mobile-popup-title">为了方便给您推送消息，请先绑定手机</div>
            <div class="bind-mobile-popup-form">
                <ul>
                    <li class="bind-mobile-this-input">
                        <x-input
                            ref="valid_mobile"
                            v-model="mobile_val"
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
                            v-model="code_val"
                            placeholder="请输入验证码"
                            ref="code_input"
                            type="tel"
                            :max="8"
                            required
                        ></x-input>
                        <a
                            href="javascript:;"
                            class="bind-mobile-code-btn"
                            v-if="countDownShow==false"
                            @click="countDown"
                        >获取验证码</a>
                        <a href="#" class="bind-mobile-code-btn cur" v-else>
                            <countdown
                                v-show="countDownShow"
                                v-model="time"
                                :start="start"
                                @on-finish="finish"
                            ></countdown>s重新发送
                        </a>
                    </li>
                </ul>
                <div class="bind-mobile-popup-btn-box">
                    <a href="#" class="bind-mobile-popup-btn" @click="postData">确定绑定</a>
                    <a href="javascript:;" class="bind-mobile-popup-btn tourist-btn"  @click="switch_mobile_dialog(false)">暂不绑定</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { XInput, XButton, Countdown } from "vux";
import { mapMutations, mapActions } from 'vuex';
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
      ...mapMutations(['switch_mobile_dialog']),
      ...mapActions(['LoginInfo']),
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
        let username = $.trim(this.mobile_val);
        let code = $.trim(this.code_val);
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

<style lang="less" scoped>
</style>
