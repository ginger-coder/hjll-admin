<template>
    <div>
        <el-dialog :title="(type!='create' ? '编辑' : '添加') + title" :visible.sync="isShow"  :lock-scroll="true" :before-close="dialogCancel">
            <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper2">
                <el-form class="userForm" ref="form" :model="form" :rules="rules" >
                    <el-form-item  label="角色名称：" prop="name">
                        <el-input v-model="form.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <!-- <el-form-item  label="角色编码：" prop="code">
                        <el-input v-model="form.code" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item  label="数据权限：" prop="dataScope">
                        <el-select v-model="form.dataScope" placeholder="请选择">
                            <el-option v-for="item in dataOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="显示排序：" prop="sort">
                        <el-input-number v-model="form.sort" controls-position="right" :min="0" ></el-input-number>
                    </el-form-item>
                    <el-form-item  label="状态：" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio :label="1">正常</el-radio>
                            <el-radio :label="0">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item> -->
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
import { rolesCreate, rolesUpdate } from "@/api/roles"

export default {
    props: {
    },
    data() {
        return {
            pageFun:rolesCreate,

            dataOptions:[
                {value:1,label:'全部数据权限'},
                {value:2,label:'本部门数据权限'},
                {value:3,label:'本部门及以下数据权限'},
                {value:4,label:'本人数据'}
            ],

            rules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                // code: [
                //     { required: true, message: '请输入角色编码', tigger: 'blur' }
                // ],
                // dataScope: [
                //     { required: true,type:'number', message: '请选择数据权限', tigger: 'change' }
                // ],
                // sort: [
                //     { required: true,type:'number', message: '请输入排序', tigger: 'blur' }
                // ],
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
            console.log(that.form);
            that.$nextTick(()=>{
                this.$refs['form'].clearValidate(['roleIds']);
                // 寻找该组织所在的组织id
                
            })
        },
        change_org:function(val){
            var that = this
            console.log(val);
            
        },
        dialogSubmit() {
            let that = this;
            
            if (that.submitLoading) return;
            let post = deepClone(that.form)
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

                        let fun = that.type =='modify'? rolesUpdate :rolesCreate
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

            post = post || {};

            let obj = {};
            if (post.id) obj.id = post.id;
            obj.name = post.name || '';
            obj.code = post.code || '';
            obj.dataScope = post.dataScope || ''
            obj.sort = post.sort || '';
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