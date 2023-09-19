<template>
    <div>
        <el-dialog :title="(type!='create' ? '编辑' : '添加') + '巡检' + title" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
                <el-form class="el-form-dialog" ref="form" :model="form" :rules="rules">
                    <el-form-item class="" :label="title+'名称：'" prop="name">
                        <el-input v-model="form.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item class="" label="适用专业：" prop="roleno">
                        <el-select v-model="form.roleno" clearable>
                            <el-option v-for="item in roleLists" :key="'role'+item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="" label="巡检周期：" prop="roleno">
                        <el-select v-model="form.roleno" clearable>
                            <el-option v-for="item in roleLists" :key="'role'+item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
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

import { workRoleManager } from "@/api/workRole";

export default {
    props: {
        title: {
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
            roleLists: [],

            rules: {
                account: [
                    { required: true, message: `请输入名称`, tigger: 'blur' }
                ],
                phone: [
                    { required: true, validator: phoneRule, tigger: 'blur' }
                ],
            },
            form: {}
        }
    },
    mixins: [formDailogMixin],
    watch: {
    },
    created() {
        let that=this;
        that.loader_role()

    },
    methods: {
        loader_role:function(){
            var that = this
            // console.log(workRoleManager);
            
            // workRoleManager({},{},{}).then(res=>{

            // })
			// mbConfig({ method: "post", name: "save" }, {}, _post).then((res) => {
            workRoleManager({method: "get", name:'page'}, {current: 1, size: 999}).then(res => {
                let _list = [];
                res.data.records.map((item) => {
                    _list.push({
                        label: item.name,
                        value: item.id,
                    });
                });
                that.roleLists = _list;
            });
        },
        openDialogAfter() {
            let that = this;

        },
        dialogSubmitCustom(post, next) {
            let that = this;

            post = post || {};

            let obj = {};
            if (post.id) obj.id = post.id;

            next && next(obj)
        }
    },
};
</script>
<style lang="scss" scoped>
</style>