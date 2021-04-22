<template>
    <div class="wrapper">
        <x-header :left-options="{backText: ''}">修改密码</x-header>
        <div class="this-form">
            <div class="this-form-tips"></div>
            <div class="this-form-main">
                <ul>
                    <li>
                        <x-input ref="pwd" type="password" placeholder="请输入旧密码" required v-model="old_pwd_val"></x-input>
                    </li>
                    <li>
                        <x-input ref="new_pwd" placeholder="请输入新密码" type="password" v-model="new_pwd_val" required></x-input>
                    </li>
                    <li>
                        <x-input ref="new_pwd2" placeholder="请确认新密码" type="password" required></x-input>
                    </li>
                </ul>
            </div>
        </div>
        <div class="btn-box btn-blue">
            <x-button type="primary" @click.native="postData">确认</x-button>
        </div>
        <div class="this-form-other"><icon type="warn"></icon><span>注：成功修改密码后，需要重新登录</span></div>
    </div>
</template>

<script>
import { XButton, XHeader, XInput, Icon } from "vux";
export default {
  components: {
    XButton,
    XHeader,
    XInput,
    Icon
  },
  mounted() {},
  data() {
    return {
      old_pwd_val: "",
      new_pwd_val: "",
    };
  },
  methods: {
    loginout() {
      this.$ajax
        .get("/login/out")
        .then(response => {
          if (response.data.status == 0) {
            this.$vux.toast.text(response.data.msg);
            return;
          }
          this.$router.push("/login");
        })
        .catch(error => {
          console.log(error);
          this.$vux.toast.text("logout err");
        });
    },
    postData() {
      let pwd = this.$refs.pwd.currentValue,
        new_pwd = this.$refs.new_pwd.currentValue,
        new_pwd2 = this.$refs.new_pwd2.currentValue;
      if (pwd == "") {
        this.$vux.toast.text("旧密码未填写");
        return;
      } else if (new_pwd == "") {
        this.$vux.toast.text("新密码未填写");
        return;
      } else if (new_pwd2 == "") {
        this.$vux.toast.text("确认新密码未填写");
        return;
      } else if (new_pwd != new_pwd2) {
        this.$vux.toast.text("两次密码不相同");
        return;
      } else if (
        new_pwd.length < 6 ||
        new_pwd.length > 12 ||
        (new_pwd2.length < 6 || new_pwd2.length > 12) ||
        (pwd.length < 6 || pwd.length > 12)
      ) {
        this.$vux.toast.text("密码长度需6~12个字符");
        return;
      } else {
        let newPwd = this.new_pwd_val;
        let oldPwd = this.old_pwd_val;
        let params = new URLSearchParams();
        params.append("opwd", oldPwd);
        params.append("npwd", newPwd);
        params.append("npwd2", newPwd);
        this.$ajax({
          method: "post",
          url: "/reset-pwd/index",
          data: params
        })
          .then(response => {
            console.log(response);
            if (response.data.status != 1) {
              this.$vux.toast.text(response.data.msg);
              return;
            }
            this.$vux.toast.text("修改成功");
            this.loginout();
          })
          .catch(error => {
            this.$vux.toast.text("系统错误，请稍后重试");
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
