<template>
  <div class="search-form-box">
    <el-form :model="formData" ref="formRef" :label-width="'120px'" :inline="true">
      <el-form-item label="所属区域：">
        <el-cascader
        class="selets"
        ref="cascader"
        :options="options"
        @change="changeArea"
        @remove-tag="removeTag"
        @clear="clear"
        :props="optionProps"
        collapse-tags
        clearable></el-cascader>
      </el-form-item>
      <el-form-item label="所属基站：" v-if="type!='基站'">
        <!-- remote
          reserve-keyword
          :remote-method="remoteMethod" -->
        <el-select
          v-model="formData.ownStationCode"
          clearable
          ref="select"
          :loading="loading"
        >
          <el-option
            created
            v-for="t in zzLists"
            :label="t.label"
            :value="t.value"
            :key="'t' + t.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="基站编码：">
        <el-input v-model="formData.stationCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="基站名称：" v-if="type=='基站'">
        <el-input v-model="formData.stationName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item  v-if="type=='基站'" placeholder="请选择" label="运营商">
            <el-select class="selets" v-model="operator" collapse-tags multiple clearable>
              <el-option
                  v-for="(t, i) in selectKey.operator"
                  :key="i"
                  :label="t.label"
                  :value="t.value"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item  v-if="type=='基站'" placeholder="请选择" label="基站保障等级">
            <el-select class="selets" v-model="protectionLevel" collapse-tags multiple clearable>
              <el-option
                  v-for="(t, i) in selectKey.protectionLevel"
                  :key="i"
                  :label="t.label"
                  :value="t.value"
                ></el-option>
            </el-select>
        </el-form-item>
      <template v-for="(item,index) in filterData" >
          <el-form-item :key="index" v-if="item.type == 'select'" placeholder="请选择" :label="item.label+'：'">
            <el-select v-if="item.prop=='deviceSecondType'" v-model="formData[item['prop']]" clearable>
              <el-option
                  v-for="(t, i) in deviceDatas"
                  :key="i"
                  :label="t.label"
                  :value="t.value"
                ></el-option>
            </el-select>
            <el-select @change="changeType" v-else v-model="formData[item['prop']]" clearable>
              <el-option
                  v-for="(t, i) in selectKey[item['key']]"
                  :key="i"
                  :label="t.label"
                  :value="t.value"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :key="index" v-if="item.type == 'input'" :label="item.label+'：'">
          <el-input v-model="formData[item['prop']]" placeholder="请输入"></el-input>
        </el-form-item>
      </template>
      <!-- 提交按钮 -->
      <div class="btn-box">
        <!-- <el-button
          v-if="btnItems.includes('reset')"
          type="default"
          class="btn-reset"
          @click="onReset"
          >重置</el-button
        > -->
        <el-button
          v-if="btnItems.includes('search')"
          type="primary"
          class="btn-search"
          @click="onSearch"
          >查询</el-button
        >
        <el-button type="default" class="btn-search" @click="onAdd"
          >新增</el-button
        >
        <el-button
          v-if="btnItems.includes('export')"
          type="primary"
          class="btn-export"
          @click="onExport"
          >导出</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import AreaSelect from "@/components/custom/areaSelect";
import { zz} from "@/api/device";
import resource from "@/mixins/resource";
import {
	deviceData,
  machineData,
  towerData,
  stationData,
} from "@/utils/filterTable";
import {
	getRegionList,
  getStationData
  } from "@/api/resource";
import { getBatch } from "@/api/system"
export default {
  mixins: [resource],
  components: {
    AreaSelect,
  },
  props: {
    // 类型
    type: "",
    // 提交按钮项，多个用逗号分隔（search, export, reset）
    btnItems: {
      type: String,
      default() {
        return "search";
      },
    },
  },

  data() {
    return {
      text: "展开",
      loading: false,
      placeholder: "",
      filterData:[],
      list:[],
      zzLists: [],
      pageNo: 1,
      selectKey:{},
      noMore: false,
      pageSize: 10,
      deviceDatas: [],
      optionProps:{ 
        multiple: true,
        value: 'code',
        emitPath: false, // 只返回该节点的值
        label: 'name',
        children: 'childArea'
      },
      operator:[],
      protectionLevel:[],
      options:[],
      alarmLevel: [],
      formData: {
        areaCode:null
      },
    };
  },
  mounted() {
    let that = this;
    that.$nextTick(() => {
      // if (that.$refs.select) {
      //   that.$refs.select.$refs.scrollbar.$refs.wrap.addEventListener(
      //     "scroll",
      //     this.scolling
      //   );
      // }
    });
  },
  created() {
    this.getCode()
    const {type} = this
    this.dictParams = ['stationType','protectionLevel','operator','machineRoomType','deviceSecondType','deviceType','towerType']
    if(type=='设备'){
      this.filterData = deviceData
    }else if(type == '机房'){
      this.filterData = machineData
    }else if(type == '铁塔'){
      this.filterData = towerData
    }else{
      this.filterData = stationData
    }
    
    this.loader_site(this.formData);
  },
  methods: {
    getAuthName(dataList) {
        dataList.forEach(item => {
            if (item.code.length!=6) {
                this.getAuthName(item.childArea);
            }else{
                item.childArea = null
            }
        });
        return dataList
    },
    getCode(){
      let tenantId = sessionStorage.getItem('tenantId')
      getRegionList({tenantId}).then((res)=>{
        if(res.success){
            let dataList = res.data
            this.options = this.getAuthName(dataList)
        }
        })
    },
    changeType(val) {
      let that = this
      if(that.type=='设备'){
        getBatch([val]).then((res)=>{
            if(res.success){
              that.deviceDatas = []
              that.deviceDatas = res.data[`${val}`]
            }
        })
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.list = this.zzLists.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.list = [];
      }
    },
    scolling() {
      let that = this;
      let e = that.$refs.select.$refs.scrollbar.$refs.wrap;
      let loadMore = e.scrollHeight - e.scrollTop <= e.clientHeight;
      if (loadMore) {
        that.loader_site(this.formData);
      }
    },
    loader_site: function (data, next) {
      var that = this;
      let { pageNo, pageSize } = this;
      getStationData(
        {
          current: 1,
          size: 50,
          areaCode: data.areaCode,
        }
      )
        .then((res) => {
          // if (pageNo === res.data.total) {
          //   // 获取到最后的值时，不再监听滚动条的动作，移除滚动事件
          //   that.$nextTick(() => {
          //     that.$refs.select.$refs.scrollbar.$refs.wrap.removeEventListener(
          //       "scroll",
          //       this.scolling()
          //     );
          //   });
          //   this.noMore = true;
          // }
          // this.pageNo++;
          that.zzLists = []
          res.data.list.map((item) => {
            that.zzLists.push({
              label: item.stationName,
              value: item.stationCode,
            });
          });
          next();
        })
        .catch((error) => {});
    },
    clear(){
      this.formData.areaCode = null
    },
    removeTag(val){
      this.removeTagVal = val
    },
    changeArea(e) {
      if(e.length!=0){
        this.formData.areaCode = e.join(',')
      }else{
        this.formData.areaCode = null
      }
      this.loader_site(this.formData);
	  },
    change(event) {
      this.text == "展开" ? (this.text = "收起") : (this.text = "展开");
    },
    onValidate(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          callback();
        }
      });
    },
    // 搜索
    onSearch() {
      if(this.operator.length!=0){
        this.formData.operator=   this.operator.join(',')
      }else{
        this.formData.operator = null
      }
      if(this.protectionLevel.length!=0){
        this.formData.protectionLevel=   this.protectionLevel.join(',')
      }else{
        this.formData.protectionLevel = null
      }
      this.$emit("onSearch", this.formData);
    },
    // 导出
    onExport() {
      this.$message.warning('暂未开通')
      this.onValidate(() => {
        this.$emit("onExport", this.formData);
      });
    },
    onReset() {
      this.formData = {};
      this.$refs.formRef.resetFields();
      this.$emit("onReset", this.formData);
    },
    onAdd() {
      this.$emit("onAdd", null);
    },
  },
};
</script>
<style scoped lang="scss">
 .el-cascader-menu{
    max-width:250px;
  }
::v-deep .selets {
  .tags-select-input {
    height: 40px;
    .el-select__tags {
      white-space: nowrap;
      overflow: hidden;
      flex-wrap: nowrap;
    }
  }

  .el-select__tags-text {
    display: inline-block;
    max-width: 85px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.search-form-box {
  background: #fff;
  padding: 15px 0;
  margin-bottom: 20px;
}
.btn-box {
  margin-left: 50px;
}

.up-down {
  display: inline-block;
  margin-left: 20px;
  cursor: pointer;
  color: #5674e5;
  font-size: 14px;
}
.up-down i {
  margin-left: 5px;
}
.search-form-box .el-input{
    margin-right: 15px;
}
</style>