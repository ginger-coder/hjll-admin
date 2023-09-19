<template>
    <div class="">
        <el-dialog title="修改头像" :visible.sync="isShow" custom-class="w_464" :before-close="closeDialog">
            <div class="cropper_wrap">
                <div class="cropper_component" style="">
                    <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="option.info" :full="option.full" :fixed="option.fixed" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :fixedBox="option.fixedBox" :centerBox="option.centerBox" @realTime="realTime">
                    </vueCropper>
                </div>
                <div class="cropper_preview" v-if="preview.url">
                    <img class="circle_img" :src="preview.url" alt="">
                    <img class="square_img" :src="preview.url" alt="">
                </div>
            </div>
            <div class="tc preview_operate_box">
                <template v-if="option.img&&preview.url">
                    <el-button type="primary" plain circle icon="el-icon-zoom-in" @click="changeScale($event,1)"></el-button>
                    <el-button type="primary" plain circle icon="el-icon-zoom-out" @click="changeScale($event,-1)"></el-button>
                    <el-button type="primary" plain circle icon="el-icon-refresh" @click="changeRefresh($event)"></el-button>
                    <el-button type="primary" plain circle icon="el-icon-refresh-right" @click="changeRotate($event,'right')"></el-button>
                    <el-button type="primary" plain circle icon="el-icon-refresh-left" @click="changeRotate($event,'left')"></el-button>
                </template>
            </div>
            <div class="dialog_footer_holder"></div>
            <div slot="footer" class="dialog-footer">
                <el-upload class="upload_avatar" action="" :auto-upload="false" :show-file-list="false" :on-change='changeUpload'>
                    <el-button type="primary">选择图片</el-button>
                </el-upload>
                <el-button :disabled="!(option.img&&preview.url)" :loading="submitLoading" type="primary" v-hold-click @click="submitDialog">上传并保存</el-button>
                <el-button v-hold-click @click="closeDialog">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import { authModify } from "@/api/auth"

import { commUpload } from "@/api/common"

export default {
    components: {
        VueCropper
    },
    data() {
        return {
            isShow: false,
            adminId: '',
            avatar: '',
            option: {
                mode: 'cover',
                img: '', // 裁剪图片的地址
                info: false, // 裁剪框的大小信息
                outputSize: 1, // 剪切后的图片质量（0.1-1）
                full: true, // 输出原图比例截图 props名full
                outputType: 'png', // 裁剪生成额图片的格式
                canMove: true, // 能否拖动图片
                original: false, // 上传图片是否显示原始宽高
                canMoveBox: true, // 能否拖动截图框
                autoCrop: true, // 是否默认生成截图框
                fixed: true, //否开启截图框宽高固定比例
                fixedBox: false, // 固定截图框大小
                centerBox: true, //截图框是否被限制在图片里面
            },
            preview: {
                url: ''
            },
            submitLoading: false
        };
    },
    created() {
        this.initer();
        this.adminId = this.$store.getters.user.accountId || '';
    },
    methods: {
        buttonClick(e) {
            const target = e.target
            if (target.nodeName === 'SPAN' || target.nodeName === 'I') {
                target.parentNode.blur()
            }
            target.blur()
        },
        initer() {
            let that = this;


        },
        openDialog(avatar) {
            let that = this;


            avatar = avatar || '';
            that.avatar = avatar;

            that.isShow = true;

            if (avatar) {
                that.option.img = avatar
            }
        },
        closeDialog() {
            let that = this;

            that.isShow = false;

            that.submitLoading = false;
            that.avatar = '';
            that.option.img = '';
            that.preview = {
                url: ''
            }
        },
        realTime(data) {
            let that = this;

            that.$refs.cropper.getCropData(data1 => {
                // console.log('getCropData.data',data1)
                that.preview.url = data1 || '';
            })
        },
        changeUpload(file, fileList) {
            let that = this;
            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M) {
                that.$message.error('上传文件大小不能超过 5MB!')
                return false
            }

            var reader = new FileReader();
            reader.readAsArrayBuffer(file.raw)
            reader.onload = (e) => {
                let data;
                if (typeof e.target.result === 'object') {
                    // 把Array Buffer转化为blob 如果是base64不需要
                    data = window.URL.createObjectURL(new Blob([e.target.result]))
                } else {
                    data = e.target.result
                }
                that.option.img = data
            }
        },
        changeScale(e, val) {
            let that = this;
            that.buttonClick(e)


            if (that.$refs.cropper) {
                that.$refs.cropper.changeScale(val)
            }
        },
        changeRotate(e, val) {
            let that = this;
            that.buttonClick(e)


            if (that.$refs.cropper) {
                if (val == 'right') that.$refs.cropper.rotateRight()
                if (val == 'left') that.$refs.cropper.rotateLeft()
            }
        },
        changeRefresh(e) {
            let that = this;
            that.buttonClick(e)

            if (that.$refs.cropper) {
                that.$refs.cropper.reload()
                that.$refs.cropper.rotateClear()
            }
        },
        submitDialog() {
            let that = this;

            that.submitLoading = true;

            that.$refs.cropper.getCropBlob(data => {
                that.uploadAxios(data)
            })
        },
        uploadAxios(file) {
            let that = this;

            if (!file) {
                that.submitLoading = false;
                return;
            }

            that.$loading({
                lock: true,
                spinner: 'el-icon-loading',
                customClass: 'custom-loading',
                background: 'rgba(255, 255, 255, 0.9)'
            })

            let form=new FormData()
            form.append('file',file)

            commUpload(form)
                .then(res => {

                    authModify({ avatar: res.url })
                        .then(res => {
                            that.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            that.$loading().close();
                            that.closeDialog();
                            that.$store.dispatch('user/authInfo')
                        })
                        .catch(err => {
                            that.$message({
                                message: '修改失败，请重新上传',
                            });
                            that.$loading().close();
                        })

                })
                .catch(err => {
                    that.submitLoading = false;
                    that.$loading().close();
                })
        }
    },
};
</script>
<style lang="scss" scoped>
::v-deep {
    .el-dialog.w_464 {
        width: 464px;
        margin-left: auto;
        margin-right: auto;

        .el-dialog__body {
            padding: 20px;
        }
    }

    .el-button--medium.is-circle {
        padding: 6px;
        font-size: 20px;
    }
}

.cropper_wrap {
    display: flex;

    .cropper_component {
        width: 276px;
        height: 276px;
    }

    .cropper_preview {
        width: 128px;
        margin-left: 20px;
        line-height: 0;

        .circle_img {
            width: 128px;
            height: 128px;
            border-radius: 75px;
        }

        .square_img {
            width: 128px;
            height: 128px;
        }

        .circle_img+.square_img {
            margin-top: 20px;
        }
    }
}



.preview_operate_box {
    margin-top: 15px;
    height: 34px;
}

.upload_avatar {
    display: inline-block;
    margin-right: 10px;
}

.dialog_footer_holder {
    height: 66px;
}
</style>