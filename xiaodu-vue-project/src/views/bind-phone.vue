<template>
    <div class="wrapper">
        <x-header :left-options="{backText: ''}">绑定手机</x-header>
        <div v-if="isSuccess==false" v-cloak>
            <div class="this-form">
                <div class="this-form-tips">
                    <i class="icon-tips-warn"></i>
                    <span>绑定成功后，可用手机登录，账号更安全</span>
                </div>
                <div class="this-form-main">
                    <ul>
                        <li>
                            <x-input placeholder="请输入手机号码" type="tel" :max="11" keyboard="number" required is-type="china-mobile" ref="valid_mobile" v-model="mobile_val" @on-change="isWin" ></x-input>
                        </li>
                        <li>
                            <x-input placeholder="请输入验证码" v-model="code_val" type="tel" ref="code_input" :max="8" required></x-input>
                            <x-button mini type="warn" class="code-btn" v-if="countDownShow==false"  @click.native="countDown">发送验证码
                            </x-button>
                            <x-button mini type="warn" class="code-btn cur" v-else>
                                <countdown v-show="countDownShow" v-model="time" :start="start" @on-finish="finish"></countdown>s重新发送
                            </x-button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="btn-box btn-blue">
                <x-button type="primary" @click.native="postData">下一步</x-button>
            </div>
            <!-- <div class="this-form-other"><icon type="warn"></icon><span>注：成功修改密码后，需要重新登录</span></div> -->
        </div>

        <div class="bind-success" v-if="isSuccess" v-cloak>
          <div class="bind-success-img">
            <img src="../assets/img/bind-phone-success.png" alt="">
          </div>
          <div class="bind-success-body">
            <h2>绑定成功</h2>
            <p>您已经成功绑定手机：{{bind_phone}}</p>
          </div>
          <div class="btn-box btn-blue">
            <x-button type="primary" @click.native="changePhone">更换绑定手机</x-button>
          </div>
        </div>
    </div>
</template>

<script>
import { XButton, XHeader, XInput, Icon, Countdown } from "vux";
import { mapGetters, mapActions } from 'vuex';
export default {
  components: {
    XButton,
    XHeader,
    XInput,
    Icon,
    Countdown
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  mounted() {
    this.$nextTick(function() {
      let playerInfo = this.getUserInfo;
      if(playerInfo != null){
        if(playerInfo.is_bind_phone == 1){
          this.isSuccess = true;
          this.bind_phone = playerInfo.bind_phone;
        }else{
          this.changePhone();
        }
      }else{
        this.$ajax
        .get("/xd-api/player-info")
        .then(res => {
          let data = res.data.data;
          if(data.is_bind_phone == 1){
            this.isSuccess = true;
            this.bind_phone = data.bind_phone;
          }else{
            this.changePhone();
          }
          this.$store.commit("setUserInfo",data);
        })
        .catch(error => {
          console.log(error);
        });
      }
    });
  },
  data() {
    return {
      time: 60,
      start: false,
      countDownShow: false,
      valid_mobile: false,
      isSuccess: false,
      mobile_val: "",
      code_val: "",
      bind_phone: ""
    };
  },
  methods: {
    ...mapActions(['LoginInfo']),
    finish(index) {
      this.start = false;
      this.countDownShow = false;
      this.time = 60;
    },
    countDown() {
      if (this.valid_mobile) {
        this.bindPhoneSms();
      } else {
        this.$vux.toast.text("请输入正确手机号");
      }
    },
    // 手机验证是否通过
    isWin() {
      this.valid_mobile = this.$refs.valid_mobile.valid;
    },
    bindPhoneSms() {
      //绑定手机发送验证码
      let phone = $.trim(this.mobile_val);
      let params = new URLSearchParams();
      params.append("phone_num", phone);
      this.$ajax({
        method: "post",
        url: "/bind-phone/send-sms",
        data: params
      })
        .then(response => {
          if (response.data.status != 1) {
            this.$vux.toast.text(response.data.msg);
            return;
          }
          this.$vux.toast.text("发送成功");
          this.countDownShow = true;
          this.start = true;
        })
        .catch(error => {
          this.$vux.toast.text("发送失败，请稍后重试");
        });
    },
    changePhone() {
      this.isSuccess = false;
      this.mobile_val = "";
      this.code_val = "";
      this.finish();
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
            this.isSuccess = true;
            this.bind_phone = username;
            this.LoginInfo();
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
[v-cloak] {
  display: none;
}
</style>
