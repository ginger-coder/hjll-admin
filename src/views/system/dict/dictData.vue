<template>
    <div class="app-container ">
		<el-scrollbar wrap-class="app-container-wrapper">
			<div ref="pageHead">
                <div style="font-size:16px;font-weight: 500;">
                    {{ typeName + ' — ' + '数据项数据项' }}
                </div>
                <el-divider></el-divider>
                <div class="sh1"></div>
                <el-form ref="searchs" :model="searchs" class="form_horizontal">
                    <el-form-item label="数据项名称：" >
                        <el-input  placeholder="请输入数据项名称" clearable v-model="searchs.keywords" @clear="do_search" @keyup.enter.native="do_search">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
                        <el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
                    </el-form-item>
                </el-form>
				<div v-if="perOperate" class="page_handle_group">
					<el-button type="primary" icon="el-icon-plus" v-hold-click @click="toCreate()">新增</el-button>
				</div>
				<!-- 已选 -->
				<!-- <template v-if="perOperate">
                    <div class="table_selection_card">
                        已选 <span class="mcolor">{{tableSelectionIds.length}}</span> 项
                        <el-button type="text" :disabled="tableSelectionIds.length==0" @click="handleSelectionClear">清空</el-button>
                    </div>
                    <div class="sh1"></div>
                </template> -->
			</div>
			<template>
				<el-table :data="lists" ref="lists" :border="false" fit highlight-current-row :max-height="tableMaxHeight" :row-key="getRowKey" @selection-change="handleSelectionChange" @cell-click="cell_click">
					<el-table-column key="id" type="index" width="50" align="center" label="#" fixed>
						<template slot-scope="scope">
							{{ scope.$index + 1 + (currentPage - 1) * pageSize }}
						</template>
					</el-table-column>
					<el-table-column label="数据项名称" min-width="150" prop="name" >
						<template slot-scope="scope">
							{{ scope.row.name || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="数据项值" min-width="150" prop="name" >
						<template slot-scope="scope">
							{{ scope.row.value || "-" }}
						</template>
					</el-table-column> 
					<el-table-column label="状态" width="140" prop="stateName">
						<template slot-scope="scope">
                            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="table_cell_state_change(scope.row,$event)">
                            </el-switch>
						</template>
					</el-table-column>
					<!-- <el-table-column label="创建时间" width="188" prop="createTime"> 
						<template slot-scope="scope">
							{{ scope.row.createTime || "-" }}
						</template>
                    </el-table-column>
					<el-table-column label="修改时间" width="188" prop="updateTime">
						<template slot-scope="scope">
							{{ scope.row.updateTime || "-" }}
						</template>
                    </el-table-column> -->
					<el-table-column label="操作" align="center" width="138" fixed="right">
						<template slot-scope="scope">
                            <el-button type="text" v-hold-click @click.stop="table_edit(scope.row)">编辑</el-button>
							<el-button type="text" v-hold-click @click.stop="table_remove(scope.row)"><span class="el-danger">删除</span></el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</el-scrollbar>
        <div  ref="pagePagign" class="paging_fixed_bottom">
            <div class="pagign_box disp_flex ju_bet ali_cen">
                <div>
                </div>
				<el-pagination background :total="total" :page-size="pageSize" :pager-count="pagerCount" :current-page="currentPage" layout="total,prev, pager, next,sizes, jumper" :page-sizes="pageSizes" @current-change="paging_change" @size-change="size_change"></el-pagination>
            </div>
        </div>
        <dictItemForm :title="moduleTitle" ref="formDialog" :typeCode="typeCode" @submit="formDialogSubmit"/>
    </div>
</template>
<script>
import basic from "@/mixins/basic"

import { dictItemPages,dictItemUpdate,dictItemInfo,dictItemRemove } from "@/api/dict"
import { parseTime } from "@/utils";
import dictItemForm from "../components/dictItemForm"

import variables from "@/styles/variables.scss"

export default {
    components: {
        dictItemForm
    },
    data() {
        return {
            pageFun: '',
            apiKey: 'id',
            moduleTitle: '数据项',

            typeCode:'',
            typeName:'',

            searchs_default:{
            },

			loading:false,

        }
    },
    computed: {
    },
    mixins: [basic],
    created() {
        let that = this;
		let _query = this.$route.query;
		if (_query.typeCode) {
			this.typeCode = _query.typeCode
			this.typeName = _query.typeName
            that.searchs_default.typeCode = this.typeCode
		}
        that.pageFun = dictItemPages
        
    },
    mounted() {
        let that = this;
        
    },
    methods: {
        page_created:function(){
            var that = this
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
		table_cell_state_change(row, status) {
			let that = this;
			dictItemUpdate({},{},{...row,status:row.status})
				.then(res => {
					that.$message.success("修改成功");
					that.paging_change(that.currentPage);
				})
				.catch(err => {

				})
		},
        table_edit:function(row){
            var that = this
            dictItemInfo({},{},{id:row.id}).then((res) => {

				that.$refs.formDialog && that.$refs.formDialog.openDialog(res.data);
				that.$nextTick(() => {
					if (that.$refs.forms) that.$refs.forms.clearValidate()
				})
            })
            .catch((err) => {});

        },
        table_remove:function(row){
            var that = this

                that.$confirm('确定删除该数据吗', "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        dictItemRemove({},{},
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
        table_jump:function(row){
            var that = this
            
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