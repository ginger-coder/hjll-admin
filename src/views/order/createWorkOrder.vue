<template>
  <div style="height: 98%;overflow: hidden;">
    <div v-loading="loading" class="formPage" ref="orderCreate">
      <div class="form_box scrllbar">
        <div class="form_header disp_flex">
          <span class="title">{{orderType?'巡检计划管理':'派单管理'}}</span>
          <div style="flex:1;text-align: right;">
            <el-button v-hold-click type="primary" v-if="state" @click="submitForm()" :loading="loading" >仅创建</el-button>
            <el-button v-hold-click type="danger" v-if="state" @click="submitForm('pf')" :loading="loading">创建并提交</el-button>
            <el-button v-hold-click type="info" plain @click="back" >关闭</el-button>
          </div>
        </div>
        <div class="create_form">
          <el-form ref="form" :model="form" :rules="rules" label-width="130px">
            <el-form-item label="计划名称：" prop="planName" v-if="orderType=='patrol'">
              <el-input  placeholder="请输入计划名称"  v-model="form.planName">
              </el-input>
            </el-form-item>
            <el-form-item label="业务类型：" prop="resourceType">
              <el-radio-group v-model="form.resourceType">
                <el-radio-button :label="item.value" v-for="item in orderResourceTypeList" >{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="巡检类型：" prop="inspectionCode" v-if="orderType=='patrol'">
              <el-radio-group v-model="form.inspectionCode" @change="workOrderTypeChangePatrol">
                <template v-for="item in orderTypeList" >
                  <el-radio-button   :label="item.code" >{{item.name}}</el-radio-button>
                </template>
            </el-radio-group>
            </el-form-item>
            <el-form-item label="工单类型：" prop="orderTypeCode" v-else>
              <el-radio-group v-model="form.orderTypeCode" @change="workOrderTypeChange">
                <template v-for="item in orderTypeList" >
                  <el-radio-button   :label="item.code"  v-if="item.children.length==0">{{item.label}}</el-radio-button>
                  <el-radio-button :label="item.code"  v-else :disabled="true"> 
                      <el-dropdown :hide-on-click="false" @command="handleCommand">
                        <span class="el-dropdown-link">{{item.workOrderTypeXunJian?item.workOrderTypeXunJian:item.label }}<i class="el-icon-arrow-down el-icon--right"></i></span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="beforeHandleCommand(items.code,items.orderTypeCode,items.name,item.label)" v-for="items in item.children">{{items.name}}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                  </el-radio-button>
                </template>
            </el-radio-group>
            </el-form-item>
            <el-form-item label="所属区域：" prop="areaArray" v-if="orderType=='patrol'">
              <areaSelect
                          :isdisabled="distDisabled"
                          ref="areaSelect" @change="changeAreaPatral($event, 'form')"
                          :value="form.areaArray" :isEcho="isEcho"  :ismultiple="true" :isShowAll="false"></areaSelect>
            </el-form-item>
            <el-form-item label="所属区域：" prop="dist" v-else>
              <areaSelect
                          :isdisabled="distDisabled"
                          ref="areaSelect" @change="changeArea($event, 'form')"
                          :value="[form.province, form.city, form.area]" :isEcho="isEcho" ></areaSelect>
            </el-form-item>
            <el-form-item label="站点名称：" prop="siteInfoIds"  v-if="orderType">
              <el-select v-model="form.siteInfoIds"
                        @change="changeSitePatral"
                        :disabled="siteDisabled"
                        multiple
                        value-key="value"
                        filterable>
                <el-option v-for="item,index in siteList" :label="item.label"  :value="item.value" :key="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="站点名称：" prop="siteInfoId" v-else>
              <el-select v-model="form.siteInfoId"
                        @change="changeSite"
                        :disabled="siteDisabled"
                        value-key="value"
                        filterable>
                <el-option v-for="item in siteList" :label="item.label"  :value="item.value" :key="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="workOrderTypeName+'内容：'" prop="templateId">
                
            </el-form-item>
            <div style="margin-bottom: 20px;">
              <treeModles :editState="editState" :moduleList="moduleList" @getCheckTableData="getCheckTableData" @getOrderModuleName="getOrderModuleName" :height="-50"></treeModles>
            </div>
            <el-form-item label="紧急程度：" prop="orderUrgency" v-if="orderType!=='patrol'">
              <el-radio-group v-model="form.orderUrgency">
                <el-radio-button :label="item.value" v-for="item in orderUrgencyList">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="实施周期：" prop="timeArr" >
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"  v-model="form.timeArr" type="datetimerange"
                              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                              @change="changeTime" :picker-options="currentOptions" ></el-date-picker>
            </el-form-item>
            <el-form-item label="工单派发时间：" prop="deliveryOrderTime" >
                  <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"  :picker-options="currentOptions" v-model="form.deliveryOrderTime" style="width:200px" type="datetime" placeholder="请选择工单派发时间" 
                  ></el-date-picker>
                  <span style="color: #999;margin-left: 20px;">*默认派发时间为实施周期开始时间</span>
            </el-form-item>
            <el-form-item label="预估费用：" prop="predictMoney">
              <el-input  placeholder="请输入预估费用"  v-model="form.predictMoney"
                        @input="input_price($event,'predictMoney','form')">
                        <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="form.remark" class="textarea" maxlength="150" show-word-limit></el-input>
            </el-form-item>
          </el-form>
          <div style="height: 300px;margin-right: 200px;">
            <el-steps direction="vertical" :active="active" v-if="orderType">
              <el-step title="填报计划"></el-step>
              <el-step title="提交审核"></el-step>
              <el-step title="生成工单"></el-step>
            </el-steps>
            <el-steps direction="vertical" :active="active" v-else>
              <el-step title="填报工单"></el-step>
              <el-step title="提交审核"></el-step>
              <el-step title="工单派发"></el-step>
              <el-step title="已回单"></el-step>
            </el-steps>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {workOrder, workOrderType, workOrderArea , getModuleList} from "@/api/order";
import {savePollingPlan,updatePollingPlan,getPollingPlanDetail} from "./api";
import { getStationList } from "@/api/area";
import areaSelect from "@/components/custom/areaSelectAll";
import {} from "@/utils/dict";
import {deepClone, priceInput} from "@/utils";
import treeModles from "../../components/treeModles.vue";
import { getDictTypesItem } from "@/api/dict";
import store from "@/store";
import { thisTypeAnnotation, throwStatement } from "@babel/types";

export default {
  components: {
    areaSelect,
    treeModles
  },
  data() {
    let areaRule = (rule, value, callback) => {
      let {province, city, area} = this.form;
      if (!province || !city || !area) {
        return callback(new Error("请选择所属区域"));
      } else {
        callback();
      }
    };
    let timeRule = (rule, value, callback) => {
      let {orderExecuteEndTime, orderExecuteStartTime,executeStartTime,executeEndTime} = this.form;
      if(this.orderType){
        if (executeStartTime && executeEndTime) {
          callback();
        } else {
          return callback(new Error("请选择工单执行时间"));
        }
      }else{
        if (orderExecuteEndTime && orderExecuteStartTime) {
          callback();
        } else {
          return callback(new Error("请选择工单执行时间"));
        }
      }
      
    };
    return {
      title: "",
      loading: false,
      id: '',
      isEcho: false, //isEcho是否回显

      orderTypeList: [],
      sbTypeList: [],
      moduleList: [],
      zdTypeList: [],
      siteList: [],
      mbList: [],
      userList: [],
      userLoading: false,


      // 携带参数跳转之后禁用对应的选项
      orderTypeCodeDisabled: false,
      operatorIdDisabled: false,
      siteDisabled: false,
      distDisabled: false,
      form: {
        province: undefined,
        city: undefined,
        county: undefined,
        siteInfoId: undefined,
        lng: undefined,
        site: undefined,
        lat: undefined,
        resourceType: 1,
        timeArr: [],
        deliveryOrderTime: undefined,
        contentList:[],
        areaArray:[],
        siteInfoIds:[],
      },
      rules: {
        planName: [{required: true, message: "请输入计划名称", trigger: "blur"}],
        orderTypeCode: [{required: true, message: "请选择工单类型", trigger: "blur"}],
        resourceType: [{required: true, message: "请选择业务类型", trigger: "change"}],
        inspectionCode: [{required: true, message: "请选择巡检类型", trigger: "change"}],
        dist: [{required: true, validator: areaRule, trigger: "change"}],
        areaArray: [{required: true,  message: "请选择区域", trigger: "change"}],
        timeArr: [{required: true, validator: timeRule, trigger: "change"}],
        siteInfoId: [{required: true, message: '请选择所属站点', trigger: "change"}],
        orderUrgency: [{required: true, message: "请选择工单紧急程度", trigger: "change"}],
        deliveryOrder: [{required: true, message: "请选择派单模式", trigger: "change"}],
        deliveryOrderTime: [{required: true, message: "请选择工单派发时间", trigger: "change"}],
        siteType: [{required: true, message: "请选择所属站点", trigger: "change"}],
        predictMoney: [{required: true, message: "请输入预计工单费用", trigger: "blur"}],
        operatorId: [{required: true, message: "请选择运营商", trigger: "blur"}],
        siteInfoIds: [{required: true, message: "请选择站点", trigger: "change"}],
      },
      isp_list: [],
      workOrderTypeXunJian:'',
      workOrderTypeName:'发电',
      active:1,
      editState:true,
      currentOptions:{
          disabledDate(time) {
              return time.getTime() <Date.now() - 8.64e7;
          }
      },
      state:true,
      orderUrgencyList:[],
      orderResourceTypeList:[],
      siteArray:[]

    };
  },
  mixins: [basic],
  created() {
    this.initer();
    const id = this.getRouterValue('id')
    const state = this.getRouterValue('state')
    const orderType = this.getRouterValue('type')
    this.orderType=orderType;
    if(this.orderType){
      this.workOrderTypeName='巡检';
    }
    if(state){
      this.state=false;
    }
    if (id) {
      this.id = id
      this.title = "编辑新工单";
      setTimeout(() => {
        this.loader_order_info()
      }, 1000);
    } else {
      this.title = "创建新工单";
    }
  },
  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.$refs.orderCreate.scrollTop = 0;
    });
    // that.initer();
  },
  methods: {
    beforeHandleCommand(code, orderTypeCode,name,label) { //index我这里是遍历的角标，即你需要传递的额外参数
        return {
          'code': code,
          'orderTypeCode': orderTypeCode,
          'name': name,
          'label':label
        }
    },
    handleCommand(e) {
        this.$set(this.form, 'orderTypeCode', e.orderTypeCode)
        this.workOrderTypeName=e.label;
        this.orderTypeList.filter(item=>item.code==e.orderTypeCode)[0].workOrderTypeXunJian=e.name;
        this.form.orderSecondTypeCode=e.code;
        this.form.orderTypeCode=e.orderTypeCode;
        this.loader_getModuleList(e.orderTypeCode,'',e.code);
    },
    workOrderTypeChange(e){
      this.form.orderTypeCode=e;
      let workOrderTypeName=this.orderTypeList.filter(item=>item.code==e)[0].label;
      this.workOrderTypeName=workOrderTypeName;
      this.loader_getModuleList(e,'');
    },
    // 巡检计划新增
    workOrderTypeChangePatrol(e){
      this.form.inspectionCode=e;
      this.loader_getModuleList(this.form.orderTypeCode,'',e);
    },
    getRouterValue(key) {
      return this.$route.query?.[key]
    },
    back() {
      this.$router.go(-1);
    },
    initer: function () {
      let that = this;
      that.loader_orderType();
      that.getInitPage();
    },
    loader_order_info: function () {
      let that = this;
      that.loading=true;
      if(that.orderType){
        getPollingPlanDetail(that.id)
            .then((res) => {
              let workOrder = res.data;
              that.form = workOrder;
              that.form.areaArray = workOrder.regionList;
              that.$set(that.form, "timeArr", [workOrder.executeStartTime,workOrder.executeEndTime]);
              that.isEcho = true;
              if(that.form.auditStatus==3){
                that.active=2;
              }else if(that.form.auditStatus==4){
                that.active=3;
              }
              if(that.form.areaArray.length>0){
                that.changeAreaPatral(that.form.areaArray,false)
              }
              if(workOrder.inspectionCode){
                that.workOrderTypeChangePatrol(workOrder.inspectionCode)
              }
              if(that.form.pollingOrderVOList){
                setTimeout(() => {
                  let _array=[];
                  let array=[];
                  this.moduleList.map(function(item){
                    let itemsArray=that.form.pollingOrderVOList.filter(items=>items.id==item.id).length>0?that.form.pollingOrderVOList.filter(items=>items.id==item.id):[];
                    _array.push({
                      ...item,
                      checkedData:itemsArray.length>0?itemsArray:[],
                      checkedArr:itemsArray.length>0?itemsArray[0].itemList.split(','):[]
                    })
                  })
                  that.form.pollingOrderVOList.map(item=>{
                    array.push({
                      itemId:item.itemList,
                      orderSecondTypeCode:that.form.orderSecondTypeCode,
                      orderTypeCode:that.form.orderTypeCode,
                      moduleId:item.id
                    })
                  })
                  this.form.contentList=array;
                  this.moduleList=_array;
                  this.loading=false;
                }, 1000);
              }else{
                this.loading=false;
              }
              
            })
            .catch((error) => {
        });
      }else{
        workOrder({method: "get", name: "detail"}, {id: that.id})
            .then((res) => {
              let workOrder = res.data;
              that.form = workOrder;
              that.form.province = workOrder.provinceCode;
              that.form.city = workOrder.cityCode;
              that.form.area = workOrder.areaCode;
              that.form.id = that.id;
              that.$set(that.form, "siteInfoId", parseFloat(workOrder.siteInfoId));
              that.$set(that.form, "timeArr", [workOrder.orderExecuteStartTime,workOrder.orderExecuteEndTime]);
              that.isEcho = true;
              if(that.form.workOrderStatus==21){
                that.active=2;
              }else if(that.form.workOrderStatus==1){
                that.active=3;
              }else if(that.form.workOrderStatus==7){
                that.active=4;
              }
              if(that.form.province&&that.form.city&&that.form.area){
                that.changeArea({province:that.form.province,city:that.form.city,area:that.form.area},'form')
              }
              if(workOrder.orderSecondTypeCode){
                let name=that.orderTypeList.filter(item=>item.code==workOrder.orderTypeCode)[0]?.children.filter(items=>items.code==workOrder.orderSecondTypeCode)[0].name;
                let label=that.orderTypeList.filter(item=>item.code==workOrder.orderTypeCode)[0]?.label;
                that.handleCommand({orderTypeCode:workOrder.orderTypeCode,code:workOrder.orderSecondTypeCode,name:name,label:label})
              }else{
                that.workOrderTypeChange(workOrder.orderTypeCode)
              }
              if(that.form.pollingOrderVOList){
                setTimeout(() => {
                  let _array=[];
                  let array=[];
                  this.moduleList.map(function(item){
                    let itemsArray=that.form.pollingOrderVOList.filter(items=>items.id==item.id).length>0?that.form.pollingOrderVOList.filter(items=>items.id==item.id):[];
                    _array.push({
                      ...item,
                      checkedData:itemsArray.length>0?itemsArray:[],
                      checkedArr:itemsArray.length>0?itemsArray[0].itemList.split(','):[]
                    })
                  })
                  that.form.pollingOrderVOList.map(item=>{
                    array.push({
                      itemId:item.itemList,
                      orderSecondTypeCode:that.form.orderSecondTypeCode,
                      orderTypeCode:that.form.orderTypeCode,
                      moduleId:item.id
                    })
                  })
                  this.form.contentList=array;
                  this.moduleList=_array;
                  this.loading=false;
                }, 1000);
              }else{
                this.loading=false;
              }
             
              
            })
            .catch((error) => {
        });
      }
      
    },
    // 工单类型
    loader_orderType: function () {
      let that = this;
      workOrderType({method: "get", name: "getAllWorkOrderType"})
          .then((res) => {
            if(that.orderType){
               res.data.map((item) => {
                if(item.name=='巡检'){
                  that.form.orderTypeCode=item.code
                  that.orderTypeList =item.orderTypeDetailList;
                }
              });
            }else{
              that.orderTypeList = res.data.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                  code: item.code,
                  children:item.orderTypeDetailList,
                  workOrderTypeXunJian:''
                }
              });
            }
            this.$nextTick(() => {
              const orderTypeCode = +(that.getRouterValue('orderTypeCode'))
              if (orderTypeCode) {
                this.$set(that.form, 'orderTypeCode', orderTypeCode)
                this.$set(that.form, 'workOrderTypeDetailsId', orderTypeCode)
                this.$set(that, 'orderTypeCodeDisabled', true)
              }
            })
          })
          .catch((error) => {
          });
    },
    getInitPage(){
			var that = this;
			// 紧急程度
			getDictTypesItem({name:'order_urgency',method:'get'}).then(res=>{
				if(res.code=='0'){
					that.orderUrgencyList = res.data|| [];
				}	
			})
			// 业务类型
			getDictTypesItem({name:'order_resource_type',method:'get'}).then(res=>{
				if(res.code=='0'){
					that.orderResourceTypeList = res.data|| [];
				}	
			})
		},
    // 模块类型
    loader_getModuleList: function (orderType,orderModuleName,orderSecondTypeCode) {
      let that = this;
      var json = {
        orderModuleName: orderModuleName,
        orderType: orderType,
        orderSecondType:orderSecondTypeCode,
      };
      getModuleList({method: "post", name: "getModuleList"}, json)
          .then((res) => {
            this.moduleList=res.data;
          })
          .catch((error) => {
          });
    },
    changeTime: function (time) {
      let that = this;
      if (time) {
        that.$set(that.form, "timeArr", time);
        if(that.orderType){
          that.$set(that.form, "executeStartTime", time[0]);
          that.$set(that.form, "executeEndTime", time[1]);
        }else{
          that.$set(that.form, "orderExecuteStartTime", time[0]);
          that.$set(that.form, "orderExecuteEndTime", time[1]);
        }
        that.$set(that.form, "deliveryOrderTime", time[0]);
      } else {
        that.$set(that.form, "orderExecuteStartTime", "");
        that.$set(that.form, "orderExecuteEndTime", "");
        that.$set(that.form, "executeStartTime", "");
        that.$set(that.form, "executeEndTime", "");
        that.$set(that.form, "deliveryOrderTime", "");
      }
    },
    changeArea(val, type) {
      let that = this;
      if(!type){
        that.$set(that.form, 'siteInfoId', '')
        that.$set(that.form, 'lng', '')
        that.$set(that.form, 'site', '')
        that.$set(that.form, 'lat', '')
      }
      let {province, city, area} = val;
      that.form.province = province;
      that.form.city = city;
      that.form.area = area;

      that.loader_site([that.form.area]);
    },
    changeAreaPatral(val, type) {
      let that = this;
      let array=[];
      if(type){
        that.$set(that.form, 'siteInfoIds', [])
      }
      that.form.areaArray=val;
      that.form.areaArray.map(item=>{
        array.push(item[2])
      })
      if(array.length==0){
        that.siteList=[];
      }else{
        that.loader_site(array);
      }
     
      
    },
    loader_site: function (searchs) {
      let that = this;
      console.log(searchs)
      getStationList({name:searchs.join(',')}, {})
          .then((res) => {
            let _list = [];
            res.data.map((item) => {
              _list.push({
                label: item.stationName,
							  value: item.id,
              });
            });
            that.siteList = _list;
            that.siteArray=res.data;
          })
          .catch((error) => {
          });
    },
    changeSite: function (val) {
      let item=this.siteArray.filter(item=>item.siteId==val)[0];
      this.$set(this.form,'siteInfoId',val)
      this.form = {...this.form,lat:item.lat,lng:item.lng};
    },
    changeSitePatral: function (val) {
      this.form.siteInfoIds=val;
    },
    loader_price: function () {
      var that = this

      workOrder({method: "get", name: "predictMoney"}, {
        siteType: that.form.siteType1,
        isCity: that.form.isCity
      }, {}).then((res) => {
        that.$set(that.form, 'predictMoney', res.data.predictMoney)

      });
    },
    input_price: function (value, type) {
      let that = this
      that.$set(that.form, type, priceInput(value))
    },
    // blur_price: function (value, type) {
    //   let that = this
    //   that.$set(that.form, type, Number(priceInput(value)))
    // },
    getCheckTableData(data){
        let array=[];
        console.log(this.form.orderSecondTypeCode)
        data.map(item=>{
          array.push({
            itemId:item.checkedArr.join(),
            orderSecondTypeCode:this.form.orderSecondTypeCode,
            orderTypeCode:this.form.orderTypeCode,
            moduleId:item.id
          })
        })
        this.form.contentList=array;
    },
    getOrderModuleName(val){
      if(this.orderType){
        this.loader_getModuleList(this.form.orderTypeCode,val,this.form.inspectionCode);
      }else{
        this.loader_getModuleList(this.form.orderTypeCode,val,this.form.orderSecondTypeCode);
      }
      
    },
    submitForm: function (type) {
      let that = this;
      that.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm(type?'是否将本工单直接提交审批':'是否创建该工单', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.loading=true;
            const {timeArr, ...rest} = that.form
            if(that.orderType){
              const _post = {
                ...deepClone(rest),
                executeStartTime:timeArr[0],
                executeEndTime:timeArr[1]
              };
              if (type) {
                _post.auditStatus = 1
              } else {
                _post.auditStatus = 0
              }
              delete _post.areaArray;
              if(that.form.id){
                updatePollingPlan({method: "post"}, {}, _post).then((res) => {
                  that.loading=false;
                  that.$message({
                    type: "success",
                    message: res.msg,
                  });
                  that.back();
                });
              }else{
                savePollingPlan({method: "post"}, {}, _post).then((res) => {
                  that.loading=false;
                  that.$message({
                    type: "success",
                    message: res.msg,
                  });
                  that.back();
                });
              }
            }else{
              const _post = {
                ...deepClone(rest),
                orderExecuteStartTime:timeArr[0],
                orderExecuteEndTime:timeArr[1]
              };
              if (type) {
                _post.workOrderStatus = 21
              } else {
                _post.workOrderStatus = 20
              }
              workOrder({method: "post", name: "saveOrUpdate"}, {}, _post).then((res) => {
                that.loading=false;
                that.$message({
                  type: "success",
                  message: res.msg,
                });
                that.back();
              });
            }
            
          })
        }
      });
    },
  },
};
</script>
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
.formPage{
  height: 100%;
}
.form_header{
  border-bottom: 1px solid #ddd;
  padding: 20px;
  position: fixed;
  background-color: #ffffff;
  width: 84%;
  box-sizing: border-box;
  z-index: 99;
  .title {
    font-size: 18px;
    font-weight: 500;
    line-height: 2;
    // margin-bottom: 10px;
    // margin-right: 20px;
  }
}
.form_box {
  background-color: #ffffff;
  margin-top: 0px;
  border-radius: 4px;
  height: 100%;
  padding-bottom: 40px;
  .create_form{
    display: flex;
    justify-content: space-between;
    padding-top: 140px;
    height: 100%;
    overflow: auto;
    .el-form {
      width: 50%;
      min-width: 450px;
      min-height: 800px;
    }
  }

}
.el-radio-button__orig-radio:checked + .el-radio-button__inner .el-dropdown{
  color: #ffffff;
}
::v-deep .el-radio-button__orig-radio:disabled:checked + .el-radio-button__inner{
  color: #FFFFFF!important;
  background-color: #5A77E2!important;
  border-color: #5A77E2!important;
}
::v-deep  .textarea .el-textarea__inner{
  resize: none!important;
}
</style>
