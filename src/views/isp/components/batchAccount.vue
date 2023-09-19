<template>
    <div>
        <el-dialog title="关联账号" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <div class="border_wrap" v-loading.body="loading" element-loading-spinner="el-icon-loading" element-loading-custom-class="custom-loading">
                <div ref="leftWrap" class="left_wrap">
                    <div ref="leftWrapHead">
                        <div class="left_wrap_head">
                            <el-input v-model="keyword" suffix-icon="el-icon-search" placeholder="输入姓名" clearable></el-input>
                            <el-breadcrumb separator="/">
                                <el-breadcrumb-item v-for="(item,index) in leftBreadcrumb" :key="''+item.va">
                                    <template v-if="(index+1)==leftBreadcrumb.length">
                                        {{item.name}}
                                    </template>
                                    <a href="javascript:;" v-else @click="toLevel(item,index)">{{item.name}}</a>
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                        <div class="tree_li">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        </div>
                    </div>
                    <div ref="leftWrapBody">
                        <el-scrollbar ref="leftWrapBodyScroll">
                            <template v-if="!keyword">
                                <template v-for="item in leftData">
                                    <div class="tree_li" :key="'left'+item.value"> 
                                        <el-checkbox v-if="item.type == 'account'" v-model="item.checked" @change="itemChange($event,item)">{{item.name}}</el-checkbox>
                                        <template v-else-if="item.type == 'org'">
                                            <div class="line_1_hidden org_name">
                                                {{item.name}}
                                            </div>
                                            <div v-if="item.type == 'org'" class="pointer lower_btn" @click="toNextLevel(item)">
                                                <svg-icon icon-class="org" />
                                                下级
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </template>
                            <template v-else>
                                <template v-for="item in leftSeartchData">
                                    <div class="tree_li" :key="'left'+item.value">
                                        <el-checkbox v-if="item.type == 'account'" v-model="item.checked" @change="itemChange($event,item)">{{item.name}}</el-checkbox>
                                        <template v-else-if="item.type == 'org'">
                                            <div class="line_1_hidden org_name">
                                                {{item.name}}
                                            </div>
                                            <div v-if="item.type == 'org'" class="pointer lower_btn" @click="toNextLevel(item)">
                                                <svg-icon icon-class="org" />
                                                下级
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </template>
                        </el-scrollbar>
                    </div>
                </div>
                <div ref="rightWrap" class="right_wrap">
                    <template v-if="checkData.length>0">
                        <div ref="rightWrapHead" class="right_wrap_head">
                            <span>已选：（{{checkData.length}}）</span>
                            <el-button size="mini" type="text" @click="clearCheck">清空</el-button>
                        </div>
                        <div ref="rightWrapBody">
                            <el-scrollbar ref="rightWrapBodyScroll">
                                <div class="tree_li" v-for="item in checkData" :key="'check'+item.value">
                                    <div class="tree_li_name">{{item.name}}</div>
                                    <i class="el-icon-close color pointer" @click="toDelCheck(item)"></i>
                                </div>
                            </el-scrollbar>
                        </div>
                    </template>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-hold-click @click="dialogSubmit">确 定</el-button>
                <el-button v-hold-click @click="dialogCancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { deepClone } from "@/utils"
import { title } from "@/settings"

import { systemManager } from "@/api/system"

export default {
    data() {
        return {
            isShow: false,
            title: title,
            leftBreadcrumb: [],

            keyword: '',
            leftData: [],
            leftSeartchData: [],
            checkData: [],
            checkDataInit: [],

            loading: false,

            checkAll: false,
            isIndeterminate: false
        }
    },
    watch: {
        'keyword': function(val) {
            let that = this;
            that.leftSeartchData = val ? that.leftData.filter(item => item.name.search(val) > -1) : [];
        },
        'leftData': function() {
            let that = this;

            that.filterCheckAll()
        },
        'checkData': function() {
            let that = this;

            that.leftData.map(item => {
                if (item.type == 'account') {
                    item.checked = that.filterCheckState(item.value)
                }
            })

            that.filterCheckAll()
        }
    },
    created() {
        let that = this;

        window.addEventListener('resize', () => {
            that.filterLeftWrapBody()
        })

        that.toNextLevel({
            level: 0,
            name: title
        })

    },
    methods: {
        // 左侧高度
        filterLeftWrapBody() {
            let that = this;

            if (!that.isShow) return;

            let minHeight = 80;

            // 左侧滚动区域
            let leftWrapHeight = getComputedStyle(that.$refs.leftWrap).height || 0;
            let leftWrapHeadHeight = getComputedStyle(that.$refs.leftWrapHead).height || 0;
            let leftWrapBodyHeight = leftWrapHeight.replace('px', '') - leftWrapHeadHeight.replace('px', '')
            leftWrapBodyHeight = leftWrapBodyHeight < minHeight ? minHeight : leftWrapBodyHeight
            that.$refs.leftWrapBody.style.height = leftWrapBodyHeight + 'px'
            that.$refs.leftWrapBodyScroll.update()

            // 右侧滚动区域
            let rightWrapHeight = getComputedStyle(that.$refs.rightWrap).height || 0;
            let rightWrapHeadHeight = getComputedStyle(that.$refs.rightWrapHead).height || 0;
            let rightWrapBodyHeight = rightWrapHeight.replace('px', '') - rightWrapHeadHeight.replace('px', '')
            rightWrapBodyHeight = rightWrapBodyHeight < minHeight ? minHeight : rightWrapBodyHeight
            that.$refs.rightWrapBody.style.height = rightWrapBodyHeight + 'px'
            that.$refs.rightWrapBodyScroll.update()
        },
        // 全选状态
        filterCheckAll() {
            let that = this;

            let leftCheckLength = 0;

            let leftAccountData = that.leftData.filter(item => {
                return item.type == 'account'
            });
            let leftAccountCheckData = leftAccountData.filter(item => {
                return item.checked
            });
            that.checkAll = leftAccountData.length == leftAccountCheckData.length ? true : false;
            that.isIndeterminate = leftAccountCheckData.length > 0 ? true : false;
            that.isIndeterminate = that.checkAll ? false : that.isIndeterminate;
        },
        openDialog(arr) {
            let that = this;
            that.isShow = true;

            that.$nextTick(() => {
                that.filterLeftWrapBody()
            })

            that.checkDataInit = deepClone(arr)
            that.checkData = deepClone(arr)
        },
        dialogCancel() {
            let that = this;

            that.isShow = false;
            that.$loading().close()

            setTimeout(() => {
                that.leftData = [];
                that.leftBreadcrumb = [];
                that.checkData = [];
                that.checkDataInit = [];
                that.toNextLevel({
                    level: 0,
                    name: title
                })
            }, 300)
        },
        dialogSubmit() {
            let that = this;

            if (that.checkData.length == 0) {
                that.$message.warning('未选择账号')
                return;
            }

            that.$loading({
                lock: true,
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                customClass: 'custom-loading'
            })

            let setArray = [];
            that.checkData.map(item => {
                setArray.push({
                    name: item.name,
                    value: item.value
                })
            })
            let removeArray = [];
            that.checkDataInit.map(item => {
                let isHas=that.checkData.find(row => row.value == item.value)
                if(!isHas) {
                    removeArray.push({
                        name: item.name,
                        value: item.value
                    })
                }
            })

            that.$emit('submit', setArray,removeArray)
            that.dialogCancel();
        },
        itemChange(value, row) {
            let that = this;

            if (value && row.type == 'account') {
                let json = row
                that.checkData.push(json)
            } else {
                that.toDelCheck(row)
            }
        },
        toDelCheck(row) {
            let that = this;

            that.checkData = that.checkData.filter(item => item.value != row.value);
        },
        toNextLevel(row) {
            let that = this;

            that.loading = true;
            that.leftData = [];

            that.leftBreadcrumb.push({
                level: row.level,
                name: row.name,
                value: row.value
            })

            that.$nextTick(() => {
                that.filterLeftWrapBody()
            })

            systemManager({ name: 'query', method: 'post' }, {}, { state: 1 })
                .then(res => {
                    res.map((item, i) => {
                        item.id = item._id;
                        if (item.grade != 10) {
                            that.leftData.push({
                                name: item.names || item.name || item.account,
                                value: item.id,
                                type: 'account',
                                checked: that.filterCheckState(item.id)
                            })
                        }
                    })
                    that.loading = false;
                })
                .catch(err => {
                    that.loading = false;
                })
        },
        toLevel(row, index) {
            let that = this;
            that.leftBreadcrumb.splice(index)

            that.toNextLevel(row)
        },
        filterCheckState(val) {
            let that = this;

            let find = that.checkData.find(item => item.value == val)
            return Boolean(find && find.value);
        },
        clearCheck() {
            let that = this;

            that.checkData = [];
        },
        handleCheckAllChange(val) {
            let that = this;

            let leftAccountData = that.leftData.filter(item => {
                return item.type == 'account'
            });
            leftAccountData.map(item => {
                if (val) that.checkData.push(item)
                else that.toDelCheck(item)
            })
        }
    },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.tree_li {
    padding: 0 15px;
    line-height: 40px;
    display: flex;
    align-items: center;

    &:hover {
        background-color: #F2F6FC;
    }

    .el-checkbox {
        display: block;
        width: 100%;
    }

    .org_name {
        display: inline-block;
        width: 260px;
    }

    .lower_btn {
        display: inline-flex;
        font-size: 12px;
        padding: 0 10px;
        line-height: 30px;
        align-items: center;
        color: #606266;

        ::v-deep {
            .svg-icon {
                font-size: 14px;
                margin-right: 4px;
            }
        }

        &:hover {
            color: $mcolor;
        }

    }

    .tree_li_name {
        display: inline-block;
        width: 300px;
    }

    .el-icon-close {
        &:hover {
            color: $mcolor;
        }
    }
}

::v-deep {
    .el-checkbox__label {
        font-weight: 400;
    }

    .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #606266;
    }
}



.border_wrap {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    height: 100%;
    overflow: hidden;

    .el-scrollbar {
        ::v-deep {
            .el-scrollbar__wrap {
                overflow-x: hidden;
            }
        }
    }

    .left_wrap,
    .right_wrap {
        vertical-align: top;
        display: inline-block;
        width: 50%;
        height: 100%;
    }

    .left_wrap+.right_wrap {
        border-left: 1px solid #dcdfe6;
    }

    .left_wrap {
        .left_wrap_head {
            padding: 15px;
            padding-bottom: 0px;

            .el-breadcrumb {
                margin-top: 10px;
            }
        }

        .el-breadcrumb__item {
            float: none;
            line-height: 16px;
        }
    }

    .right_wrap {
        .right_wrap_head {
            font-size: 14px;
            padding: 15px;
            color: #303133;
            padding-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
}
</style>