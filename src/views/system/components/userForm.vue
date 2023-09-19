<template>
    <div>
        <el-dialog :title="(type!='create' ? '详情' : '添加成员') + title" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
                <el-form class="userForm" ref="form" :model="form" :rules="rules" >
                    <el-form-item  label="姓名：" prop="nickname">
                        <el-input v-model="form.nickname" placeholder="请输入"  :disabled="disabled" maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item  label="用户性别：" prop="gender">
                        <el-select v-model="form.gender" clearable  :disabled="disabled">
                            <el-option v-for="item in genderLists"  :key="'gender'+item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item> 
                    <el-form-item  label="所属部门：" >
                        <el-cascader ref="deptId" v-model="form.deptId" clearable :options="treeOrgList" 
                        :props="{ checkStrictly: true,expandTrigger: 'hover',value:'id',label:'name',leaf:'children' }"  node-key="id"  :disabled="disabled"
                         @change="change_org">         
                        </el-cascader>
                    </el-form-item>
                    <el-form-item  label="手机号码：" prop="mobile">
                        <el-input v-model="form.mobile" placeholder="请输入" maxlength="11"  :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item  label="人员类型：" prop="userType">
                        <el-select v-model="form.userType" clearable  :disabled="disabled">
                            <el-option v-for="item in userTypeList"  :key="'gender'+item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item> 
                    <el-form-item  label="入职时间：" prop="entryTime">
                        <el-date-picker v-model="form.entryTime" placeholder="请输入" type="date" value-format="yyyy-MM-dd"  :disabled="disabled"></el-date-picker>
                    </el-form-item>
                    <el-form-item  label="角色：" prop="roleIds">
                        <el-select multiple v-model="form.roleIds" clearable  :disabled="disabled">
                            <el-option v-for="item in rolesLists" :disabled="item.status===0" :key="'role'+item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="默认账号："  v-if="disabled==true">
                        <el-input v-model="form.username"   :disabled="disabled"></el-input>
                    </el-form-item>
                </el-form>
            </el-scrollbar>
            <div slot="footer" class="dialog-footer" v-if="disabled==false">
                <el-button type="primary" v-hold-click @click="dialogSubmit">确 定</el-button>
                <el-button v-hold-click @click="dialogCancel">取 消</el-button>
            </div>
            <div slot="footer" class="dialog-footer" v-else>
                    <el-button v-hold-click @click="disabled=false">编辑</el-button>
                </div>
        </el-dialog>
    </div>
</template>
<script>
import { deepClone } from "@/utils"

import { validMobile, validEmail } from "@/utils/validate"
import { rolesOptions } from "@/api/roles"
import { getDictTypesItem } from "@/api/dict"
import formDailogMixin from "@/mixins/formDialog";
import { users } from "@/api/users"

export default {
    props: {
        treeOrgList:{
            type:Array,
            default:[]
        },
        disabled:{
            type:Boolean,
            default:false
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
        return {
            pageFun:users,
            rolesLists:[],
            genderLists:[
                {label:'男',value:1},
                {label:'女',value:2}
            ],
            userTypeList:[],
            rules: {
                userType: [
                    { required: true, message: '请输入人员类型', trigger: 'change' }
                ],
                nickname: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { required: true, validator: phoneRule, trigger: 'blur' }
                ],
                deptId: [
                    { required: true, message: '请选择所属部门', trigger: 'change' }
                ],
                roleIds: [
                    { required: true, message: "请选择角色", trigger: "blur" },
                ],
                entryTime: [
                    { required: true, message: "请选择入职时间", trigger: "change" },
                ],

            },
            form: {},
        }
    },
    watch:{
        'type':function(val){
            var that = this
            if (val == 'modify') {
                that.disabled=true;
            }
            
        },
    },
    mixins: [formDailogMixin],
    created() {
        let that=this;
        that.loader_roles()
        that.loader_user()
    },
    methods: {
        loader_roles:function(){
            var that = this
            rolesOptions({name: 'options', method: 'get'})
				.then(res => {
                    that.rolesLists = res.data || []

				})
				.catch(err => {

				})
        },
        loader_user:function(){
            let that=this;
            getDictTypesItem({name:'user_type',method:'get'}).then(res=>{
				if(res.code=='0'){
					that.userTypeList = res.data|| [];
				}	
			})
        },
        change_org:function(val){
            var that = this
        },
        dialogSubmit() {
            let that = this;
            if (that.submitLoading) return;
            let post = deepClone(that.form)
            that.$refs["form"].validate((valid) => {
                if (valid) {

                    let param = {}
                    let opt = {
                        name: that.type == 'modify' ? `update` : `create`,
                        method: 'post',
                    }

                    let next = (post) => {
                        that.$loading({
                            lock: true,
                            spinner: 'el-icon-loading',
                            customClass: 'custom-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        })
                        post.deptId=post.deptId[post.deptId.length-1]
                        that.submitLoading = true;
                        that.pageFun(opt, param, post)
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

            post = post || {};
            let obj = {};
            if (post.id) obj.id = post.id;
            obj.nickname = post.nickname || '';
            obj.deptId = post.deptId|| '';
            obj.mobile = post.mobile || '';
            obj.entryTime = post.entryTime;
            obj.userType = post.userType;
            obj.gender = post.gender || '';
            obj.roleIds = post.roleIds || [];
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