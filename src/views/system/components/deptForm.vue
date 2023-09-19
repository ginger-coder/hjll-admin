<template>
    <div>
        <el-dialog :title="(type!='create' ? '编辑' : '添加') + '组织架构'" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
                <el-form class="el-form-dialog" ref="form" :model="form" :rules="rules">
                    <el-form-item class="el-form-item-half" label="上级：" prop="rootIds">
                        <el-cascader ref="deptCascader" clearable v-model="form.rootIds" :options="formTreeData()" :props="{ checkStrictly: true,expandTrigger: 'hover' }" @change="rootIdsChange">                      
                        </el-cascader>
                    </el-form-item>
                    <el-form-item class="el-form-item-half" label="名称：" prop="names">
                        <el-input v-model="form.names" placeholder="请输入" maxlength="20" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </el-scrollbar>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-hold-click @click="dialogSubmit">确 定</el-button>
                <el-button v-hold-click @click="dialogCancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { deepClone } from "@/utils"

import formDailogMixin from "@/mixins/formDialog"

import { emDept } from "@/api/em"

export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        treeData: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            pageFun: emDept,

            default: {
                names: '',
                names2: '',
                rootIds: [],
                summary: ''
            },

            rules: {
                names: [
                    { required: true, message: '请输入组织架构名称', tigger: 'blur' }
                ]
            },
        }
    },
    mixins: [formDailogMixin],
    watch: {
        'form.rootIds': {
            handler(val) {
                if (!this.$refs.deptCascader) return;
                if (val && val.length == 0) {
                    // 清空级联选择器选中状态
                    this.$refs.deptCascader.$refs.panel.clearCheckedNodes()
                    // 清除高亮
                    this.$refs.deptCascader.$refs.panel.activePath = []
                }
                //监听值发生变化就关闭它
                if (this.$refs.deptCascader) this.$refs.deptCascader.dropDownVisible = false;
            }
        }
    },
    computed: {
        formTreeData() {
            return () => {
                let that = this;

                let arr = deepClone(that.treeData || []);

                if (that.type == 'modify') {
                    // 不可选择自己


                    let forFn = (item, i) => {
                        if (item.id == that.form.id) {
                            item.disabled = true;
                            if (item.children) {
                                for (let j = 0; j < item.children.length; j++) {
                                    forFn2(item.children[j])
                                }
                            }
                            // break;
                        } else if (item.children) {
                            for (let j = 0; j < item.children.length; j++) {
                                forFn(item.children[j])
                            }
                        }
                    }

                    let forFn2 = (item, i) => {
                        item.disabled = true;
                        if (item.children) {
                            for (let j = 0; j < item.children.length; j++) {
                                forFn2(item.children[j])
                            }
                        }
                    }
                    for (let i = 0; i < arr.length; i++) {
                        forFn(arr[i])
                    }
                }

                return arr;
            }
        }
    },
    created() {
        let that = this;
    },
    methods: {
        rootIdsChange(){
            let that=this;

            if (that.$refs.deptCascader) that.$refs.deptCascader.dropDownVisible = false;
        },
        openDialogAfter() {
            let that = this;

            if (that.form.rootId) {
                that.form.rootIds = that.treeDataFindRoots(that.treeData, that.form.rootId)
            }
        },
        dialogSubmitCustom(post, next) {
            let that = this;

            post = post || {};

            let obj = {};
            if (post.id) obj.id = post.id;
            obj.names = post.names || '';
            obj.rootId = post.rootIds[post.rootIds.length - 1] || '';
            obj.summary = post.summary || '';
            next && next(obj)
        }
    },
};
</script>
<style lang="scss" scoped>
</style>