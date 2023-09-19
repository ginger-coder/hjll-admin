<template>
  <div class="topic-content">
    <div class="disp_flex topic_themeName" v-if="topic.text || (topic.img && topic.img.length)">
      <slot name="topic_type"></slot>
      <slot name="themeName">
        <div class="disp_flex">
            <el-checkbox v-if="!isOther" v-model="topic.checked" class="check"></el-checkbox>
            <content-option :text="topic.text" :img="topic.img"/>
        </div>
      </slot>
    </div>
    <el-collapse-transition>
      <div v-show="show">
        <slot name="options">
          <div class="topic_options_wrap" v-if="options && options.length">
            <component :is="`el-${optionType}-group`" :value="filterValue()" @input="handleInput">
              <template v-for="(el, elI) in options || []" v-if="el.text || (el.img && el.img.length)">
                <component :is="`el-${optionType}`" :key="elI" :label="el.value || el.text">
                  <content-option v-bind="{...el}"/>
                </component>
              </template>
            </component>
            <!--            <el-checkbox-group :value="rightAnswer">-->
            <!--              <template v-for="(el, elI) in options || []" v-if="el.text">-->
            <!--                <el-checkbox :key="elI" :label="el.text">-->
            <!--                  <content-option v-bind="{...el}"/>-->
            <!--                </el-checkbox>-->
            <!--              </template>-->
            <!--            </el-checkbox-group>-->
          </div>
        </slot>
        <slot name="analysis" >
          <div class="analysis" v-if="analysis.text || (analysis.img && analysis.img.length)">
            <el-link style="margin-bottom: 12px">解析</el-link>
            <contentOption :text="analysis.text" :img="analysis.img"/>
          </div>
        </slot>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import contentOption from '../components/content'

export default {
  name: "topic",
  props: {
    isOther: {
      type: Boolean,
      default: false
    },
    value: Array | String,
    topic: { // 题目的文字和图片
      type: Object,
      default: () => ({
        text: null,
        img: [],
        checked: false,
      })
    },
    rightAnswer: { // 正确答案
      type: Array,
      default: () => ([])
    },

    options: { // 答案选项
      type: Array,
      default: () => ([])
    },
    analysis: { // 解析
      type: Object,
      default: () => ({
        text: null,
        img: []
      })
    },
    show: {
      type: Boolean,
      default: false
    },
    optionType: {
      type: String,
      default: 'radio'
    }

  },
  components: {
    contentOption
  },
  methods: {
    filterValue() {
      const val = this.value || this.rightAnswer || [];
      if (this.optionType === 'radio') {
        return val?.[0]
      }
      return val;
    },
    handleInput(val) {

      let value = val;
      if (this.optionType === 'radio') {
        value = [val]
      }
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped lang="scss">
.topic-content {
    .check {
        margin-right: 10px;
    }
  --space: 12px;
  ::v-deep {

    .option_image {
      margin-top: 8px;
    }
  }
  .el-checkbox-group, .el-radio-group {
    display: flex;
    flex-direction: column;

    .el-checkbox, .el-radio {
      display: flex;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      padding: 8px 0;
    }

    .el-checkbox {
      //align-items: center;
      ::v-deep {
        .el-checkbox__label {
          line-height: 14px;
        }

        .el-checkbox__inner {
          width: 16px;
          height: 16px;
        }

        .el-checkbox__inner::after {
          left: 4.5px;
          top: 1.5px;
        }
      }

    }
  }

  .topic_themeName {
    font-size: 14px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    padding: var(--space) 0;
  }

  .topic_options_wrap {
    margin-bottom: var(--space);
    padding-left: 20px;
    box-sizing: border-box;
  }

  .analysis {
    background: #FAFAFA;
    border-radius: 0 0 2px 2px;
    border: 1px solid #E9E9E9;
    padding: 16px;
    margin-bottom: var(--space);
  }
}
</style>
