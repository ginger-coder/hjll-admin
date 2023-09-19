import { deepClone } from "@/utils"
import utilMixin from "./util"

export default {
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            type: 'create',
            isShow: false,

            submitLoading: false,

            default: {
                name: '',
            },

            rules: {
                name: [
                    { required: true, message: '请输入名称', tigger: 'blur' }
                ]
            },
            form: {},
        }
    },
    mixins:[utilMixin],
    methods: {
        openDialog(info) {
            let that = this;
            info = info || that.default

            that.isShow = true;

            that.form = deepClone(info || that.default)
            if (info && info.id) {
                that.type = 'modify';
            }
            if (that.$refs.form) that.$refs.form.resetFields();
            // 打开dialog后自定义操作
            that.openDialogAfter && that.openDialogAfter()
        },
        dialogCancel() {
            let that = this;

            that.isShow = false;

            // 关闭dialog后自定义操作
            that.dialogCancelAfter && that.dialogCancelAfter()

            that.$nextTick(() => {
                setTimeout(() => {
                    that.type = "create";
                    that.form = deepClone(that.default);

                    // 滚动到顶部
                    if (that.$refs.dialogScrollbar) that.$refs.dialogScrollbar.wrap.scrollTop = 0;
                }, 300)
            })
        },
        dialogSubmit() {
            let that = this;
            if (that.submitLoading) return;
            let post = deepClone(that.form)
            that.$refs["form"].validate((valid) => {
                if (valid) {

                    let param = {}
                    let opt = {
                        name: that.type == 'modify' ? `update${that.moduleType}` : `save${that.moduleType}`,
                        method: 'post',
                    }

                    let next = (post) => {
                        that.$loading({
                            lock: true,
                            spinner: 'el-icon-loading',
                            customClass: 'custom-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        })

                        that.submitLoading = true;
                        that.pageFun(opt, param, post)
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
        remarkInput() {
            let that = this;

            that.$refs.form.validateField('remark');
        },
        formUploadPics() {

        }
    }
}