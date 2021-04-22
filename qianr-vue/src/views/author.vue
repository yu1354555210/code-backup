<template>
    <div class="jumping">跳转中,请稍后...</div>
</template>

<script>
export default {
  mounted() {
    let playUrl = localStorage.getItem("playUrl");
    let thirdRedirect = localStorage.getItem("thirdRedirect");
    if (playUrl) {
      // 如果有跳转游戏,自动跳转
      window.location.href = playUrl;
      localStorage.removeItem("playUrl");
    } else if (thirdRedirect) {
      //第三方登录后自动跳转来源页面
      this.$router.push({
        path: thirdRedirect
      });
      localStorage.removeItem("thirdRedirect");
    } else {
      this.$router.push({
        path: "/"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.jumping {
  text-align: center;
  font-size: 0.3rem;
  color: #333333;
  padding: 1rem;
}
</style>
