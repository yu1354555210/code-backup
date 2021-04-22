<template>
    <div class="wrapper">
        <x-header :left-options="{backText: ''}">绑定账号</x-header>
        <div v-if="isSuccess==false">
          <div class="this-form">
              <div class="this-form-tips">
                  <i class="icon-tips-warn"></i>
                  <span>绑定成功后，可使用账号密码登录</span>
              </div>
              <div class="this-form-main">
                  <ul>
                      <li>
                          <x-input ref="user_name" placeholder="账号由4~12位数字，字母或下划线组成" v-model="new_user_val" required ></x-input>
                      </li>
                      <li>
                          <x-input ref="pwd" :min="6" :max="12" placeholder="设置登录密码（6~12个字符）" v-model="new_pwd_val" type="password" required></x-input>
                      </li>
                      <li>
                          <x-input ref="pwd2" :min="6" :max="12" placeholder="确认登录密码（6~12个字符）" type="password" required></x-input>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="btn-box btn-blue">
              <x-button type="primary" @click.native="postData">确认</x-button>
          </div>
          <div class="this-form-other"><icon type="warn"></icon><span>注：成功修改密码后，需要重新登录</span></div>
        </div>

        <div class="bind-success" v-if="isSuccess">
          <div class="bind-success-img">
            <img src="../assets/img/bind-user-success.png" alt="">
          </div>
          <div class="bind-success-body">
            <h2>绑定成功</h2>
            <p>您已经成功绑定平台账号：{{new_user_val}}</p>
          </div>
        </div>
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
      isSuccess: false,
      new_user_val: '',
      new_pwd_val: ''
    };
  },
  methods: {
    postData() {
      let userNameInfo = this.$refs.user_name.currentValue,
          pwd = this.$refs.pwd.currentValue,
          pwd2 = this.$refs.pwd2.currentValue;
      if (userNameInfo == "") {
        this.$vux.toast.text("账号未填写");
        return;
      } else if (pwd == "") {
        this.$vux.toast.text("密码未填写");
        return;
      } else if (pwd2 == "") {
        this.$vux.toast.text("确认密码未填写");
        return;
      } else if (pwd != pwd2){
          this.$vux.toast.text("两次密码不相同");
          return;
      }else if((pwd.length < 6 || pwd.length > 12) || (pwd2.length < 6 || pwd2.length > 12)){
          this.$vux.toast.text("密码长度需6~12个字符");
          return;
      }else if(userNameInfo.length < 4 || userNameInfo.length > 12){
          this.$vux.toast.text("账号由4~12位数字，字母或下划线组成");
          return;
      }else{
          
        
        let newUser = this.new_user_val;
        let newPwd = this.new_pwd_val;
        let params = new URLSearchParams();
        params.append("account", newUser);
        params.append("password", newPwd);
        params.append("repassword", newPwd);
        this.$ajax({
          method: "post",
          url: "set-account-pwd/index",
          data: params
        })
          .then(response => {
            console.log(response);
            if (response.data.status != 1) {
              this.$vux.toast.text(response.data.msg);
              return;
            }
            this.$vux.toast.text("修改成功");
            this.isSuccess = true;
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
