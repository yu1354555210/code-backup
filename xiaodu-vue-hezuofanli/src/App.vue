<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    //友盟统计
    const script = document.createElement("script");
    script.src =
      "https://s96.cnzz.com/z_stat.php?id=1275438492&web_id=1275438492";
    script.language = "JavaScript";
    document.body.appendChild(script);
  },
  watch: {
    $route() {
      //友盟统计
      if (window._czc) {
        let location = window.location;
        let contentUrl = location.pathname + location.hash;
        let refererUrl = "/";
        window._czc.push(["_trackPageview", contentUrl, refererUrl]);
        window._czc.push(["_setAccount", "1275438492"]);
      }
    }
  },
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import "./assets/css/reset.styl";
@import "~vux/src/styles/1px.less";
body{
  background-color: #f7f7f7;
}
#app {
    height: 100%;
}
</style>
