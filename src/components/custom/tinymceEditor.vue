<template>
    <div class="tinymce-editor">
        <editor v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick">
        </editor>
    </div>
</template>

<script>
    import {BASE_API, BASE_URL} from '@/config'

    import settings from '@/settings';

    import tinymce from 'tinymce/tinymce'
    import Editor from '@tinymce/tinymce-vue'
    import 'tinymce/themes/silver'
    import 'tinymce/icons/default/icons'
    import 'tinymce/plugins/advlist'
    import 'tinymce/plugins/anchor'
    import 'tinymce/plugins/autolink'
    import 'tinymce/plugins/autosave'
    import 'tinymce/plugins/code'
    import 'tinymce/plugins/codesample'
    import 'tinymce/plugins/colorpicker'
    import 'tinymce/plugins/contextmenu'
    import 'tinymce/plugins/directionality'
    import 'tinymce/plugins/emoticons'
    import 'tinymce/plugins/fullscreen'
    import 'tinymce/plugins/hr'
    import 'tinymce/plugins/image'
    import 'tinymce/plugins/imagetools'
    import 'tinymce/plugins/insertdatetime'
    import 'tinymce/plugins/link'
    import 'tinymce/plugins/lists'
    import 'tinymce/plugins/media'
    import 'tinymce/plugins/nonbreaking'
    import 'tinymce/plugins/noneditable'
    import 'tinymce/plugins/pagebreak'
    import 'tinymce/plugins/paste'
    import 'tinymce/plugins/preview'
    import 'tinymce/plugins/print'
    import 'tinymce/plugins/save'
    import 'tinymce/plugins/searchreplace'
    import 'tinymce/plugins/spellchecker'
    import 'tinymce/plugins/tabfocus'
    import 'tinymce/plugins/table'
    import 'tinymce/plugins/template'
    import 'tinymce/plugins/textcolor'
    import 'tinymce/plugins/textpattern'
    import 'tinymce/plugins/visualblocks'
    import 'tinymce/plugins/visualchars'
    import 'tinymce/plugins/wordcount'

    export default {
        components: {
            Editor
        },
        props: {
            //传入一个value，使组件支持v-model绑定
            value: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
            height: {
                type: Number,
                default: 500
            },
            menubar: {
                type: Boolean,
                default: true
            },
            plugins: {
                type: [String, Array],
                default: 'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
            },
            toolbar: {
                type: [String, Array],
                default() {
                    return [
                        'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote undo redo removeformat subscript superscript code codesample hr bullist numlist link image preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
                    ]
                }
            },
            zIndex: {
                type: Number,
                default: 1300
            }
        },
        data() {
            return {
                //初始化配置
                init: {
                    language_url: './tinymce/langs/zh_CN.js',
                    language: 'zh_CN',
                    skin_url: './tinymce/skins/ui/oxide',
                    emoticons_database_url: './tinymce/emojis.js',
                    content_css: './tinymce/skins/content/default/content.css',
                    fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
                    font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats',
                    height: this.height,
                    plugins: this.plugins,
                    toolbar: this.toolbar,
                    branding: false,
                    menubar: this.menubar,
                    relative_urls: false,
                    remove_script_host: false,
                    images_upload_base_path: BASE_URL,
                    //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
                    //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
                    // images_upload_handler: (blobInfo, success, failure) => {
                    // 	const img = 'data:image/jpeg;base64,' + blobInfo.base64()
                    // 	success(img)
                    // }
                    images_upload_handler: (blobInfo, success, failure) => {
                        let _blob = blobInfo.blob()

                        if (_blob.size / (1 * 1024 * 1024) > 1) {
                            failure('单图大小不能超过 1MB');
                        }
                        let fd = new FormData()
                        fd.append('file', blobInfo.blob())

                        this.$store.dispatch(
                            'comm/upload',
                            fd
                        )
                            .then((res) => {
                                success(BASE_URL + res.url)
                            }).catch((res) => {
                                console.log('res', res)
                            })
                    },
                    content_style:'p {font-size:14px;}'
                },
                myValue: this.value,


            }
        },
        mounted() {
            let that = this;
            tinymce.init({})
            that.$nextTick(() => {
                setTimeout(() => {
                    if (that.zIndex > 1300 && document.querySelector('.tox-tinymce-aux')) document.querySelector('.tox-tinymce-aux').style.zIndex = that.zIndex
                }, 100);
            })
        },
        methods: {
            //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
            //需要什么事件可以自己增加
            onClick(e) {
                this.$emit('onClick', e, tinymce)
            },
            //可以添加一些自己的自定义事件，如清空内容
            clear() {
                this.myValue = ''
            }
        },
        watch: {
            value(newValue) {
                this.myValue = newValue
            },
            myValue(newValue) {
                this.$emit('input', newValue)
            }
        }
    }

</script>
<style>



</style>