<template>
  <div style="height: 100%">
    <div v-loading="loading" class="formPage" ref="orderCreate">
      <div class="header_box disp_flex ju_bet ali_cen">
        <div>
          <div class="title">{{ title }}</div>
          <div class="titleTips">{{ titleTips }}</div>
        </div>
        <div class="back_box">
          <el-button v-hold-click type="" @click="back">返回</el-button>
        </div>
      </div>
      <div class="form_box scrllbar">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-form-item label="客户：" prop="operatorId">
            <el-select v-model="form.operatorId"
                       :disabled="operatorIdDisabled"
                       clearable filterable>
              <el-option v-for="item in isp_list" :key="'isp' + item.value" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型：" prop="resourceType">
            <el-select v-model="form.resourceType" filterable>
              <el-option v-for="item in businessType"
                         :key="'resourceType' + item.value"
                         :label="item.label"
                         :disabled="item.disabled"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="工单类型：" prop="workOrderTypeId">
            <el-select v-model="form.workOrderTypeId"
                       :disabled="workOrderTypeIdDisabled"
                       @change="changeWorkOrderTypeId">
              <el-option v-for="item in orderTypeList" :key="'state' + item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属区域：" prop="dist">
            <areaSelect :operatorId="form.operatorId"
                        :isdisabled="distDisabled"
                        ref="areaSelect" @change="changeArea($event, 'form')"
                        :value="[form.province, form.city, form.area]" :isEcho="isEcho"></areaSelect>
          </el-form-item>
          <el-form-item label="巡检类型：" prop="workOrderTypeDetailsId" v-if="form.workOrderTypeId == 2">
            <el-select v-model="form.workOrderTypeDetailsId" ref="xjType" @change="changeXjtype">
              <el-option v-for="item in xjTypeList" :key="'state' + item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="站点名称：" prop="site">
            <el-select v-model="form.site"
                       @change="changeSite"
                       value-key="siteInfoId"
                       :disabled="siteDisabled"
                       filterable>
              <el-option v-for="item in siteList" :label="item.label" :value="item.value" :key="item.indx">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择模版：" prop="templateId"
                        v-if="(form.workOrderTypeId && form.workOrderTypeId != 2&& form.workOrderTypeId != 3) ||  (form.workOrderTypeId == 2 && form.workOrderTypeDetailsId)">
            <el-select v-model="form.templateId" clearable>
              <el-option v-for="item in mbList" :label="item.label" :value="item.value" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="站点类型：">
            {{ form.siteType }}
          </el-form-item>
          <el-form-item label="是否市区：">
            <span v-if="form.isCity === 0 || form.isCity === '0'">非市区</span>
            <span v-else-if="form.isCity === 1 || form.isCity === '1'">市区</span>
            <span v-else>-</span>
          </el-form-item>
          <el-form-item label="所属设备：" prop="deviceInfoId" v-if="form.workOrderTypeId == 3">
            <el-select v-model="form.deviceInfoId" filterable multiple remote reserve-keyword
                       :remote-method="loader_sbtype">
              <el-option v-for="item in sbTypeList" :key="'state' + item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="故障类型：" prop="deviceFaultInfoId" v-if="form.workOrderTypeId == 3">
            <el-select v-model="form.deviceFaultInfoId">
              <el-option v-for="item in gzTypeList" :key="'state' + item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="工单紧急程度：" prop="orderUrgency">
            <el-radio-group v-model="form.orderUrgency">
              <el-radio-button label="2">紧急</el-radio-button>
              <el-radio-button label="1">正常</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="工单执行时间：" prop="timeArr" v-if="form.workOrderTypeId == 2">
            <el-date-picker value-format="yyyy-MM-dd" format="yyyy 年 MM 月 dd 日" v-model="form.timeArr" type="daterange"
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            @change="changeTime"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="派单模式：" prop="deliveryOrder">
            <el-radio-group v-model="form.deliveryOrder">
              <el-radio-button label="1">抢单</el-radio-button>
              <el-radio-button label="2" disable>自动指派工单</el-radio-button>
              <el-radio-button label="3">手动指派工单</el-radio-button>
            </el-radio-group>
          </el-form-item> -->
          <template v-if="form.deliveryOrder == 3">
            <el-form-item label="被指派人：" prop="userId">
              <el-select v-model="form.userId" filterable remote reserve-keyword placeholder="请选择被指派人"
                         @focus="loader_user()" :remote-method="loader_user" :loading="userLoading">
                <el-option v-for="item in userList" :key="'state' + item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="预计工单费用：" prop="predictMoney">
            <el-input style="width:100px;margin-right:10px" placeholder="请输入" disabled v-model="form.predictMoney"
                      @input="input_price($event,'predictMoney','form')"
                      @blur="blur_price(form['workPrice'],'workPrice')"></el-input>
            ¥
          </el-form-item>
          <el-form-item label="实际工单费用：" prop="workPrice">
            <el-input style="width:100px;margin-right:10px" placeholder="请输入" v-model="form.workPrice"
                      @input="input_price($event,'workPrice','form')"
                      @blur="blur_price(form['workPrice'],'workPrice')"></el-input>
            ¥
          </el-form-item>
          <el-form-item label="附加费：" prop="addMoney">
            <el-input style="width:100px;margin-right:10px" placeholder="请输入" v-model="form.addMoney"
                      @input="input_price($event,'addMoney','form')"
                      @blur="blur_price(form['addMoney'],'addMoney')"></el-input>
            ¥
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item label=" " style="margin-top: 40px">
            <el-button v-hold-click type="primary" @click="submitForm()">仅创建</el-button>
            <el-button v-hold-click type="primary" @click="submitForm('pf')">创建并派发工单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {workOrder, workOrderType, xjType, gzType, deviceList,fdList} from "@/api/order";
import {gettemplate} from "@/api/patrol";
import {mbConfig} from "@/api/orderConfig";
import {page} from "@/api/omp";
import areaSelect from "@/components/custom/areaSelectCode";
import {} from "@/utils/dict";
import {deepClone, priceInput} from "@/utils";
import {ispPage} from "@/api/isp";

import store from "@/store";

export default {
  components: {
    areaSelect,
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
      let {orderExecuteEndTime, orderExecuteStartTime} = this.form;
      if (orderExecuteEndTime && orderExecuteStartTime) {
        callback();
      } else {
        return callback(new Error("请选择工单执行时间"));
      }
    };
    let siteRule = (rule, value, callback) => {
      let {siteInfoId, lat, lng} = this.form;
      if (siteInfoId && lat && lng) {
        callback();
      } else {
        return callback(new Error("请选择所属站点"));
      }
    };
    return {
      title: "",
      titleTips: "",
      loading: false,
      id: '',
      isEcho: false, //isEcho是否回显

      orderTypeList: [],
      xjTypeList: [],
      sbTypeList: [],
      gzTypeList: [],
      zdTypeList: [],
      siteList: [],
      mbList: [],
      userList: [],
      userLoading: false,


      // 携带参数跳转之后禁用对应的选项
      workOrderTypeIdDisabled: false,
      operatorIdDisabled: false,
      siteDisabled: false,
      distDisabled: false,
      form: {
        createWay: 1,
        province: undefined,
        city: undefined,
        county: undefined,
        siteInfoId: undefined,
        lng: undefined,
        site: undefined,
        lat: undefined,
        resourceType: 1
      },
      rules: {
        workOrderTypeId: [{required: true, message: "请选择工单类型", trigger: "blur"}],
        resourceType: [{required: true, message: "请选择业务类型"}],
        dist: [{required: true, validator: areaRule, trigger: "change"}],
        timeArr: [{required: true, validator: timeRule, trigger: "change"}],
        site: [{required: true, validator: siteRule, trigger: "change"}],
        orderUrgency: [{required: true, message: "请选择工单紧急程度", trigger: "change"}],
        deliveryOrder: [{required: true, message: "请选择派单模式", trigger: "change"}],
        workOrderTypeDetailsId: [{required: true, message: "请选择巡检类型", trigger: "change"}],
        deviceInfoId: [{required: true, message: "请选择所属设备", trigger: "change"}],
        deviceFaultInfoId: [{required: true, message: "请选择故障类型", trigger: "change"}],
        templateId: [{required: true, message: "请选择模版", trigger: "change"}],

        siteType: [{required: true, message: "请选择所属站点", trigger: "change"}],
        workPrice: [{required: true, message: "请输入预计工单费用", trigger: "blur"}],
        // addMoney: [{required: true, message: "请输入附加费", trigger: "blur"}],
        operatorId: [{required: true, message: "请选择运营商", trigger: "blur"}],
      },
      isp_list: [],
      businessType: [
        {
          value: 1,
          label: '基站'
        },
        {
          value: 2,
          label: '摄像头',
          disabled: true
        }
      ]
    };
  },
  mixins: [basic],
  created() {

    const province = this.getRouterValue('province');
    const city = this.getRouterValue('city');
    const area = this.getRouterValue('area');
    if (province) {
      this.$set(this.form, 'province', province)
    }
    if (city) {
      this.$set(this.form, 'city', city)
    }
    if (area) {
      this.$set(this.form, 'area', area)
    }
    this.isEcho = !!(province && area && city);

    const id = this.getRouterValue('id')
    if (id) {
      this.id = id
      this.title = "编辑新工单";
      this.titleTips = "动环系统接入前，需要手动创建工单";
      this.loader_order_info()
    } else {
      this.title = "创建新工单";
      this.titleTips = "动环系统接入前，需要手动创建工单";
    }
  },
  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.$refs.orderCreate.scrollTop = 0;
    });
    that.initer();
    that.loader_isp()
  },
  methods: {
    getRouterValue(key) {
      return this.$route.query?.[key]
    },
    back() {
      this.$router.go(-1);
    },
    initer: function () {
      let that = this;
      // 运营商数据
      that.loader_isp()
      that.loader_orderType();
      that.loader_xjtype();
      that.loader_sbtype();
      that.loader_gztype();
      that.loader_user();
    },
		loader_isp:function(){
			var that = this
			ispPage({name:'page',method:'get'},{current:1,size:999},{}).then(res=>{
				console.log(res,22222);
				let _list = [],
					_data = res.data.records || []

				_data.map(item=>{
					var json = {
						label:item.companyName,
						value:item.operatorId,
					}
					_list.push(json)
				})
				that.isp_list = _list;
        const operatorId = this.$route.query?.operatorId;
        if (operatorId) {
          this.form.operatorId = Number(operatorId);
        }
			})
		},
    loader_isp: function () {
      var that = this
      ispPage({name: 'page', method: 'get'}, {current: 1, size: 999}, {}).then(res => {

        let _list = [],
            _data = res.data.records || []

        _data.map(item => {
          var json = {
            label: item.companyName,
            value: item.operatorId,
          }
          _list.push(json)
        })
        that.isp_list = _list;
        this.$nextTick(() => {
          const operatorId = that.getRouterValue('operatorId');
          if (operatorId) {
            this.$set(that.form, 'operatorId', +operatorId)
            this.$set(that, 'operatorIdDisabled', true)
          }
        })
      })
    },
    loader_order_info: function () {
      let that = this;
      workOrder({method: "get", name: "detail"}, {id: that.id})
          .then((res) => {
            let {workOrder, siteVo, umsMember} = res.data;
            that.form = workOrder
            that.form.resourceType=1;
            that.site = {
              siteInfoId: workOrder.siteInfoId,
              lat: workOrder.lat,
              lng: workOrder.lng,
            }
            this.isEcho = true
            that.loader_site(workOrder)
            that.changeWorkOrderTypeId(workOrder.workOrderTypeId);
            that.changeXjtype(workOrder.workOrderTypeDetailsId);
          })
          .catch((error) => {
          });
    },
    // 工单类型
    loader_orderType: function () {
      let that = this;
      workOrderType({method: "get", name: "list"})
          .then((res) => {

            that.orderTypeList = res.data.records.map((item) => {
              return {
                label: item.name,
                value: item.id,
              }
            });
            this.$nextTick(() => {
              const workOrderTypeId = +(that.getRouterValue('workOrderTypeId'))
              if (workOrderTypeId) {
                this.$set(that.form, 'workOrderTypeId', workOrderTypeId)
                this.$set(that.form, 'workOrderTypeDetailsId', workOrderTypeId)
                this.$set(that, 'workOrderTypeIdDisabled', true)
                this.changeWorkOrderTypeId(workOrderTypeId) // 手动触发事件
              }
            })
          })
          .catch((error) => {
          });
    },
    // 巡检类型
    loader_xjtype: function () {
      let that = this;
      xjType({method: "get", name: "page"}, {current: 1, size: 999})
          .then((res) => {
            let _list = [];
            res.data.records.map((item) => {
              _list.push({
                ...item,
                label: item.name,
                value: item.id,
              });
            });
            that.xjTypeList = _list;
          })
          .catch((error) => {
          });
    },
    // 模版
    loader_mb: function (searchs) {
      let that = this;
      if(that.form.workOrderTypeId==2){
        gettemplate(searchs)
          .then((res) => {
            let _list = [];
            res.data.records.map((item) => {
              _list.push({
                label: item.name,
                value: item.id,
              });
            });
            that.mbList = _list;
          })
          .catch((error) => {
          });
      }else{
        fdList({current: 1, size: 999, ...searchs})
          .then((res) => {
            let _list = [];
            res.data.records.map((item) => {
              _list.push({
                label: item.name,
                value: item.id,
              });
            });
            that.mbList = _list;
          })
          .catch((error) => {
          });
      }
      
    },
    // 设备
    loader_sbtype: async function (deviceName) {
      let that = this;
      var json = {
        current: 1,
        size: 999,
      };
      if (deviceName) {
        json.deviceName = deviceName;
      }
      await this.deviceListFun(json);
      // sbType({method: "get", name: "page"}, json)
      //     .then((res) => {
      //       let _list = [];
      //       res.data.map((item) => {
      //         _list.push({
      //           label: item.deviceName,
      //           value: item.id,
      //         });
      //       });
      //       that.sbTypeList = _list;
      //       that.$set(that.form, 'deviceInfoId', this.getRouterValue('deviceInfoId')?.split(',')?.map(el => +el)?.filter(el => el) || [])
      //     })
      //     .catch((error) => {
      //     });
    },
    // 故障类型
    loader_gztype: function (nickName) {
      let that = this;
      var json = {
        current: 1,
        size: 999,
      };
      // if (nickName) {
      // 	json.nickName = nickName;
      // }
      gzType({method: "get", name: "page"}, json)
          .then((res) => {
            let _list = [];
            res.data.map((item) => {
              _list.push({
                label: item.faultName,
                value: item.id,
              });
            });
            that.gzTypeList = _list;
          })
          .catch((error) => {
          });
    },
    // 运维人员
    loader_user: function (nickName) {
      let that = this;

      that.userLoading = true;
      var json = {
        current: 1,
        size: 999,
      };
      if (nickName) {
        json.nickName = nickName;
      }
      page({}, json)
          .then((res) => {
            let _list = [];
            res.data.records.map((item) => {
              _list.push({
                label: item.nickName,
                value: item.id,
              });
            });
            that.userList = _list;
            that.userLoading = false;
          })
          .catch((error) => {
          });
    },
    changeWorkOrderTypeId: function (val) {
      let that = this;
      // 1:发电   传参：区域、站点、经纬度、工单紧急程度、派单模式、备注
      // 2:巡检   传参：区域、站点、经纬度、工单紧急程度、派单模式、备注、巡检类型、工单执行时间
      // 3:故障   传参：区域、站点、经纬度、工单紧急程度、派单模式、备注、所属设备、故障类型
    console.log(val);
      that.$delete(that.form, "templateId");

      switch (val) {
        case 1:
          that.$set(that.form, "orderUrgency", "2");
          that.$set(that.form, "deliveryOrder", "1");
          that.$delete(that.form, "workOrderTypeDetailsId"); //巡检类型
          that.$delete(that.form, "timeArr");
          that.$delete(that.form, "orderExecuteEndTime");
          that.$delete(that.form, "orderExecuteStartTime");
          that.loader_mb({orderTypeDetailsId: val})
          break;
        case 2:
          that.$set(that.form, "orderUrgency", "1");
          that.$set(that.form, "deliveryOrder", "1");

          break;
        case 3:
          that.$set(that.form, "orderUrgency", "2");
          that.$set(that.form, "deliveryOrder", "1");
          that.$delete(that.form, "workOrderTypeDetailsId"); //巡检类型
          that.$delete(that.form, "timeArr");
          that.$delete(that.form, "orderExecuteEndTime");
          that.$delete(that.form, "orderExecuteStartTime");
          this.deviceListFun(); // 获取设备列表

          that.loader_mb({orderTypeDetailsId: val})
          break;
      }
      // 重置某个验证
      this.$refs.form.clearValidate(['templateId', 'workOrderTypeDetailsId', 'deviceInfoId'])

    },
    changeTime: function (time) {
      let that = this;

      if (time) {
        that.$set(that.form, "orderExecuteStartTime", time[0]);
        that.$set(that.form, "orderExecuteEndTime", time[1]);
      } else {
        that.$set(that.form, "orderExecuteStartTime", "");
        that.$set(that.form, "orderExecuteEndTime", "");
      }
    },
    changeArea(val, type) {
      let that = this;
      that.$set(that.form, 'siteInfoId', '')
      that.$set(that.form, 'lng', '')
      that.$set(that.form, 'site', '')
      that.$set(that.form, 'lat', '')
      let {province, city, area} = val;

      that.form.province = province;
      that.form.city = city;
      that.form.area = area;

      that.loader_site({...val, type: that.form.workOrderTypeDetailsId});
    },
    loader_site: function (searchs) {
      let that = this;
      if (searchs.type == 3) {
        delete searchs.type
      }
      workOrder({method: "get", name: "areaList"}, {...searchs, tenantId: that.form.operatorId, type: 1})
          .then((res) => {
            let _list = [];
            res.data.map((item) => {
              _list.push({
                label: item.siteName,
                value: {
                  siteInfoId: item.siteId,
                  lat: item.lat,
                  lng: item.lng,
                  siteType: item.siteType,
                  siteType1: item.siteType1,
                  physicsSiteCode: item.physicsSiteCode,
                  isCity: item.isCity,
                },
              });
            });
            that.siteList = _list;
            const siteId = that.getRouterValue('siteId')
            if (siteId) {
              const item = that.siteList?.find(el => el.value.siteInfoId === +siteId)?.value
              if (!item) return false;

              that.$nextTick(() => {
                that.form = {
                  ...that.form,
                  site: item,
                  ...item,

                }
                that.$set(that, 'siteDisabled', true)
                that.$set(that, 'distDisabled', true)
              })

            }
          })
          .catch((error) => {
          });
    },
    changeSite: function (val) {
      this.form = {...this.form, ...val};
      this.loader_price()
      this.deviceListFun()
    },
    // 获取设备列表 选择了基站喝故障=3的时候
    async deviceListFun(json) {
      const {workOrderTypeId, siteId, siteInfoId} = this.form;
      if ((!siteId && !siteInfoId) || workOrderTypeId !== 3) return false;
      const res = await deviceList({siteId: siteId || siteInfoId, ...json});
      this.sbTypeList = res?.data?.map(el => ({...el, label: el.deviceName, value: el.id})).filter(el => el.id) || [];
      this.$set(this.form, 'deviceInfoId', this.getRouterValue('deviceInfoId')?.split(',')?.map(el => +el)?.filter(el => el) || []) // 页面跳转携带的参数
    },
    changeXjtype: function (val) {


      this.$set(this.form, 'isCity', null)
      this.$set(this.form, 'lat', null)
      this.$set(this.form, 'lng', null)
      this.$set(this.form, 'physicsSiteCode', null)
      this.$set(this.form, 'siteInfoId', null)
      this.$set(this.form, 'siteType', null)
      this.$set(this.form, 'siteType1', null)
      this.$set(this.form, 'site', null)


      // 清空模板数据
      this.$set(this.form, 'templateId', null)
      this.mbList = [];


      this.loader_site({
        province: this.form.province, city: this.form.city, area: this.form.area, type: val
      })
      // 请求新的模板
      const orderTypeDetailsId = this.xjTypeList.find(el => el.id === val)?.code;
      console.log(orderTypeDetailsId)
      this.loader_mb(orderTypeDetailsId)
    },
    loader_price: function () {
      var that = this

      workOrder({method: "get", name: "predictMoney"}, {
        siteType: that.form.siteType1,
        isCity: that.form.isCity
      }, {}).then((res) => {
        that.$set(that.form, 'predictMoney', res.data.workUser)
        that.$set(that.form, 'workPrice', res.data.workUser)
        that.$set(that.form, 'operatorPrice', res.data.operator)
      });
    },
    input_price: function (value, type) {
      let that = this
      that.$set(that.form, type, priceInput(value))
    },
    blur_price: function (value, type) {
      let that = this

      that.$set(that.form, type, Number(priceInput(value)))
    },

    submitForm: function (type) {
      let that = this;
      that.$refs.form.validate((valid) => {
        if (valid) {
          const {deviceInfoId = [], operatorId, ...rest} = that.form
          const _post = {
            ...deepClone(rest),
            deviceInfoId: deviceInfoId?.toString(),
            tenantId: operatorId
          };
          // that.$delete(_post, "site");
          // _post.deviceInfoId = that.form.deviceInfoId?.toString()
          // _post.tenantId = that.form.operatorId
          // 				抢单  					派单
          // 仅创建		isSendOrder=0			isSendOrder=0
          // 				workOrderStatus=0		workOrderStatus=2

          // 创建并派单	isSendOrder = 1			isSendOrder=1
          // 				workOrderStatus=1		workOrderStatus=2
          // 				deliveryOrderWay=1		deliveryOrderWay=1
          // 抢单模式
          if (_post.deliveryOrder == "1") {
            if (type) {
              _post.isSendOrder = 1
              _post.workOrderStatus = 1
              _post.deliveryOrderWay = 1
            } else {
              _post.isSendOrder = 0
              _post.workOrderStatus = 0
            }
          }
          // 自动指派、手动指派
          else {
            if (type) {
              _post.isSendOrder = 1
              _post.workOrderStatus = 2
              _post.deliveryOrderWay = 1
            } else {
              _post.isSendOrder = 0
              _post.workOrderStatus = 2
            }
          }

          workOrder({method: "post", name: "createWorkOrder"}, {}, _post).then((res) => {
            that.$message({
              type: "success",
              message: res.msg,
            });
            that.back();
          });
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

.header_box {
  background: #ffffff;
  margin: -20px;
  padding: 20px;

  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .back_box {
  }
}

.form_box {
  background-color: #ffffff;
  margin-top: 40px;
  border-radius: 4px;

  .el-form {
    width: 50%;
    min-width: 450px;
    min-height: 800px;
    margin: 0 auto;
    padding-top: 40px;
  }
}
</style>
