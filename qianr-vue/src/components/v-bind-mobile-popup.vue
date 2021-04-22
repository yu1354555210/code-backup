<template>
  <!-- 绑定手机 -->
  <div class="this-form-container" @click.self="switch_mobile_dialog(false)">
    <div class="this-form-wrap" v-show="!isBind">
      <div class="this-form-title" v-text="bindPhoneTitle"></div>
      <group class="this-form-input">
        <i class="icon-phone form-icon"></i>
        <x-input
          :placeholder="phoneTips"
          type="tel"
          :max="11"
          keyboard="number"
          required
          is-type="china-mobile"
          ref="valid_mobile"
          v-model="mobile_val"
          @on-change="isWin"
          @on-blur="inputLoseFocus"
        ></x-input>
      </group>
      <group class="this-form-input">
        <i class="icon-code form-icon"></i>
        <x-input
          placeholder="请输入验证码"
          v-model="code_val"
          type="tel"
          ref="code_input"
          :max="8"
          :show-clear="false"
          novalidate
          @on-blur="inputLoseFocus"
        ></x-input>
        <a
          href="#"
          class="icon-form-code"
          v-if="countDownShow==false"
          id="rp_getcode"
          @click="countDown"
        >获取验证码</a>
        <a href="#" class="icon-form-code cur" v-else>
          <countdown v-show="countDownShow" v-model="time" :start="start" @on-finish="finish"></countdown>s重新发送
        </a>
      </group>
      <div class="this-form-btn-box">
        <x-button
          type="primary"
          class="this-form-btn radius text-sm"
          @click.native="postData"
          v-text="btnText"
        ></x-button>
      </div>
    </div>
    <div class="this-form-wrap" v-show="isBind">
      <div class="this-form-title">绑定手机</div>
      <group class="this-form-input this-bind-text">
        <x-input type="tel" v-model="bind_phone" readonly></x-input>
      </group>
      <div class="this-form-btn-box">
        <x-button
          type="primary"
          class="this-form-btn radius text-sm"
          @click.native="changePhone"
        >更换绑定</x-button>
      </div>
    </div>
    <div class="this-form-wrap" v-show="valOldPhone">
      <div class="this-form-title">验证原手机</div>
      <group class="this-form-input">
        <i class="icon-phone form-icon"></i>
        <x-input v-model="bind_phone" readonly></x-input>
      </group>
      <group class="this-form-input">
        <i class="icon-code form-icon"></i>
        <x-input
          placeholder="请输入验证码"
          v-model="code_val2"
          type="tel"
          ref="code_input2"
          :max="8"
          :show-clear="false"
          novalidate
          @on-blur="inputLoseFocus"
        ></x-input>
        <a
          href="#"
          class="icon-form-code"
          v-if="countDownShow2==false"
          :start="start2"
          @on-finish="finish2"
          @click="oldSendSMS"
        >获取验证码</a>
        <a href="#" class="icon-form-code cur" v-else>
          <countdown v-show="countDownShow2" v-model="time2" :start="start2" @on-finish="finish2"></countdown>s重新发送
        </a>
      </group>
      <div class="this-form-btn-box">
        <x-button
          type="primary"
          class="this-form-btn radius text-sm"
          @click.native="postOldData"
        >下一步</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import { XInput, XButton, Countdown, Group } from "vux";
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  components: {
    XInput,
    XButton,
    Countdown,
    Group
  },
  props: {
    isBindPhone: false
  },
  data() {
    return {
      code_val: "",
      code_val2: "",
      mobile_val: "",
      countDownShow: false,
      time: 60,
      start: false,
      countDownShow2: false,
      time2: 60,
      start2: false,
      valid_mobile: false,
      bind_phone: "",
      bindPhoneTitle: "绑定手机",
      phoneTips: "请输入手机号码",
      btnText: "下一步",
      valOldPhone: false,
      valNewPhone: false,
      isBind: false
    };
  },
  computed: {
    ...mapGetters(["getUserInfo"])
  },
  mounted() {
    this.$nextTick(function() {
      if (this.isBindPhone == true) {
        this.bind_phone = this.getUserInfo.bind_phone;
        this.isBind = this.isBindPhone;
      }
    });
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
      let url;
      // 是否更换绑定
      if(this.valNewPhone){
        url = "/change-bind-phone/new-send-sms";
      }else{
        url = "/bind-phone/send-sms";
      }
      //验证手机窗口内容
      let phone = this.mobile_val;
      let params = new URLSearchParams();
      params.append("phone_num", phone);
      //ajax请求
      this.$ajax({
        method: "post",
        url: url,
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
      let url;
      // 是否更换绑定
      if(this.valNewPhone){
        url = "/change-bind-phone/new-validate-sms";
      }else{
        url = "/bind-phone/index";
      }
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
          url: url,
          data: params
        })
          .then(response => {
            if (response.data.status != 1) {
              this.$vux.toast.text(response.data.msg);
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
    },
    oldSendSMS() {
      //验证手机窗口内容
      this.$ajax({
        method: "post",
        url: "/change-bind-phone/old-send-sms"
      })
        .then(response => {
          if (response.data.status == 1) {
            this.$vux.toast.text("发送成功");
            this.countDownShow2 = true;
            this.start2 = true;
          } else {
            this.$vux.toast.text(response.data.msg);
            return;
          }
        })
        .catch(error => {
          this.$vux.toast.text("发送失败，请稍后重试");
        });
    },
    postOldData() {
      if (this.$refs.code_input2.currentValue == "") {
        this.$vux.toast.text("验证码未填写");
        return;
      }
      let code = $.trim(this.code_val2);
      let params = new URLSearchParams();
      params.append("sms", code);
      this.$ajax({
        method: "post",
        url: "/change-bind-phone/old-validate-sms",
        data: params
      })
        .then(response => {
          if (response.data.status != 1) {
            this.$vux.toast.text(response.msg);
            return;
          }
          this.bindPhoneTitle = "更换绑定";
          this.phoneTips = "请输入新手机号";
          this.btnText = "确定绑定";
          this.isBind = false;
          this.valOldPhone = false;
          this.valNewPhone = true;
        })
        .catch(error => {
          this.$vux.toast.text("系统错误，请稍后重试");
        });
    },
    changePhone() {
      this.isBind = false;
      this.valOldPhone = true;
      this.mobile_val = "";
      this.code_val = "";
      this.finish();
    },
    finish2(index) {
      this.start2 = false;
      this.countDownShow2 = false;
      this.time2 = 60;
    },
  }
};
</script>

<style lang="less" scoped>
</style>
