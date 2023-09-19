<template>
    <div>
        <el-dialog :title="(type!='create' ? '编辑' : '添加') + '故障' + title" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
                <el-form class="el-form-dialog" ref="form" :model="form" :rules="rules">
                    <el-form-item class="" :label="title+'名称：'" prop="name">
                        <el-input v-model="form.name" placeholder="请输入"></el-input>
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

import { validMobile, validEmail } from "@/utils/validate"
import formDailogMixin from "@/mixins/formDialog";


export default {
    props: {
        moduleType: {
            type: String,
            default: ''
        },
        pageFun: '',


    },
    data() {
        let phoneRule = (rule, value, callback) => {
            if (value) {
                if (!validMobile(value)) {
                    callback(new Error("请输入正确的手机号"));
                } else {
                    callback();
                }
            } else {
                callback(new Error("请输入手机号"));
            }
        };
        return {
            default:{
            },

            rules: {
                name: [
                    { required: true, message: `请输入名称`, tigger: 'blur' }
                ],
            },
            form: {},
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
        dialogSubmitCustom(post, next) {
            let that = this;
            
            post = post || {};
            next && next(post)
        },
        dialogCancelAfter:function(){
            var that = this
            that.$emit('success')
        },
    },
};
</script>
<style lang="scss" scoped>
</style>