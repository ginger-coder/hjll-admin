<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import getPageTitle from '@/utils/get-page-title'
import {title} from '@/settings'
export default {
  name: 'App'
}
// 设置标题
document.title = getPageTitle(title)
</script>
