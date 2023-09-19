<template>
    <div class="app-container check">
        <div class="header_box disp_flex ju_bet ali_cen">
			<div>
				<div class="title">发起结算</div>
			</div>
            <div class="back_box">
                <el-button @click="add">增加收款人</el-button>
            </div>
		</div>
        <div class="container">
            <div class="forms">
                <el-form ref="form"
                class="formModal"
                :model="form"
                :rules="rules"
                >
                <el-form-item label="钱包选择" prop="settlementWalletId">
                    <el-select  v-model="form.settlementWalletId" @change="walletChange" placeholder="请选择">
                        <el-option 
                        v-for="(t, i) in selectKey.wallet"
                        :key="i"
                        :label="t.label"
                        :value="t"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核人员" prop="examinePersonId">
                    <el-select  v-model="form.examinePersonId" @change="roleChange">
                        <el-option 
                        v-for="(t, i) in selectKey.roleList"
                        :key="i"
                        :label="t.label"
                        :value="t"/>
                    </el-select>
                </el-form-item>
                </el-form>
                <p>结算人数：{{grantPersonNum}}</p>
                <p>结算金额：<span v-if="grantMoney">￥</span>{{grantMoney}}</p>
                <p>钱包余额：{{sum}}</p>
                <el-button type="primary" @click="submit('params')">提交结算</el-button>
            </div>
            <div class="table-box">
                <div class="list_title">基本列表</div>
                <publicTable :tableData="tableData" :tagHeight="590" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
                    @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
                </publicTable>
            </div>
        </div>
        <!--选择组-->
        <el-dialog
            :title="group.title"
            destroy-on-close
            class="el-dialog-unify el-dialog-small"
            width="600px"
            v-if="group.visible"
            :visible="group.visible"
            :before-close="groupHandleClose">
            <el-form ref="formModal"
             :model="group.form"
             class="formModal"
             >
                    <el-form-item label="选择业务线" prop="workOrderStatus">
                        <el-select  v-model="group.form.obj" @change="changeData" clearable placeholder="请选择">
                            <el-option 
                            v-for="(t, i) in selectKey.billType"
                            :key="i"
                            :label="t.label"
                            :value="t"/>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="选择工作组" prop="alarmLevel">
                        <el-select  v-model="group.form.groupList" @change="changeGroup" clearable>
                            <el-option 
                                v-for="(t, i) in selectKey.group"
                                :key="i"
                                :label="t.label"
                                :value="t"/>
                        </el-select>
                    </el-form-item>
             </el-form>
             <span slot="footer" class="dialog-footer">
                <el-button @click="group.visible = false">取 消</el-button>
                <el-button type="primary" @click="groupSure">确 定</el-button>
            </span>
        </el-dialog>
        <!--    增加收款人 -->
        <el-dialog
            :title="addType=='1'?'提示':'增加收款人'"
            destroy-on-close
            v-if="addFlag"
            class="el-dialog-unify el-dialog-medium"
            width="1284px"
            :visible="addFlag"
            :before-close="(()=>{addFlag = false})">
            <div class="himt" v-if="addType=='1'">
                <p><i class="el-icon-warning-outline"></i>是否确认仍需要手动介入，增加收款人以发起结算？</p>
                <p>已设定当前小组的结算方式为 <span>周期性结算 / 即时结算</span></p>
            </div>
            <div v-if="addType=='2'">
                <el-form class="popleForm" :model="formData" ref="formRef" :label-width="'120px'" :inline="true">
                    <el-form-item label="">
                        <el-input prefix-icon="el-icon-search"  v-model="filterText" placeholder="搜索员工"></el-input>
                    </el-form-item>
                </el-form>
                <div class="checkboxList">
                    <el-checkbox v-if="!filterText" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <div class="checkboxBox">    
                        <el-checkbox-group ref="tree" v-model="checkedCities" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="item in filteredData" :key="item.userId" :label="item.userId" >{{item.userName}}：{{item.phone}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
             <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="sure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- <Footers/> -->
    </div>
</template>
<script>
import basic from "@/mixins/basic"
import finance from "@/mixins/finance"
import {
  selectKey
} from "@/utils/filterSettle";
import { getBillData,queryUmsProjectGroupList,queryUsersByRole,queryTreatSettlementUserList,queryUnSettledUserPager,singleUserDel,getwallets,queryWalletBalance,postInitiateSettlement,userCheckedDetermine} from "@/api/finance"
import publicTable from "@c/business/tables";
import Footers from "./components/footer"
export default {
    components: {
        publicTable,
        Footers
    },
    data() {
        return {
            checkAll: false,
            objectData:[],
            groupListData:[],
            checkedCities: [],
            cities: [],
            isIndeterminate: false,
            formData:{},
            activeName:'first',
            tableData:[],
            form:{
                data:'',
                name:''
            },
            addType:'1',
            group:{
                title:'请选择业务线及工作组',
                visible:true,
                form:{
                    obj:'',
                    groupList:''
                }
            } ,
            columObj:{
                selection: false,
                selectType:false,
                loading:false,
                columnData: [
                {
                prop: "userName",
                label: "员工姓名",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "project",
                label: "所属业务线",
                text: true,
                editRow: undefined,
                align: "center",
                },
                {
                prop: "group",
                label: "所属工作组",
                text: true,
                width: "",
                align: "center",
                
                },
                {
                prop: "settlementAmount",
                label: "本次结算",
                ownDefined: true,
                width: "",
                align: "center",
                ownDefinedReturn:(row, $index) => {
                    return '￥'+row.settlementAmount
                    
                }
                },
                {
                        isOperation: true,
                        label: "操作",
                        operation: [{
                            operation: "del",
                            type: "text",
                            label: "移除",
                            icon: "",
                            color: '#4365AC',
                            isShow: (row, $index) => {
                                return true
                            }
                        }
                        ]
                    },
                ]
            },
			addFlag:false,
            roleCheck:[],
            selectKey,
            // 结算需要的参数
            params:{
                belongGroup:'',
                belongGroupId:'',
                belongProject:'',
                belongProjectId:'',
                examinePersonId:'',
                examinePersonName:'',
                queryKey:'',
                settlementWallet:'',
                taxRate:'',
            },
            queryKey:'',
            grantMoney:null,
            filterText:'',
            grantPersonNum:null,
            sum:null,
            pageObj: { //分页对象
					position: "right", //分页组件位置
					total: 0,
                    show:true,
					pageData: {
                        queryKey:'',
						currentPage: 1,
						pageSize: 10,
					}
				},
        }
    },
    watch: {
     
    },
    computed: {
        filteredData() {
            if (this.filterText) {
                return this.cities.filter(item =>
                    item.userName.toLowerCase().includes(this.filterText.toLowerCase())
                );
            } else {
                return this.cities;
            }
        }
    },
    mixins: [basic,finance],
    created() {
        this.getGrop()
    },
    mounted() {
        let that = this;
    },
    methods: {
        
        roleChange(val){
            this.params.examinePersonName = val.label
            this.params.examinePersonId = val.value
        },
        walletChange(val){
            this.params.settlementWallet = val.label
            this.params.settlementWalletId = val.value
            queryWalletBalance({walletId:val.value}).then((res)=>{
                if(res.code == 0){
                    this.sum = res.data.walletBalance
                    this.params.taxRate = res.data.taxRate
                }
            })
        },
        groupSure(){
            this.group.visible = false
            this.params.belongGroup = this.group.form.groupList.label
            this.params.belongGroupId = this.group.form.groupList.value
            this.params.belongProject = this.group.form.obj.label
            this.params.belongProjectId = this.group.form.obj.value
            
        },
        changeData(val){
            queryUmsProjectGroupList({parentId:val.value}).then((res)=>{
                if(res.code == 0){
                let rulest = res.data
                let dataNew = []
                rulest.map(item => {
                    let obj = {
                        value: item.id,
                        label: item.name,
                    }
                    dataNew.push(obj);
                });
                    this.selectKey.group = dataNew
                }
            })
        },
        changeGroup(val){
            queryUsersByRole({groupId:val.value}).then((res)=>{
                    if(res.code == 0){
                        let rulest =  res.data
                        let dataNew = []
                        rulest.map(item => {
                            let obj = {
                                value: item.id,
                                label: item.nickname,
                            }
                            dataNew.push(obj);
                        });
                        this.selectKey.roleList = dataNew
                    }
                })    
        },
        getGrop(){
            queryUmsProjectGroupList({parentId:0}).then((res)=>{
                if(res.code == 0){
                let rulest = res.data
                let dataNew = []
                rulest.map(item => {
                    let obj = {
                        value: item.id,
                        label: item.name,
                    }
                    dataNew.push(obj);
                });
                this.selectKey.billType = dataNew
                }
            })
            getwallets({}).then((res)=>{
                if(res.code == 0){
                    let rulest =  res.data[0]
                    let dataNew = []
                    let obj = {
                            value: rulest.walletId,
                            label: rulest.walletName,
                    }
                    dataNew.push(obj);
                    this.selectKey.wallet = dataNew
                }
            })
           
        },
        handleCheckAllChange(val) {
            let arr = []
            arr = val ? this.cities.map((item) => item.userId) : [];
            this.checkedCities = arr
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        close(){
            this.addFlag = false
            this.checkedCities = []
        },
        getTable(){
            queryUnSettledUserPager(this.pageObj.pageData).then((res)=>{
                if(res.code == 0){
                    this.tableData = res.data.dataList || []
                    this.columObj.loading = false
                    this.grantMoney = res.data.grantMoney
                    this.grantPersonNum = res.data.grantPersonNum
                    this.pageObj.total = res.data.total
                }else{
                    this.grantMoney = null
                    this.grantPersonNum = null
                }
            })
        },
        // 添加收款人
        sure(){
            if(this.addType == '2'){
                this.addType = '1'
                this.addFlag = false
                // this.getTable()
                // let arr = []
                // this.checkedCities.forEach((item)=>{
                //     arr.push(item)
                // })
                // console.log(this.checkedCities)
                // console.log(arr)
                userCheckedDetermine({
                    walletId:this.params.settlementWalletId,
                    checkedUserList:this.checkedCities,
                    queryKey:this.params.queryKey,
                }).then((res)=>{
                    if(res.code == 0){
                        this.queryKey = res.data.queryKey
                        this.params.queryKey = res.data.queryKey
                        this.grantMoney = res.data.grantMoney
                        this.grantPersonNum = res.data.grantPersonNum
                        this.tableData = res.data.dataList || []
                        this.columObj.loading = false
                        this.pageObj.total = res.data.total
                    }
                })
            }else{
                this.addType = '2'
            }
        },
        // 提交结算
        submit(formName){
            if(!this.params.settlementWalletId){
                this.$message.warning('请选择钱包')
                return
            }
            if(!this.params.examinePersonId){
                this.$message.warning('请选择审核人员')
                return
            }
            if(!this.params.queryKey){
                this.$message.warning('请增加收款人')
                return
            }
            
			// 增加收款人提交
			// this.$refs[formName].validate((valid) => {
			// if (valid) {
                postInitiateSettlement(this.params).then((res)=>{
                    if(res.code == 0){
                        this.$message.success('结算成功')
                        this.$router.go(-1);
                    }
			    })
			// } else {
			// console.log("error submit!!");
			//     return false;
			// }
		// });
		},
        // 组弹框关闭
        groupHandleClose(){
            this.group.visible = false
        },
         // 获取表格数据
        onSearch(val) {
            delete val.time;
            this.pageObj.pageData = Object.assign(this.pageObj.pageData, val);
            this.getData();
        },
        // 重置请求参数请求数据
        onReset() {
            this.getData();
        },
        add(){
            if(!this.params.settlementWalletId){
                this.$message.warning('请先选择钱包')
                return
            }
            if(this.group.form.obj && this.group.form.groupList){
                this.addFlag = true
                queryTreatSettlementUserList({belongGroupId:this.params.belongGroupId,belongProjectId:this.params.belongProjectId,queryKey:this.queryKey}).then((res)=>{
                    if(res.code == 0){
                        this.cities = res.data.dataList
                        this.queryKey = res.data.queryKey
                        this.params.queryKey = res.data.queryKey
                        this.pageObj.pageData.queryKey = res.data.queryKey
                    }
                })
            }else{
                this.group.visible = true
            }   
        },
        rowOperation(row, $index, now) {
            // 默认只有删除请求删除接口
            singleUserDel({
                delUserId:row.userId,
                queryKey:this.queryKey
            }).then((res)=>{
                if(res.code == 0){
                    this.checkedCities  = this.checkedCities.filter(item => item != row.userId);
                    this.tableData.forEach((item)=>{
                        if(item.userId == row.userId){
                            this.tableData.splice(item,1)
                        }
                    })
                    if(this.checkedCities.length!=0){
                        userCheckedDetermine({
                            walletId:this.params.settlementWalletId,
                            checkedUserList:this.checkedCities,
                            queryKey:this.params.queryKey,
                        }).then((res)=>{
                            if(res.code == 0){
                                this.queryKey = res.data.queryKey
                                this.params.queryKey = res.data.queryKey
                                this.grantMoney = res.data.grantMoney
                                this.grantPersonNum = res.data.grantPersonNum
                                this.tableData = res.data.dataList || []
                                this.columObj.loading = false
                                this.pageObj.total = res.data.total
                            }
                        })
                    }else{
                        this.isIndeterminate = true
                        this.checkedCities = []
                        this.grantMoney = null
                        this.grantPersonNum = null
                    }
                    this.$message.success('移除成功')
                }
            })
        },
        // 复选框选中添加id
        handleSelectionChange(row) {
            this.selectIds = row.selectKey
        },
        //页码变化
        handleCurrentChange(e) {
            this.pageObj.pageData.currentPage = e;
            this.getData()
        },
        //条数变化
        handleSizeChange(e) {
            this.pageObj.pageData.pageSize = e;
            this.pageObj.pageData.currentPage = 1;
            this.getData()
        },
        getData(){
            // 结算审核列表
            getBillData(this.pageObj.pageData).then((res)=>{
                if(res.code === 0){
                    this.tableData = res.data.records || []
                    this.columObj.loading = false
                    this.pageObj.total = res.data.total
                }else{
                    this.$message.error('请求报错')
                }
            })
        },
    },
};
</script>
<style>
.check .el-select > .el-input, .el-dialog__wrapper .el-select > .el-input{
    display: inline-block !important;
}
</style>
<style lang="scss" scoped>
.el-select{
    display: block;
    width: 256px;
}
.container .el-select > .el-input{
    display: inline-block !important;
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
.header{
    height: 50px;
    padding: 0 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    line-height: 63px;
    background: #fff;
    margin-right: 20px;
    color: #000;
}
.header span{
    flex: 1;
    margin-left: 20px;
    color: #000;
    font-size: 16px;
}
.header button{
    margin-right: 20px;
    margin-top: 7px;
    height: 35px;
    width: 105px;
    text-align: center;
}
.tabs{
    margin: 0 20px;
    padding-top: 20px;
}
.rightTitle {
    height: 53px;
    margin-top: -20px;
    line-height: 53px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}
.forms{
    width: 328px;
    height: 480px;
    background: #fff;
    .el-form-item {
    min-width: 360px;
    display: inline-block;
    vertical-align: top;
    margin-left: 30px;
  }
  .el-input__suffix{
    top:17px !important;
}
}
.formModal{
    margin-top: 40px;
    width: 435px;
    margin: 0 auto;
}
.formModal .el-select{
    width: 445px;
}
.formModal .el-form-item{
    margin-top: 30px;
}
.forms p{
    height: 40px;
    font-size: 14px;
    color: #000;
    line-height: 40px;
    text-indent: 32px;
}
.forms  button{
    margin-left: 150px;
}
.forms .el-select{
    width: 255px;
}
.table-box{
    padding: 15px;
    height: 480px;
    width: calc(100% - 348px);
    background: #fff;
}
.table-box .list_title{
    height: 50px;
    color: #000;
    font-size: 16px;
}
.container{
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: 50px;
}
.app-container {
    font-size: 0;
    position: relative;
    background: transparent;
    ::v-deep {
        .el-table {
            &::before {
                content: none;
            }
        }
    }


    .app-container-left {

        .el-scrollbar {
            height: calc(100% - 54px);
			.left_device_list{
				height: 100%;
				margin: 10px 0;
				padding: 0 10px;
				.left_device_list_item{
					font-size: 14px;
					padding: 10px 10px 10px;
					cursor: pointer;
					border-radius: 4px;
					margin-bottom: 4px;
					&:hover,&.activeSB{
						background: #2280DC;
						color: #ffffff;
					}

				}
			}
        }
		
    }



}
.himt p:first-child{
    color: #000;
    font-size: 16px;
}
.himt p:last-child{
    color: #aaa;
}
.himt p i{
    font-size: 24px;
    color: #FFC300;
    margin-right: 10px;
    position: relative;
    top:3px;
}
.himt p span{
    color: #4365AC;
}
.popleForm{
    width: 435px;
    margin: 0 auto;
}
.popleForm .el-input{
    width: 435px;
}
.checkboxList .el-checkbox{
    display: block;
    margin: 10px 0 0 10px;
}
.checkboxList{
    border:1px solid #D9D9D9;
    width: 435px;
    height: 590px;
    margin: 0 auto;
    margin-bottom: 20px;
}
.checkboxBox{
    height: 255px;
    overflow: auto;
}
</style>