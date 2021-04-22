<template>
    <div class="wrapper">
        <div class="login-box">
            <v-login :isLoginPage="true" :path="'game-mine'"></v-login>
        </div>
    </div>
</template>
<script>
import vLogin from "@/components/v-login";
export default {
  components: {
    vLogin
  },
  mounted() {
    this.$nextTick(function() {
    });
  }
};
</script>

<style>
</style>
