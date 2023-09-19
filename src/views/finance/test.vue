<template>
  <div>
    <json-form :schema="schema"/>
  </div>
</template>

<script>
import jsonForm from "@/views/finance/components/JsonForm.js";

export default {
  name: "test",
  data() {
    return {
      schema: [
        {
          is: 'el-input',
          prop: 'name',
          formItem: {
            label: '测试',
            labelWidth: '100px'
          }
        },
        {
          is: 'el-input',
          prop: 'text',
          formItem: {
            label: '测试',
            labelWidth: '100px'
          },
          props: {
            value: '测试123',
          }
        },
        // {
        //   is: 'el-upload',
        //   prop: 'upload',
        //   formItem: {
        //     label: '测试',
        //     labelWidth: '100px'
        //   },
        //   props: {
        //     text: '上传',
        //   }
        // },
        {
          is: 'el-select',
          prop: 'upload',
          formItem: {
            label: '测试',
            labelWidth: '100px'
          },
          props: {
            value: '2',
            multiple: true,
          },
          options: [
            {
              value: '选项1',
              label: '黄金糕'
            },
            {label: '测试2', value: 2},
            {label: '测试3', value: 3},
            {label: '测试3', value: 4},
          ]
        }
      ]
    }
  },
  components: {
    jsonForm
  }
}
</script>

<style scoped>

</style>