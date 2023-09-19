<template>
    <div class="disp_flex flex_column"  v-loading.body="loading" element-loading-spinner="el-icon-loading" element-loading-custom-class="custom-loading" style="height: 100%;">
        <el-card shadow="hover">
                <div ref="pageHead">
                        <el-form ref="payload" :model="payload" class="form_horizontal business-form" inline >
                            <el-form-item label="模糊搜索：" >
                                <el-input  placeholder="姓名/工号/手机号" clearable v-model="payload.keywords" >
                                </el-input>
                            </el-form-item>
                            <el-form-item label="所属部门：" prop="deptId">
                                <el-cascader ref="deptId" v-model="payload.deptId" clearable :options="treeOrgList" 
                                    :props="{ checkStrictly: true,expandTrigger: 'hover',value:'id',label:'name',leaf:'children' }">         
                                </el-cascader>
                            </el-form-item>
                            <el-form-item label="人员类型：" prop="userType">
                                <el-select v-model="payload.userType" clearable >
                                    <el-option v-for="item in userTypeList" :key=" item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="人员状态：" prop="userStatus">
                                <el-select v-model="payload.userStatus" clearable >
                                    <el-option label="在职" :value="1"></el-option>
                                    <el-option label="离职" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div v-if="perOperate" class="page_handle_group disp_flex">
                            <el-button  type="primary" v-hold-click @click="submitForm('payload')">查询</el-button>
                            <el-button  v-hold-click @click="resetForm('payload')">重置</el-button>
                            <el-button type="primary" v-if="perms.includes('sys:user:add')"  v-hold-click @click="toCreate">添加成员</el-button>
                            <el-button type="" v-hold-click @click="openImport">导入数据</el-button>
                            <el-button type="" v-hold-click @click="toExportTem">下载导入模版</el-button>
                            <!-- <el-button type="" v-hold-click @click="toExport">导出</el-button> -->
                        </div>
                </div>
        </el-card>
        <el-card shadow="hover" v-loading="loading" style="margin-top: 24px;" :body-style="{height: '100%'}"
             class="m-card-full-body flex">
                <mTable ref="mTable"
                        height="100%"
                        :loading.sync="loading"
                        stripe
                        :columns="columns"
                        :request="getUserPage"
                        :payload="payload">
                        <el-table-column slot="index" label="序号">
                            <template slot-scope="scope">
                            {{ scope.$index+1+($refs.mTable.current-1)*$refs.mTable.size }}
                            </template>
                        </el-table-column>
                        <el-table-column slot="userStatus" label="人员状态">
                            <template slot-scope="{ row }">
                                <span v-if="row.userStatus==1">在职</span>
                                <span v-if="row.userStatus==0">离职</span>
                            </template>
                        </el-table-column>
                        <el-table-column slot="status" label="账号状态">
                            <template slot-scope="{ row }">
                                <span v-if="row.status==1">启用</span>
                                <span v-if="row.status==0">禁用</span>
                                <span v-if="row.status==2">冻结</span>
                            </template>
                        </el-table-column>
                        <template slot="action">
                            <el-table-column
                                label="操作"
                                width="120"
                                align="center">
                                <template slot-scope="scope">
                                    <!-- <el-button type="text" v-hold-click @click.stop="resetPassword(scope.row)">重置密码</el-button> -->
                                    <el-button type="text" v-if="perms.includes('sys:user:edit')" v-hold-click @click.stop="table_edit(scope.row)">详情</el-button>
                                    <el-dropdown @command="doCommand($event, scope.row)">
                                        <el-button @click.stop type="text">更多</el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="updateStatus" v-if="perms.includes('sys:user:updateStatus')">暂停账号</el-dropdown-item>
                                            <el-dropdown-item command="tableRemove" v-if="perms.includes('sys:user:leaveOffice')">操作离职</el-dropdown-item>
                                            <el-dropdown-item command="changeDepartment" v-if="perms.includes('sys:user:updateDept')">变更部门</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
                            </el-table-column>
                        </template>
                </mTable>
        </el-card>
        <userForm :title="moduleTitle" ref="formDialog" :treeOrgList="treeOrgList" @submit="formDialogSubmit" :disabled="disabled" />
        <importDialog ref="uploadDialog" @submit="importSuccess" :treeOrgList="treeOrgList"/>
        <el-dialog
            title="暂停账号"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">
            <div>
                <div  class="dialog-header">
                    <div style="display: flex; align-items: center;">
                        <div style="margin-right: 5px;"><img src="@/assets/man.png" alt="" v-if="form.gender==1"><img src="@/assets/woman.png" alt="" v-else></div>
                        <div>
                            <div  class="nickname">{{ form.nickname }}</div>
                            <div><span>工号：</span>{{ form.jobNumber }}</div>
                        </div>
                    </div>
                </div>
                <div style="margin: 20px;">将暂停 {{ form.nickname }} 的账号</div>
                <div class="dialog-bottom">
                    <div class="tips"> <span class="cricle"></span> 暂停期间，该账号无法访问此网站。</div>
                    <div class="tips">  <span class="cricle"></span>暂停期间，系统将保留该人员相关的所有数据。</div>
                </div>
               
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="rightBtn">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="操作离职"
            :visible.sync="dialogVisible2"
            width="50%"
            :before-close="handleClose2">
            <div class="dialog-header">
                <div style="display: flex; align-items: center;">
                    <div style="margin-right: 5px;"><img src="@/assets/man.png" alt="" v-if="form.gender==1"><img src="@/assets/woman.png" alt="" v-else></div>
                    <div>
                        <div  class="nickname">{{ form.nickname }}</div>
                        <div><span>工号：</span>{{ form.jobNumber }}</div>
                    </div>
                </div>
            </div>
            <div style="margin:20px">
                <div style="margin: 10px 0;">将成员拥有的资源</div>
                <el-radio-group v-model="radio">
                    <el-radio :label="1">转移给其他人员</el-radio>
                    <el-radio :label="2">冻结</el-radio>
                </el-radio-group>
            </div>
            <div style="margin:20px">
                <div style="margin: 10px 0;">选择要转移的资源</div>
                <el-radio-group v-model="radio2">
                    <el-radio :label="1">工单</el-radio>
                    <el-radio :label="2">培训</el-radio>
                </el-radio-group>
            </div>
            <div style="margin:20px">
                <div style="margin: 10px 0;">设置资源接收人</div>
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="date"
                        label="资源">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="资源描述">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="操作">
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="rightBtn2">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="变更部门"
            :visible.sync="dialogVisible3"
            width="50%"
            :before-close="handleClose3">
            <div>
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText" prefix-icon="el-icon-search">
                </el-input>
              <el-tree
                class="tree-tap"
                :data="treeOrgList"
                show-checkbox
                node-key="id"
                v-model="form.deptId"
                ref="treeForm"
                :check-on-click-node="true"
                :props="defaultProps"
                @check="changetree"
                default-expand-all
                @check-change="handleNodeClick"
                :filter-node-method="filterNode"
                ></el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="rightBtn3">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import basic from "@/mixins/basic"

import { users, usersInfo,usersMeAdmin,getUserPage } from "@/api/users"
import { deptPage } from "@/api/dept"
import { parseTime,downLoadFile } from "@/utils";
import userForm from "./components/userForm"
import importDialog from "./components/importDialog"
import mTable from '@c/business/table'
import variables from "@/styles/variables.scss"
import uploadFiles from "@/components/custom/uploadFile";
import { getDictTypesItem } from "@/api/dict";
export default {
    components: {
        userForm,
        uploadFiles,
        importDialog,
        mTable
    },
    data() {
        return {
            filterText: '',
            pageFun:users,
            payload: {},
            moduleTitle: '',
			orgInfo:{}, 
            treeOrgList:[],
            columns: [
                {
                    label: '序号',
                    slot: 'index'
                },
                {
                    label: '姓名',
                    prop: 'nickname'
                }, {
                    label: '工号',
                    prop: 'jobNumber'
                }, {
                    label: '所属部门',
                    prop: 'deptName'
                }, {
                    label: '手机号码',
                    prop: 'mobile'
                }, {
                    label: '人员类型',
                    prop: 'userType'
                }, {
                    label: '人员状态',
                    slot: 'userStatus'
                }, {
                    label: '默认账号',
                    prop: 'username'
                }, {
                    label: '账号状态',
                    slot: 'status'
                }, {
                    label: '入职时间',
                    prop: 'entryTime'
                },
                {
                    slot: 'action'
                }
            ],
            disabled:false,
			loading:false,
            userTypeList:[],
            perms:[],
            dialogVisible:false,
            dialogVisible2:false,
            dialogVisible3:false,
            form:{},
            radio:'',
            radio2:'',
            tableData:[],
            defaultProps: {
                label: 'name',
                id: 'id'
            },

        }
    },
    computed: {
    },
    mixins: [basic],
    created() {
        
    },
    watch: {
      filterText(val) {
        this.$refs.treeForm.filter(val);
      }
    },
    mounted() {
        let that = this;
        that.perms = that.$store.getters.user.perms
        that.getUserType();
        that.loader_org();
    },
    methods: {
        doCommand(command, row) {
            switch (command) {
                case "updateStatus":
                this.updateStatus(row)
                break;
                case "tableRemove":
                this.tableRemove(row)
                break;
                case "changeDepartment":
                this.changeDepartment(row)
                break;
            }
        },
        handleNodeClick(data, checked, node) {
            if (checked) {
                this.$refs.treeForm.setCheckedKeys([data.id])
                this.form.deptId=data.id
            }
        },
        changetree(data, lst) {
            if (lst.checkedKeys.length > 0) {
                //这里的treeForm是你el-tree命名的ref的值
                this.$refs.treeForm.setCheckedKeys([data.id])
            }
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        getUserType(){
            let that=this;
            getDictTypesItem({name:'user_type',method:'get'}).then(res=>{
				if(res.code=='0'){
					that.userTypeList = res.data|| [];
				}	
			})
        },
        loader_org:function(){
            var that = this
			deptPage({name: '', method: 'get'}, {})
				.then(res => {
                    that.treeOrgList =res.data || []
				})
				.catch(err => {

				})
        },
        resetForm(formName) {
			this.payload = {};
			this.$refs[formName].resetFields();
			this.$nextTick(() => {
				this.$refs.mTable.resetInit();
			})
		},
		submitForm(formName) {
            if(this.payload.deptId)this.payload.deptId=this.payload.deptId[this.payload.deptId.length-1]
			this.$refs[formName].validate((valid) => {
				this.$refs.mTable?.resetInit();
			});
		},
        formDialogSubmit(){
            this.$refs.mTable?.resetInit();
        },
		search_reset: function () {
			let that = this;
		},
        getUserPage,
        toExport:function(){
            var that = this
            this.$message.warning('正在建设中！');
            return false;
			users({name: '_export', method: 'get'},)
				.then(res => {                   
                    downLoadFile(res,'用户导出')
				})
				.catch(err => {
				})
        },
        toExportTem:function(){
                var that = this
                users({name: 'template', method: 'get'},)
				.then(res => {
                    downLoadFile(res,'用户导入模版')
                    
				})
				.catch(err => {
				})
        },
        resetPassword(row) {
            this.$prompt(`请输入用户「${row.username}」的新密码`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            })
            .then(({ value }) => {
                users({name: 'password', method: 'patch'}, {userId:row.id,password:value},{})
                    .then(res => {
                        this.$message({
                            type: 'success',
                            message: '密码重置成功'
                        });
                    })
                    .catch(err => {

                    })
                })
                .catch(() => {   
                });
        },
		table_cell_state_change(row, status) {
			let that = this;
			that.pageFun({name: 'status', method: 'patch'}, {userId:row.id,status:row.status})
				.then(res => {
					that.$message.success("修改成功");
					that.$refs.mTable?.resetInit();
				})
				.catch(err => {

				})
		},
        //暂停账号
        updateStatus:function(row){
            var that = this
            that.$confirm('确定暂停该账号吗', "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    that.dialogVisible=true;
                    that.form=row;
                })
                .catch(() => {});
        },
        rightBtn(){
            var that = this;
            that.pageFun(
                {method:'updateStatus',name:'updateStatus'},
                {id:that.form.id,status:0},
            ).then((res) => {
                    that.dialogVisible=false;
                    that.$message.success("操作成功");
                    that.$refs.mTable?.resetInit();
                })
                .catch((err) => {});
        },
        // 操作离职
        tableRemove:function(row){
            var that = this
            that.$confirm('确定操作离职吗', "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                    that.dialogVisible2=true;
                    that.form=row;
                    that.radio='';
                    that.radio2='';
                })
                .catch(() => {});
        },
        // 变更部门
        changeDepartment:function(row){
            var that = this;
            that.$confirm('确定变更部门吗', "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                that.dialogVisible3=true;
                that.form=row;
                that.$refs.treeForm.setCheckedKeys([row.deptId])
            }).catch(() => {});
        },
        rightBtn2(){
            var that = this;
            that.pageFun(
                {method:'leaveOffice',name:'leaveOffice'},
                {id:that.form.id},
            ).then((res) => {
                    that.$message.success("操作成功");
                    that.dialogVisible2=false;
                    that.$refs.mTable?.resetInit();
            }).catch((err) => {});
        },
        rightBtn3(){
            var that = this;
            that.pageFun(
                {method:'updateDept',name:'updateDept'},
                {id:that.form.id,deptId:that.form.deptId},
            ).then((res) => {
                that.$message.success("操作成功");
                that.dialogVisible3=false;
                that.$refs.mTable?.resetInit();
            }).catch((err) => {});
        },
        handleClose(){
            this.dialogVisible=false;
        },
        handleClose2(){
            this.dialogVisible2=false;
        },
        handleClose3(){
            this.dialogVisible3=false;
        },
        table_edit:function(row){
            var that = this
            this.disabled=true;
            usersInfo({},{userId:row.id}).then((res) => {

				that.$refs.formDialog && that.$refs.formDialog.openDialog(res.data);
				that.$nextTick(() => {
					if (that.$refs.forms) that.$refs.forms.clearValidate()
				})
            })
            .catch((err) => {});

        },
        toCreate(){
            this.disabled=false;
            this.$refs.formDialog && this.$refs.formDialog.openDialog();
        },
        openImport:function(){
            var that = this
            that.$refs.uploadDialog && that.$refs.uploadDialog.openDialog();
        },
        importSuccess:function(){
            var that = this
            that.$refs.mTable?.resetInit();
        },
    },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/containerColumn2.scss";

.rightTitle {
    height: 53px;
    margin-top: -20px;
    line-height: 53px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}
.business-form {
  ::v-deep {
    .el-select .el-input__inner, .el-input .el-input__inner,
    .el-input--suffix .el-input__inner, .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 248px;
    }
  }
}
.mt-space {
  margin-top: 24px;
}
.business-descriptions {
  font-size: 16px;
  ::v-deep .el-descriptions--medium:not(.is-bordered) .el-descriptions-item__cell {
    padding-bottom: 20px;
  }
}
.dialog-header{
    width: 100%;
    height: 98px;
    background: rgba(86,116,229,0.05);
    border-radius: 8px;
    margin: 20px 0;
    padding: 20px;
    .nickname{
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0,0,0,0.85);
        margin-bottom: 12px;
    }
}
.dialog-bottom{
    width: 100%;
    height: 100px;
    background: #FAFAFA;
    border-radius: 3px 3px 0px 0px;
    margin: 20px;
    padding: 20px;
    .tips{
        margin-bottom: 12px;
        .cricle{
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #F5222D;
            border-radius: 50%;
            margin-right: 5px;
        }
    }
}
</style>