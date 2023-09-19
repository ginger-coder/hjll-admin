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
          <h3 class="titles_h3">铁塔类型</h3>
          <div class="form_list">
            <el-form-item label="铁塔细分类型：" prop="towerType">
              <el-select clearable v-model="ruleForm.towerType" placeholder="请选择">
                <el-option
                  v-for="(item, i) in selectKey.towerType"
                  :key="i"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <h3 class="titles_h3">铁塔基础属性</h3>
          <div class="form_list">
            <span v-for="(item, index) in tableKey" :key="index">
              <el-form-item
                v-if="item.type == 'select'"
                :label="item.label + '：'"
                :prop="item['prop']"
              >
                <el-select
                  clearable
                  v-model="ruleForm[item['prop']]"
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
                  @change="((value)=>{timeChange(value, item)})"
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
                :rules="numberlimit"
              >
                <el-input
                  @input="((value)=>{yearChange2(value, item)})"
                  v-model="ruleForm[item['prop']]"
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
          <h3 class="titles_h3">铁塔抱杆信息</h3>
          <div class="form_list">
            <el-form-item label="抱杆数量（个）：" >
              <el-select clearable @change="changeBao"  v-model="bao" placeholder="请选择">
                <el-option
                  v-for="(item, i) in 3"
                  :key="i"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <span @click="addLine">新增抱杆</span> -->
            <br />
            <span
              class="children_list"
              v-for="(item, i) in ruleForm.ironTowerHugRodInfos"
              :key="i"
            >
              <h4>抱杆{{ i + 1 }} </h4>
              <!-- <span @click="delLine(item)">删除</span> -->
              <el-form-item label="抱杆名称：" :prop="'ironTowerHugRodInfos.'+i+'.towerHugRodName'" :rules="formRules.towerHugRodName">
                <el-input
                  maxlength="50"
                  v-model="item.towerHugRodName"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="抱杆类型："  :prop="'ironTowerHugRodInfos.'+i+'.towerHugRodType'"  :rules="formRules.towerHugRodType">
                <el-select clearable v-model="item.towerHugRodType" placeholder="请选择">
                  <el-option v-for="(item,i) in selectKey.towerHugRodType" :label="item.label" :value="item.value" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="维护状态：" :prop="'ironTowerHugRodInfos.'+i+'.status'"  :rules="formRules.status">
                <el-select clearable v-model="item.status" placeholder="请选择">
                  <el-option v-for="(item,i) in selectKey.hugRodMaintainState" :label="item.label" :value="item.value" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="高度（米）：" :prop="'ironTowerHugRodInfos.'+i+'.high'"  :rules="numberlimit">
                <el-input
                  v-model="item.high	"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              
            </span>
          </div>
          <h3 class="titles_h3">铁塔平台信息</h3>
          <div class="form_list">
            <el-form-item label="平台数量（个）：" >
              <el-select clearable @change="changePing"  v-model="ping" placeholder="请选择">
                <el-option
                  v-for="(item, i) in 3"
                  :key="i"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <br />
            <span
              class="children_list"
              v-for="(item, i) in ruleForm.ironTowerPlatformInfos"
              :key="i"
            >
              <h4>平台{{ i + 1 }}</h4>
              <el-form-item label="平台名称："  :prop="'ironTowerPlatformInfos.'+i+'.towerPlatformName'" :rules="formRules.towerPlatformName">
                <el-input
                  v-model="item.towerPlatformName"
                  maxlength="50"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="平台类型：" :prop="'ironTowerPlatformInfos.'+i+'.towerPlatformType'" :rules="formRules.towerPlatformType">
                <el-select clearable v-model="item.towerPlatformType" placeholder="请选择">
                  <el-option v-for="(item,i) in selectKey.towerPlatformType" :label="item.label" :value="item.value" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="维护状态：" :prop="'ironTowerPlatformInfos.'+i+'.status'" :rules="formRules.status">
                <el-select clearable v-model="item.status" placeholder="请选择">
                  <el-option v-for="(item,i) in selectKey.platformMaintainState" :label="item.label" :value="item.value" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="高度（米）：" :prop="'ironTowerPlatformInfos.'+i+'.high'"  :rules="numberlimit">
                <el-input
                  v-model="item.high"
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
        <h2>铁塔信息</h2>
        <div class="details_box">
          <div class="box_title">
            <span>铁塔名称: {{detailsData.towerName}}</span>
          </div>
          <div class="line">
            <div
              class="box_item"
              v-for="(item, index) in tableLabel"
              :key="index"
            >
              <span>{{ item.label }}：</span>
              <span>{{ detailsData[item["prop"]] || '-'}}</span>
            </div>
          </div>
        </div>
        <h2  v-if="ironTowerHugRodInfos && ironTowerHugRodInfos.length!=0">抱杆信息</h2>
        <div v-if="ironTowerHugRodInfos && ironTowerHugRodInfos.length!=0" class="details_box">
          <div class="box" >
            <div v-for="(list,idx) in ironTowerHugRodInfos" :key="idx">
              <h2>抱杆名称：{{list.towerHugRodName}}</h2>
                <div class="line">
                  <div class="box_item" v-for="(item, index) in linkData" :key="index" >
                    <span>{{ item.label }}：{{ list[item["prop"]] || '-'}}</span>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <h2  v-if="ironTowerPlatformInfos && ironTowerPlatformInfos!=0">平台信息</h2>
        <div v-if="ironTowerPlatformInfos && ironTowerPlatformInfos!=0" class="details_box">
          <div class="box" >
            <div v-for="(list,idx) in ironTowerPlatformInfos" :key="idx">
              <h2>抱杆名称：{{list.towerPlatformName}}</h2>
                <div class="line">
                  <div class="box_item" v-for="(item, index) in linkDatas" :key="index" >
                    <span>{{ item.label }}：{{ list[item["prop"]] || '-'}}</span>
                  </div>
              </div>
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
import {  stationBasicKey} from "@/utils/station";
import areaSelect from "@/components/custom/areaSelect";
import {
	getTowerDetail,
	changeTower,
  getUpTower
  } from "@/api/resource";
import { ironTower, selectKey,linkData,linkDatas } from "@/utils/tower";
import { rules } from "@/utils/rules";
export default {
  components: {
    areaSelect,
  },
  data() {
    return {
      title: "",
      val: null,
      placeholder:'',
      module: "",
      module_title: "",
      id: "",
      stationBasicKey:stationBasicKey,
      stationBasic:[],
      linkData:linkData,
      linkDatas:linkDatas,
      selectKey: selectKey,
      tableKey: [],
      tableLabel: [],
      loading: false,
      pageNo: 1,
      noMore: false,
      pageSize: 10,
      detailsData: [],
      devicelist: [],
      bao:null,
      ping:null,
      ironTowerPlatformInfos:[],
      ironTowerHugRodInfos:[],
      ruleForm: {
        areaCode:'',
        ironTowerHugRodInfos:[
        ],
        ironTowerPlatformInfos:[]
      },
      rules: rules,
      formRules:{
        towerHugRodName:[{ required: true, message: "抱杆名称", trigger: "blur" }],
        towerHugRodType:[{ required: true, message: "抱杆类型", trigger: "change" }],
        towerPlatformName:[{ required: true, message: "平台名称", trigger: "change" }],
        towerPlatformType:[{ required: true, message: "平台类型", trigger: "change" }],
        status:[{ required: true, message: "维护状态", trigger: "change" }],
      }
    };
  },
  mixins: [basic,resource],
  created() {
    // 铁塔字典接口需要的参数
    this.dictParams = ['towerType','manufacturer','useStatus','perpendicularity','towerPlatform','ladderAndShield','towerStructure','towerBolt','towerGrounding','towerSpace','towerHugRodType','hugRodMaintainState','towerPlatformType','platformMaintainState']
    const { id, module } = this.$route.query;
    this.id = id;
    this.module = module;
    switch (module) {
      case "add":
        this.title = "新增铁塔";
        this.tableKey = ironTower.filter((item) => {
          return item &&item.type;
        });
        this.placeholder = '请选择'
        break;
      case "edit":
        getUpTower(id).then((res)=>{
          if(res.code == 0){
            this.ruleForm = res.data
            this.ruleForm.areaCode = res.data.area
            this.stationBasic = res.data.stationInfo
            this.bao = res.data.ironTowerHugRodInfos?.length
            this.ping = res.data.ironTowerPlatformInfos?.length || null
            this.placeholder = res.data.areaPlaceholder
          }
        })
        this.title = "修改铁塔";
        this.tableKey = ironTower.filter((item) => {
          return item &&item.type;
        });
        break;
      case "details":
      getTowerDetail(id).then((res)=>{
          if(res.code == 0){
              this.detailsData = res.data
              this.detailsData.areaCode = res.data.area
              this.placeholder = res.data.areaPlaceholder
              this.stationBasic = res.data.stationInfo
              // 平台信息
              this.ironTowerPlatformInfos = res.data.ironTowerPlatformInfos
              // 抱杆信息
              this.ironTowerHugRodInfos = res.data.ironTowerHugRodInfos
          }
        })
        this.title = "铁塔详情";
        ironTower.map((item) => {
          this.tableLabel.push(item);
        });
        this.tableLabel.unshift({label:'铁塔细分类型',prop:'towerType'})
        break;
    }
  },
  mounted() {},
  methods: {
    addLine(){
      let i = 0
      i++
      this.ruleForm.ironTowerHugRodInfos.push({
        id:i,
        high:'',
        status:'',
        towerHugRodName:'',
        towerHugRodType:'',
      })
    },
    delLine(item){
      console.log(item)
      this.ruleForm.ironTowerHugRodInfos.forEach((el,i,arr)=>{
        if(el.id == item.id){
          arr.splice(i,1)
        }
      })
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
    timeChange(val,obj){
      if(obj.label == '投产时间'){
        this.start = null
        this.start = val
        this.computNum2(this.middleValue)
        if(this.middleValue){
            this.ruleForm.releaseTime = this.end
        }
      } 
    }, 
    changeBao(val){
      if(val == 1){
          this.ruleForm.ironTowerHugRodInfos = [
            {
              high:'',
              status:'',
              towerHugRodName:'',
              towerHugRodType:'',
            }
          ]
      }else if(val == 2){
        this.ruleForm.ironTowerHugRodInfos = [
            {
              high:'',
              status:'',
              towerHugRodName:'',
              towerHugRodType:'',
            },
            {
              high:'',
              status:'',
              towerHugRodName:'',
              towerHugRodType:'',
            }
          ]
      }else if(val == 3){
        this.ruleForm.ironTowerHugRodInfos = [
            {
              high:'',
              status:'',
              towerHugRodName:'',
              towerHugRodType:'',
            },
            {
              high:'',
              status:'',
              towerHugRodName:'',
              towerHugRodType:'',
            },
            {
              high:'',
              status:'',
              towerHugRodName:'',
              towerHugRodType:'',
            }
          ]
      }else{
        this.ruleForm.ironTowerHugRodInfos = []
      }
    },
    changePing(val){
      if(val == 1){
          this.ruleForm.ironTowerPlatformInfos = [
            {
              high:'',
              status:'',
              towerPlatformName:'',
              towerPlatformType:'',
            }
          ]
      }else if(val == 2){
        this.ruleForm.ironTowerPlatformInfos = [
        {
              high:'',
              status:'',
              towerPlatformName:'',
              towerPlatformType:'',
            },
            {
              high:'',
              status:'',
              towerPlatformName:'',
              towerPlatformType:'',
            }
          ]
      }else if(val == 3){
        this.ruleForm.ironTowerPlatformInfos = [
        {
              high:'',
              status:'',
              towerPlatformName:'',
              towerPlatformType:'',
            },
            {
              high:'',
              status:'',
              towerPlatformName:'',
              towerPlatformType:'',
            },
            {
              high:'',
              status:'',
              towerPlatformName:'',
              towerPlatformType:'',
            }
          ]
      }else{
        this.ruleForm.ironTowerPlatformInfos = []
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          changeTower(this.ruleForm).then((res)=>{
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
.hrefs{
  color: #5674E5;
  cursor: pointer;
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
.box h2 {
  height: 44px;
  line-height: 44px;
  text-indent: 20px;
  background: #fafafa;
  border-radius: 3px 3px 0px 0px;
  padding: 0;
  margin: 0;
}
.box {
  border-top: none;
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
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;
  display: inline-block;
  border-bottom: 1px solid #e9e9e9;
}
.children_list {
  display: inline-block;
  margin-bottom: 20px;
  margin-left: 20px;
  border: 1px solid #e9e9e9;
}
.children_list h4 {
  text-indent: 30px;
  border-bottom: 1px solid #e9e9e9;
  line-height: 40px;
  height: 40px;
  margin: 0;
  background: #fafafa;
}
.form_box .children_list .el-form-item {
  min-width: 280px;
  margin-right: 10px;
}
</style>
  