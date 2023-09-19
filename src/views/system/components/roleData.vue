<template>
    <div>
        <el-dialog title="资源分配" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
                <el-tree 	 ref="treeRole" :check-strictly="true" :data="roleDatas" :show-checkbox="true" :expand-on-click-node="false" empty-text="暂未设置" node-key="value" default-expand-all @check-change="tree_role_change" @node-click="nodeClick">
                    <div class="custom-tree-node" :class="classObj(data)" slot-scope="{ node, data }">
                        <span class="el-tree-node__label">{{ node.label || '??' }}</span>
                    </div>
                </el-tree>
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
import { rolesUpdate, rolesMenu } from "@/api/roles"
import { menusQuery } from "@/api/menu"

export default {
    props: {
    },
    data() {
        return {
            roleDatas:[],
            form: {
            },


        }
    },
    mixins: [formDailogMixin],
    watch: {
    },
    computed: {
        classObj() {
            return (data) => {
                return {
                    'inlineBlock': data.nodeKey && (data.nodeKey.includes('Info') || data.nodeKey.includes('Operate'))
                };
            }
        }
    },
    created() {
        let that=this;
        
        that.$nextTick(() => {
            that.treeLoadClass();
        })
    },
    methods: {
        openDialogAfter() {
            let that = this;
            console.log(that.form);
            
            that.loader_menus()
            that.$nextTick(()=>{
                if (that.form.menuIds && that.form.menuIds.length) {
                    that.$refs.treeRole.setCheckedKeys(that.form.menuIds)
                }
            })
        },
        loader_menus:function(){
            var that = this
            menusQuery().then((res)=>{
                that.roleDatas  = res.data || []
            })
        },
        treeLoadClass() {
            let inlineBlocks = document.querySelectorAll('.inlineBlock');
            for (let i = 0; i < inlineBlocks.length; i++) {
                let item = inlineBlocks[i];
                item.parentElement.parentElement.classList.add('inline')
            }
        },
        nodeClick(val) {
            let that = this;
            console.log(val);
            
            that.$nextTick(() => {
                that.treeLoadClass();
            })
        },
        tree_role_change: function(val1,val2,val3) {
            let that = this;
            
            const checkedKeys = that.$refs.treeRole.getCheckedNodes(false, true).map(item=>item.value)
            // console.log(checkedKeys);
            
            // that.$emit('treeChange', checkedKeys)
            that.form.menuIds = checkedKeys
            



            that.$nextTick(() => {
                that.treeLoadClass();
            })
        },
        dialogCancelAfter:function(){
            var that = this
            that.clear()
        },
        clear: function() {
            let that = this;

            if (that.$refs.treeRole) {
                that.changeTreeNodeStatus(that.$refs.treeRole.store.root, false)
                that.$refs.treeRole.setCheckedKeys([]);
            }

        },
        // 改变节点的状态
        changeTreeNodeStatus(node, value) {
            node.expanded = value
            for (let i = 0; i < node.childNodes.length; i++) {
                // 改变节点的自身expanded状态
                node.childNodes[i].expanded = value
                // 遍历子节点
                if (node.childNodes[i].childNodes.length > 0) {
                    this.changeTreeNodeStatus(node.childNodes[i], value)
                }
            }
        },
        dialogSubmitCustom(post, next) {
            let that = this;

            post = post || {};

            let obj = post.menuIds || [];
            // if (post.password != '******') obj.password = post.password
            next && next(obj)
        },
        dialogSubmit() {
            let that = this;
            
            if (that.submitLoading) return;

            let param = {}

            let next = (post) => {
                that.$loading({
                    lock: true,
                    spinner: 'el-icon-loading',
                    customClass: 'custom-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })

                that.submitLoading = true;

                rolesMenu({}, {id:that.form.roleId}, post)
                    .then(() => {
                        that.$message({
                            message: '提交成功',
                            type: 'success'
                        });
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
        },
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