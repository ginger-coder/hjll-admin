<template>
  <div>
    <svg-icon icon-class="refresh" v-hold-click @click="click" />
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    click() {
      this.$store.dispatch('app/changeRefreshview',false)
      setTimeout(() => {
        this.$store.dispatch('app/changeRefreshview',true)
      },200)
    },
  }
}
</script>

<style scoped>
.refresh {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
