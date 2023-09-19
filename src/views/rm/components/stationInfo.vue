<template>
  <div class="formPage" ref="rmInfo" id="rmInfo">
    <Anchor :list="anchorList"  v-if="module == 'details'" />
    <div class="header_box disp_flex ju_bet ali_cen" >
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
          <div>
            <div class="form_list">
              <span v-for="(item, index) in tableKey" :key="index">
                <h3 v-if="item.type == 'title'" class="titles_h3">
                  {{ item.label }}
                </h3>
                <el-form-item
                  v-else-if="item.type == 'select'&& item.label=='FSU是否安装'"
                  :label="item.label + '：'"
                  :prop="item['prop']"
                >
                  <el-select
                  @change="((value)=>{changeShow(value, item)})"
                    v-model="ruleForm[item['prop']]"
                    :multiple="item.multiple"
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
                <el-form-item
                  v-else-if="item.type == 'select'&& item.label=='上站难易程度'"
                  :label="item.label + '：'"
                  :prop="item['prop']"
                >
                  <el-select
                  @change="((value)=>{changeShow2(value, item)})"
                    v-model="ruleForm[item['prop']]"
                    :multiple="item.multiple"
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
                <el-form-item
                  v-else-if="item.type == 'select'&& item.label=='FSU状态' && flag2"
                  :label="item.label + '：'"
                  :prop="item['prop']"
                >
                  <el-select
                    v-model="ruleForm[item['prop']]"
                    clearable
                    :multiple="item.multiple"
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
                <el-form-item
                  v-else-if="item.type == 'select'&& item.label =='上站困难原因' && flag1"
                  :label="item.label + '：'"
                  :prop="item['prop']"
                >
                  <el-select
                    v-model="ruleForm[item['prop']]"
                    clearable
                    :multiple="item.multiple"
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
                <el-form-item
                  v-else-if="item.type == 'select'&& item.label !='上站困难原因'&& item.label !='FSU状态'"
                  :label="item.label + '：'"
                  :prop="item['prop']"
                >
                  <el-select
                    v-model="ruleForm[item['prop']]"
                    clearable
                    :multiple="item.multiple"
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
                <el-form-item
                  v-else-if="item.type == 'areaSelect'"
                  :label="item.label + '：'"
                  :prop="item['prop']"
                >
                  <area-select
                    style="width: 100%"
                    @change="changeArea($event)"
                    :class="module == 'edit' ? 'placeholdertype' : null"
                    :placeholder="placeholder"
                    
                  ></area-select>
                </el-form-item>
                <el-form-item
                  v-else-if="item.type == 'time'&& item.label!='FSU交维时间'"
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
                  v-else-if="item.type == 'time' &&  item.label=='FSU交维时间' && flag2"
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
              >
                <el-input
                  v-model="ruleForm[item['prop']]"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-else-if="item.type == 'input'"
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
            <el-form-item
                  label="运营商共享情况"
                  prop="operator"
                >
                  <el-select
                    @change="changease"
                    v-model=" ruleForm.operator"
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(t, i) in selectKey.operator"
                      :key="i"
                      :label="t.label"
                      :value="t.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
            <div  v-for="(obj,i) in ruleForm.shareConditions" :key="obj.id">
                <div v-if="ruleForm.operator.includes(obj.operator)" class="yun">
                  <div class="operator_title">{{obj.operator=='CMCC'?'移动':obj.operator=='CUCC'?'联通':'电信'}}公司信息</div>
                <el-form-item
                  label="公司站型"
                  :prop="'shareConditions.'+i+'.stationType'" :rules="formRules.stationType"
                >
                  <el-select
                    v-model="obj.stationType"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(t, i) in selectKey[linkData[0].key]"
                      :key="i"
                      :label="t.label"
                      :value="t.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="设备制式"
                  :prop="'shareConditions.'+i+'.deviceStandard'" :rules="formRules.deviceStandard"
                >
                  <el-select
                    v-model="obj.deviceStandard"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(t, i) in selectKey[linkData[1].key]"
                      :key="i"
                      :label="obj.operator=='CMCC'?'移动'+t.label:obj.operator=='CUCC'?'联通'+t.label:'电信'+t.label"
                      :value="t.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="基站维护服务等级"
                  :prop="'shareConditions.'+i+'.preserveLevel'" :rules="formRules.preserveLevel"
                >
                  <el-select
                    v-model="obj.preserveLevel"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(t, i) in selectKey[linkData[2].key]"
                      :key="i"
                      :label="t.label"
                      :value="t.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="是否购买发电服务"
                  :prop="'shareConditions.'+i+'.powerGenerationService'" :rules="formRules.powerGenerationService"
                >
                  <el-select
                    v-model="obj.powerGenerationService"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(t, i) in selectKey[linkData[3].key]"
                      :key="i"
                      :label="t.label"
                      :value="t.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="起租时间"
                  :prop="'shareConditions.'+i+'.rentStartTime'" :rules="formRules.rentStartTime"
                >
                  <el-date-picker
                    v-model="obj.rentStartTime"
                    @change="((value)=>{timeChange(value, obj)})"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始使用时间"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item
                  label="租期（年）"
                  :prop="'shareConditions.'+i+'.rentTerm'" :rules="formRules.rentTerm"
                >
                  <el-input
                  @input="((value)=>{yearChange(value, obj)})"
                    v-model="obj.rentTerm"
                    type="input"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="租期截止时间"
                  :prop="'shareConditions.'+i+'.rentEndTime'" :rules="formRules.rentEndTime"
                >
                  <el-date-picker
                    v-model="obj.rentEndTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始使用时间"
                  >
                  </el-date-picker>
                </el-form-item>
                </div>
              </div>
          </div>
        </div>
      </el-form>
    </div>
    <!-- 详情 -->
    <div v-else class="form_box scrllbar">
      <div class="details_list">
        <h3 id="1" class="details_title" @click="goto">基站信息</h3>
        <div class="box">
          <div class="list">
            <h2>基站名称：{{stationBasic.stationName}}</h2>
            <div class="line">
                <div class="box_item"  v-for="(item, index) in stationBasicKey" :key="index" >
                  <span>{{ item.label }}：{{ stationBasic[item["prop"]] || '-'}}</span>
                </div>
            </div>
          </div>
        </div>
        <h3 id="2" class="details_title">物业信息</h3>
        <div class="box">
          <div class="list">
          <h2>物业信息</h2>
          <div class="line">
              <div class="box_item" v-for="(item, index) in stationExtendInfoKey" :key="index">
                <span>{{ item.label }}：{{ stationExtendInfo[item["prop"]]  || '-'}}</span>
              </div>
          </div>
        </div>
        </div>F
        <h3 id="3" class="details_title">市电信息</h3>
        <div class="box">
          <div class="list">
          <h2>市电信息</h2>
          <div class="line">
              <div class="box_item" v-for="(item, index) in stationExtendInfoKey2" :key="index" >
                <span>{{ item.label }}：{{ stationExtendInfo[item["prop"]] || '-'}}</span>
              </div>
          </div>
        </div>
        </div>
        <h3 id="4" class="details_title">运营商共享情况</h3>
        <div class="box"  v-for="(list,idx) in  ruleForm.shareConditions" :key="idx">
          <div class="list">
          <h2>{{list.operator=='CMCC'?'移动':list.operator=='CUCC'?'联通':'电信'}}公司信息</h2>
          <div class="line">
            <div>
              <div class="box_item"  v-for="(item, index) in linkData" :key="index" >
                <span>{{ item.label }}：{{ list[item["prop"]] || '-'}}</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增修改以及详情 -->
    <div class="relevance">
      <div v-if="module!='add'">
        <h3 v-if="module != 'details'" class="titles_h3">关联机房信息</h3>
        <h3 v-else id="5" class="titles2">关联机房信息</h3>
        <div class="details_box">
          <div class="box" v-if="machineRoom && machineRoom.length!=0">
            <div class="list" v-for="(list,idx) in machineRoom" :key="idx">
                <h2>机房名称：{{list.machineRoomName}}</h2>
                <div class="line">
                  <div class="box_item" v-for="(item, index) in machineRoomKey" :key="index" >
                    <span v-if="item.label=='机房编码'">{{ item.label }}：<span class="hrefs" @click="goTo(1,list)">{{ list[item["prop"]] || '-'}}</span></span>
                    <span v-else>{{ item.label }}：{{ list[item["prop"]] || '-'}}</span>
                  </div>
              </div>
            </div>
          </div>
          <el-button icon="el-icon-plus" v-if="module != 'details'" type="default" class="btn-add" @click="addlist('机房')"
            >点击添加关联机房</el-button
          >
        </div>
      </div>
      <div v-if="module!='add'">
        <h3 v-if="module != 'details'" class="titles_h3">关联铁塔信息</h3>
        <h3 v-else id="6" class="titles2">关联铁塔信息</h3>
        <div class="details_box">
          <div class="box" v-if="ironTower && ironTower.length!=0">
            <div class="list">
            <h2>铁塔名称：{{ironTower.towerName}}</h2>
            <div class="line">
                <div class="box_item" v-for="(item, index) in ironTowerKey" :key="index" >
                  <span v-if="item.label=='铁塔编码'">{{ item.label }}：<span class="hrefs" @click="goTo(2,ironTower)">{{ ironTower[item["prop"]] || '-'}}</span></span>
                  <span v-else>{{ item.label }}：{{ ironTower[item["prop"]] || '-'}}</span>
                </div>
            </div>
          </div>
          </div>
          <el-button icon="el-icon-plus"  v-if="module != 'details'" type="default" class="btn-add" @click="addlist('铁塔')"
            >点击添加关联铁塔</el-button
          >
        </div>
      </div>
      <div v-if="module!='add'">
          <h3 v-if="module != 'details'" class="titles_h3">关联设备信息</h3>
          <h3 v-else id="7" class="titles2">关联设备信息</h3>
          <div class="details_box">
            <div v-if="module == 'details'">
              <div class="device_title">设备明细一览表</div>
              <div class="device_box">
                  <div class="left">
                      <p>设备类型</p>
                      <p>数量</p>
                      <p>型号</p>
                  </div>
                  <div v-for="(item,index) in devicePreviews" :key="index" class="right">
                      <p><span @click="goDevice(item)" class="hrefs">{{item.deviceType}}</span></p>
                      <p>{{item.deviceCount}}</p>
                      <p>{{item.deviceVersion}}</p>
                  </div>
              </div>
            </div>
            <div class="box">
                <div class="list scroll" :id="list.deviceVersion" v-for="(list,idx) in deviceInfos" :key="idx">
                  <h2>设备名称：{{list.deviceName}}</h2>
                  <div class="line">
                  <template v-for="(item, index) in deviceInfosKey">
                    <div class="box_item " :key="index" v-if="item.slected == list.deviceType">
                      <span v-if="item.label=='设备编码'">{{ item.label }}：<span class="hrefs" @click="goTo(3,list)">{{ list[item["prop"]] || '-'}}</span></span>
                      <span v-else>{{ item.label }}：{{ list[item["prop"]] || '-'}}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <el-button icon="el-icon-plus" v-if="module != 'details'" type="default" class="btn-add" @click="addlist('设备')"
              >点击添加关联设备</el-button
            >
          </div>
      </div>
      <div v-if="module == 'details'">
        <h3 id="8" class="titles2">基站历史维修信息</h3>
        <div class="details_box">
        
        </div>
        <h3 id="9" class="titles2">基站历史告警信息</h3>
        <div class="details_box">
        
        </div>
      </div>
    </div>
    <Correlation
      :visible="dialogVisible2"
      :filtertype="relevance"
      @sure="sure"
      @updateVisible="() => {}"
      @resetPopupData="() => {}"
      @submitPopupData="() => {}"
      @handleClose="
        () => {
          this.dialogVisible2 = false;
        }
      "
    >
    </Correlation>
  </div>
</template>
  <script>
import basic from "@/mixins/basic";
import resource from "@/mixins/resource";
import areaSelect from "@/components/custom/areaSelect";
import Anchor from "./anchor";
import { labelData, selectKey, stationBasicKey,stationExtendInfoKey,stationExtendInfoKey2,linkData ,devicePreviewsKey} from "@/utils/station";
import { machineRoom } from "@/utils/machine";
import { ironTower } from "@/utils/tower";
import { deviceInfos } from "@/utils/device";
import { rules } from "@/utils/rulesStation";
import Correlation from "./correlation";
import {
	getStationDetail,
	changeStation,
	bindStation,
  getUpStation
  } from "@/api/resource";
export default {
  components: {
    Anchor,
    Correlation,
    areaSelect,
  },
  data() {
    const checkAge = (rule, value, callback) => {
    if(value){
      if (!/(^[1-9]\d*$)/.test(value)) {
      callback(new Error('请输入数字值'))
      } else {
      if (value > 200) {
      callback(new Error('不能超过200'))
      } else {
      callback()
      }
      }
    }else{
      callback(new Error('必填项不能为空'))
    }
    }
    return {
      title: "",
      rmInfo:'rmInfo',
      dialogVisible2: false,
      relevance:null,
      val: null,
      anchorList: [
        {
          name: "基站信息",
          id: 1,
        },
        
        {
          name: "物业信息",
          id: 2,
        },
        {
          name: "市电信息",
          id: 3,
        },
        {
          name: "运营商共享情况",
          id: 4,
        },
        {
          name: "关联机房信息",
          id: 5,
        },
        {
          name: "关联铁塔信息",
          id: 6,
        },
        {
          name: "关联设备信息",
          id: 7,
        },
        {
          name: "基站历史维修信息",
          id: 8,
        },
        {
          name: "基站历史告警信息",
          id: 9,
        },
      ],
      module: "",
      module_title: "",
      id: "",
      placeholder: "",
      selectKey: selectKey,
      tableKey: [],
      stationBasicKey:stationBasicKey,
      devicePreviewsKey:devicePreviewsKey,
      stationExtendInfoKey:stationExtendInfoKey,
      stationExtendInfoKey2:stationExtendInfoKey2,
      deviceInfosKey:deviceInfos,
      machineRoomKey:machineRoom,
      ironTowerKey:ironTower,
      devicePreviews:[],
      linkData:linkData,
      tableLabel: [],
      loading: false,
      pageNo: 1,
      noMore: false,
      pageSize: 10,
      detailsData: [],
      stationBasic:[],
      stationExtendInfo:[],
      historyAlarmList:[],
      historyMaintenanceList:[],
      ironTower:[],
      machineRoom:[],
      deviceInfos: [],
      operator:['CMCC','CUCC','CTCC'],
      flag1:false,
      flag2:false,
      ruleForm: {
        operator:[],
        shareConditions:[
        {
          id:1,
          operator:'',
          deviceStandard:null,
          powerGenerationService:null,
          preserveLevel:null,
          rentTerm:null,
          stationType:null,
          rentStartTime:null,
          rentEndTime:null
        },
        {
          id:2,
          operator:'',
          deviceStandard:null,
          powerGenerationService:null,
          preserveLevel:null,
          rentTerm:null,
          stationType:null,
          rentStartTime:null,
          rentEndTime:null
        },
        {
          id:3,
          operator:'',
          deviceStandard:null,
          powerGenerationService:null,
          preserveLevel:null,
          rentTerm:null,
          stationType:null,
          rentStartTime:null,
          rentEndTime:null
        }
      ],areaCode:'',},
      rules: rules,
      formRules:{
        stationType:[{ required: true, message: "公司站型", trigger: "change" }],
        deviceStandard:[{ required: true, message: "设备制式", trigger: "change" }],
        preserveLevel:[{ required: true, message: "基站维护服务等级", trigger: "change" }],
        powerGenerationService:[{ required: true, message: "是否购买发电服务", trigger: "change" }],
        rentStartTime:[{ required: true, message: "起租时间", trigger: "blur" }],
        rentTerm:[{ required: true, validator: checkAge, trigger: "blur" }],
        rentEndTime:[{ required: true, message: "租期截止时间", trigger: "change" }],
      }
    };
  },
  mixins: [basic, resource],
  created() {
    // 基站下拉菜单的字典请求参数
    this.dictParams = [
      "stationType",
      "operator",
      "protectionLevel",
      "stationStatus",
      "stationSecondStatus",
      "terrain",
      "weather",
      "fsuStatus",
      "deviceStandard",
      "preserveLevel",
      "realEstateAttr",
      "getInStationDiffLevel",
      "getInStationDiffReason",
      "powerSupplyModeFirst",
      "powerSupplyModeSecond",
    ];
    const { id, module } = this.$route.query;
    this.id = id;
    this.module = module;
    switch (module) {
      case "add":
        this.title = "新增基站";
        this.tableKey = labelData.filter((item) => {
          return item;
        });
        this.placeholder = "请选择";
        break;
      case "edit":
        this.getEdit(id)
        this.title = "修改基站";
        this.tableKey = labelData.filter((item) => {
          return item;
        });
        break;
      case "details":
        this.title = "基站详情";
        getStationDetail(id).then((res)=>{
          if(res.code == 0){
              this.stationBasic = res.data.stationBasic
              this.stationExtendInfo = res.data.stationExtendInfo || []
              this.machineRoom = res.data.machineRoom
              // this.operator = [res.data.stationBasic.sharingCondition]
              this.ruleForm.operator = [res.data.stationBasic.sharingCondition]
              this.machineRoom && this.machineRoom.forEach((item,i)=>{
                item.areaCode = item.area
              })
              this.deviceInfos = res.data.deviceInfos
              this.deviceInfos && this.deviceInfos.forEach((item,i)=>{
                item.areaCode = item.area
              })
              this.ironTower = res.data.ironTower
              this.ruleForm.shareConditions = res.data.shareConditions
              if(this.ironTower){
                this.ironTower.areaCode = res.data.ironTower.area || null
              }
              this.devicePreviews = res.data.devicePreviews
          }
        })
        break;
    }
  },
  mounted() {
  },
  methods: {
    goto(){
    },
    getEdit(id){
      getUpStation(id).then((res)=>{
          if(res.code == 0){
            let data = res.data.shareConditions
            let arr = this.ruleForm.shareConditions
            let operatorArr = []
            data.forEach((item,i)=>{
              operatorArr.push(item.operator)
              // arr[i] = item
              this.$set(this.ruleForm.shareConditions, i, item)
            })
            this.ruleForm =  {...res.data.stationBasic, ...res.data.stationExtendInfo}
            if(this.ruleForm.fsuInstallStatus == '1'){
              this.flag2 = true
            }
            if(this.ruleForm.getInStationDiffLevel != '1'){
              this.flag1 = true
            }
            this.ruleForm.shareConditions = arr
            this.ruleForm.areaCode = this.ruleForm.area
            this.ruleForm.operator = operatorArr
            this.placeholder = res.data.stationBasic.areaPlaceholder
            this.machineRoom = res.data.machineRoom
            this.machineRoom && this.machineRoom.forEach((item,i)=>{
              item.areaCode = item.area
            })
            this.deviceInfos = res.data.deviceInfos
            this.deviceInfos && this.deviceInfos.forEach((item,i)=>{
                item.areaCode = item.area
            })
            this.ironTower = res.data.ironTower
            if(this.ironTower){
              this.ironTower.areaCode = res.data.ironTower.area || null
            }
          }
        })
    },
    sure(val){
      let ids = []
      let type = null
      val.forEach((item)=>{
        ids.push(item.id)
      })

      if(this.relevance=='机房'){
        type = 1
      }else if(this.relevance=='铁塔'){
        type = 2
      }else{
        type = 3
      }
      let params = {
        stationCode:this.ruleForm.stationCode,
        resourceType: type,
        resourceIdList:ids
      }
      bindStation(params).then((res)=>{
        if(res.code == 0){
          this.$message.success('关联成功')
          this.getEdit(this.$route.query.id)
        }
      })
    },
    goTo(val,row){
      if(val==1){
        this.$router.push({
          name:'rmMachineInfo',
          query:{
            id:row.id,
            module:'details'
          }
        })
      }else if(val == 2){
        this.$router.push({
          name:'rmTowerInfo',
          query:{
            id:row.id,
            module:'details'
          }
        })
      }else{
        this.$router.push({
          name:'rmDeviceInfo',
          query:{
            id:row.id,
            module:'details'
          }
        })
      }
    },
    // 设备详情
    goDevice(val){
      let arr = val.deviceVersion.split(',')
      console.log(arr[0])
      document.getElementById(arr[0]).scrollIntoView({ behavior: "smooth", block: 'start'})
    },
    timeChange(val,obj){
      this.computNum(val,obj.rentTerm,obj)
    }, 
    yearChange(val,obj){
      this.computNum(obj.rentStartTime,val,obj)
    },
    changeShow(val,item){
      if(item.label == 'FSU是否安装' && val==1){
        this.flag2 = true
      }else{
        this.flag2 = false
      }
    },
    changeShow2(val,item){
      if(item.label == '上站难易程度' && val!=1 && val!=''){
        this.flag1 = true
      }else{
        this.flag1 = false
      }
    },
    changArr(tempArr) {
        let result = [];
        let obj = {};
        for (let i = 0; i < tempArr.length; i++) {
            if (!obj[tempArr[i].operator]) {
                result.push(tempArr[i]);
                obj[tempArr[i].operator] = true;
            };
        };
        return result;
    },
    changease(val){
      this.operator.forEach((item,i)=>{
        this.ruleForm.shareConditions[i].operator = val[i]  || null
      })
      this.$forceUpdate();
    },
    addlist(val) {
      this.relevance = val
      this.dialogVisible2 = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let arr = []
          this.ruleForm.shareConditions.forEach((item,i)=>{
            if(item.operator === this.ruleForm.operator[i]){
              console.log(this.ruleForm.operator[i])
              arr.push(item)
            }
          })
          console.log(arr,'运营商数据')
          let params = {
            basicForm:{
              address:this.ruleForm.address,
              areaCode:this.ruleForm.areaCode,
              fsuHandoverTime:this.ruleForm.fsuInstallStatus=='1'?this.ruleForm.fsuHandoverTime:null,
              fsuInstallStatus:this.ruleForm.fsuInstallStatus,
              fsuStatus:this.ruleForm.fsuInstallStatus=='1'?this.ruleForm.fsuStatus:null,
              id:this.ruleForm.id || null,
              lat:this.ruleForm.lat,
              lng:this.ruleForm.lng,
              protectionLevel:this.ruleForm.protectionLevel,
              secondStatus:this.ruleForm.secondStatus,
              operator:this.ruleForm.operator,
              startTime:this.ruleForm.startTime,
              stationName:this.ruleForm.stationName,
              stationType:this.ruleForm.stationType,
              status:this.ruleForm.status,
              terrain:this.ruleForm.terrain,
              weather:this.ruleForm.weather,
            },
          shareConditions:arr,
          stationExtendInfo:{
            batterySupportExtraTime:this.ruleForm.batterySupportExtraTime,
            batterySupportTime:this.ruleForm.batterySupportTime,
            fixedOilMachine:this.ruleForm.fixedOilMachine,
            generationWaitingTime:this.ruleForm.generationWaitingTime,
            getInStation:this.ruleForm.getInStation,
            getInStationDiffLevel:this.ruleForm.getInStationDiffLevel,
            getInStationDiffReason:this.ruleForm.getInStationDiffLevel !='1'?this.ruleForm.getInStationDiffReason:null,
            getInStationPowerGeneration:this.ruleForm.getInStationPowerGeneration,
            powerGenerationCondition:this.ruleForm.powerGenerationCondition,
            powerLineName:this.ruleForm.powerLineName,
            realEstateAttr:this.ruleForm.realEstateAttr,
            powerSupplyCompany:this.ruleForm.powerSupplyCompany,
            powerSupplyDeptPhone:this.ruleForm.powerSupplyDeptPhone,
            powerSupplyModeFirst:this.ruleForm.powerSupplyModeFirst,
            powerSupplyModeSecond:this.ruleForm.powerSupplyModeSecond,
            powerSupplyModeSecond:this.ruleForm.powerSupplyModeSecond,
            realEstateContacts:this.ruleForm.realEstateContacts,
            realEstatePhone:this.ruleForm.realEstatePhone,
            requiredEnginePower:this.ruleForm.requiredEnginePower,
            voltageGateRestriction:this.ruleForm.voltageGateRestriction,
          },
          }
          console.log(params,'所有数据')
          changeStation(params).then((res)=>{
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
  #rmInfo{
    position: relative;
    overflow-y: scroll;
    height: 100%;
  } 
  .hrefs{
    color: #5674E5;
  cursor: pointer;
  }
  .details_title, .titles2{
    scroll-margin: 75px;
  }  
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
  background: #ffffff;
  padding: 20px;
  margin-top: 55px;

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
  margin: 0;
  border-bottom: 1px solid #e9e9e9;
}
.titles2{
  padding: 20px;
  margin: 0;
}
.form_list {
  width: 100%;
  height: 100%;
}

.details_list .details_title {
  font-size: 16px;
}
.box h2 {
  font-size: 16px;
  height: 44px;
  line-height: 44px;
  text-indent: 20px;
  background: #fafafa;
  border-radius: 3px 3px 0px 0px;
  border-top: 1px solid #e9e9e9;
}
.box {
  padding-bottom: 20px;
}
.details_list .box_list {
  display: inline-block;
  width: 30%;
  line-height: 44px;
  height: 44px;
  margin-left: 20px;
  border-bottom: 1px solid #e9e9e9;
}
.details_box {
  padding:0 20px;
}
.details_box button{
  width: 100%;
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
.list{
  padding-bottom: 20px;
  border: 1px solid #e9e9e9;
  border-top:none;
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
.scroll{
  scroll-margin: 65px;
}
.relevance {
  background: #fff;
}
.yun{
  border:1px solid #ddd;
  margin: 0 auto;
  margin-top: 10px;
}
.operator_title{
  width: 100%;
  height: 44px;
  text-indent: 20px;
  line-height: 44px;
  background: #FAFAFA;
  border-bottom: 1px solid #E9E9E9;
}
.btn-add{
  margin-top: 20px;
}
.device_title{
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #000;
  border:1px solid #E8E8E8;
  background: #FAFAFA ;
}

.device_box{
  display: flex;
}
.left{
  width: 100px;
  height: 125px;
  overflow: hidden;
  background: #FAFAFA ;
  text-align: center;
  border-right: 1px solid #E8E8E8;
  border-left: 1px solid #E8E8E8;
}
.left p{
  margin: 10px 0;
  line-height: 30px;
  border-bottom:1px solid #E8E8E8 ;
}

.right{
  flex: 1;
  width: 100%;
  border-right: 1px solid #E8E8E8;
  text-align: center;
}
.right p{
  padding: 5px 0;
  margin: 0;
  line-height: 30px;
  border-bottom:1px solid #E8E8E8 ;
  overflow:hidden;
  border-bottom: 1px solid #e9e9e9;
}
</style>
  