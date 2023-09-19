<template>
  <div class="page_box">
    <div class="box_header" :class="{ box_header_padding: ($slots.headerSlot || title)}">
      <div :class="{header_title :title}" v-text="title"/>
      <div class="header_slot" v-if="$slots.headerSlot">
        <slot name="headerSlot"></slot>
      </div>
    </div>
    <el-divider v-if="border"/>
    <div class="page_box_content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  name: "pageBox"
}
</script>

<style scoped lang="scss">
.page_box.bg-white {
  background-color: #fff;
}
.page_box.padding {
 padding: 15px 0;
}

.page_box {
  width: 100%;
  //background-color: #fff;
  border-radius: 2px;
  //padding: 16px 0;
  .el-divider {
    margin: 0 auto;
  }


  .box_header {
    display: flex;
    -webkit-justify-content: space-around;
    justify-content: space-between;
    align-items: center;
    //border-bottom: 1px solid #E9E9E9;
    padding: 0 32px;


    .header_title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC, serif;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
      //line-height: 55px;
      //padding-bottom: 16px;
      //height: 55px;
    }

    .header_slot {
      //padding-bottom: 16px;
    }

  }

  .box_header_padding {
    padding: 15px 32px;
  }

  .page_box_content {
    padding: 15px 32px;
  }

  .has-title {
    margin-top: 16px;
  }
}


</style>