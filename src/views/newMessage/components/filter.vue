<template>
  <div class="search-form-box">
    <el-form :model="formData" ref="formRef" :label-width="'140px'" :inline="true">
      <template v-for="(item,index) in filterData" >
          <el-form-item :key="index" v-if="item.type == 'select'" placeholder="请选择"  :label="item.label+'：'">
            <el-select v-model="formData[item['prop']]" :multiple="item.multiple" clearable collapse-tags>
              <el-option
                  v-for="(t, i) in selectKey[item['key']]"
                  :key="i"
                  :label="t.label"
                  :value="t.value"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :key="index" v-if="item.type=='areaSelect'" :label="item.label+'：'" :prop="item['prop']">
              <areaSelectAll
						ref="areaSelect"
						@change="changeArea"
						:ismultiple="true"
						:isCollapse="true"
					></areaSelectAll>
            </el-form-item>
        <el-form-item :key="index" v-if="item.type == 'time' && activeName=='1'" placeholder="请选择" :label="item.label+'：'">
            <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            @change="changeTime"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item :key="index" v-if="item.type == 'time2'" placeholder="请选择" :label="item.label+'：'">
            <el-date-picker
            v-model="time2"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            @change="changeTime2"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item :key="index" v-if="item.type == 'input'" :label="item.label+'：'">
          <el-input v-model="formData[item['prop']]" placeholder="请输入"></el-input>
        </el-form-item>
      </template>
      <el-form-item  v-if="type=='3'" label="评分：">
          <el-input style="width: 80px;" v-model="formData.scoreStart" placeholder=""></el-input>
          -
          <el-input style="width: 80px;" v-model="formData.scoreEnd" placeholder=""></el-input>
        </el-form-item>
      <!-- 提交按钮 -->
      <div class="btn-box">
        
        <el-button
          v-if="btnItems.includes('search')"
          type="primary"
          class="btn-search"
          @click="onSearch"
          >查询</el-button
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
  systemFilter,
  systemFilter2,
  orderFilter,
  popleData,
  companyData,
  interiorData,
  selectKey
} from "@/utils/filterMessage";
import areaSelectAll from '@/components/custom/areaSelectAll';
import {parseTime} from '@/utils/index'
import { messageItem,getTypeList,getOptions } from "@/api/message"
import {
	getRegionList,
  } from "@/api/resource";
import { work_role_page } from "@/api/pxks"
export default {
  components: {
    areaSelectAll,
  },
  props: {
    // 类型
    type: "",
    activeName:'',
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
      options:[],
      optionProps:{ 
        multiple: true,
        value: 'code',
        emitPath: false, // 只返回该节点的值
        label: 'name',
        children: 'childArea'
      },
      text: "展开",
      loading: false,
      placeholder: "请选择",
      time:'',
      time2:'',
      filterData:[],
      list:[],
      zzLists: [],
      systemFilter:[
        {label:'消息分类',prop:'messageTypeCode',type:'select',key:'classify'},
        {label:'消息状态',prop:'status',type:'select',key:'status'},
        {label:'消息标题',prop:'title',type:'input'},
        {label:'创建时间',prop:'createdTime',type:'time'},
        {label:'发送时间',prop:'sendTime',type:'time2'},
      ],
      systemFilter2:[
        {label:'消息分类',prop:'messageTypeCode',type:'select',key:'classify'},
        {label:'消息状态',prop:'status',type:'select',key:'readStatus'},
        {label:'消息标题',prop:'title',type:'input'},
        {label:'接收时间',prop:'sendTime',type:'time2'},
      ],
      cascader:null,
      pageNo: 1,
      selectKey:selectKey,
      formData: {
      },
    };
  },
  mounted() {
    this.getItem()
  },
  watch: {
		activeName(value) {
      this.formData = {}
      if(value =='1'){
        this.filterData =  systemFilter
      }else{
        this.filterData =  systemFilter2
      }
		},
	},
  created() {
    this.getCode()
    if(this.type=='1'){
      this.filterData =  this.systemFilter
    }else if(this.type == '2'){
      this.filterData =  orderFilter
    }else if(this.type == '3'){
      this.filterData = popleData
    }else if(this.type == '4'){
      this.filterData = companyData
    }else if(this.type == '5'){
      this.filterData = interiorData
    }
     
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
      let tenantId = localStorage.getItem('tenantId')
      getRegionList({tenantId}).then((res)=>{
        if(res.success){
            let dataList = res.data
            this.options = this.getAuthName(dataList)
        }
        })
    },
    clear(){
      this.formData.areaCode = null
    },
    changeArea(val) {
			console.log('ara', val);
			this.formData.areaList = val.map((el) => el[2]);
		},
    changeTime(val){
      if(val){
        this.formData.createTimeStart = parseTime(val[0])
        this.formData.createTimeEnd = parseTime(val[1])
      }else{
        this.formData.createTimeStart = ''
        this.formData.createTimeEnd = ''
      }
    },
    // 发送时间
    changeTime2(val){
      if(val){
        this.formData.sentTimeStart = parseTime(val[0])
        this.formData.sentTimeEnd = parseTime(val[1])
      }else{
        this.formData.sentTimeStart = ''
        this.formData.sentTimeEnd = ''
      }
    },
    onValidate(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          callback();
        }
      });
    },
    // 下拉分类
    getItem(){
      messageItem({typeCode:'system_message_type'}).then((res)=>{
        if(res.code == 0){
          let rulest = res.data.list
              let dataNew = []
            rulest.map(item => {
                let obj = {
                    value: item.id,
                    label: item.name,
                }
                dataNew.push(obj);
            });
            this.selectKey.classify = dataNew
        }
      })
      getTypeList().then((res)=>{
        if(res.code == 0){
          this.selectKey.typeList = res.data
        }
      })
      work_role_page({
        size: 100,
        current: 1,
      }).then((res) => {
        let rulest = res.data.records
              let dataNew = []
            rulest.map(item => {
                let obj = {
                    value: item.name,
                    label: item.name,
                }
                dataNew.push(obj);
            });
        this.selectKey.roleList2 = dataNew;
      });
      getOptions().then((res) => {
        let rulest = res.data
              let dataNew = []
            rulest.map(item => {
                let obj = {
                    value: item.id,
                    label: item.name,
                }
                dataNew.push(obj);
            });
        this.selectKey.roleList = dataNew;
      });
    },
    // 搜索
    onSearch() {
      if(this.formData.roleList && this.formData.roleList.length!=0){
        // this.formData.role = this.formData.roleList.join(',')
        this.formData.roleIds = this.formData.roleList.join(',')
      }else{
        // this.formData.role = null
        this.formData.roleIds = null
      }
      console.log(this.formData)
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
      this.time2 = ''
      this.formData = {};
      if(this.$refs.areaSelect){
        this.$refs.areaSelect[0].value1 = []
      }
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
  margin-left: 20px;
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