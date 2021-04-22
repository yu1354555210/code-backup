<template>
    <div class="wrapper">
        <x-header :left-options="{backText: ''}">修改昵称</x-header>
        <div class="this-form">
            <div class="this-form-tips"></div>
            <div class="this-form-main">
                <ul>
                    <li>
                        <x-input ref="username" type="text" :placeholder="username" v-model="newUsername" required :max="15"></x-input>
                    </li>
                </ul>
            </div>
        </div>
        <div class="btn-box btn-blue">
            <x-button type="primary" @click.native="postData">确认</x-button>
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
      username: this.$store.getters.getUserInfo.nick_name,
      newUsername: null
    };
  },
  methods: {
    postData() {
      let username = this.$refs.username.currentValue;
      if(username == ""){
        this.$vux.toast.text("昵称不能为空");
        return;
      }else{
        this.$ajax.get('/player/modify-nickname',{
          params:{
            nickname: username
          }
        })
        .then(response => {
          if (response.data.status != 1) {
            this.$vux.toast.text(response.data.msg);
            return;
          }
          this.$vux.toast.text("修改成功");
          setTimeout(() => {
            this.$router.push("/game-mine");
            this.$store.dispatch("LoginInfo");
          }, 300);
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
