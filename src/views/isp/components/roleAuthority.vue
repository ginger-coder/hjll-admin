<template>
    <div class="authority-container" :style="{height:maxHeight+'px'}">
        <el-scrollbar wrap-class="authority_scrollbar_wrap" ref="authorityScrollbar">
            <el-tree ref="treeRole" :check-strictly="false" :data="roleDatas" :show-checkbox="!disabled" :expand-on-click-node="false" empty-text="暂未设置" :props="defaultProps" node-key="nodeKey" default-expand-all @check-change="tree_role_change" @node-click="nodeClick">
                <div class="custom-tree-node" :class="classObj(data)" slot-scope="{ node, data }">
                    <span class="el-tree-node__label">{{ node.label || '??' }}</span>
                </div>
            </el-tree>
            <div class="sh"></div>
            <div v-if="disabled" class="sh"></div>
        </el-scrollbar>
    </div>
</template>
<script>
import { title } from '@/settings'
import path from 'path'
import { deepClone } from '@/utils'

import routes from '@/router/routes'

import {generateTree} from '@/router/filter'

export default {
    props: {
        maxHeight: {
            type: Number,
            default: 100
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'title'
            },

            roleDatas: [],

            authority:[],

        }
    },
    watch: {
        value: function(val) {
            var that = this;

        },
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
    created(){
        let that=this;

        window.addEventListener('resize',() => {
            if(that.$refs.authorityScrollbar) that.$refs.authorityScrollbar.update()
        })
    },
    mounted() {
        let that = this;

        that.roleDatas = that.generateRoutes(routes);

        if (that.disabled) {
            that.roleDatas = [];
        }

        that.$nextTick(() => {
            that.treeLoadClass();
        })
    },
    methods: {
        treeLoadClass() {
            let inlineBlocks = document.querySelectorAll('.inlineBlock');
            for (let i = 0; i < inlineBlocks.length; i++) {
                let item = inlineBlocks[i];
                item.parentElement.parentElement.classList.add('inline')
            }
        },
        nodeClick() {
            let that = this;
            that.$nextTick(() => {
                that.treeLoadClass();
            })
        },
        generateRoutes(routes, basePath = '/') {
            const res = []

            for (let route of routes) {

                const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

                if (route.children && onlyOneShowingChild && !route.alwaysShow) {
                    route = onlyOneShowingChild
                }

                const data = {
                    nodeKey: route.nodeKey,
                    path: path.resolve(basePath, route.path),
                    title: route.meta && route.meta.title

                }

                if (route.children) {
                    data.children = this.generateRoutes(route.children, data.path)
                }
                res.push(data)
            }
            return res
        },
        onlyOneShowingChild(children = [], parent) {
            let onlyOneChild = null
            const showingChildren = children.filter(item => item)

            if (showingChildren.length === 1) {
                onlyOneChild = showingChildren[0]
                onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
                return onlyOneChild
            }

            if (showingChildren.length === 0) {
                onlyOneChild = { ...parent, path: '', noShowingChildren: true }
                return onlyOneChild
            }

            return false
        },

        tree_role_change: function(val1,val2,val3) {
            let that = this;

            const checkedKeys = that.$refs.treeRole.getCheckedKeys()

            that.$emit('treeChange', checkedKeys)


            that.authority=checkedKeys || [];

            that.$nextTick(() => {
                that.treeLoadClass();
            })
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
        generateArr(routes) {
            let data = []
            routes.forEach(route => {

                if (route.children && route.children.length > 0) {
                    const temp = this.generateArr(route.children)
                    if (temp.length > 0) {
                        data = [...data, ...temp]
                    }
                } else {
                    data.push(route.nodeKey)
                }
            })
            return data
        },
        setValues: function(authority) {
            let that = this;

            that.roleDatas=that.disabled?that.generateRoutes(generateTree(routes,'/',authority)):that.generateRoutes(routes)
            
            if (that.$refs.treeRole) {
                that.$nextTick(() => {
                    that.$refs.treeRole.setCheckedKeys(authority)
                    setTimeout(() => {
                        that.treeLoadClass();
                    },300)
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.authority-container {
    overflow: hidden;
}

::v-deep {
    .el-tree-node__expand-icon {
        display: none;
    }

    .el-tree-node__content:hover {
        background-color: transparent;
    }

    .el-tree-node__children {

        .el-tree-node.inline {
            display: inline-block;
            width: 120px;

        }
    }

    .authority_scrollbar_wrap{
        height: calc(100% + 15px);
        overflow-x:hidden;
    }
}
</style>