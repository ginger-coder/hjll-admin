<template>
  <div style="height: 100%" class="formPage" ref="rmInfo">
    <div class="header_box disp_flex ju_bet ali_cen">
      <div>
        <div class="title">{{ title }}</div>
      </div>
      <div class="back_box">
        <el-button
          v-if="module != 'details'"
          v-hold-click
          type="primary"
          @click="save('ruleForm')"
          >保存</el-button
        >
        <el-button v-hold-click type="" @click="back">返回</el-button>
      </div>
    </div>
    <!-- 新增编辑 -->
    <div v-if="module != 'details'" class="form_box scrllbar">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div>
          <h3 class="titles_h3">设备类型</h3>
          <div class="form_list">
            <el-form-item label="设备类型：" prop="deviceType">
              <el-select
                v-model="ruleForm.deviceType"
                clearable
                @change="changeType"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, i) in selectKey.deviceType"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备细分类型：" prop="deviceSecondType"  :rules="[{required:isShow,message:'设备细分类型',trigger:'change'}]">
              <el-select @change="changeTypeDet" clearable v-model="ruleForm.deviceSecondType" placeholder="请选择">
                <el-option
                  v-for="(item, i) in deviceData"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <h3 class="titles_h3">设备基础属性</h3>
          <div class="form_list">
            <span v-for="(item, index) in tableKey" :key="index">
              <el-form-item
                v-if="item.type == 'select' && item.slected == val"
                :label="item.label + '：'"
                :prop="item['prop']"
              >
                <el-select
                  v-model="ruleForm[item['prop']]"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="(t, i) in selectKey[item['key']]"
                    :key="i"
                    :label="t.label"
                    :value="t.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else-if="item.type=='areaSelect' && item.slected == val" :label="item.label+'：'" :prop="item['prop']">
                <area-select style="width: 100%" @change="changeArea($event)"
                      :class="module=='edit'?'placeholdertype':null"
                      :placeholder="placeholder"
                      ></area-select>
              </el-form-item>
              <el-form-item
                v-else-if="item.type == 'time' && item.slected == val"
                :label="item.label + '：'"
                :prop="item['prop']"
              >
                <el-date-picker
                  @change="((value)=>{timeChange(value, item)})"
                  v-model="ruleForm[item['prop']]"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择开始使用时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item
                v-else-if="item.type == 'number' && item.slected == val"
                :label="item.label + '：'"
                :prop="item['prop']"
              >
                <el-input
                  maxlength="50"
                  v-model="ruleForm[item['prop']]"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-else-if="item.type == 'integer' && item.slected == val"
                :label="item.label + '：'"
                :prop="item['prop']"
                :rules="numberlimit"
              >
                <el-input
                  maxlength="50"
                  @input="((value)=>{yearChange2(value, item)})"
                  v-model="ruleForm[item['prop']]"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-else-if="item.slected == val"
                :label="item.label + '：'"
                :prop="item['prop']"
              >
                <el-input
                  v-model="ruleForm[item['prop']]"
                  maxlength="50"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </span>
          </div>
        </div>
      </el-form>
    </div>
    <!-- 详情 -->
    <div v-else class="form_box scrllbar">
      <div class="details_list">
        <h2>设备信息</h2>
        <div class="details_box">
          <div class="box_title">
            <span>设备名称: {{detailsData.deviceName}}</span>
          </div>
          <div class="line">
            <div
              class="box_item"
              v-for="(item, index) in tableLabel"
              :key="index"
            >
              <span>{{ item.label }}：</span>
              <span>{{ detailsData[item["prop"]] }}</span>
            </div>
          </div>
        </div>
        <h2 v-if="stationBasic">关联基站信息</h2>
        <div v-if="stationBasic" class="details_box">
          <div class="box_title">
            <span>基站名称: {{stationBasic.stationName}}</span>
          </div>
          <div class="line">
            <div class="box_item"  v-for="(item, index) in stationBasicKey" :key="index" >
                <span v-if="item.label=='基站编码'">{{ item.label }}：<span class="hrefs" @click="goTo(stationBasic)">{{ stationBasic[item["prop"]] || '-'}}</span></span>
                <span v-else>{{ item.label }}：{{ stationBasic[item["prop"]] || '-'}}</span>
            </div>
          </div>
        </div>
        <!-- <h2>设备历史维修信息</h2>
        <div class="details_box">
          <div class="box_title">
            <span>关联工单编号：</span>
          </div>
          <div class="line"></div>
        </div> -->
      </div>
    </div>
  </div>
</template>
  <script>
import basic from "@/mixins/basic";
import areaSelect from "@/components/custom/areaSelect";
import {
	getDeviceDetail,
	changeDevice,
  getUpDevice
  } from "@/api/resource";
import resource from "@/mixins/resource";
import {  stationBasicKey} from "@/utils/station";
import { getBatch } from "@/api/system"
import { deviceInfos, selectKey } from "@/utils/device";
import { rules } from "@/utils/rules";
export default {
  components: {
    areaSelect,
  },
  data() {
    return {
      title: "",
      val: null,
      module: "",
      placeholder:null,
      module_title: "",
      id: "",
      selectKey: selectKey,
      tableKey: [],
      tableLabel: [],
      stationBasicKey:stationBasicKey,
      stationBasic:[],
      loading: false,
      pageNo: 1,
      noMore: false,
      pageSize: 10,
      isShow:true,
      deviceData: [],
      detailsData: [],
      devicelist: [],
      ruleForm: {
        areaCode:'',
        deviceType:'',
        deviceSecondType:''
      },
      types:'switchingPowerSupply',//要展示详情的设备类型
      rules:rules,
    };
  },
  mixins: [basic,resource],
  created() {
    // 设备字典接口需要的参数
    this.dictParams = ['deviceType','manufacturer','ratedOutputVoltage','electricityAndVoltageGrade','bmsManufacturer','batteryCoding','regStatus','networkStandard','operator','networkStatus','ratedWorkingVoltage','startingMode','coolingMode','maintenanceState']
    const { id, module } = this.$route.query;
    this.id = id;
    this.module = module;
    switch (module) {
      case "add":
        this.title = "新增设备";
        this.tableKey = deviceInfos.filter((item) => {
          return item && item.type;
        });
        this.placeholder = '请选择'
        break;
      case "edit":
        getUpDevice(id).then((res)=>{
          if(res.code == 0){
              this.ruleForm = res.data
              this.ruleForm.areaCode = res.data.area
              this.types = res.data.deviceType
              this.changeType2(this.types)
              this.placeholder = res.data.areaPlaceholder
            }
        })
        this.title = "修改设备";
        this.tableKey = deviceInfos.filter((item) => {
          return item && item.type;
        });
        break;
      case "details":
        this.title = "设备详情";
        getDeviceDetail(id).then((res)=>{
          if(res.code == 0){
              this.detailsData = res.data
              this.types = res.data.deviceType
              let val = res.data.deviceType
              if (this.types == 'smokeSensation' || this.types == 'temperatureDetector' || this.types == 'waterLogging' || this.types == 'infraredInduction') {
                val = 5;
              } else {
                val = this.types;
              }
              deviceInfos.map((item) => {
                if (item.slected == val) {
                  this.tableLabel.push(item);
                }
              });
              this.stationBasic = res.data.stationInfo
              this.detailsData.areaCode = res.data.area
          }
        })
       
        break;
    }
  },
  mounted() {},
  methods: {
    formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d  ;
    },
    timeChange(val,obj){
      if(obj.label == '开始使用时间'){
        this.start = null
        this.start = val
        this.computNum2(this.middleValue)
      } 
    },
    isFinite(){
      if(this.end){
        if(new Date(this.end).getTime()>=new Date(this.formatDate(new Date())).getTime()){
          this.ruleForm.isReleaseTime = '0'
        }else{
          this.ruleForm.isReleaseTime = '1'
        }
      }
    },
    computNum2(val){
      if(this.start && !isNaN(parseFloat(val))){
        let endTime = Number(this.start.slice(0, 4))+Number(val)
        this.end = endTime+this.start.slice(4)
        this.isFinite()
      }else{
          this.end = null  
      }
    },
    goTo(row){
      this.$router.push({
        name:'rmStationInfo',
        query:{
          id:row.id,
          module:'details'
        }
      })
    },
    coment(val){
      if (val == 'smokeSensation' || val == 'temperatureDetector' || val == 'waterLogging' || val == 'infraredInduction') {
        this.val = 5;
      } else {
        this.val = val;
      }
    },
    // 新增的类型切换和请求细分类型
    changeType(val) {
      let that = this
      this.coment(val)
      getBatch([val]).then((res)=>{
            if(res.success){
              that.deviceData = []
              that.ruleForm.deviceSecondType = ''
              that.deviceData = res.data[`${val}`]
              if(JSON.stringify(res.data) == "{}"){
                that.isShow = false
                that.ruleForm.deviceSecondType = ''
              }else{
                that.isShow = true
              }
            }
        })
    },
    // 修改回显的请求的接口 deviceSecondType不清空
    changeType2(val) {
      let that = this
      this.coment(val)
      getBatch([val]).then((res)=>{
            if(res.success){
              that.deviceData = []
              that.deviceData = res.data[`${val}`]
              if(JSON.stringify(res.data) == "{}"){
                that.isShow = false
                that.ruleForm.deviceSecondType = ''
              }else{
                that.isShow = true
              }
            }
        })
    },
    changeTypeDet(val){
      this.ruleForm.deviceSecondType = val
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changeDevice(this.ruleForm).then((res)=>{
            if(res.code == 0){
              this.$message.success('保存成功')
              this.$router.go(-1);
            }
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
  <style lang="scss">
.placeholdertype input::-webkit-input-placeholder {
  color: #333 !important;
}
.placeholdertype input::placeholder {
  color: #333 !important;
}
.hrefs{
  color: #5674E5;
  cursor: pointer;
}
.feedbackDrawerBox {
  .el-drawer__body {
    padding: 20px;
  }
}
</style>
  <style lang="scss" scoped>
.app-container {
  font-size: 0;
  position: relative;

  ::v-deep {
    .el-table {
      &::before {
        content: none;
      }
    }
  }
}

.header_box {
  background: #ffffff;
  margin: -20px;
  padding: 20px;
  position: fixed;
  margin: 0 auto;
  top: 60px;
  right: 37px;
  z-index: 100;
  height: 75px;
  width: calc(100% - 298px);

  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .back_box {
  }
}
.openSidebar .header_box{
  width: calc(100% - 298px);
}
.hideSidebar .header_box{
  width: calc(100% - 110px);
}
.form_box {
  padding-bottom: 20px;
  background: #ffffff;

  .el-form-item {
    min-width: 360px;
    display: inline-block;
    vertical-align: top;
    margin-left: 30px;
  }

  ::v-deep {
    .f18 {
      .el-form-item__label {
        font-size: 18px;
      }
    }
  }
}
.titles_h3 {
  padding: 20px;
  border-bottom: 1px solid #e9e9e9;
}
.form_list {
  width: 100%;
  height: 100%;
  padding: 20px;
}
.details_list h2 {
  font-size: 16px;
  text-indent: 55px;
  padding-top: 20px;
}
.details_box {
  margin: 20px auto;
  padding-bottom: 20px;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  width: 95%;
}
.box_title {
  background: #fafafa;
  height: 44px;
  line-height: 44px;
  text-indent: 40px;
  color: #000;
  font-weight: bold;
}
.line {
  margin-left: 50px;
}
.box_item {
  color: #333;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  width: 32%;
  text-align: left;
  display: inline-block;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;
  border-bottom: 1px solid #e9e9e9;
}
</style>
  