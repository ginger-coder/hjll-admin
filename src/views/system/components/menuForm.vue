<template>
    <div>
        <el-dialog :title="(type!='create' ? '编辑' : '添加') + title" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
                <el-form class="userForm" ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-form-item label="菜单类型：" prop="type">
                        <el-radio-group v-model="form.type" @change="handleMenuTypeChange" >
                            <el-radio label="CATALOG">目录</el-radio>
                            <el-radio label="MENU">菜单</el-radio>
                            <el-radio label="BUTTON">按钮</el-radio>
                            <el-radio label="EXTLINK">外链</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 为按钮时，父级菜单必填 -->
                    <el-form-item  label="父级菜单：" prop="parentId">
                        <el-cascader @change="changeMenu" clearable ref="deptId" v-model="form.parentId" :options="menuLists" :props="{ checkStrictly: true,expandTrigger: 'hover',value:'id',label:'name',leaf:'children' }" :show-all-levels="false"></el-cascader>
                    </el-form-item>
                    <el-form-item  label="菜单名称：" prop="name">
                        <el-input v-model="form.name" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item label="路由路径" prop="path" v-if="form.type == 'CATALOG' || form.type == 'MENU'">
                        <el-input v-if="form.type == 'CATALOG'" v-model="form.path" placeholder="/system  (目录以/开头)" />
                        <el-input v-else v-model="form.path" placeholder="user" />
                    </el-form-item>
                    <!-- 组件页面完整路径 -->
                    <el-form-item  label="页面路径" v-if="form.type != 'BUTTON' && form.type != 'EXTLINK'" prop="component" >
                        <el-input v-model="form.component" placeholder="system/user/index" >
                            <template v-if="form.parentId != '0'" #prepend >src/views/</template >
                            <template v-if="form.parentId != '0'" #append>.vue</template>
                        </el-input>
                    </el-form-item>

                    <!-- 实际指向path地址 -->
                    <el-form-item v-if="form.type == 'MENU' || form.type == 'CATALOG'" label="跳转路径" prop="redirect" >
                        <el-input v-model="form.redirect" placeholder="system/user"  >
                        </el-input>
                    </el-form-item>

                    <!-- 按钮 -->
                    <el-form-item v-if="form.type == 'BUTTON'" label="权限标识：" prop="perm" >
                        <el-input v-model="form.perm" placeholder="sys:user:add" style="width: 95%" >
                        </el-input>
                    </el-form-item>

                    <!-- 外链 -->
                    <el-form-item v-if="form.type == 'EXTLINK'" label="外链地址：" prop="path" >
                        <el-input v-model="form.path" placeholder="请输入外链完整路径" style="width: 95%" >
                        </el-input>
                    </el-form-item>
                    <el-form-item  label="显示排序：" prop="sort">
                        <el-input-number v-model="form.sort" controls-position="right" :min="0" ></el-input-number>
                    </el-form-item>
                    <el-form-item  label="状态：" prop="visible">
                        <el-radio-group v-model="form.visible">
                            <el-radio :label="1">正常</el-radio>
                            <el-radio :label="0">禁用</el-radio>
                        </el-radio-group>
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
import { deepClone, treeDataFindRoots} from "@/utils"

import formDailogMixin from "@/mixins/formDialog";
import { menusPages, menusUpdate, menusCreate } from "@/api/menu"

export default {
    props: {
    },
    
    data() {
        return {
            dataOptions:[
                {value:1,label:'全部数据权限'},
                {value:2,label:'本部门数据权限'},
                {value:3,label:'本部门及以下数据权限'},
                {value:4,label:'本人数据'}
            ],

            rules: {
                name: [
                    { required: true, message: '请输入角色名称', tigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入角色编码', tigger: 'blur' }
                ],
                dataScope: [
                    { required: true,type:'number', message: '请选择数据权限', tigger: 'change' }
                ],
                sort: [
                    { required: true,type:'number', message: '请输入排序', tigger: 'blur' }
                ],                
                path: [
                    { required: true, message: '请输入路由路径', tigger: 'blur' }
                ],
                component: [
                    { required: true, message: '请输入页面路径', tigger: 'blur' }
                ],
                // parentId: [
                //     {required: true, message: "请选择父级菜单", trigger: 'blur'}
                // ],
            },
            form: {
            },
            menuLists:[]

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
            that.loader_menu()
            console.log(that.rules);
            
                
        },
        handleMenuTypeChange(val) {
            var that = this
            that.$set(that.form,'parentId',null)
            console.log(val);
            if(val){
                let _data = deepClone(that.menuLists)
                _data.map(item=>{
                    item = that.filter_menu(item,val)
                })
                that.menuLists = _data
            }
            
        },
        loader_menu:function(){
            var that = this
			menusPages({name: '', method: 'get'}, {size:9999,current:1,type:'CATALOG'})
				.then(res => {
                    let _list =  res.data || []

                    _list.map(item=>{
                        item = that.filter_menu(item)
                    })
                    that.menuLists = _list
                    
                    if (that.form.parentId != 0) {
                        let _parentId = that.treeDataFindRoots(that.menuLists,that.form.parentId)
                        if (_parentId && _parentId.length) {
                            that.form.parentId = _parentId
                        }
                        
                    }
                    
				})
				.catch(err => {

				})
        },
        filter_menu:function(item,type){
            var that = this
            item.disabled = false
            if (type == item.type && type == 'MENU') {
                item.disabled = true
            }else if(item.type == 'MENU' && type == 'CATALOG'){
                item.disabled = true
            }else if(item.type != 'MENU' && type == 'BUTTON'){
                item.disabled = true
            }else if(item.type != 'CATALOG' && type == 'EXTLINK'){
                item.disabled = true
            }

            if(item.children && item.children.length>0){
                
                item.children.map(k=>{
                    k = that.filter_menu(k,type)
                })
            }else if(item.children && item.children.length == 0){
                item.children = null 
            }else{
            }
            
            return item
            

        },
        changeMenu:function(val){
            var that = this
            console.log(val);
            
        },
        findDeptId:function(list,id,treeData){
            let that = this
            console.log(list,id);
            for (let i = 0; i < list.length; i++) {
                const element = list[i];

                if (element.id === id) {
                    treeData.push(element.id)
                }else{
                    
                }
                
            }
            
        },
        dialogSubmit() {
            let that = this;
            console.log(that.form);
            
            if (that.submitLoading) return;
            that.$refs["form"].validate((valid) => {
                if (valid) {
                    if (that.form.tyep == 'BUTTON') {
                        
                    }
                    let param = {}

                    let next = (post) => {
                        console.log(post);
                        
                        that.$loading({
                            lock: true,
                            spinner: 'el-icon-loading',
                            customClass: 'custom-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        })

                        that.submitLoading = true;
                        let fun = that.type =='modify'? menusUpdate :menusCreate
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
            obj.path = post.path || '';
            obj.component = post.component || 'Layout';
            obj.type = post.type || '';
            obj.sort = post.sort || '';
            obj.visible = post.visible;
            obj.redirect = post.redirect;
            if(obj.type == 'BUTTON'){obj.perm = post.perm}
            

            obj.parentId = post.parentId && post.parentId.length ? post.parentId[post.parentId.length-1] : 0;

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