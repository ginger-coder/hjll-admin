<template>
    <div class="app-container">
        <el-scrollbar wrap-class="app-container-wrapper pcenter-container-wrapper">
            <div class="pcenter_wrap">
                <div class="pcenter_info_card">
                    <el-card shadow="never">
                        <div class="p20">
                            <!-- 图像 -->
                            <div class="tc left_card_head">
                                <div>
                                    <div v-if="avatar" @click="openAvatarDialog">
                                        <el-avatar class="user_avatar pointer" :src="avatar"></el-avatar>
                                    </div>
                                    <img v-else class="pointer user_avatar" src="@/assets/avatar.png" @click="openAvatarDialog">
                                </div>
                                <div class="user_info_names">{{person_info.name || person_info.names || person_info.account}}</div>
                            </div>
                            <div class="left_card_info">
                                <div v-if="person_info.phone" class="info_item">
                                    <i class="el-icon-mobile-phone"></i>{{person_info.phone}}
                                </div>
                                <div v-if="person_info.email" class="info_item">
                                    <i class="el-icon-custom-email"></i>{{person_info.email}}
                                </div>
                                <!-- <div v-if="person_info.orgNamw" class="info_item">
                                    <i class="el-icon-custom-bumen"></i>{{person_info.orgNamw}}
                                </div>
                                <div v-if="person_info.job" class="info_item">
                                    <i class="el-icon-custom-zhiwei"></i>{{person_info.job}}
                                </div> -->
                                <div v-if="person_info.roleName" class="info_item">
                                    <i class="el-icon-custom-xingming"></i>{{person_info.roleName}}
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
                <div class="pcenter_data_card">
                    <el-card>
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="基本信息" name="base">
                                <el-form label-width="80px">
                                    <el-form-item label="账号">
                                        <el-input disabled class="form_personal_input" v-model.trim="form.account"></el-input>
                                    </el-form-item>
                                    <el-form-item label="手机号">
                                        <el-input class="form_personal_input" v-model.trim="form.phone"></el-input>
                                    </el-form-item>
                                    <el-form-item label="邮箱">
                                        <el-input class="form_personal_input" v-model.trim="form.email"></el-input>
                                    </el-form-item>
                                    <!-- <el-form-item label="部门">
                                        <el-input disabled class="form_personal_input" v-model.trim="form.orgName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="职位">
                                        <el-input class="form_personal_input" v-model.trim="form.job"></el-input>
                                    </el-form-item> -->
                                    <el-form-item>
                                        <el-button :loading="submitLoading" type="primary" v-hold-click @click="onSubmit">保存</el-button>
                                        <el-button v-hold-click @click="onReset">重置</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <!-- <el-tab-pane label="登录日志" name="logs">
                <logTable ref="logTable" />
              </el-tab-pane> -->
                        </el-tabs>
                    </el-card>
                </div>
            </div>
            <!-- 修改头像 -->
            <avatarDialog ref="avatarDialog" @submit="" />
        </el-scrollbar>
    </div>
</template>
<script>
import { parseTime } from "@/utils";

import { gender } from "@/utils/dict"

import { validMobile, validEmail } from "@/utils/validate"

import avatarDialog from "./components/avatarDialog"
import logTable from "./components/logTable"

import { authInfo, authModify } from "@/api/auth"

import { mapGetters } from 'vuex'

export default {
    components: {
        avatarDialog,
        logTable
    },
    data() {
        return {
            person_info: {},

            genderList: JSON.parse(JSON.stringify(gender)),

            activeName: 'base',

            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },

            form: {
                names: '',
                gender: null,
                mobile: '',
                birthday: '',
                email: '',
            },
            submitLoading: false,
        };
    },
    computed: {
        ...mapGetters([
            'avatar'
        ]),
    },
    created() {
        let that = this;
        that.initer();
    },
    methods: {
        initer() {
            let that = this;

            that.loadInfo();
        },
        loadInfo() {
            let that = this;

            authInfo()
                .then(res => {
                    that.person_info = that.filter_admin_row(res);
                    that.form = { ...that.person_info }
                })
        },
        filter_admin_row(row) {
            let that=this;

            row.roleno_names=row.roleno_names || '';
            row.roleName=row.roleno_names || '';
            
            return row;
        },
        openAvatarDialog() {
            let that = this;

            console.log('openAvatarDialog')

            if (that.$refs.avatarDialog) that.$refs.avatarDialog.openDialog(that.avatar)
        },
        onReset() {
            let that = this;

            that.form = { ...that.person_info }
        },
        onSubmit() {
            let that = this;
            if (that.submitLoading) return;
            let form = { ...that.form };

            if (form.phone) {
                if (!validMobile(form.phone)) {
                    that.$message('手机号格式不正确')
                    return;
                }
            }

            if (form.email) {
                if (!validEmail(form.email)) {
                    that.$message.warning('邮箱格式不正确')
                    return;
                }
            }

            if (that.submitLoading) return;
            authModify({
                    phone: form.phone || '',
                    email: form.email || '',
                    job: form.job || '',
                })
                .then(res => {
                    that.submitLoading = false;
                    that.$message.success('修改成功')
                    that.loadInfo();
                    that.$store.dispatch('user/authInfo')
                })
                .catch(err => {
                    that.submitLoading = false;
                })
        }
    },
};
</script>
<style>
.pcenter-container-wrapper .el-scrollbar__view {
    height: 100%;
}
</style>
<style lang="scss" scoped>
.form_personal_input {
    width: 260px;
}

.user_avatar {
    width: 100px;
    height: 100px;
}

.pcenter_wrap {
    display: flex;
    height: 100%;

    ::v-deep {
        .el-card {
            height: 100%;
        }
    }

    .pcenter_info_card {
        width: 420px;
        margin-right: 20px;
    }

    .pcenter_data_card {
        flex: 1;
    }
}

.p20 {
    padding: 20px;
}


.left_card_head {
    margin-bottom: 20px;

    .user_info_names {
        font-size: 24px;
        color: #303133;
        font-weight: bold;
        margin-top: 15px;
    }
}

.left_card_info {
    padding: 0 40px;
    font-size: 16px;
    line-height: 34px;
    color: #606266;

    .info_item {
        display: flex;
        align-items: center;

        [class^=el-icon] {
            font-size: 18px;
            margin-right: 10px;
        }
    }
}
</style>