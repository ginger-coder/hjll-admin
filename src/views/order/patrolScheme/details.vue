<template>
  <div class="orderApprovalListDetails">
    <el-card shadow="hover">
      <div slot="header" class="disp_flex ali_cen">
        <span class="h3"  style="margin-right: 24px">巡检计划详情</span>
        <div style="flex:1;text-align: right;">
          <el-button type="primary" @click="toApproval(orderApprovalDetail,'3')" v-if="orderApprovalDetail.auditStatus==1&&approvalState">通过</el-button>
          <el-button type="danger" @click="toApproval(orderApprovalDetail,'2')" v-if="orderApprovalDetail.auditStatus==1&&approvalState">驳回</el-button>
          <el-button type="info" plain @click="toBack">关闭</el-button>
        </div>
      </div>
     <div class="disp_flex ju_bet" v-loading="loading">
        <el-descriptions class="business-descriptions flex" :column="1" style="margin-left: 50px;">
         <el-descriptions-item label="计划名称">{{ orderApprovalDetail.planName||'-' }}</el-descriptions-item>
         <el-descriptions-item label="实施周期">{{ orderApprovalDetail.executeStartTime+'-'+orderApprovalDetail.executeEndTime||'-' }}</el-descriptions-item>
         <el-descriptions-item label="业务类型">{{ orderApprovalDetail.resourceTypeName||'-' }}</el-descriptions-item>
         <el-descriptions-item label="巡检类型">{{ orderApprovalDetail.workOrderName||'-' }}</el-descriptions-item>
         <el-descriptions-item label="所属区域">{{ orderApprovalDetail.regionName||'-'}}</el-descriptions-item>
         <el-descriptions-item label="所属站点">{{ orderApprovalDetail.siteName||'-' }}</el-descriptions-item>
         <el-descriptions-item label="工单派发时间">{{ orderApprovalDetail.deliveryOrderTime||'-' }}</el-descriptions-item>
         <el-descriptions-item label="预估费用">{{ orderApprovalDetail.predictMoney||'-' }}</el-descriptions-item>
         <el-descriptions-item label="工单内容">
          <treeModles :editState="editState" :moduleList="moduleList" ></treeModles>
         </el-descriptions-item>
         <el-descriptions-item label="工单备注">
          {{ orderApprovalDetail.remark||'-' }}
         </el-descriptions-item>
        </el-descriptions>
        <div style="height: 300px;margin-right: 200px;">
          <el-steps :space="100" class="flex" direction="vertical" :active="active">
            <el-step title="填报巡检工单" :description="'(提交人：'+(orderApprovalDetail.createUserName?orderApprovalDetail.createUserName:'- ')+')'"></el-step>
            <el-step title="巡检计划审核"  v-slot:description>
              <template>
              <div>{{ '(审核人：'+(orderApprovalDetail.updateUserName?orderApprovalDetail.updateUserName:'- ')+')' }}</div>
              <div>{{ orderApprovalDetail.rejectionNote?'驳回原因：'+orderApprovalDetail.rejectionNote:'' }}</div>
              </template>
            </el-step>
            <el-step title="巡检计划派发" :description="'(派发人：'+(orderApprovalDetail.dispatchName?orderApprovalDetail.dispatchName:'- ')+')'"></el-step>
          </el-steps>
        </div>
     </div>
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
import {getPollingPlanDetail,processPollingPlan} from "../api";
import treeModles from "../../../components/treeModles.vue";
import { getModuleList} from "@/api/order";
export default {
  name: "orderApprovalListDetails",
  components: {
    treeModles
  },
  data() {
    return {
      orderApprovalDetail:{},
      editState:false,
      moduleList:[],
      loading:false,
      centerDialogVisible:false,
      form2:{},
      rules: {
          rejectionNote: [
            { required: true, message: '请输入备注', trigger: 'blur' },
          ],
      },
      active:1,
      approvalState:true
    }
  },
  created() {
    let id=this.getRouterValue('id');
    let approvalState=this.getRouterValue('approvalState');
    if(approvalState) this.approvalState=approvalState;
    this.getDetails(id);
  },
  methods: {
    getRouterValue(key) {
      return this.$route.query?.[key]
    },
    toBack() {
      this.$router.go(-1);
    },
    getDetails(id){
      getPollingPlanDetail(id).then(res=>{
        if(res.code==0){
            this.orderApprovalDetail=res.data;
            if(res.data.auditStatus==3){
              this.active=2
            }else if(res.data.auditStatus==4){
              this.active=3
            }
            this.loader_getModuleList('','',this.orderApprovalDetail.inspectionCode);
        }
      })
    },
    rightBtn(formName){
      this.$refs[formName].validate((valid) => {
          if(valid){
            processPollingPlan({method: "post"},{},this.form2).then(res=>{
              if(res.code==0){
                this.toBack();
                this.centerDialogVisible=false;
              }
            })
          }
      });
    },
    // 模块类型
    loader_getModuleList: function (orderType,orderModuleName,orderSecondTypeCode) {
      let that=this;
      var json = {
        orderModuleName: orderModuleName,
        orderType: orderType,
        orderSecondType:orderSecondTypeCode,
      };
      getModuleList({method: "post", name: "getModuleList"}, json)
          .then((res) => {
            that.moduleList=res.data;
            let _array=[];
            that.moduleList.map(function(item){
              let itemsArray=that.orderApprovalDetail.pollingOrderVOList.filter(items=>items.id==item.id).length>0?that.orderApprovalDetail.pollingOrderVOList.filter(items=>items.id==item.id):[];
              _array.push({
                ...item,
                checkedData:itemsArray.length>0?itemsArray:[],
                checkedArr:itemsArray.length>0?itemsArray[0].itemList.split(','):[]
              })
            })
            that.moduleList=_array;
            that.loading=false;
          })
          .catch((error) => {
          });
    },
    toApproval(row,state){
      this.$confirm(state==3?'请确认是否通过该计划?':'请确认是否驳回该工单？', '提示', {
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
            processPollingPlan({method: "post"},{},json).then(res=>{
              if(res.code==0){
                this.toBack();
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

<style scoped lang="scss">
.orderApprovalListDetails {
  .h3 {
    font-size: 18px;
    font-weight: bold;
  }
}
::v-deep .textarea textarea{
  resize: none!important;
  width: 300px;
}
.business-descriptions {
  font-size: 16px;
  ::v-deep .el-descriptions--medium:not(.is-bordered) .el-descriptions-item__cell {
    padding-bottom: 20px;
  }
}

</style>

