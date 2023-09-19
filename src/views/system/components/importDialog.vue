<template>
    <div>
        <el-dialog title="用户导入" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
                <el-form class="userForm" ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-form-item  label="部门：" prop="deptId">
                        <el-cascader ref="deptId" v-model="form.deptId" :options="treeOrgList" :props="{ checkStrictly: true,expandTrigger: 'hover',value:'value',label:'label',leaf:'children' }" :show-all-levels="false" @change="change_org">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item  label="角色：" prop="roleIds">
                        <el-select multiple v-model="form.roleIds" clearable>
                            <el-option v-for="item in rolesLists" :disabled="item.status===0" :key="'role'+item.label" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="Excel：" prop="file">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            drag
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :on-remove="removeFile"
                            :file-list="fileList"
                            :on-change="changeFile"
                            :multiple="false"
                            :auto-upload="false">
                            <div  slot="trigger">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            </div>
                        <div slot="tip" class="el-upload__tip">xls/xlsx files</div>
                        </el-upload>
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

import { rolesOptions } from "@/api/roles"
import { users } from "@/api/users"
import uploadFiles from "@/components/custom/uploadFile";
export default {
    components: {
        uploadFiles,
    },
    props: {
        treeOrgList:{
            type:Array,
            default:[]
        },
    },
    data() {
		let fileRule = (rule, value, callback) => {
            if (value) {
				callback();
            }else{
                callback(new Error("请上传文件"));
            }
		};
        return {
            pageFun:users,

            fileList:[],

            rolesLists:[],

            rules: {
                deptId: [
                    { required: true,type:'array', message: '请选择所属部门', tigger: 'change' }
                ],
                roleIds: [
                    { required: true,type:'array', message: '请选择角色', tigger: 'change' }
                ],
                file: [
                    { required: true, validator: fileRule, message: '请选择上传文件', tigger: 'change' }
                ],
            },
            form: {
            },
        }
    },
    mixins: [formDailogMixin],
    watch: {
    },
    created() {
        let that=this;
        that.loader_roles()
    },
    methods: {
        openDialogAfter() {
            let that = this;
            that.$nextTick(()=>{
                this.$refs['form'].clearValidate(['roleIds']);
                if( this.$refs['upload'] )this.$refs['upload'].clearFiles();
            })
        },
        loader_roles:function(){
            var that = this
            rolesOptions({name: 'options', method: 'get'})

				.then(res => {
                    that.rolesLists = res.data || []
				})
				.catch(err => {

				})
        },
        change_org:function(){
            var that = this
            
        },
        removeFile:function(file, fileList){
            var that = this
            
        },
        changeFile:function(file, fileList){
            var that = this
            if (fileList && fileList.length) {

                that.form.file = file.raw
            }
            console.log(that.form);
        },
        dialogSubmit() {
            let that = this;
            if (that.submitLoading) return;
            let post = that.form
            that.$refs["form"].validate((valid) => {
                if (valid) {

                    let next = (post) => {
                        console.log(post);
                        
                        that.$loading({
                            lock: true,
                            spinner: 'el-icon-loading',
                            customClass: 'custom-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        })

                        that.submitLoading = true;
                        users({name: '_import', method: 'post'}, {}, post)
                            .then(() => {
                                that.$message({
                                    message: '导入成功',
                                    type: 'success'
                                });
                                that.$emit('submit', that.form)
                                that.dialogCancel();
                                that.submitLoading = false;
                                that.$loading().close()

                                // that.fileList = []
                                if (that.$refs.upload) {
                                    that.$refs.upload.clearFiles()
                                }
                            })
                            .catch((res) => {
                                console.log('res', res)
                                that.submitLoading = false;
                                that.$loading().close()
                                if (that.$refs.upload) {
                                    that.$refs.upload.clearFiles()
                                }
                            })
                    }

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

            let obj = new FormData();
            obj.append('deptId',post.deptId[post.deptId.length-1])
            obj.append('roleIds',post.roleIds)
            obj.append('file',post.file)
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