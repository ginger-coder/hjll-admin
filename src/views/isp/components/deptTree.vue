<template>
    <div class="app-container-left">
        <div class="app-container-left_head">
            <div class="app-container-left_head_title">企业组织架构</div>
            <el-button v-if="perOperate" type="text" icon="el-icon-plus" @click="toCreate"></el-button>
        </div>
        <div class="app-container-left_search">
            <el-input placeholder="输入关键字进行搜索" v-model="filterText">
            </el-input>
        </div>
        <el-scrollbar ref="deptTreeScroll">
            <el-tree ref="deptTree" :data="treeData" node-key="value" default-expand-all :filter-node-method="filterNode" :expand-on-click-node="false" @node-click="handleNodeClick">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="el-tree-node__label line_1_hidden">{{ node.label }}</span>
                    <span v-if="perOperate" class="el-tree-btns">
                        <el-button type="text" class="el-info" icon="el-icon-edit" size="mini" @click.stop="tree_item_edit(data)"></el-button>
                        <el-button type="text" class="el-info" icon="el-icon-delete" size="mini" @click.stop="tree_item_remove(data)"></el-button>
                    </span>
                </div>
            </el-tree>
            <div class="sh"></div>
        </el-scrollbar>
        <deptForm :title="moduleTitle" ref="deptForm" :treeData="treeData" @submit="deptSubmitAfter" />
    </div>
</template>
<script>
import utilMixin from "@/mixins/util"
import { deepClone } from "@/utils"

import { emDept } from "@/api/em"

import deptForm from "./deptForm"

export default {
    components: {
        deptForm
    },
    props:{
        perOperate:{
            type:Boolean,
            default:false
        },
        treeData:{
            type:Array,
            default:[]
        }
    },
    data() {
        return {
            moduleTitle: '组织架构',
            filterText: '',


            selectId:''
        }
    },
    watch: {
        'treeData':function (){
            let that=this;

            that.$nextTick(() => {
                if (that.treeData.length > 0 && that.$refs.deptTree) {
                    const firstNode = that.$refs.deptTree.$el.querySelector('.el-tree-node')
                    firstNode.click();
                }
            })
        },
        filterText(val) {
            this.$refs.deptTree.filter(val);
        },
    },
    mixins: [utilMixin],
    created() {
        let that = this;

        window.addEventListener('resize', function() {
            that.$refs.deptTreeScroll && that.$refs.deptTreeScroll.update()
        })
    },
    methods: {
        deptSubmitAfter() {
            let that = this;

            that.$emit('query')
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        handleNodeClick(data) {
            let that = this;

            that.selectId=data.value || '';
            that.$emit('tree-click', data.value)
        },
        toCreate() {
            let that = this;

            if (that.$refs.deptForm) that.$refs.deptForm.openDialog({
                rootId: that.selectId
            })
        },
        tree_item_remove(row) {
            let that = this;

            that
                .$confirm("你确定删除当前 组织 吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    emDept({ name: 'remove' }, { deptId: row.id })
                        .then(res => {
                            that.$message.success('删除成功')
                            that.$emit('query')
                        })
                        .catch(err => {

                        })
                })
                .catch(() => {});
        },

        request_dept_info: function(id, next) {
            let that = this;

            emDept({ name: 'info' }, {
                    deptId: id
                })
                .then((res) => {
                    res = that.filter_dept_row(res);
                    next(res)
                })
                .catch((res) => {
                    console.log('res', res)
                })
        },
        filter_dept_row(row) {
            row.id = row._id;
            return row;
        },
        tree_item_edit(row) {
            let that = this;

            that.request_dept_info(row.value, function(info) {
                if (that.$refs.deptForm) that.$refs.deptForm.openDialog(info)
            })
        }
    },
};
</script>
<style lang="scss" scoped>
</style>