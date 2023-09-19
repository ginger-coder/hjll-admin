<template>
    <div>
        <el-dialog :title="(type!='create' ? '编辑' : '添加') + title" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
                <el-form class="el-form-dialog" ref="form" :model="form" :rules="rules">
                    <el-form-item class="el-form-item-half" label="账号：" prop="account">
                        <el-input v-model="form.account" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item class="el-form-item-half" label="密码：" prop="password">
                        <el-input type="password" autocomplete="new-password" v-model="form.password" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item class="el-form-item-half" label="手机号：" prop="phone">
                        <el-input v-model="form.phone" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item class="el-form-item-half" label="邮箱：" prop="email">
                        <el-input v-model="form.email" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item v-if="org" class="el-form-item-half" label="部门：" prop="rootIds">
                        <el-cascader ref="orgCascader" v-model="form.rootIds" :options="orgData" :props="{ checkStrictly: true,expandTrigger: 'hover' }" :show-all-levels="false"></el-cascader>
                    </el-form-item>
                    <el-form-item v-if="org" class="el-form-item-half" label="职位：" prop="job">
                        <el-input v-model="form.job" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item class="el-form-item-half" label="角色：" prop="roleno">
                        <el-select v-model="form.roleno" clearable>
                            <el-option v-for="item in roleData" :key="'role'+item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入备注"></el-input>
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

import { emRole } from "@/api/em"
import { systemManager } from "@/api/system"

export default {
    props: {
        org: {
            type: Boolean,
            default: false
        }
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
        let emailRule = (rule, value, callback) => {
            if (value) {
                if (!validEmail(value)) {
                    callback(new Error("请输入正确的邮箱"));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            pageFun:systemManager,

            orgData: [],
            roleData:[],

            default: {
                name: '',
                password:'',
                phone: '',
                email: '',
                orgId:'',
                job: '',
                roleno: '',
                summary: ''
            },

            rules: {
                account: [
                    { required: true, message: '请输入账号', tigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', tigger: 'blur' }
                ],
                phone: [
                    { required: true, validator: phoneRule, tigger: 'blur' }
                ],
                email: [
                    { validator: emailRule, tigger: 'blur' }
                ]
            },
            form: {}
        }
    },
    mixins: [formDailogMixin],
    watch: {
        'form.rootIds': {
            handler(val) {
                if (!this.$refs.orgCascader) return;
                if (val.length == 0) {
                    // 清空级联选择器选中状态
                    this.$refs.orgCascader.$refs.panel.clearCheckedNodes()
                    // 清除高亮
                    this.$refs.orgCascader.$refs.panel.activePath = []
                }
                //监听值发生变化就关闭它
                if (this.$refs.orgCascader) this.$refs.orgCascader.dropDownVisible = false;
            }
        }
    },
    created() {
        let that=this;

        that.filterRoleAll();
    },
    methods: {
        filterRoleAll(){
            let that=this;

            let roleData=[];
            emRole({name:'query',method:'post'},{},{state:1})
            .then(res => {
                res.map(item => {
                    roleData.push({
                        label:item.name,
                        value:item._id
                    })
                })
                that.roleData=roleData
            })
            .catch(err => {
                that.roleData=roleData
            })
        },
        openDialogAfter() {
            let that = this;

            if (that.form && that.form.id) {
                that.$set(that.form, 'password', '******')
            }
        },
        dialogSubmitCustom(post, next) {
            let that = this;

            post = post || {};

            let obj = {};
            if (post.id) obj.id = post.id;
            obj.account = post.account || '';
            obj.names = post.names || '';
            if (post.password != '******') obj.password = post.password
            obj.phone = post.phone || '';
            obj.email = post.email || '';
            obj.orgId = post.orgId || '';
            obj.job = post.job || '';
            obj.roleno = post.roleno || '';
            obj.summary = post.summary || '';
            next && next(obj)
        }
    },
};
</script>
<style lang="scss" scoped>
</style>