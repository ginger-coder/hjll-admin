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
          <h3 class="titles_h3">机房类型</h3>
          <div class="form_list">
            <el-form-item label="机房细分类型：" prop="machineRoomType">
              <el-select clearable v-model="ruleForm.machineRoomType" placeholder="请选择">
                <el-option
                  v-for="(item, i) in selectKey.machineRoomType"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <h3 class="titles_h3">机房基础属性</h3>
          <div class="form_list">
            <span v-for="(item, index) in tableKey" :key="index">
              <el-form-item
                v-if="item.type == 'select'"
                :label="item.label + '：'"
                :prop="item['prop']"
              >
                <el-select
                  v-model="ruleForm[item['prop']]"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(t, i) in selectKey[item['key']]"
                    :key="i"
                    :label="t.label"
                    :value="t.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else-if="item.type=='areaSelect'" :label="item.label+'：'" :prop="item['prop']">
                <area-select style="width: 100%" @change="changeArea($event)"
                      :class="module=='edit'?'placeholdertype':null"
                      :placeholder="placeholder"
                      ></area-select>
              </el-form-item>
              <el-form-item
                v-else-if="item.type == 'time'"
                :label="item.label + '：'"
                :prop="item['prop']"
              >
                <el-date-picker
                  v-model="ruleForm[item['prop']]"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择开始使用时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item
                v-else-if="item.type == 'number'"
                :label="item.label + '：'"
                :prop="item['prop']"
              >
                <el-input
                  v-model="ruleForm[item['prop']]"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-else-if="item.type == 'integer'"
                :label="item.label + '：'"
                :prop="item['prop']"
                :rules="numberlimitMin"
              >
              <span v-if="item.ping" style="margin-left: -12px">(m<sup>2</sup>):</span>
                <el-input
                  v-model="ruleForm[item['prop']]"
                 @change="((value)=>{acreage(value,item)})"
                 @focus="valueBlur"
                 @blur="valueBlur"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-else
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
        <h2>机房信息</h2>
        <div class="details_box">
          <div class="box_title">
            <span>机房名称: {{detailsData.machineRoomName}}</span>
          </div>
          <div class="line">
            <div
              class="box_item"
              v-for="(item, index) in tableLabel"
              :key="index"
            >
              <span>{{ item.label }}<span v-if="item.ping">(m<sup>2</sup>):</span>：</span>
              <span>{{ detailsData[item["prop"]] || '-'}}</span>
            </div>
          </div>
        </div>
        <h2  v-if="stationBasic">关联基站信息</h2>
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
      </div>
    </div>
  </div>
</template>
  <script>
import basic from "@/mixins/basic";
import resource from "@/mixins/resource";
import areaSelect from "@/components/custom/areaSelect";
import { machineRoom,selectKey } from "@/utils/machine";
import {  stationBasicKey} from "@/utils/station";
import { rules } from "@/utils/rules";
import {
	getRoomDetail,
	changeRoom,
  getUpRoom
  } from "@/api/resource";
export default {
  components: {
    areaSelect,
  },
  data() {
    return {
      title: "",
      val: null,
      module: "",
      module_title: "",
      id: "",
      placeholder:'',
      stationBasicKey:stationBasicKey,
      stationBasic:[],
      selectKey: selectKey,
      tableKey: [],
      tableLabel: [],
      loading: false,
      pageNo: 1,
      noMore: false,
      pageSize: 10,
      detailsData: [],
      devicelist: [],
      ruleForm: {areaCode:''},
      rules: rules,
    };
  },
  mixins: [basic,resource],
  created() {
    // 机房下拉菜单的字典请求参数
    this.dictParams = ['machineRoomType','useStatus','doorLockType','machineRoomLevel']
    const { id, module } = this.$route.query;
    this.id = id;
    this.module = module;
    switch (module) {
      case "add":
        this.title = "新增机房";
        this.tableKey = machineRoom.filter((item) => {
          return item && item.type;
        });
        this.placeholder = '请选择'
        break;
      case "edit":
        getUpRoom(id).then((res)=>{
          if(res.code == 0){
            this.ruleForm = res.data
            this.ruleForm.areaCode = res.data.area
            this.placeholder = res.data.areaPlaceholder
          }
        })
        this.title = "修改机房";
        this.tableKey = machineRoom.filter((item) => {
          return item &&item.type;
        });
        break;
      case "details":
        getRoomDetail(id).then((res)=>{
          if(res.code == 0){
              this.detailsData = res.data
              this.stationBasic = res.data.stationInfo
              this.detailsData.areaCode = res.data.area
          }
        })
        this.title = "机房详情";
        machineRoom.map((item) => {
          this.tableLabel.push(item);
        });
        break;
    }
  },
  mounted() {},
  methods: {
    acreage(val,item){
      if(item.label == '建筑面积'){
        this.start = val
      }
      if(item.label == '已占面积'){
        this.end =  val
      }
      this.ruleForm.freeArea = this.relustData
    },
    valueBlur(){
      this.ruleForm.freeArea = this.relustData
      this.$forceUpdate();
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changeRoom(this.ruleForm).then((res)=>{
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
.feedbackDrawerBox {
  .el-drawer__body {
    padding: 20px;
  }
}
.hrefs{
  color: #5674E5;
  cursor: pointer;
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
  