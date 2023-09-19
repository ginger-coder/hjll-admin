<template>
  <div>
    <el-dialog :title="(type!='create' ? '编辑' : '添加') + '巡检' + title"
               :visible.sync="isShow"
               class="el-dialog-unify el-dialog-medium" width="1284px" 
               destroy-on-close
               :lock-scroll="true"
               :before-close="dialogCancel">
      <!-- <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper"> -->
        <el-form class="el-form-dialog" ref="form" :model="form" :rules="rules">
          <el-form-item class="" label="巡检类型：" prop="orderDetailsType">
            <el-select filterable clearable v-model="form.orderDetailsType" @change="searchName" :disabled="form.itemCount>0"> 
              <el-option v-for="item in orderTypeLists"
                         :key="item.code"
                         :label="item.name"
                         :value="item.code"/>
            </el-select>
          </el-form-item>
          <el-form-item class="" :label="title+'名称：'" prop="name">

            <!-- <el-select filterable clearable v-model="form.name">
              <el-option v-for="item in names"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select> -->
            <el-input v-model="form.name" :placeholder="'请输入'+title+'名称'"></el-input>
          </el-form-item>
          <el-form-item class="" label="巡检周期：" prop="period">
            <el-select filterable clearable v-model="form.period"> 
              <el-option v-for="item in periodData"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item class="" label="站点类型：" prop="relatedSiteType">
            <el-select filterable clearable v-model="form.relatedSiteType" multiple> 
              <el-option v-for="item in stationTypeData"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <template v-if="moduleType=='Item'">
            <el-form-item class="" label="巡检项目类型：" prop="pollingObject">
              <el-select v-model="form.pollingObject" clearable @change="loader_polling_device">
                <el-option v-for="item in deviceTypeLists" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="" label="巡检项目：" prop="pollingDevice">
              <el-select v-model="form.pollingDevice" filterable>
                <el-option v-for="item in allDeviceLists" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
      <!-- </el-scrollbar> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
        <el-button @click="dialogCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {deepClone} from "@/utils"

import {validMobile, validEmail} from "@/utils/validate"
import formDailogMixin from "@/mixins/formDialog";
import {getPollingType,savePollingModule,updatePollingModule} from "@/api/orderXjConfig";
import {workRoleManager} from "@/api/workRole";
import {allDeviceType, allDevice, workOrderType, configurePage} from "@/api/device";
import { getBatchSystem } from "@/api/system"
export default {
  props: {
    moduleType: {
      type: String,
      default: ''
    },
    pageFun: '',
  },
  mixins: [formDailogMixin],
  data() {
    let phoneRule = (rule, value, callback) => {
      if (value) {
        if (!validMobile(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      } else {
        callback(new Error("请输入手机号"));
      }
    };
    return {
      roleLists: [],
      deviceTypeLists: [],
      allDeviceLists: [],
      default: {
        umsRole: []
      },
      stationTypeData:[],
      periodData:[],
      rules: {
        name: [
          {required: true, message: `请输入巡检项目名称`, trigger: 'blur'}
        ],
        orderDetailsType: [
          {required: true, message: `请选择巡检类型`, trigger: 'change'}
        ],
        period: [
          {required: true, message: `请选择巡检周期`, trigger: 'change'}
        ],
        relatedSiteType: [
          {required: true, message: `请选择站点类型`, trigger: 'change'}
        ],
        umsRole: [
          {required: true, type: 'array', message: "请选择适用专业", trigger: 'change'}
        ],
        pollingPeriod: [
          {required: true, type: 'number', message: `请选择巡检周期`, trigger: 'change'}
        ],
        pollingDevice: [
          {required: true, type: 'number', message: "请选择巡检项目", trigger: 'change'}
        ],
        pollingObject: [
          {required: true, type: 'number', message: `请选择巡检项目类型`, trigger: 'change'}
        ],
      },
      form: {},

      orderTypeLists: [
        // {label:'机房巡检',value:1},
        // {label:'铁塔巡检',value:2},
        // {label:'站点巡检',value:3}
      ],
      names: [],
      pollingPeriodLists: [
        {label: '月度', value: 1},
        {label: '双月', value: 2},
        {label: '季度', value: 3},
        {label: '半年', value: 4},
        {label: '一年', value: 5},
      ]
    }
  },

  watch: {},
  created() {
    this.loader_role()
    // this.loader_polling_object()
    this.workOrderTypeFun();
    this.getBatchList();

  },
  methods: {
    searchName(val) {
      const orderDetailsType = this.form?.orderDetailsType;
      this.names = [];
      this.form.name = undefined;
      // if (orderDetailsType) {
      //   configurePage({orderDetailsType})
      //       .then(res => {
      //         this.names = res?.data?.records?.map(el => {
      //           return {
      //             ...el,
      //             label: el?.name,
      //             value: el?.name
      //           }
      //         }) || [];
      //       })
      // }
    },
    async workOrderTypeFun() {
      getPollingType({},{orderTypeCode:'XJ-TYPE-789'}).then(res=>{
        this.orderTypeLists=res|| [];
      })
    },
    getBatchList(){
      getBatchSystem(['stationType','period']).then((res)=>{
            if(res.success){
              this.stationTypeData = res.data.stationType;
              this.periodData = res.data.period;
            }
        })
    },
    loader_role: function () {
      var that = this
      workRoleManager({method: "get", name: 'page'}, {current: 1, size: 999}).then(res => {
        let _list = [];
        res.data.records.map((item) => {
          _list.push({
            label: item.name,
            value: item.id,
          });
        });
        that.roleLists = _list;
      });
    },
    loader_polling_object: function () {
      var that = this
      allDeviceType({method: "post",}).then(res => {
        let _list = [];
        res.data.map((item) => {
          _list.push({
            label: item.name,
            value: item.id,
          });
        });
        that.deviceTypeLists = _list;
      });
    },
    loader_polling_device: function () {
      var that = this
      allDevice({method: "post",}, {deviceTypeId: that.form.pollingObject}).then(res => {
        let _list = [];
        res.map((item) => {
          _list.push({
            label: item.deviceName,
            value: item.id,
          });
        });
        that.allDeviceLists = _list;
      });
    },
    openDialogAfter() {
      let that = this;
      if (that.form && that.form.pollingObject) {
        that.loader_polling_device()
      }

    },
    dialogSubmitCustom(post, next) {
      let that = this;

      post = post || {};
      if(post.id){
      //  if(post.itemCount>0){ return this.$message.warning("该模块下已有项目，不可修改！");}
      console.log(post?.relatedSiteType)
        updatePollingModule({},{},{
          ...post,
          orderDetailsType: post?.orderDetailsType,
          relatedSiteType: post?.relatedSiteType.join(','),
          orderType: 'XJ-TYPE-789',
        }).then(res=>{
          if(res.code==0){
            this.isShow=false;
            this.$message.success("修改成功");
            this.dialogCancelAfter();
          }
        })
      }else{
        savePollingModule({},{},{
          ...post,
          orderDetailsType: post?.orderDetailsType,
          relatedSiteType: post?.relatedSiteType.join(','),
          orderType: 'XJ-TYPE-789',
        }).then(res=>{
          if(res.code==0){
            this.isShow=false;
            this.$message.success("添加成功");
            this.dialogCancelAfter();
          }
        })
      }
      
      
    },
    dialogCancelAfter: function () {
      var that = this
      that.$emit('success')
    },
  },
};
</script>
<style lang="scss" scoped>
</style>