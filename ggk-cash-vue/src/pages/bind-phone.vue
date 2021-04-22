<template>
  <div class="wrapper">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp">
      <x-header :left-options="{backText: ''}">绑定手机</x-header>
      <div class="bind-mobile-form">
        <ul>
          <li class="bind-mobile-input">
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
            <a
              href="javascript:;"
              class="bind-mobile-code-btn"
              :class="canSave?'':'cur'"
              v-if="countDownShow==false"
              @click="countDown"
            >获取验证码</a>
            <a href="#" class="bind-mobile-code-btn cur" v-else>
              <countdown v-show="countDownShow" v-model="time" :start="start" @on-finish="finish"></countdown>s重新发送
            </a>
          </li>
          <li class="bind-mobile-input">
            <x-input
              v-model.trim="code_val"
              placeholder="请输入验证码"
              ref="code_input"
              type="tel"
              required
              :max="8"
            ></x-input>
          </li>
        </ul>
        <button class="long-button" @click="postData">确定绑定</button>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import { XButton, XHeader, XInput, Group, Countdown } from "vux";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    Group,
    XButton,
    Countdown,
    XHeader,
    XInput,
    MescrollVue
  },
  mounted() {
    // 让app可以调用methods里的方法
    this.$nextTick(function() {
      this.token = localStorage.getItem("token");
    });
  },
  data() {
    return {
      canSave: true,
      token: "",
      code_val: "",
      mobile_val: "",
      countDownShow: false,
      time: 60,
      start: false,
      valid_mobile: false,
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        use: false,
        isBounce: false
      }
    };
  },
  computed: {},
  methods: {
    finish(index) {
      this.start = false;
      this.countDownShow = false;
    },
    countDown() {
      if (this.valid_mobile) {
        this.getCountTime();
      } else {
        this.$vux.toast.text("请输入正确手机号");
      }
    },
    isWin() {
      this.valid_mobile = this.$refs.valid_mobile.valid;
    },
    getCountTime(){
      if(!this.canSave){
        return;
      }
      this.canSave = false;
      //验证手机窗口内容
      let params = {
        token:  this.token,
        api_name: 'time_down'
      }
      //ajax请求
      this.$ajax({
        method: "post",
        url: "/api/huser/api",
        data: this.$qs.stringify(params)
      })
        .then(response => {
          let data = response.data;
          if (data.code == 1) {
            this.time = +data.data.time_down;
            this.regSendSMS();
          } else {
            this.$vux.toast.text(data.msg);
            return;
          }
        })
        .catch(error => {
          this.$vux.toast.text("发送失败，请稍后重试");
        });
    },
    regSendSMS() {
      //验证手机窗口内容
      let params = {
        token:  this.token,
        api_name: 'send_sms',
        tel: this.mobile_val
      }
      //ajax请求
      this.$ajax({
        method: "post",
        url: "/api/huser/api",
        data: this.$qs.stringify(params)
      })
        .then(response => {
          let data = response.data;
          if (data.code == 1) {
            this.$vux.toast.text("发送成功");
            this.countDownShow = true;
            this.start = true;
          } else {
            this.$vux.toast.text(data.msg);
            return;
          }
          setTimeout(() => {
            this.canSave = true;
          }, 1000);
        })
        .catch(error => {
          this.$vux.toast.text("发送失败，请稍后重试");
          setTimeout(() => {
            this.canSave = true;
          }, 1000);
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
        let params = {
          token:  this.token,
          api_name: 'bind_tel',
          tel: this.mobile_val,
          code: this.code_val
        }
        this.$ajax({
          method: "post",
          url: "/api/huser/api",
          data: this.$qs.stringify(params)
        })
          .then(response => {
            let data = response.data;
            if (data.code != 1) {
              this.$vux.toast.text(data.msg);
              return;
            }
            this.$vux.toast.text("绑定成功");
            setTimeout(() => {
              this.$router.back(-1);
            }, 1000);
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
