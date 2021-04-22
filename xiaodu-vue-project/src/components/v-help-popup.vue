<template>
    <div class="help-mask-container" @touchstart="switch_help_dialog(false)">
      <div class="help-mask" @click.stop="switch_help_dialog(true)">
        <slot></slot>
      </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
    methods: {
        ...mapMutations(['switch_help_dialog'])
    }
}
</script>

<style>

</style>
