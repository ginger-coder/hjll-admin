<template>
    <div class="app-container">
        <el-scrollbar wrap-class="app-container-wrapper">
            <div ref="pageHead">
                <el-form ref="searchs" :model="searchs" class="form_horizontal">
                    <el-form-item label="关键字：" prop="keyword">
                        <el-input placeholder="请输入" clearable v-model="searchs.keyword" @clear="do_search" @keyup.enter.native="do_search">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-hold-click @click="do_search">筛选</el-button>
                        <el-button v-hold-click @click="search_reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <div class="page_handle_group">
                    <el-button type="primary" icon="el-icon-reading">全部标注已读</el-button>
                    <el-button type="primary" icon="el-icon-reading">当前页标注已读</el-button>
                </div>
            </div>
            <template>
                <el-table :data="lists" ref="lists" fit highlight-current-row :border="false" v-loading.body="loading" element-loading-spinner="el-icon-loading" element-loading-custom-class="custom-loading" :max-height="tableMaxHeight">
                    <el-table-column type="index" width="66" align="center" label="序号"></el-table-column>
                    <el-table-column label="标题" min-width="300" prop="title" show-overflow-tooltip></el-table-column>
                    <el-table-column label="已读/未读" width="100" prop="author">
                        <template slot-scope="scope">
                            {{scope.row.author || '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="发布时间" width="188" prop="updateTime"></el-table-column>
                    <el-table-column label="操作" align="center" width="88" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" v-hold-click @click.stop="table_cell_info(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-scrollbar>
        <div ref="pagePagign" class="paging_fixed_bottom">
            <div class="pagign_box disp_flex ju_end ali_cen">
                <el-pagination background :total="total" :page-size="pageSize" :pager-count="pagerCount" :current-page="currentPage" layout="sizes,total,prev, pager, next, jumper" :page-sizes="pageSizes" @current-change="paging_change" @size-change="size_change"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import imagesBox from "@/components/custom/imagesBox";
import uploadPics from "@/components/custom/uploadPics";
import tinymceEditor from "@/components/custom/tinymceEditor";

import { parseTime, numInput, amount_format, fileDownload } from "@/utils";


import basic from "@/mixins/basic"

import { tableList } from "@/api/demo"

export default {
    components: {
        imagesBox,
        uploadPics,
        tinymceEditor
    },
    data() {
        return {
            pageFun: tableList,
            apiUrl: 'table',
            apiKey: 'id',

            rules: {
                title: [{ required: true, message: "请输入标题", tigger: "blur" }],
                author: [{ required: true, message: "请输入作者", tigger: "blur" }],
                remark: [{ required: true, message: "请输入内容", tigger: "blur" }],
            },

            priority_popover: {
                id: '',
                isshow: false,
                priority: 0,
            },

            options: [
                { label: '选项一', value: 'value1' },
                { label: '选项二', value: 'value2' },
            ],
        };
    },
    mixins: [basic],
    methods: {
        page_created() {},
        page_mounted() {},
        filter_page_row(row) {
            row.rate = row.rate || Math.floor(Math.random() * 5)
            row.priority = 0;
            row.priorityShow = false;
            return row;
        },
        errorHandler() {
            return true
        },
        switch_change: function(val, row, index) {
            let that = this;

            that.lists[index].isswitch = val;

            that.$message({
                message: "设置成功",
                type: "success",
            });
        },
        test(row) {
            let that = this;

            that.priority_popover.id = row.id;
            that.priority_popover.priority = row.priority || 0;
            that.priority_popover.isShow = true;
        },
        show_priority_popover: function(index, row) {
            let that = this;
            if (that.priority_popover.isShow) return;

            that.priority_popover.id = row.id;
            that.priority_popover.priority = row.priority || 0;
            that.priority_popover.isShow = true;
        },
        hide_priority_popover: function() {
            let that = this;

            that.priority_popover.isShow = false;
            that.priority_popover.priority = 0;
            that.priority_popover.id = '';
        },
        // priority_popover_submit: function(index, id) {
        //   let that = this;

        //   var _post = {
        //     id: id,
        //     priority: that.priority_popover.priority
        //   }
        //   that.$store.dispatch(
        //       `${taht.apiUrl}/modify`,
        //       _post
        //     )
        //     .then(() => {
        //       that.hide_priority_popover(index);
        //       that.paging_change(that.currentPage)
        //     }).catch((err) => {
        //       console.log('err', err)
        //     })
        // },
        priorityInput: function(val) {
            let that = this;
            if (typeof(val) != 'number') {
                val = Number(numInput(val))

                that.priority_popover.priority = val;
            }

        },
        priority_popover_submit: function(index, id) {
            let that = this;

            that.lists[index].priority = that.priority_popover.priority
            that.hide_priority_popover();

        },
        // mock临时 正常去掉直接使用basic中的
        request_info: function(id, next) {
            var that = this;

            let res = that.lists.find(item => item.id == id) || {}

            res = that.filter_row(res);
            next(res)
        },
        form_dialog_submit: function() {
            let that = this;

            that.$refs["forms"].validate((valid) => {
                if (valid) {
                    if (!that.isedit) {
                        that.$message({
                            message: "添加成功",
                            type: "success",
                        });
                        that.lists.push({ ...that.forms });
                    } else {
                        that.$message({
                            message: "修改成功",
                            type: "success",
                        });
                    }
                    that.form_dialog_cancel();
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
</style>