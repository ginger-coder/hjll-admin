<template>
  <div class="search-form-box">
    <el-form :model="formData" ref="formRef" :label-width="'120px'" :inline="true">
      <el-form-item v-if="type == '4'" placeholder="请选择" label="所属业务：">
            <el-select v-model="formData.billType" clearable>
              <el-option
                  v-for="(t, i) in options"
                  :key="i"
                  :label="t.label"
                  :value="t.value"
                ></el-option>
            </el-select>
        </el-form-item>
      <template v-for="(item,index) in filterData" >
          <el-form-item :key="index" v-if="item.type == 'select'" placeholder="请选择" :label="item.label+'：'">
            <el-select v-model="formData[item['prop']]"  @change="((value)=>{ChangeData(value, item)})" clearable>
              <el-option
                  v-for="(t, i) in selectKey[item['key']]"
                  :key="i"
                  :label="t.label"
                  :value="t.value"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :key="index" v-if="item.type == 'time'" placeholder="请选择" :label="item.label+'：'">
            <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            @change="changeTime"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item :key="index" v-if="item.type == 'input'" :label="item.label+'：'">
          <el-input v-model="formData[item['prop']]" placeholder="请输入"></el-input>
        </el-form-item>
      </template>
      <br>
      <!-- 提交按钮 -->
      <div class="btn-box">
        
        <el-button
          v-if="btnItems.includes('search')"
          type="primary"
          class="btn-search"
          @click="onSearch"
          >查询</el-button
        >
        <el-button
          v-if="btnItems.includes('sponsor')"
           class="btn-search" @click="onAdd"
          >发起结算</el-button
        >
        <!-- <el-button
          v-if="btnItems.includes('export')"
          type="primary"
          class="btn-export"
          @click="onExport"
          >导出</el-button
        > -->
        <el-button
          v-if="btnItems.includes('reset')"
          type="default"
          class="btn-reset"
          @click="onReset"
          >重置</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  settleData,
  accountData,
  selectKey
} from "@/utils/filterSettle";
import { queryUmsProjectGroupList,getwallets,getWalletList } from "@/api/finance"
import {parseTime,parseTime2} from '@/utils/index'
export default {
  components: {
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
      time:'',
      filterData:[],
      options:[
        {
          label:'账户充值',
          value:1
        },
        {
          label:'个人提现',
          value:2
        }
      ],
      list:[],
      zzLists: [],
      pageNo: 1,
      selectKey,
      formData: {
      },
    };
  },
  mounted() {
    this.getGroup()
  },
  created() {
    // this.dictParams = ['stationType','protectionLevel','operator','machineRoomType','deviceSecondType','deviceType','towerType']
    if(this.type=='1'){
      this.filterData =  settleData
    }else{
      this.filterData =  accountData
    }
     
  },
  methods: {
    ChangeData(val,item){
      if(item.label =='所属项目'){
        queryUmsProjectGroupList({parentId:val}).then((res)=>{
            if(res.code == 0){
              let rulest = res.data
              let dataNew = []
              rulest.map(item => {
                  let obj = {
                      value: item.id,
                      label: item.name,
                  }
                  dataNew.push(obj);
              });
              this.selectKey.group = dataNew
            }
        })
      }
    },
    getGroup(){
        queryUmsProjectGroupList({parentId:0}).then((res)=>{
            if(res.code == 0){
              let rulest = res.data
              let dataNew = []
              rulest.map(item => {
                  let obj = {
                      value: item.id,
                      label: item.name,
                  }
                  dataNew.push(obj);
              });
              this.selectKey.billType = dataNew
            }
        })
        getwallets({}).then((res)=>{
                if(res.code == 0){
                  let rulest =  res.data[0]
                  let dataNew = []
                  let obj = {
                        value: rulest.walletId,
                        label: rulest.walletName,
                  }
                  dataNew.push(obj);
                  this.selectKey.wallet = dataNew
                }
            })
      },
    changeTime(val){
      if(val){
        if(this.type == '3'){
          this.formData.startDate = parseTime2(val[0])
          this.formData.closeDate = parseTime2(val[1])
          this.formData.endDate = parseTime2(val[1])
        }else{
          this.formData.startDate = parseTime(val[0])
          this.formData.closeDate = parseTime(val[1])
          this.formData.endDate = parseTime(val[1])
        }
      }else{
        this.formData.startDate = ''
        this.formData.closeDate = ''
        this.formData.endDate = ''
      }
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
      this.time = ''
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
  display: inline-block;
  margin-left: 35px;
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