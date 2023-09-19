<template>
  <div class="disp_flex flex_column orderApprovalList">
    <el-card shadow="hover" :body-style="{padding: 10}">
      <el-form inline
               :model="form"
               ref="form"
               label-width="100px"
               class="form business-form">
        <div class="flex">
          <el-form-item label="工单编号">
            <el-input placeholder="请输入工单编号" v-model="form.serialNumber"/>
          </el-form-item>
          <el-form-item label="工单类型">
            <el-select filterable clearable v-model="form.orderTypeCode">
              <el-option v-for="item in orderTypeList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="审批状态">
            <el-select v-model="form.workOrderStatus" placeholder="请选择审批状态">
              <el-option label="待审批" :value="21"></el-option>
							<el-option label="已通过" :value="30"></el-option>
							<el-option label="未通过" :value="22"></el-option>
							<el-option label="已过期" :value="24"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建方式">
            <el-select v-model="form.createWay" clearable>
              <el-option v-for="item in createWayList" :key=" item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
          </el-form-item>
          <el-form-item label="业务类型">
            <el-select v-model="form.resourceType" clearable >
              <el-option v-for="item in orderResourceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
          </el-form-item>
          <el-form-item label="运营商">
            <el-select v-model="form.operatorId"
                       clearable filterable>
              <el-option v-for="item in ispList" :key="'isp' + item.value" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域">
            <areaSelect ref="areaSelect" @change="areaSelectChange($event, 'form')"
                        :value="[form.province, form.city, form.area]"/>
          </el-form-item>
          <el-form-item label="站     点">
            <el-select v-model="form.siteInfoId"
                       placeholder="请选择站点"
                       value-key="siteInfoId"
                       @change="siteChange"
                       filterable>
              <el-option v-for="item in siteList" :label="item.label" :value="item.value" :key="'siteId' + item.value"> 
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="紧急程度">
            <el-select v-model="form.orderUrgency" clearable placeholder="请选择工单类型">
							<el-option label="紧急" :value="2"></el-option>
							<el-option label="正常" :value="1"></el-option>
						</el-select>
          </el-form-item>

          <el-form-item label="提交时间">
            <el-date-picker
							v-model="receiptTime"
							type="datetimerange"
							@change="changeTime"
							range-separator="至"
							value-format="yyyy-MM-dd HH:mm:ss"
							:clearable="false"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
          </el-form-item>
        </div>
        <el-form-item>
          <div class="disp_flex" style="margin-left: 32px;">
            <el-button type="primary" native-type="submit" @click="submitForm('form')">搜索</el-button>
            <el-button  v-hold-click native-type="submit" @click="resetForm('form')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card shadow="hover" class="flex mt-space table-card" :body-style="{height: '100%', paddingBottom: 0}">
      <m-table height="100%" :columns="columns"  :request="getTableData" :payload="form" :loading.sync="loading" ref="table">
        <el-table-column slot="index" label="序号">
            <template slot-scope="scope">
              {{ scope.$index+1+($refs.table.current-1)*$refs.table.size }}
            </template>
        </el-table-column>
        <el-table-column slot="areaName" label="所属区域">
            <template slot-scope="{ row }">
              {{row.provinceName+row.cityName+row.areaName || "-" }}
            </template>
        </el-table-column>
        <el-table-column slot="workOrderStatusName" label="审批状态">
					<template  v-slot="{ row }">
            <span class="auditStatusColor" style="background-color: #FFBF00;" v-if="row.workOrderStatusName=='待审批'"></span>
            <span class="auditStatusColor" style="background-color: #52C41A;" v-else-if="row.workOrderStatusName=='已通过'"></span>
            <span class="auditStatusColor" style="background-color: #F5222D;" v-else-if="row.workOrderStatusName=='未通过'"></span>
            <span class="auditStatusColor" style="background-color: #BFBFBF;" v-else></span>
            <span>{{ row.workOrderStatusName }}</span>
					</template>
				</el-table-column>
        <el-table-column slot="Action" label="操作" width="160">
          <template slot-scope="{ row }">
            <el-button  type="text" @click="toPage(row)">详情</el-button>
            <el-button  type="text" @click="toApproval(row,'1')" v-if="row.workOrderStatus==21">通过</el-button>
            <el-button  type="text" @click="toApproval(row,'22')" v-if="row.workOrderStatus==21">驳回</el-button>
          </template>
        </el-table-column>
      </m-table>
    </el-card>
    <el-dialog
      title="驳回"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-form inline
                :model="form2"
                ref="form2"
                label-width="100px"
                :rules="rules">
        <el-form-item label="备注"  prop="rejectionNote">
          <el-input placeholder="请输入备注" v-model="form2.rejectionNote" type="textarea" class="textarea" maxlength="200"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="rightBtn('form2')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import mTable from "@c/business/table";
import areaSelect from "@/components/custom/areaSelectAll";
import {workOrderType, workOrder,workOrderArea} from '@/api/order'
import {ispPage} from "@/api/isp";
import {getTableData,update} from "../api";
import { getDictTypesItem } from "@/api/dict";
export default {
  name: "orderApprovalList",
  components: {mTable, areaSelect},
  data() {
    return {
      form: {},
      orderTypeList: [], // 工单类型
      ispList: [], // 客户|运营商
      siteList: [], // 站点
      orderUrgencyList: [],
      createWayList: [], 
      loading: false,
      columns: [
        {label: '序号', slot: 'index', width: 60},
        {label: '业务类型', prop: 'resourceTypeName'},
        {label: '巡检类型', prop: 'orderTypeName'},
        {label: '工单编号', prop: 'serialNumber', width: 180},
        {label: '所属区域', slot: 'areaName', width: 180},
        {label: '站点', prop: 'siteName', width: 180},
        {label: '审批状态', slot: 'workOrderStatusName'},
        {label: '紧急程度', prop: 'orderUrgencyName'},
        {label: '剩余时间', prop: 'remainingTime'},
        {label: '提交时间', prop: 'submitTime'},
        {label: '操作', slot: 'Action'}
      ],
      centerDialogVisible:false,
      form2:{

      },
      receiptTime:[],
      rules: {
          rejectionNote: [
            { required: true, message: '请输入备注', trigger: 'blur' },
          ],
      }
    }
  },
  created() {
    this.workOrderTypeFun();
    this.loader_isp();
    this.getInitPage();
  },
  methods: {
    getTableData,
    getInitPage(){
			var that = this;
			// 创建方式
			getDictTypesItem({name:'create_way',method:'get'}).then(res=>{
				if(res.code=='0'){
					that.createWayList = res.data|| [];
				}	
			})
			// 工单类型
			getDictTypesItem({name:'order_type',method:'get'}).then(res=>{
				if(res.code=='0'){
					that.orderTypeList = res.data|| [];
				}	
			})
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
    resetForm() {
      this.form = {};
      this.receiptTime=[],
      this.siteList=[],
      this.$refs.form.resetFields();
      this.$nextTick(() => {
        this.$refs.table.resetInit();
      })
    },
    changeTime(val){
      this.form.startDate=val[0];
      this.form.closeDate=val[1];
    },
    workOrderTypeFun() {
      workOrderType({method: "get", name: "getAllWorkOrderType"})
          .then((res) => {
            this.orderTypeList = res?.data?.map((item) => {
              return {
                label: item.name,
							  value: item.code,
              }
            });
          })
          .catch((error) => {
          });
    },
    async loader_isp() {
      const res = await ispPage({name: 'page', method: 'get'}, {current: 1, size: 999}, {})
      this.ispList = res?.data?.records?.map(item => {
        return {
          ...item,
          label: item.companyName,
          value: item.operatorId,
        }
      }) || []
    },
    toApproval(row,state){
      this.$confirm(state==1?'请确认是否通过该计划?':'请确认是否驳回该工单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass:'del-model',
        type: 'warning'
      }).then(() => {
          if(state==1){
            let json={
              id:row.id,
              workOrderStatus:state
            };
            update(json).then(res=>{
              if(res.code==0){
                this.$refs.table?.resetInit();
              }
            })
          }else{
              this.form2={
                id:row.id,
                workOrderStatus:state
              }
              this.centerDialogVisible=true;
          }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
      
    },
    toPage(row){
        this.$router.push({
            path:"/order/orderApprovalDetails",
            query:{
            	id:row.id
            }
        })
    },
    rightBtn(formName){
      this.$refs[formName].validate((valid) => {
          if(valid){
            update(this.form2).then(res=>{
              if(res.code==0){
                this.$refs.table?.resetInit();
                this.centerDialogVisible=false;
              }
            })
          }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.$refs.table?.resetInit();
      });
    },
    areaSelectChange(val) {
      const {province, city, area} = val;
      this.form.province = province;
      this.form.city = city;
      this.form.area = area;
      this.loader_site({...val, type: this.form.workOrderTypeDetailsId});
    },
    async loader_site(payload) {

      if (payload.type == 3) {
        delete payload.type
      }
      const res = await workOrderArea({method: "post", name: "areaList"}, {
        regionList:[payload],
        tenantId: this.form.operatorId,
        type: payload.type || 1
      })
      this.siteList = res?.data?.map((item) => {
        return {
          label: item.siteName,
					value: item.siteId,
        }
      }) || [];
    },
    siteChange(val) {
      console.log(val);
      // 提交的时候要把 form.site 过滤
      this.form = {...this.form, ...val};
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";

.orderApprovalList {
  height: 100%;

  .form {
    margin-top: 16px;
  }
}
::v-deep .textarea textarea{
  resize: none!important;
  width: 300px;
}
</style>
