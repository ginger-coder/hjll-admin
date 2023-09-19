<template>
  <div>

    <el-cascader class="dialog_forms_input_long"
                 :key="keyIndex"
                 :clearable="isclearable"
                 :disabled="isdisabled"
                 v-model="value1"
                 :options="regions"
                 @change="areaChange"
                 :props="props"
                 ref="cascader"
                 placeholder="请选择区域"/>
  </div>
</template>
<script>
import {regionData, CodeToText} from "element-china-area-data";
import {areaOrder} from "@/api/area";
import {deepClone} from "@/utils";

export default {
  props: {
    isclearable: {
      default: true,
      type: Boolean,
    },
    isdisabled: {
      default: false,
      type: Boolean,
    },
    ischeckStrictly: {
      default: false,
      type: Boolean,
    },
    ismultiple: {
      default: false,
      type: Boolean,
    },
    isEcho: {
      default: false,
      type: Boolean,
    },
    value: {
      default() {
        return [];
      },
      type: Array,
    },
    operatorId: {
      default: 0,
      type: Number,
    },
  },
  data() {
    return {
      regions: [],
      value1: [],
      keyIndex: 0,
      props: {
        lazy: true,
        // expandTrigger: "hover",
        // value: "row",
        checkStrictly: true,
        multiple: false,
        lazyLoad: (node, resolve) => {
          let that = this;
          const {level} = node;

          const value = node?.value || that.value[level]
          if (level === 1 && that.operatorId) {
            that.loader_next_area({provinceCode: value}, function (list) {
              resolve(list);
            }, level);
          } else if (level === 2 && that.operatorId) {
            that.loader_next_area({cityCode: value,}, function (list) {
              list.map((item) => {
                item.leaf = true;
              });
              resolve(list);
            }, level);
          } else {
            resolve([])
          }
        },
      },
      areaInfo: {},
    };
  },
  watch: {
    value: function (val) {
      var that = this;
      // that.value1 = val;
      if (val.length === 0) {
        // 清空级联选择器选中状态
        this.$refs.cascader.$refs.panel.clearCheckedNodes();
        // 清除高亮
        this.$refs.cascader.$refs.panel.activePath = [];
      }
    },
    // isEcho: function (val) {
    //   if (val && this.value.length) {
    //     this.setValueLabel()
    //   }
    // },
    ischeckStrictly: function (val) {
      let that = this;

      // that.$set(that.props, 'checkStrictly', val)
    },
    ismultiple: function (val) {
      let that = this;

      that.props.multiple = val;
    },
    value1: function (val) {
      if (this.$refs.cascader) {
        this.$refs.cascader.dropDownVisible = false; //监听值发生变化就关闭它
      }
    },
    operatorId: {
      handler(val) {

        this.regions = [];
        if (!val) return;
        if (!this.isEcho) {
          this.loader_next_area();
        } else {

          this.setValueLabel()
        }
      },
      immediate: true
    }
  },
  //渲染到页面的时候
  mounted() {

    this.initer();
  },
  methods: {
    initer: function () {
      this.$set(this.props, 'checkStrictly', this.ischeckStrictly)
      this.props.multiple = this.ismultiple;
      this.$nextTick(() => {
        // this.$set(this, 'value1', this.value)
      })
    },
    loader_next_area: function (searchs = {}, next) {
      let that = this;
      areaOrder(
          {
            method: "get",
            name: "operatorId"
          },
          {
            operatorId: that.operatorId,
            ...searchs
          }
      ).then((res) => {
        let _list = [];
        if (res.data && res.data.length) {
          res.data?.filter(el => el).map((item) => {
            var json = {
              value: item.code,
              row: {code: item.code, name: item.name},
              label: item.name,
            };
            _list.push(json);
          });
          if (JSON.stringify(searchs) === "{}") {
            that.regions = _list;
          }
        }
        next && next(_list);
      });
    },
    areaChange: function (value) {
      let that = this;
      if (value.length) {
        that.$emit("change", {province: value[0], city: value[1], area: value[2]});
      } else {
        that.$emit("change", {});
      }
    },
    setValueLabel() {

      const {value, isEcho, regions = []} = this;

      if (!value?.length || !isEcho) return regions;
      let options = []
      let maps = [undefined, {provinceCode: value[0]}, {cityCode: value[1]}]
      this.loader_next_area('', (list) => {
        options = list?.map(el => ({
          level: 0,
          ...el
        }));
        this.$set(this, 'regions', options)
        const index = list?.findIndex(el => el.value === value[0]);
        if (index !== -1) {
          // 获取下级
          this.loader_next_area({provinceCode: value[0]}, (list1) => {

            options[index].children = list1?.map(el => ({
              level: 1,
              ...el
            })) || [];
            this.$set(this, 'regions', options)
            const twoIndex = list1?.findIndex(el => el.value === value[1])
            if (twoIndex !== -1) {
              this.loader_next_area({cityCode: value[1]}, (list2) => {
                options[index].children[twoIndex].children = list2?.map(el => ({
                  ...el,
                  level: 2,
                  leaf: true
                })) || [];
                this.$set(this, 'regions', options);
                this.$nextTick(() => {
                  this.$set(this, 'value1', value);
                  this.$set(this, 'keyIndex', this.keyIndex+=1);
                  this.areaChange(value);
                })
              })
            }
          })
        }

      })
    }
  },
};
</script>
<style></style>
