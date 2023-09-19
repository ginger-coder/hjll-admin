<template>
    <div>
        <el-dialog :title="(type!='create' ? '编辑' : '添加') + title" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
                <el-form class="userForm" ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-form-item  label="字典名称：" prop="name">
                        <el-input v-model="form.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item  label="字典编码：" prop="code">
                        <el-input v-model="form.code" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item  label="状态：" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio :label="1">正常</el-radio>
                            <el-radio :label="0">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item  label="备注：" prop="remark">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入"></el-input>
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

import formDailogMixin from "@/mixins/formDialog";
import {dictUpdate, dictCreate } from "@/api/dict"

export default {
    props: {
    },
    data() {
        return {

            rules: {
                name: [
                    { required: true, message: '请输入字典名称', tigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入字典编码', tigger: 'blur' }
                ],
                status: [
                    { required: true,type:'number', message: '请选择', tigger: 'change' }
                ],
            },
            form: {
            }
        }
    },
    mixins: [formDailogMixin],
    watch: {
    },
    created() {
        let that=this;
        
    },
    methods: {
        openDialogAfter() {
            let that = this;
        },
        dialogSubmit() {
            let that = this;
            console.log(that.form);
            
            if (that.submitLoading) return;
            that.$refs["form"].validate((valid) => {
                if (valid) {

                    let param = {}

                    let next = (post) => {
                        that.$loading({
                            lock: true,
                            spinner: 'el-icon-loading',
                            customClass: 'custom-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        })

                        that.submitLoading = true;

                        let fun = that.type =='modify'? dictUpdate :dictCreate
                        fun({}, param, post)
                            .then(() => {
                                that.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                that.$emit('submit', that.form)
                                that.dialogCancel();
                                that.submitLoading = false;
                                that.$loading().close()
                            })
                            .catch((res) => {
                                console.log('res', res)
                                that.submitLoading = false;
                                that.$loading().close()
                            })
                    }

                    let post = deepClone(that.form)
                    if (that.dialogSubmitCustom) {
                        that.dialogSubmitCustom(post, next)
                    } else {
                        next && next(post);
                    }
                }
            });
        },
        dialogSubmitCustom(post, next) {
            let that = this;

            let opt = {
                name: that.type == 'modify' ?  `update${that.moduleType}` : ``,
                method: 'post',
            }

            post = post || {};

            let obj = {};
            if (post.id) obj.id = post.id;
            obj.name = post.name || '';
            obj.code = post.code || '';
            obj.remark = post.remark || '';
            obj.status = post.status || 0;
            // if (post.password != '******') obj.password = post.password
            next && next(obj)
        }
    },
};
</script>
<style lang="scss" scoped>
.userForm{
    ::v-deep{
        .el-input,
        .el-select,
        .el-cascader
        {
            width: 100%;
        }
    }
}
</style>