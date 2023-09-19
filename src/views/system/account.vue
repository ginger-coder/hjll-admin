<template>
    <div class="app-container">
        <el-scrollbar wrap-class="app-container-wrapper">
            <div ref="pageHead">
                <el-form ref="searchs" :model="searchs" class="form_horizontal">
                    <el-form-item label="账号搜索：" prop="keyword">
                        <el-input placeholder="请输入账号/手机号" clearable v-model="searchs.keyword" @clear="do_search" @keyup.enter.native="do_search">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="状态：" prop="state">
                        <el-select v-model="searchs.state" clearable @change="do_search">
                            <el-option v-for="item in stateData" :key="'state'+item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
                        <el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <div v-if="perOperate" class="page_handle_group">
                    <el-button type="primary" icon="el-icon-plus" v-hold-click @click="toCreate">新增</el-button>
                </div>
                <!-- 已选 -->
                <template v-if="perOperate">
                    <div class="table_selection_card">
                        已选 <span class="mcolor">{{tableSelectionIds.length}}</span> 项
                        <el-button type="text" :disabled="tableSelectionIds.length==0" @click="handleSelectionClear">清空</el-button>
                    </div>
                    <div class="sh1"></div>
                </template>
            </div>
            <template>
                <el-table :data="lists" ref="lists" fit highlight-current-row border class="no_border_table" v-loading.body="loading" element-loading-spinner="el-icon-loading" element-loading-custom-class="custom-loading" :max-height="tableMaxHeight" :row-key="getRowKey" @selection-change="handleSelectionChange" @cell-click="cell_click">
                    <el-table-column v-if="perOperate" key="selection" type="selection" :reserve-selection="true" align="center" :selectable="checkboxInit" fixed></el-table-column>
                    <el-table-column v-else key="id" type="index" width="50" align="center" label="#" fixed></el-table-column>
                    <el-table-column label="账号" width="100" prop="account" fixed>
                        <template slot-scope="scope">
                            <span class="table_cell_names_span" @click.stop="table_cell_info(scope.row)">{{scope.row.account || '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号" width="140" prop="phone">
                        <template slot-scope="scope">
                            {{scope.row.phone || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="邮箱" min-width="160" prop="email" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.email || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="角色" width="140" prop="roleName">
                        <template slot-scope="scope">
                            {{scope.row.roleName || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="140" prop="stateName">
                        <template slot-scope="scope">
                            {{scope.row.stateName || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="perOperate" label="操作" align="center" width="138" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.grade != 10" type="text" v-hold-click @click.stop="table_cell_edit(scope.row)">编辑</el-button>
                            <el-button v-if="scope.row.grade != 10" type="text" v-hold-click @click.stop="table_cell_remove(scope.row)"><span class="el-danger">删除</span></el-button>
                            <el-dropdown v-if="scope.row.grade != 10" @command="handleCommand($event,scope.row)">
                                <el-button @click.stop type="text"><i class="el-icon-more"></i></el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="scope.row.state == 1" command="state0">{{filterDictLabel(stateData,0)}}</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.state == 0" command="state1">{{filterDictLabel(stateData,1)}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-scrollbar>
        <div ref="pagePagign" class="paging_fixed_bottom">
            <div class="pagign_box disp_flex ju_bet ali_cen">
                <div>
                    <el-dropdown v-if="perOperate" @command="handleBatchCommand">
                        <el-button :disabled="tableSelectionIds.length==0">批量操作<span v-if="tableSelectionIds.length>0">（{{tableSelectionIds.length}}）</span> <i class="el-icon-arrow-up"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="state0">{{filterDictLabel(stateData,0)}}</el-dropdown-item>
                            <el-dropdown-item command="state1">{{filterDictLabel(stateData,1)}}</el-dropdown-item>
                            <el-dropdown-item command="delete" divided class="el-danger">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <el-pagination background :total="total" :page-size="pageSize" :pager-count="pagerCount" :current-page="currentPage" layout="sizes,total,prev, pager, next, jumper" :page-sizes="pageSizes" @current-change="paging_change" @size-change="size_change"></el-pagination>
            </div>
        </div>
        <!-- form -->
        <accountForm :title="moduleTitle" ref="formDialog" :org="isShowOrg" @submit="formDialogSubmit" />
        <!-- info -->
        <accountInfo :perOperate="perOperate" :title="moduleTitle" ref="infoPopup" :org="isShowOrg" @operation="InfoOperation" />
    </div>
</template>
<script>
import basic from "@/mixins/basic"
import { systemManager } from "@/api/system"

import accountForm from "./components/accountForm"
import accountInfo from "./components/accountInfo"

export default {
    components: {
        accountForm,
        accountInfo
    },
    data() {
        return {
            isShowOrg: false, //当前系统是否有组织架构
            pageFun: systemManager,
            moduleTitle: '账号',
            apiKey: 'adminId',

            stateData: [
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 }
            ]
        }
    },
    mixins: [basic],
    methods: {
        checkboxInit(row, index) {
            // 管理员账号不可删除
            return row.grade != 10
        },
        filter_page_row(row) {
            let that = this;

            row.name=row.name || row.account || '';

            row.roleno_names = row.roleno_names || '';
            row.roleName = row.roleno_names || '';

            row.stateName = '';
            row.stateName = that.filterDictLabel(that.stateData, row.state)

            return row;
        },
        orgNodeClick(orgId) {
            let that = this;

            console.log('orgNodeClick.orgId', orgId)
            that.searchs.orgId = orgId;
            that.do_search();
        },
        handleBatchCommand(command) {
            let that = this;

            let admins = [];
            that.tableAllSelection.map(item => {
                admins.push({
                    id: item.id,
                    name: item.account
                })
            })

            switch (command) {
                case 'state0':
                case 'state1':
                    that.batchModityState(command.replace('state', ''), admins);
                    break;
                case 'delete':
                    that.batchRemove(admins);
                    break;
            }
        },
        InfoOperation(type, id) {
            let that = this;

            switch (type) {
                case 'edit':
                    that.table_cell_edit({ id: id });
                    break;
            }
        }
    }
}
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
</style>