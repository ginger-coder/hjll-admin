<template>
  <div class="content-text-image">
    <slot name="text">
      <span class="option_text" v-if="text" v-text="text || '-'"/>
    </slot>
    <slot name="img">
      <div class="option_image" v-if="img && img.length">
        <el-row :gutter="16" type="flex" class="content-text-image-row">
          <el-col v-for="el in img" :key="el">
            <el-image class="elImage" v-if="el" :src="el" :preview-src-list="img" v-bind="imgProps"/>
          </el-col>
        </el-row>
      </div>
    </slot>
  </div>
</template>

<script>

export default {
  name: "contentOption",
  props: {
    text: {
      type: String,
      default: '',
    },
    img: {
      type: Array,
      default: () => ([])
    },
    imgProps: {
      type: Object,
      default: () => ({
        lazy: false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.content-text-image-row {
  flex-wrap: wrap;

  .el-col-24 {
    width: auto;
  }

  .elImage {
    width: var(--imgWidth, 64px);
    height: var(--imgHeight, 64px);
    display: flex;
    align-items: ce;
    img {
        width: 100%;
    }
  }

}
</style>
