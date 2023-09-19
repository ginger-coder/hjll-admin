<template>
  <div class="disp_flex flex_column orderApprovalList">
    <el-card shadow="hover" :body-style="{padding: 10}">
      <el-form inline
               :model="form"
               label-width="100px"
               class="form m-form" ref="form">
        <div class="flex">
          <el-form-item label="计划编号:">
            <el-input placeholder="请输入计划编号" v-model="form.serialNumber"/>
          </el-form-item>
          <el-form-item label="巡检类型:">
            <el-select filterable clearable v-model="form.inspectionCode">
              <el-option v-for="item in orderTypeList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="计划状态:">
              <el-select v-model="form.auditStatus" clearable>
								<el-option v-for="item in stateDataList" :key="'auditStatus' + item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
          </el-form-item>
          <el-form-item label="业务类型:">
            <el-select v-model="form.resourceType" clearable>
							<el-option v-for="item in orderResourceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
          </el-form-item>
          <el-form-item label="所属区域:">
            <areaSelect ref="areaSelect" @change="areaSelectChange($event, 'form')"
                        :value="regionList" :ismultiple="true" :isCollapse="true"/>
          </el-form-item>
          <el-form-item label="创建时间:">
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
          <div class="disp_flex" style="margin-left: 20px;">
            <el-button type="primary" native-type="submit" @click="submitForm">搜索</el-button>
            <el-button  v-hold-click native-type="submit" @click="resetForm">重置</el-button>
            <el-button type="primary"  v-hold-click @click="jump('/order/createWorkOrder?type=patrol')" plain>新增巡检计划</el-button>
          </div>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card shadow="hover" class="flex mt-space table-card" :body-style="{height: '100%', paddingBottom: 0}">
      <m-table height="100%" :columns="columns" :request="getTableData"  :payload="form" :loading.sync="loading" ref="table">
        <el-table-column slot="index" label="序号">
					<template slot-scope="scope">
					{{ scope.$index+1+($refs.table.current-1)*$refs.table.size }}
					</template>
				</el-table-column>
        <el-table-column slot="auditStatusName" label="审批状态">
					<template  v-slot="{ row }">
            <span class="auditStatusColor" style="background-color: #5674E5;" v-if="row.auditStatusName=='未提交'"></span>
            <span class="auditStatusColor" style="background-color: #FFBF00;" v-else-if="row.auditStatusName=='审核中'"></span>
            <span class="auditStatusColor" style="background-color: #22BBF5;" v-else-if="row.auditStatusName=='已派单'"></span>
            <span class="auditStatusColor" style="background-color: #9B00FF;" v-else-if="row.auditStatusName=='已接单'"></span>
            <span class="auditStatusColor" style="background-color: #52C41A;" v-else-if="row.auditStatusName=='已回单'||row.auditStatusName=='已通过审核'"></span>
            <span class="auditStatusColor" style="background-color: #F5222D;" v-else-if="row.auditStatusName=='未通过审核'"></span>
            <span class="auditStatusColor" style="background-color: #BFBFBF;" v-else></span>
            <span>{{ row.auditStatusName }}</span>
					</template>
				</el-table-column>
        <el-table-column slot="Action" label="操作" width="150">
					<template v-slot="{ row }">
						<el-button type="text" v-hold-click @click.stop="doCommand('info', row)" v-if="row.auditStatus !== 0"> 详情 </el-button>
						<el-button type="text" v-hold-click @click.stop="doCommand('edit', row)" v-if="row.auditStatus === 0||row.auditStatus === 2"> 编辑 </el-button>
						<el-button type="text" v-hold-click @click.stop="doCommand('sign', row)" v-if="row.auditStatus === 0"> 提交 </el-button>
						<el-button type="text" v-hold-click @click.stop="doCommand('delete', row)" v-if="row.auditStatus === 0||row.auditStatus === 2"> 删除 </el-button>
					</template>
				</el-table-column>
      </m-table>
    </el-card>
  </div>
</template>

<script>
import mTable from "@c/business/table";
import areaSelect from "@/components/custom/areaSelectAll";
import {getTableData,updateStatusPollingPlan,deletePollingPlan} from './api'
import { workOrderType, workOrderArea } from "@/api/order";
import { getDictTypesItem } from "@/api/dict";
import basic from "@/mixins/basic";
export default {
  name: "patrolSchemeList",
  components: {mTable, areaSelect},
  mixins: [basic],
  data() {
    return {
      form: {},
      orderTypeList: [], // 工单类型
      ispList: [], // 客户|运营商
      stateDataList: [{
          label:'未提交',
          value:0
        },{
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
      columns: [
        {label: '序号', slot: 'index', width: 60},
        {label: '业务类型', prop: 'resourceTypeName'},
        {label: '巡检类型', prop: 'workOrderName'},
        {label: '计划编号', prop: 'serialNumber', width: 180},
        {label: '计划名称', prop: 'planName'},
        {label: '所属区域', prop: 'regionName', width: 180},
        {label: '巡检项目', prop: 'itemName'},
        {label: '实施周期', prop: 'concatTime'},
        {label: '创建时间', prop: 'createTime'},
        {label: '审批状态', slot: 'auditStatusName'},
        {label: '操作', slot: 'Action'},
      ],
      createTime:[],
      form:{},
      loading:false,
      regionList:[]
    }
  },
  mounted() {
    this.loader_orderType();
    this.getInitPage();
  },
  methods: {
    getTableData,
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
          this.$refs.table?.resetInit();
        }
      });
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
    areaSelectChange(val, type) {
			let that = this;
      let array=[];
      val.map(item=>{
        array.push({"province": item[0],"city": item[1],"area": item[2]})
      })
      that.regionList=val;
      that[type].regionString=JSON.stringify(array);
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
    doCommand(command, row) {
			switch (command) {
				case "info":
					this.jump(`/order/patrolSchemeDetails?type=patrol&id=${row.id}&state=true&approvalState=false`);
					break;
				case "edit":
					//编辑 
					this.jump(`/order/createWorkOrder?type=patrol&id=${row.id}`);
					break;
				case "sign":
					// 提交
					this.changeOrderStatus(row,'1')
					break;
				case "delete":
					this.removeOrder(row)
					break;
			}
		},
    changeOrderStatus: function (row, status) {
			let that = this;
			let _post = {id:row.id}
			switch (status) {
				// 派发
				case "1":
					_post.auditStatus = 1;
					break;
			}
			this.$confirm('是否将本工单直接提交审批', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				customClass:'del-model',
				type: 'warning'
			}).then(() => {
				updateStatusPollingPlan({ method: "post" }, {}, _post).then((res) => {
					that.$refs.table.resetInit();
				});
			}).catch(() => {
				this.$message({
				type: 'info',
				message: '已取消'
				});          
			});
		},
    removeOrder:function(row){
      console.log(row)
			var that = this
      this.$confirm('是否将本工单删除？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				customClass:'del-model',
				type: 'warning'
			}).then(() => {
          deletePollingPlan(row.id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            that.$refs.table.resetInit();
          });
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

.orderApprovalList {
  height: 100%;

  .form {
    margin-top: 16px;
  }
}

.mt-space {
  margin-top: 24px;
}
.auditStatusColor{
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
  display: inline-block;
}
</style>
