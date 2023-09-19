<template>
  <!-- <el-scrollbar style="height: 90%"> -->
    <div class="menuList">
      <el-row style="margin-top: 20px">
        <div class="menuList-table">
          <!-- 总全选-->
          <!-- <el-checkbox
            :indeterminate="indeterminate"
            v-model="isCheckAll"
            @change="checkAll"
            >全选
          </el-checkbox> -->
          <!--这里使用element-ui 的折叠板-->
          <!-- <el-collapse>
            <el-collapse-item
              v-for="(one, oneIndex) in menuData"
              :key="oneIndex"
            >
              <template slot="title"> -->
            <div  v-for="(one, oneIndex) in menuData" :key="oneIndex" class="item-box"> 
                <!-- 一级 权限列表-->
                <div class="item-list">
                  <el-checkbox
                    :indeterminate="one.indeterminate"
                    v-model="one.checked"
                    @change="checkedOneAll(oneIndex, one.code, $event)"
                    >{{ one.name }}
                  </el-checkbox>
                </div>
                <!-- </template> -->
                <!-- 二级 权限列表-->
                <div class="item-list2">
                  <div  v-for="(two, twoIndex) in one.children" :key="twoIndex" class="item-secound">
                    <el-checkbox
                      v-model="two.checked"
                      @change="checkedTwoAll(oneIndex, twoIndex, two.code, one.code, $event)"
                      :indeterminate="two.indeterminate"
                      >{{ two.name }}
                    </el-checkbox>
                    <div class="item-third" v-if="two.children.length > 0">
                        <el-checkbox
                          style="display: block; line-height: 2"
                          v-for="(three, threeIndex) in two.children"
                          :key="threeIndex"
                          v-model="three.checked"
                          :title="three.name"
                          @change="
                            checkedThreeAll(
                              oneIndex,
                              twoIndex,
                              threeIndex,
                              three.code,
                              two.code,
                              $event
                            )
                          "
                          >{{ three.name | filterName }}
                        </el-checkbox>
                      </div>
                  </div>
                </div>
            </div> 
            <!-- </el-collapse-item>
          </el-collapse> -->
        </div>
      </el-row>
    </div>
  <!-- </el-scrollbar> -->
</template>
<script>
export default {
  name: "treeNode",
  components: {},
  props: {
    menuData:{
      default:[],
      type:Array
    }
  },
  data() {
    return {
      isCheckAll: false, //一级全选状态
      indeterminate: false,
    };
  },
  computed: {},
  methods: {
    //总change事件
    checkAll(e) {
      this.ischeckAll = e;
      console.log('eeeeeeeeeeeee',e);
      if (e === true) {
        this.indeterminate = false;
        for (var i = 0, len = this.menuData.length; i < len; i++) {
          //二级全选反选不确定
          this.menuData[i].checked = e;
          this.menuData[i].indeterminate = false;
          for (
            var j = 0, len1 = this.menuData[i].children.length;
            j < len1;
            j++
          ) {
            this.menuData[i].children[j].checked = e;
            for (
              var k = 0, len2 = this.menuData[i].children[j].children.length;
              k < len2;
              k++
            ) {
              this.menuData[i].children[j].children[k].checked = e;
            }
          }
        }
      } else {
        this.indeterminate = false;
        for (let i = 0, len = this.menuData.length; i < len; i++) {
          //三级全选反选不确定
          this.menuData[i].checked = e;
          this.menuData[i].indeterminate = false;
          for (
            let j = 0, len1 = this.menuData[i].children.length;
            j < len1;
            j++
          ) {
            this.menuData[i].children[j].checked = e;
            for (
              let k = 0, len2 = this.menuData[i].children[j].children.length;
              k < len2;
              k++
            ) {
              this.menuData[i].children[j].children[k].checked = e;
            }
          }
        }
      }
    },
    //一级change事件
    checkedOneAll(oneIndex, oneId, e) {
      this.menuData[oneIndex].checked = e; //一级勾选后，子级全部勾选或者取消
      if (e === true) {
        //去掉一级不确定状态
        this.menuData[oneIndex].indeterminate = false;
      }
      let childrenArray = this.menuData[oneIndex].children;
      if (childrenArray.length > 0) {
        childrenArray.forEach((oneItem) => {
          oneItem.checked = e;
          if (oneItem.children.length > 0) {
            oneItem.children.forEach((twoItem) => {
              twoItem.checked = e;
            });
          }
        });
      }
      this.getIsCheckAll();
    },
    //二级change事件
    checkedTwoAll(oneIndex, twoIndex, twoId, oneId, e) {
      var childrenArray = this.menuData[oneIndex].children;
      var tickCount = 0,
        unTickCount = 0,
        len = childrenArray.length;
      for (var i = 0; i < len; i++) {
        if (twoId === childrenArray[i].code) childrenArray[i].checked = e;
        if (childrenArray[i].checked === true) tickCount++;
        if (childrenArray[i].checked === false) unTickCount++;
      }
      //判断二级下面是否还有三级，点击选择二级(选择与不选）时候下面三级是全选还是全不选
      if (childrenArray[twoIndex].children.length > 0) {
        childrenArray[twoIndex].children.forEach((threeItem) => {
          threeItem.checked = e;
        });
        //判断二级是否选中
        childrenArray[twoIndex].checked = e;
        if (e === true) {
          childrenArray[twoIndex].indeterminate = false;
        }
      }
      if (tickCount === len) {
        //二级全勾选
        this.menuData[oneIndex].checked = e;
        this.menuData[oneIndex].indeterminate = false;
      } else if (unTickCount === len) {
        //二级全不勾选
        this.menuData[oneIndex].checked = e;
        this.menuData[oneIndex].indeterminate = false;
      } else {
        this.menuData[oneIndex].checked = e;
        this.menuData[oneIndex].indeterminate = true; //添加一级不确定状态
      }

      this.getIsCheckAll();
    },
    //三级change事件
    checkedThreeAll(oneIndex, twoIndex, threeIndex, threeId, twoId, e) {
      let childrenArray = this.menuData[oneIndex].children[twoIndex].children;
      let tickCount = 0,
        unTickCount = 0,
        len = childrenArray.length;
      for (let i = 0; i < len; i++) {
        if (threeId === childrenArray[i].code) childrenArray[i].checked = e;
        if (childrenArray[i].checked === true) tickCount++;
        if (childrenArray[i].checked === false) unTickCount++;
      }
      if (tickCount === len) {
        //三级全勾选
        this.menuData[oneIndex].children[twoIndex].checked = true;
        this.menuData[oneIndex].children[twoIndex].indeterminate = false;
        this.menuData[oneIndex].checked = true;
        this.menuData[oneIndex].indeterminate = false; //添加二级不确定状态
      } else if (unTickCount === len) {
        //三级全不勾选
        this.menuData[oneIndex].children[twoIndex].checked = false;
        this.menuData[oneIndex].children[twoIndex].indeterminate = false;
        this.menuData[oneIndex].checked = false;
        this.menuData[oneIndex].indeterminate = false; //添加二级不确定状态
        this.isCheckAll = false;
        this.indeterminate = true;
      } else if (tickCount !== len) {
        //三级勾选几个
        this.menuData[oneIndex].children[twoIndex].checked = e;
        this.menuData[oneIndex].children[twoIndex].indeterminate = true;
        this.menuData[oneIndex].checked = false;
        this.menuData[oneIndex].indeterminate = true; //添加二级不确定状态
        this.isCheckAll = false;
        this.indeterminate = true;
      }
      this.getIsCheckAll();
    },
    /**
     *是否全选
     */
    getIsCheckAll() {
      var tickCount = 0,
        unTickCount = 0,
        ArrLength = this.menuData.length;
      for (var j = 0; j < ArrLength; j++) {
        //全选checkbox状态
        if (this.menuData[j].checked === true) tickCount++;
        if (this.menuData[j].checked === false) unTickCount++;
      }
      if (tickCount === ArrLength) {
        //二级全勾选
        this.isCheckAll = true;
        this.indeterminate = false;
      } else if (unTickCount === ArrLength) {
        //二级全不勾选
        this.isCheckAll = false;
        this.indeterminate = false;
      } else {
        this.isCheckAll = false;
        this.indeterminate = true; //添加一级不确定状态
      }
      this.$emit('getDataList',this.menuData)
    },
    /**
     * 获取列表数据
     *
     */
    getList() {
      this.menuData.forEach((oneItem, oneIndex) => {
        console.log('+++++',oneIndex);
        if (oneItem.children.length > 0) {
          let oneCountNum = oneItem.children.length;
          let isOneCheckedNum = 0;
          oneItem.children.forEach((twoItem) => {
            if (twoItem.checked) {
              isOneCheckedNum += 1;
            }
            if (twoItem.children.length > 0) {
              let twoCountNum = twoItem.children.length;
              let isTwoCheckedNum = 0;
              twoItem.children.forEach((three) => {
                if (three.checked) {
                  isTwoCheckedNum += 1;
                }
              });
              twoItem.checked = isTwoCheckedNum === twoCountNum;
              twoItem.indeterminate =
                isTwoCheckedNum > 0 && isTwoCheckedNum < twoCountNum;
            }
          });
          oneItem.checked = isOneCheckedNum === oneCountNum;
          oneItem.indeterminate =
            isOneCheckedNum > 0 && isOneCheckedNum < oneCountNum;
        }
      });
    },
  },
  created() {
    this.getList();
  },
  watch: {},
  filters: {
    filterName(value) {
      if(value.length>10){
        return value.substring(0, 5) + "...";
      }else{
        return value;
      }
      
    },
  },
};
</script>
<style lang="scss" scoped>
  .menuList-table{
    background: #FFFFFF;
    border-radius: 0px 4px 0px 0px;
    border: 1px solid #E9E9E9;
    padding: 20px 10px;
      .item-box{
        display: flex;
        .item-list{
          width: 200px;
        }
        .item-list2{
          .item-secound{
            display: flex;
            .item-third{
              top: 4px;
              left: 200px;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
            }
          }
          
        }
      }
      
  }
  ::v-deep .el-collapse-item__content {
  padding-bottom: 0;
  min-height: 200px;
  font-size: 33px;
  margin-left: 2%;
}
::v-deep .el-checkbox {
  margin-right: 20px !important;
  width: 200px;
}
</style>
