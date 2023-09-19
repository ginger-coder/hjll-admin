<template>
    <div class="app-container" style="background: transparent;">
            <el-card shadow="hover">
                <div ref="pageHead">
                    <el-form ref="searchs" :model="searchs" class="form_horizontal">
                        <el-form-item label="部门名称：" >
                            <el-input  placeholder="请输入部门名称" clearable v-model="searchs.keywords" @clear="do_search" @keyup.enter.native="do_search">
                            </el-input>
                        </el-form-item>
                        <el-form-item style="float: right;">
                            <el-button type="primary" v-hold-click @click="do_search">查询</el-button>
                            <el-button  v-hold-click @click="search_reset">重置</el-button>
                            <el-button type="primary"  v-hold-click @click="toCreate()">新建部门</el-button>
                            <el-button type="primary"  v-hold-click  plain @click="exportBtn">批量导入</el-button>
                            <!-- <el-button type="primary"  v-hold-click  plain @click="exportBtn">导出</el-button> -->
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
            <el-card shadow="hover" v-loading="loading" style="margin-top: 24px;background: #fff;height: 85%;" :body-style="{height: '100%'}"
             class="m-card-full-body flex">
                <template>
                    <el-table :data="lists" ref="lists" :border="false" fit highlight-current-row :max-height="tableMaxHeight" row-key="id" @selection-change="handleSelectionChange" @cell-click="cell_click">
                        <el-table-column key="id" type="index" width="50" align="center" label="序号" fixed>
                            <template slot-scope="scope">
                                {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
                            </template>
                        </el-table-column>
                        <el-table-column label="部门名称" min-width="150" prop="name" fixed show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{ scope.row.name || "-" }}
                            </template>
                        </el-table-column>
                        <el-table-column label="负责人" min-width="150" prop="leader" fixed show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{ scope.row.leaderName || "-" }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="200" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" v-hold-click @click.stop="table_create(scope.row)">添加子部门</el-button>
                                <el-button type="text" v-hold-click @click.stop="table_edit(scope.row)" v-if="scope.row.parentId!==0">详情</el-button>
                                <el-button type="text" v-hold-click @click.stop="table_remove(scope.row)" v-if="scope.row.parentId!==0">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-card>
        
        <orgForm :title="moduleTitle" ref="formDialog" :orgLists="treeOrgList" @submit="do_refresh" :usersList="usersList"/>
        <orgDetail :title="moduleTitle" ref="detailDialog" :orgLists="treeOrgList" @submit="do_refresh" :usersList="usersList"/>
    </div>
</template>
<script>
import basic from "@/mixins/basic"

import { deptPage, deleteDepartments,deptInfo,deptUpdate,getUsersList,checkDept } from "@/api/dept"
import { parseTime } from "@/utils";
import orgForm from "./components/orgForm"
import orgDetail from "./components/orgDetail"
import variables from "@/styles/variables.scss"

export default {
    components: {
        orgForm,
        orgDetail
    },
    data() {
        return {
            pageFun: deptPage,
            apiKey: 'id',
            moduleTitle: '部门',
            searchs_default:{},

			loading:false,
            treeOrgList:[],
            usersList:[]

        }
    },
    computed: {
    },
    mixins: [basic],
    created() {
        let that = this;
    },
    mounted() {
        let that = this;
        that.loader_org()
        that.getUsersLists();
        
    },
    methods: {
        do_refresh:function(){
            var that = this
            that.loader_org()
            that.search_reset()
        },
        page_created:function(){
            var that = this
        },
        loader_org:function(){
            var that = this
			deptPage({name: '', method: 'get'}, {})
				.then(res => {
                    let _list =  res.data || []

                    _list.map(item=>{
                        item = that.filter_org(item)
                    })
                    that.treeOrgList = _list
                    
				})
				.catch(err => {

				})
        },
        filter_org:function(item){
            var that = this
            
            if(item.children && item.children.length>0){
                
                item.children.map(k=>{
                    k = that.filter_org(k)
                })
            }else if(item.children && item.children.length == 0){
                item.children = null 
            }else{
            }
            
            return item

        },
		toCreate(row) {
			let that = this;

			that.$refs.formDialog.openDialog();
		},
		table_cell_state_change(row, status) {
			let that = this;
			deptUpdate({}, {},{...row,status:row.status})
				.then(res => {
					that.$message.success("修改成功");
					that.paging_change(that.currentPage);
				})
				.catch(err => {

				})
		},
        table_create:function(row){
            var that = this
            let parentId = []
            if (row.parentId === 0) {
                parentId = [row.id]
            }else{
                parentId = [...row.treePath.split(','),row.id].slice(1).map(item=>Number(item))
            }
            that.$refs.formDialog && that.$refs.formDialog.openDialog({parentId,id:row.id});
        },
        table_edit:function(row){
            var that = this
            that.loader_org()
            deptInfo({},{userId:row.id}).then((res) => {

				that.$refs.detailDialog && that.$refs.detailDialog.openDialog(res.data);
				that.$nextTick(() => {
					if (that.$refs.forms) that.$refs.forms.clearValidate()
				})
            })
            .catch((err) => {});

        },
        table_remove:function(row){
            var that = this
            checkDept({},{id:row.id},{},).then((res) => {
                if(res.code==4099||res.code==4066){
                     that.$confirm(res.msg, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(() => {
                            deleteDepartments({},{ids:row.id,errorCode:res.code},{},)
                                .then((res2) => {
                                    that.$message.success("删除成功");
                                    that.paging_change(that.currentPage);
                                })
                                .catch((err) => {});
                           
                        })
                        .catch(() => {});
                }
            }).catch((err) => {});
           
        },
        getUsersLists(){
            getUsersList({}, {})
				.then(res => {
                    console.log(res.data)
                    this.usersList=res.data;
                    
				})
				.catch(err => {

				})
        },
        exportBtn(){
            this.$message.warning('正在建设中！');
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
</style>