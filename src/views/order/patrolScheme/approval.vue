<template>
  <div class="disp_flex flex_column patrolSchemeApproval">
    <el-card shadow="hover" :body-style="{padding: 10}">
      <el-form inline
               :model="form"
               label-width="100px"
               class="form m-form" ref="form">
        <div class="flex">
          <el-form-item label="计划编号：">
            <el-input placeholder="请输入计划编号" v-model="form.serialNumber"/>
          </el-form-item>
          <el-form-item label="业务类型：">
            <el-select v-model="form.resourceType" clearable>
              <el-option v-for="item in orderResourceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
          </el-form-item>
          <el-form-item label="巡检类型：">
            <el-select filterable clearable v-model="form.inspectionCode">
              <el-option v-for="item in orderTypeList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域：">
            <areaSelect ref="areaSelect" :ismultiple="true" :isCollapse="true" :value="regionList" @change="areaSelectChange($event, 'form')"/>
          </el-form-item>
          <el-form-item label="审批状态：">
            <el-select v-model="form.auditStatus" clearable>
								<el-option v-for="item in stateData" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker
                v-model="createTime"
                type="datetimerange"
                @change="changeTime($event, 'form')"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
          </el-form-item>
        </div>
        <el-form-item>
          <div class="disp_flex"  style="margin-left: 20px;">
            <el-button type="primary" native-type="submit" @click="submitForm">搜索</el-button>
            <el-button  v-hold-click native-type="submit" @click="resetForm">重置</el-button>
          </div>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card shadow="hover" class="flex mt-space table-card" :body-style="{height: '100%', paddingBottom: 0}">
      <m-table height="100%" :columns="columns" :request="getApproveTableData" :payload="form" :loading.sync="loading" ref="table">
        <el-table-column slot="index" label="序号">
					<template slot-scope="scope">
					{{ scope.$index+1+($refs.table.current-1)*$refs.table.size }}
					</template>
				</el-table-column>
        <el-table-column slot="auditStatusName" label="审批状态">
					<template  v-slot="{ row }">
            <span class="auditStatusColor" style="background-color: #FFBF00;" v-if="row.auditStatusName=='审核中'"></span>
            <span class="auditStatusColor" style="background-color: #52C41A;" v-else-if="row.auditStatusName=='已通过审核'"></span>
            <span class="auditStatusColor" style="background-color: #F5222D;" v-else-if="row.auditStatusName=='未通过审核'"></span>
            <span class="auditStatusColor" style="background-color: #BFBFBF;" v-else></span>
            <span>{{ row.auditStatusName }}</span>
					</template>
				</el-table-column>
        <el-table-column slot="Action" label="操作" width="160">
          <template slot-scope="{ row }">
            <el-button  type="text" @click="toPage(row)">详情</el-button>
            <el-button  type="text" @click="toApproval(row,3)" v-if="row.auditStatus==1">通过</el-button>
            <el-button  type="text" @click="toApproval(row,2)" v-if="row.auditStatus==1">驳回</el-button>
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
import { workOrderType } from "@/api/order";
import {getApproveTableData,processPollingPlan} from './api'
import { getDictTypesItem } from "@/api/dict";
export default {
  name: "patrolSchemeApproval",
  components: {mTable, areaSelect},
  data() {
    return {
      form: {
        province: undefined,
        city: undefined,
        area: undefined
      },
      columns: [
        {label: '序号',  slot: 'index', width: 60},
        {label: '业务类型', prop: 'resourceTypeName'},
        {label: '巡检类型', prop: 'workOrderName'},
        {label: '计划编号', prop: 'serialNumber', width: 180},
        {label: '计划名称', prop: 'planName'},
        {label: '所属区域', prop: 'regionName', width: 180},
        {label: '巡检项目', prop: 'itemName'},
        {label: '实施周期', prop: 'concatTime'},
        {label: '剩余时间', prop: 'remainingTime'},
        {label: '提交时间', prop: 'submitTime'},
        {label: '审批状态', slot: 'auditStatusName'},
        {label: '操作', slot: 'Action'},
      ],
      stateData:[{
        //   label:'未提交',
        //   value:0
        // },{
          label:'审核中',
          value:1
        },{
          label:'未通过审核',
          value:2
        },{
          label:'已通过审核',
          value:3
        },{
          label:'已生成工单',
          value:4
        },{
          label:'已过期',
          value:5
      }],
      orderResourceTypeList:[],
      createTime:[],
      orderTypeList:[],
      form:{},
      loading:false,
      regionList:[],
      centerDialogVisible:false,
      form2:{},
      deliveryOrderTime:[],
      receiptTime:[],
      rules: {
          rejectionNote: [
            { required: true, message: '请输入备注', trigger: 'blur' },
          ],
      }
    }
  },
  mounted() {
    this.loader_orderType();
    this.getInitPage();
  },
  methods: {
    getApproveTableData,
    getInitPage(){
			var that = this;
			// 业务类型
			getDictTypesItem({name:'order_resource_type',method:'get'}).then(res=>{
				if(res.code=='0'){
					that.orderResourceTypeList = res.data|| [];
				}	
			})
		},
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          console.log('Form validation failed');
          return false;
        }else{
          this.$refs.table.resetInit();
        }
      });
    },
    areaSelectChange(val, type) {
			let that = this;
      let array=[];
      val.map(item=>{
        array.push({"province": item[0],"city": item[1],"area": item[2]})
      })
      that.regionList=val;
      that[type].regionString=JSON.stringify(array);
		},
    resetForm() {
      this.form = {};
      this.createTime=[];
      this.regionList=[];
      this.$refs.form.resetFields();
      this.$nextTick(() => {
				this.$refs.table.resetInit();
			})
    },
    // 工单类型
		loader_orderType: function () {
			let that = this;
			workOrderType({ method: "get", name: "getAllWorkOrderType" })
				.then((res) => {
					let _list = [];
					res.data.map((item) => {
            if(item.name=='巡检'){
                item.orderTypeDetailList.map((items) => {
                  _list.push({
                    label: items.name,
                    value: items.code,
                  });
                })
            }
					});
					that.orderTypeList = _list;
				})
				.catch((error) => {});
		},
    changeTime(val, type){
			let that = this;
			that.createTime=val;
			if(val==null){
				delete that[type].startTime;
				delete that[type].endTime;
			}else{
				that[type].startTime = val[0];
				that[type].endTime = val[1];
			}
		},
    toPage(row){
        this.$router.push({
            path:"/order/patrolSchemeDetails",
            query:{
            	id:row.id,
              state:true
            }
        })
    },
    rightBtn(formName){
      this.$refs[formName].validate((valid) => {
          if(valid){
            processPollingPlan({ method: "post" }, {},this.form2).then(res=>{
              if(res.code==0){
                this.$refs.table?.resetInit();
                this.centerDialogVisible=false;
              }
            })
          }
      });
    },    
    toApproval(row,state){
      this.$confirm(state==3?'请确认是否通过该回单?':'请确认是否驳回该工单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass:'del-model',
        type: 'warning'
      }).then(() => {
          if(state==3){
            let json={
              id:row.id,
              auditStatus:state
            };
            processPollingPlan({ method: "post" }, {},json).then(res=>{
              if(res.code==0){
                this.$refs.table?.resetInit();
              }
            })
          }else{
              this.form2={
                id:row.id,
                auditStatus:state
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
  }
}
</script>

<style lang="scss" scoped>
.m-form {
  ::v-deep {
    .el-select .el-input__inner, .el-input .el-input__inner,
    .el-input--suffix .el-input__inner, .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 248px;
    }
  }
}

.patrolSchemeApproval {
  height: 100%;

  .form {
    margin-top: 16px;
  }
}

.mt-space {
  margin-top: 24px;
}
::v-deep .textarea textarea{
  resize: none!important;
  width: 300px;
}
.auditStatusColor{
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
  display: inline-block;
}
</style>
