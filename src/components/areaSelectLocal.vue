<template>
  <el-cascader
    class="dialog_forms_input_long"
    :clearable="isclearable"
    :disabled="isdisabled"
    v-model="value1"
    :options="regions"
    :props="props"
    @change="areaChange"
    ref="cascader"
    placeholder="请选择区域"
    :collapse-tags="isCollapse"
    id="el-cascader"
  >
  </el-cascader>
</template>
<script>
import areaList from "@c/custom/area";

export default {
  props: {
    isShowAll: {
      default: true,
      type: Boolean,
    },
    isclearable: {
      default: true,
      type: Boolean,
    },
    placeholder: {
      default: "请选择区域",
      type: String,
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
    isCollapse: {
      default: false,
      type: Boolean,
    },
    value: {
      default() {
        return [];
      },
      type: Array,
    },
  },
  data() {
    return {
      regions: [],
      keyIndex: 0,
      props: {
        lazy: false,
        checkStrictly: false,
        multiple: false,
        value: "code",
        label: "name",
        children: "childArea",
      },

      value1: [],
      areaInfo: {},
      areaList,
    };
  },
  watch: {
    value: function (val) {
      var that = this;
      that.value1 = val;
      if (val.length == 0) {
        // 清空级联选择器选中状态
        this.$refs.cascader.$refs.panel.clearCheckedNodes();
        // 清除高亮
        this.$refs.cascader.$refs.panel.activePath = [];
      }
    },
    isEcho: function (val) {
      var that = this;
      if (val) {
        if (this.value.length) {
          that.loader_all_area();
        }
      }
    },
    isShowAll: {
      handler(newValue) {
        this.isShowAll = newValue;
      },
      immediate: true, //初次监听即执行
    },
    ischeckStrictly: function (val) {
      let that = this;

      that.$set(that.props, "checkStrictly", val);
    },
    ismultiple: function (val) {
      let that = this;

      that.props.multiple = val;
    },
  },
  //渲染到页面的时候
  mounted() {
    var that = this;
    that.initer();
  },
  methods: {
    initer: function () {
      var that = this;
      that.loader_all_area();
      that.value1 = that.value;
      that.$set(that.props, "checkStrictly", that.ischeckStrictly);

      that.props.multiple = that.ismultiple;
    },
    loader_all_area: function (searchs = {}, next) {
      this.areaList.forEach((item1) => {
        item1.childArea.map((item2) => {
          item2.childArea.map((item3) => {
            if (!item3.childArea?.length) {
              delete item3.childArea;
            }
          });
        });
      });
      this.regions = this.areaList;
      // let that = this;
      // areaAll({ method: "get", name: "list" }, searchs).then((res) => {
      // 	if (res.data && res.data.length) {
      // res.data.map(item1=>{
      // 	item1.childArea.map(item2=>{
      // 		item2.childArea.map(item3=>{
      // 			if(item3.childArea.length==0){
      // 				delete item3.childArea;
      // 			}
      // 		})
      // 	})
      // })
      // that.regions=res.data;
      // 	}
      // });
    },
    areaChange: function (value) {
      // console.log(this.regions, "0099");
      // var el_cascader_element = document.querySelector("#el-cascader");
      // var wrapperDiv = el_cascader_element.querySelector(".el-cascader__tags");
      // console.log(wrapperDiv, "000");
      // var firstSpan = wrapperDiv.querySelector(".el-tag");
      // console.log(firstSpan, "111");
      // console.log(spanElement, "9080");
      // var length = value.join(".").length + 1;
      // console.log(length);
      // var num = 20 + "px";
      // el_cascader_element.style.width = num;
      let that = this;
      if (that.props.multiple) {
        that.$emit("change", value);
        let obj = this.$refs["cascader"].getCheckedNodes();
        // 遍历已选择节点，保证其可以取消选择
        for (let chooseNode of obj) {
          this.$set(chooseNode.data, "disabled", false);
        }
      } else {
        if (value.length) {
          that.$emit("change", {
            province: value[0],
            city: value[1],
            area: value[2],
          });
        } else {
          that.$emit("change", {});
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog_forms_input_long {
  width: 430px;
}
</style>
