<template>
  <div>
    <el-dialog :title="(type!='create' ? '编辑' : '添加') + '维修' + title"
               :visible.sync="isShow"
               class="el-dialog-unify el-dialog-medium" width="1284px" 
               destroy-on-close
               :lock-scroll="true"
               :before-close="dialogCancel">
      <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
        <el-form class="el-form-dialog" ref="form" :model="form" :rules="rules">
          <el-form-item class="" :label="'维修'+title+'名称：'" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item class="" label="维修类型：" prop="orderDetailsType">
            <el-select :multiple="!moduleType=='Item'" clearable v-model="form.orderDetailsType" placeholder="请选择">
              <el-option v-for="item in orderTypeLists"
                         :key="item.code"
                         :label="item.name"
                         :value="item.code"/>
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
          </template>

        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-hold-click @click="dialogSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {deepClone} from "@/utils"

import {validMobile, validEmail} from "@/utils/validate"
import formDailogMixin from "@/mixins/formDialog";
import {getPollingType,xmConfig} from "@/api/orderXjConfig";
import {workRoleManager} from "@/api/workRole";
import {allDeviceType, allDevice, workOrderType} from "@/api/device";
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
      first: true,
      roleLists: [],
      deviceTypeLists: [],
      allDeviceLists: [],
      stationTypeData:[],
      default: {
      },

      rules: {
        name: [
          {required: true, message: `请输入名称`, trigger: 'blur'}
        ],
        // phone: [
        //     { required: true, validator: phoneRule, trigger: 'blur' }
        // ],
        orderDetailsType: [
          {required: true, message: `请选择工单分类`, trigger: 'blur'}
        ],
        umsRole: [
          {required: true, type: 'array', message: "请选择适用专业", trigger: 'change'}
        ],
        pollingDevice: [
          {required: true, message: "请选择维修项目", trigger: 'change'}
        ],
        pollingObject: [
          {required: true, message: `请选择维修项目类型`, trigger: 'change'}
        ],
      },
      form: {
        orderDetailsType: []
      },

      orderTypeLists: [
      ],
      dialogCancelType: 'success'
    }
  },

  watch: {
    'form.pollingObject': {
      handler(val) {
        // if (this.type === 'modify' && val && this.first) {
        //   this.loader_polling_device(val);
        //   this.first = false;
        // }
      },
      immediate: true
    }
  },
  created() {
    this.loader_role()
    this.workOrderTypeFun();
    this.getBatchList();
  },
  methods: {
    getBatchList(){
      getBatchSystem(['stationType']).then((res)=>{
            if(res.success){
              this.stationTypeData = res.data.stationType;
            }
        })
    },
    cancel() {
      this.dialogCancelType = 'cancel';
      this.dialogCancel();
    },
    configuration() {
      this.dialogSubmit();
      this.$emit('update:save-jump', true)
    },
    async workOrderTypeFun() {
      const res = await getPollingType({},{orderTypeCode:'WX-TYPE-369'});
      this.orderTypeLists = res|| [];
    },
    loader_role: function () {
      var that = this
      workRoleManager({method: "get", name: 'page'}, {current: 1, size: 999}).then(res => {
        let _list = [];
        res.data.records.map((item) => {
          _list.push({
            label: item.name,
            value: item.code,
          });
        });
        that.roleLists = _list;
      });
    },
    loader_polling_object: function () {
      var that = this
      allDeviceType({method: "post",}).then(res => {
        const data = res?.data || res || [];
        that.deviceTypeLists = res?.data?.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.typeNumber,
          }
        });
      });
    },
    loader_polling_device: async function (val) {
      console.log('val', this.form.pollingDevice, 'loader_polling_device- val');
      const that = this
      // typeNumber字段单独赋值；另存并提交
      this.form.typeNumber = val;
      if (!this.first) {
        this.form.pollingDevice = undefined;
      }
      this.allDeviceLists = [];
      // 这里用val获取对应的id去查找下级，
      const deviceTypeId = this.deviceTypeLists.find(el => el.typeNumber === val)?.id;
      const res = await allDevice({method: "post",}, {deviceTypeId})
      this.allDeviceLists = res?.data?.map?.((item) => {
        return {
          label: item.deviceName,
          value: item.deviceCode,
        }
      }) || [];
      this.first = false;
    },
    openDialogAfter() {
      let that = this;
      if (that.form && that.form.pollingObject) {
        that.loader_polling_device()
      }

    },
    dialogSubmitCustom(post, next) {
      if(post.id){
        xmConfig({name:'updateItem',method:'post'},{},{
          ...post,
          orderType: 'WX-TYPE-369',
          relatedSiteType: post?.relatedSiteType.join(','),
        }).then(res=>{
          if(res.code==0){
            this.isShow=false;
            this.$message.success("修改成功");
            this.dialogCancelAfter();
          }
        })
      }else{
        xmConfig({name:'savePollingItem',method:'post'},{},{
          ...post,
          orderType: 'WX-TYPE-369',
          relatedSiteType: post?.relatedSiteType.join(','),
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
      this.first = true;
      that.$emit('success')
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
