<template>
    <div class="app-container column-2-container">
        <div class="app-container-left">
            <div class="role-header">
                <el-input  placeholder="搜索名称" clearable v-model="searchs.roleName" @clear="searchBtn" @keyup.enter.native="searchBtn"  prefix-icon="el-icon-search">
                </el-input>
            </div>
            <div class="role-content">
                <div class="role-list">
                    <div v-for="(item,index) in lists" class="role-list-items" :class="index==actived?'selected':''" v-hold-click @click="tabChange(item,index)">
                        <span><img src="@/assets/touxiang.png" alt="" style="margin-right: 5px;vertical-align: bottom;">{{ item.name }}</span>
                        <el-dropdown @command="doCommand($event, item)">
                            <el-button @click.stop type="text" ><img src="@/assets/more.png" alt=""></el-button>
                            <el-dropdown-menu slot="dropdown" style="text-align: center;">
                                <el-dropdown-item command="table_edit">编辑</el-dropdown-item>
                                <span style="display: inline-block;width: 80%;height: 1px;background-color: #ddd;"></span>
                                <el-dropdown-item command="table_remove">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div style="text-align: center;"> <el-button type="primary" icon="el-icon-plus" v-hold-click @click="toCreate()">新增</el-button></div>
            </div>
        </div>
        <div class="app-container-right" v-loading.body="loading" element-loading-spinner="el-icon-loading" element-loading-custom-class="custom-loading" v-if="loading2">
		    <el-card shadow="hover" v-loading="loading" style="height: 100%;" :body-style="{height: '80%'}"
             class="m-card-full-body flex">
                <div ref="pageHead">
                    <el-form ref="payload" :model="payload" class="form_horizontal">
                        <el-form-item label="成员姓名：" >
                            <el-input  placeholder="搜索成员姓名" clearable v-model="payload.keywords"   prefix-icon="el-icon-search">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button  type="primary" v-hold-click @click="submitForm('payload')">查询</el-button>
                            <el-button  v-hold-click @click="resetForm('payload')">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <div v-if="perOperate" class="page_handle_group">
                        <el-button type="primary"  v-hold-click @click="quanxianfenpei()" plain>权限配置</el-button>
                        <el-button type="primary"  v-hold-click @click="toAddUser()" plain>添加成员</el-button>
                        <el-button type="primary"  v-hold-click  plain @click="exportBtn">批量导入</el-button>
                        <!-- <el-button type="primary"  v-hold-click  plain @click="exportBtn">导出</el-button> -->
                    </div>
                </div>
                <template>
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
                            <template slot="action">
                                <el-table-column
                                    label="操作"
                                    width="80"
                                    align="center">
                                    <template slot-scope="scope">
                                        <el-button type="text" v-hold-click @click.stop="userRoles_remove(scope.row)"><span >移除</span></el-button>
                                    </template>
                                </el-table-column>
                            </template>
                    </mTable>
                </template>
            </el-card>
        </div>
        <el-dialog
            title="添加成员"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">
            <div class="item-content">
               <div class="item-box"> 
                    <el-input
                        placeholder="搜索成员"
                        v-model="filterText" prefix-icon="el-icon-search">
                    </el-input>
                    <el-tree
                        class="tree-tap"
                        :data="deptList"
                        show-checkbox
                        node-key="id"
                        ref="treeForm"
                        :check-on-click-node="true"
                        :props="defaultProps"
                        default-expand-all
                        @check="handleNodeClick"
                        :filter-node-method="filterNode"
                        >
                        <span class="custom-tree-node" slot-scope="{ node, data }" >
                            <span v-if="node.data.sysUserList">{{ node.label}}</span>
                            <span v-else style="display: flex;align-items: center;">
                                <span style="margin-right: 5px;"><img :src="data.avatar?data.avatar:(data.gender=='1'?require('@/assets/man.png'):require('@/assets/woman.png'))" alt="" style="width: 20px;height: 20px;border-radius: 50%;"></span>
                                <span>{{ data.nickname}}</span>
                            </span>
                        </span>
                    </el-tree>
                </div>
                <div class="item-box"> 
                    <div class="item-title">
                        <span>已选</span>
                        <el-button type="text" @click="clearBtn">清空</el-button>
                    </div>
                    <div>
                        <div v-for="item in newArrNodesList" class="personal-box">
                            <div class="avatar"><img :src="item.avatar?item.avatar:(item.gender=='1'?require('@/assets/man.png'):require('@/assets/woman.png'))" alt=""></div>
                            <div class="personal-message">
                                <div class="nickname">{{ item.nickname }}</div>
                                <div class="deptName">{{ item.deptName }}</div>
                            </div>
                            <div class="closeBtn" @click="removeBtn(item)">
                               X
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="rightBtn">确 定</el-button>
            </span>
        </el-dialog>
        <roleForm :title="moduleTitle" ref="formDialog" @submit="formDialogSubmit" />
        <roleData  ref="roleData"  />
        <el-dialog title="权限配置" :visible.sync="isShow" :lock-scroll="true" :before-close="dialogCancel"  width="70%">
            <el-tabs tab-position="top"  v-model="active">
                <el-tab-pane label="菜单及操作权限">
                    <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
                        <treeMenu :data="treeData" :treeOriginData="treeOriginData" @getCheckOutArray="getCheckOutArray" :checkArray="checkArray"></treeMenu>
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="数据权限">
                    <el-form class="userForm" ref="form" :model="form" :rules="rules" >
                        <el-form-item  label="数据权限：" prop="dataScope">
                            <el-select v-model="form.dataScope" clearable @change="getDataScope">
                                <el-option v-for="item in userTypeList"  :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-hold-click @click="dialogSubmit">确 定</el-button>
                <el-button v-hold-click @click="dialogCancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import basic from "@/mixins/basic"

import { rolesOptions, rolesInfo, rolesUpdate,rolesRemove,rolesMenuIds,getDeptUser,addUserRoles,removeUserRole,getMenusResources,updateMenus,getMenuIds } from "@/api/roles"
import { getUserPage } from "@/api/users"
import { parseTime } from "@/utils";
import mTable from '@c/business/table'
import roleForm from "./components/roleForm"
import roleData from "./components/roleData"
import treeMenu from '@c/treeMenu'
import { getDictTypesItem } from "@/api/dict"

import variables from "@/styles/variables.scss"

export default {
    components: {
        roleForm,
        roleData,
        mTable,
        treeMenu
    },
    data() {
        return {
            pageFun: rolesOptions,
            apiKey: 'id',
            moduleTitle: '角色',
            searchs_default:{
                // pages:true
            },

			loading:false,
            loading2:false,
            perms:[],
            defaultProps: {
                label: 'deptName',
                id: 'deptId',
                children:'sysUserList',
            },
            deptList:[],
            dialogVisible:false,
            filterText:'',
            actived:0,
            checkedKeys:[],
            payload: {roleId:''},
            columns: [
                {
                    label: '序号',
                    slot: 'index'
                },
                {
                    label: '姓名',
                    prop: 'nickname'
                }, {
                    label: '所属部门',
                    prop: 'deptName'
                }, {
                    label: '手机号码',
                    prop: 'mobile'
                },
                {
                    slot: 'action'
                }
            ],
            treeData:[],
            treeOriginData:[],
            isShow:false,
            checkOutArray:[],
            checkArray:[],
            active:0,
            form:{},
            rules :{
                dataScope: [
                    { required: true, message: '请选择数据权限', trigger: 'change' }
                ]
            },
            userTypeList:[{
                    label:'全部数据权限',
                    value:0
                },{
                    label:'本部门数据权限',
                    value:2
                },{
                    label:'本部门及以下数据权限',
                    value:1
                },{
                    label:'本人数据',
                    value:3
            }],
            newArrNodesList:[]
        }
    },
    computed: {
    },
    mixins: [basic],
    created() {
        let that = this;
    },
    watch: {
      filterText(val) {
        this.$refs.treeForm.filter(val);
      }
    },
    mounted() {
        let that = this;
        that.getDeptUserList();
        that.loading2=false;
        that.perms = that.$store.getters.user.perms;
        setTimeout(() => {
            that.payload.roleId=that.lists[0].id;
            that.form.dataScope=that.lists[0].dataScope;
            that.$refs.mTable?.resetInit();
            that.loading2=true;
        }, 800);
    },
    methods: {
        tabChange(data,index){
            this.actived=index;
            this.form.dataScope=data.dataScope;
            this.$nextTick(()=>{
                this.payload.roleId=data.id;
                this.$refs.mTable?.resetInit();
            })
        },
        doCommand(command, row) {
            switch (command) {
                case "table_edit":
                this.table_edit(row)
                break;
                case "table_remove":
                this.table_remove(row)
                break;
            }
        },
        handleNodeClick(data, node) {
            var arr= node.checkedKeys;
            var array=node.checkedNodes;
            let newArr= [];
            let newArrNodes= [];
            arr.forEach(item => {
                if (item) {
                    newArr.push(item)
                }
            })
            array.forEach(item => {
                if (item.id) {
                    newArrNodes.push(item)
                }
            })
            this.checkedKeys=newArr;
            this.newArrNodesList=newArrNodes;
        },
        // 清空
        clearBtn(){
            this.newArrNodesList=[];
            this.$refs.treeForm.setCheckedKeys([]);
        },
        // 移除
        removeBtn(data){
            this.checkedKeys = this.checkedKeys.filter(item => item != data.id);
            this.newArrNodesList = this.newArrNodesList.filter(item => item != data);
            this.$refs.treeForm.setCheckedKeys(this.checkedKeys);
        },
        // 过滤
        filterNode(value, data) {
            if (!value) return true;
            if(data.nickname){
                return data.nickname.indexOf(value) !== -1;
            }
        },
        handleClose(){
            this.dialogVisible=false;
        },
        rightBtn(){
            if(this.checkedKeys.length==0) return this.$message.warning("添加成员不能为空");
            addUserRoles({},{id:this.payload.roleId},this.checkedKeys).then((res) => {
                this.$refs.mTable?.resetInit();
                this.$message.success("添加成功");
                this.dialogVisible=false;
            })
            .catch((err) => {});
        },
        resetForm(formName) {
			this.payload.keywords = '';
			this.$refs[formName].resetFields();
			this.$nextTick(() => {
				this.$refs.mTable.resetInit();
			})
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				this.$refs.mTable?.resetInit();
			});
		},
        getDeptUserList(){
            getDeptUser({},{}).then((res) => {
				if(res.code=='0'){
                    this.deptList=res.data;
                }
            }).catch((err) => {});
        },
		toCreate(row) {
			let that = this;
			that.$refs.formDialog.openDialog();
            if(row){
                console.log(row);
                // that.$set(that.form,'parentId',[row.id])
                // that.form.parentId = [row.id]
            }
		},
        toAddUser(){
            this.dialogVisible=true;
            this.newArrNodesList=[];
            this.$nextTick(() => {
                this.$refs.treeForm.setCheckedKeys([])
            })
        },
        table_role_data:function(row){
            var that = this
            rolesMenuIds({},{id:row.id}).then((res) => {
                var json ={
                    roleId : row.id,
                    menuIds : res.data || []
                }
				that.$refs.roleData && that.$refs.roleData.openDialog(json);
            })
            .catch((err) => {});
        },
        table_edit:function(row){
            var that = this
            rolesInfo({},{id:row.id}).then((res) => {
				that.$refs.formDialog && that.$refs.formDialog.openDialog(res.data);
				that.$nextTick(() => {
					if (that.$refs.forms) that.$refs.forms.clearValidate()
				})
            })
            .catch((err) => {});

        },
		table_cell_state_change(row, status) {
			let that = this;
			rolesUpdate({method: 'put'}, {},{...row,status:row.status})
				.then(res => {
					that.$message.success("修改成功");
					that.paging_change(that.currentPage);
				})
				.catch(err => {

				})
		},
        table_power:function(){
            var that = this
            
        },
        table_remove:function(row){
            var that = this

                that.$confirm('确定删除该数据吗', "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        rolesRemove({},{},
                            {id:row.id},
                        )
                            .then((res) => {
                                that.$message.success("删除成功");
                                that.paging_change(that.currentPage);
                            })
                            .catch((err) => {});
                    })
                    .catch(() => {});
        },
        userRoles_remove:function(row){
            var that = this
                that.$confirm('确定移除该数据吗', "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        removeUserRole({},{roleId:this.payload.roleId,userId:row.id},
                            {},
                        )
                            .then((res) => {
                                that.$message.success("移除成功");
                                this.$refs.mTable?.resetInit();
                            })
                            .catch((err) => {});
                    })
                    .catch(() => {});
        },
        getUserPage,
        // 权限分配
        dialogSubmit(){
            let that = this;
            if(this.active==1){
                that.$refs["form"].validate((valid) => {
                    if (valid) {
			            rolesUpdate({method: 'put'}, {},{id:that.payload.roleId,dataScope:that.form.dataScope})
                            .then(res => {
                                that.$message.success("修改成功");
                                that.$refs.mTable?.resetInit();
                                this.isShow=false;
                            })
                        .catch(err => {

                        })
                    }
                });
            }else{
                updateMenus({},{id:this.payload.roleId},this.checkOutArray).then((res) => {
                    this.$refs.mTable?.resetInit();
                    this.$message.success("分配成功");
                    this.isShow=false;
                })
                .catch((err) => {});
            }

        },
        dialogCancel(){
            this.isShow=false;
        },
        quanxianfenpei(){
            this.isShow=true;
            this.active='0';
            this.getMenuIdsList();
            this.getMenusResourcesList();
        },
        getDataScope(val){
            this.form.dataScope=val;
            this.$forceUpdate();
        },
        treeDataFun(data) {
            let arr = []
            data.forEach(item=>{
                if(item.type==1){
                    if(item.children){
                        arr.push({
                            value: item.value,
                            label: item.label,
                            list: this.treeDataFun(item.children),
                            type:item.type
                        })
                    }else{
                        arr.push({
                            value: item.value,
                            label: item.label,
                            type:item.type
                        })
                    }
                }else{
                    if(item.children){
                        arr.push({
                            value: item.value,
                            label: item.label,
                            children: this.treeDataFun(item.children),
                            type:item.type
                        })
                    }else{
                        arr.push({
                            value: item.value,
                            label: item.label,
                            type:item.type
                        })
                    }
                }
               
            })
            return arr;
        },
        getMenusResourcesList(){
            getMenusResources({},{},{})
                .then((res) => {
                    if(res.code=='0'){
                        this.treeOriginData=res.data;
                        this.treeData=this.treeDataFun(res.data);
                        
                    }
                }).catch((err) => {});
        },
        getCheckOutArray(checkOutArray){
            this.checkOutArray=checkOutArray;
        },
        getMenuIdsList(){
            getMenuIds({},{id:this.payload.roleId},{}).then((res) => {
                this.checkArray=res.data;
                this.checkOutArray=res.data;
            })
            .catch((err) => {});
        },
        exportBtn(){
            this.$message.warning('正在建设中！');
        },
        searchBtn(){
            rolesOptions({},{...this.searchs},{}).then((res) => {
                this.lists=res.data;
            })
            .catch((err) => {});
        }
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
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


    .app-container-left {
        padding: 10px;
        .role-header{
            padding: 20px;
        }
        .role-content{
            width: 100%;
            height: 90%;
            .role-list{
                width: 100%;
                height: 90%;
                overflow: auto;
                .role-list-items{
                    width: 100%;
                    height: 40px;
                    font-size: 14px;
                    padding: 5px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-left: 20px;
                    cursor: pointer;
                }
                .selected{
                    background: rgba(86, 116, 229, 0.1);
                    color: #5674E5;
                }
            }
        }
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
    .app-container-right{
        padding-left: 10px;
    }


}
.item-content{
    width: 100%;
    display: flex;
    .item-box{
        width: 50%;
        height: auto;
        border: 1px solid rgba(151,151,151,0.15);
        padding: 20px;
        .item-title{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .personal-box{
            display: flex;
            padding: 20px;
            align-items: center;
            width: 100%;
            height: 63px;
            background: #FAFAFA;
            box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.05);
            border-radius: 3px;
            margin-bottom: 20px;
            .avatar{
                margin-right: 12px;
                img{
                    width: 24px;
                    height: 24px;
                    box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.05);
                }
            }
            .personal-message{
                width: 80%;
                .nickname{
                    color:rgba(0, 0, 0, 0.85);
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                .deptName{
                    color: rgba(0,0,0,0.65);
                    font-size: 12px;
                }
            }
            .closeBtn{
                width: 20px;
                height: 18px;
                border:1px solid #dddddd;
                border-radius: 50%;
                cursor: pointer;
                color: #dddddd;
                text-align: center;

            }

        }
    }
    .item-box:nth-of-type(1){
        border-right: none;
    }
}
</style>