<template>
    <div>
        <el-dialog :title="(type!='create' ? '编辑' : '添加') + title" :visible.sync="isShow" fullscreen :lock-scroll="true" :before-close="dialogCancel">
            <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
                <el-form class="el-form-dialog" ref="form" :model="form" :rules="rules">
                    <el-form-item class="el-form-item-half" label="名称：" prop="name">
                        <el-input v-model="form.name" placeholder="请输入" maxlength="20" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入"></el-input>
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
import { emRole } from "@/api/em"
export default {
    props:{
        title:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            pageFun:emRole,

            rules: {
                name: [
                    { required: true, message: '请输入角色名称', tigger: 'blur' }
                ]
            },
            form: {}
        }
    },
    mixins:[formDailogMixin],
    created() {

    },
    methods: {
        openDialogAfter(){
            let that=this;

            if (that.form && that.form.value) {
                that.type = 'modify';
            }
        }
    },
};
</script>
<style lang="scss" scoped>
</style>