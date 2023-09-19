<template>
    <div>
        <el-drawer :title="(type!='create' ? '编辑' : '新建') + title" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <!-- <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper"> -->
            <div style="padding:20px">
                <el-form class="userForm" ref="form" :model="form" :rules="rules" >
                    <el-form-item  label="部门名称：" prop="name">
                        <el-input v-model="form.name" placeholder="请输入" maxlength="20" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item  label="上级部门：" prop="parentId">
                        <el-cascader clearable ref="deptId" v-model="form.parentId" @change="change_org" :options="treeData" :props="{ checkStrictly: true,expandTrigger: 'hover',value:'id',label:'name',leaf:'children' }" :show-all-levels="false" :disabled="disabled"> 
                        </el-cascader>
                    </el-form-item>
                    <el-form-item  label="部门负责人：" >
                        <el-select v-model="form.leader" placeholder="请选择" filterable :disabled="disabled">
                            <el-option
                            v-for="item in usersList"
                            :key="item.id"
                            :label="item.nickname"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="管辖区域范围：" >
                        <el-radio-group v-model="form.ranges" :disabled="disabled">
                            <el-radio label="all">全部</el-radio>
                            <el-radio label="part">部分</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item  label="区域："  v-if="form.ranges=='part'">
                        <el-tree
                            :data="regionCodeList"
                            show-checkbox
                            node-key="code"
                            v-model="form.regionCode"
                            @check="getRegionCode"
                            :disabled="disabled"
                            :default-checked-keys="form.regionCode"
                            :props="defaultProps">
                        </el-tree>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align: right;" v-if="disabled==false">
                    <el-button type="primary" v-hold-click @click="dialogSubmit">确 定</el-button>
                    <el-button v-hold-click @click="dialogCancel">取 消</el-button>
                </div>
                <div slot="footer" class="dialog-footer" style="text-align: right;" v-else>
                    <el-button v-hold-click @click="disabled=false">编辑</el-button>
                </div>
            </div>
            <!-- </el-scrollbar> -->
           
        </el-drawer>
    </div>
</template>
<script>
import { deepClone, treeDataFindRoots } from "@/utils"
import formDailogMixin from "@/mixins/formDialog";
import { deptCreate, dept,deptUpdate,getAllRegionList } from "@/api/dept"

export default {
    props: {
        orgLists:{
            type:Array,
            default:[]
        },
        usersList:{
            type:Array,
            default:[]
        }
    },
    data() {
        return {
            pageFun:dept,
            rules: {
                name: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' }
                ],
                leader: [
                    { required: true, message: "请选择部门负责人", trigger: "change" },
                ],
                parentId: [
                    { required: true, message: "请选择上级部门", trigger: "change" },
                ],
                ranges:[
                    { required: true, message: "请选择管辖区域范围", trigger: "change" },
                ],
                regionCode:[
                    { required: true, message: "请选择管辖区域范围", trigger: "blur" },
                ],
            },
            form: {
            },
            disabled:true,
            treeData:[],
            regionCodeList:[],
            defaultProps: {
                children: 'childArea',
                label: 'name',
                id:'code'
            }
        }
    },
    mixins: [formDailogMixin],
    watch:{
        'type':function(val){
            var that = this
            if (val == 'modify') {
                that.filter_org(that.treeData,that.form.id)
                that.disabled=true;
            }
            
        },
    },
    created() {
        let that=this;
        that.getAllRegion();
        
    },
    methods: {
        openDialogAfter() {
            let that = this;
            that.treeData = deepClone(that.orgLists)
            that.$nextTick(()=>{
                this.$refs['form'].clearValidate(['roleIds']);
                // 寻找该组织所在的组织id
                if (that.form.id) {
                    that.disabled=true;
                }else{
                    that.disabled=false;
                }
            })
        },
        filter_org:function(list,id){
            var that = this
            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                if (element.id === id) {
                    element.disabled = true
                    return 
                }else{
                    if (element.children && element.children.length) {
                        that.filter_org(element.children,that.form.id)
                    }
                }
                
            }

        },
        change_org:function(val){
            var that = this
            
        },
        getRegionCode(e,node){
            this.form.regionCode=node.checkedKeys;
        },
        getAllRegion(){
            getAllRegionList({},{}).then((res)=>{
                this.regionCodeList=res.data;
            })
        },
        dialogSubmit() {
            let that = this;
            
            if (that.submitLoading) return;
            that.$refs["form"].validate((valid) => {
                if (valid) {

                    let param = {}
                    if(that.form.ranges=='part'&&that.form.regionCode==undefined){
                        return  that.$message({message: '请选择管辖区域',type: 'warning'});
                    }
                    let next = (post) => {
                        that.$loading({
                            lock: true,
                            spinner: 'el-icon-loading',
                            customClass: 'custom-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        })
                        that.submitLoading = true;
                        let fun = that.type =='modify'? deptUpdate :deptCreate
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
            obj.ranges = post.ranges || '';
            obj.leader = post.leader || '';
            obj.parentId = post.parentId;
            obj.regionCode = post.regionCode;
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