<template>
    <div>
        <template v-if="videoPath">
            <video :src="videoPath" controls controlslist="nodownload noplaybackrate" disablePictureInPicture></video>
        </template>
        <!-- .mp4 video/mp4 -->
    <el-upload ref="uploadVideo" class="upload_file" :action="action" accept="video/mp4" :multiple="false" :show-file-list="false" :on-success="video_success" :on-error="video_error" :on-progress="on_progress" :before-upload="before_upload">
        <el-button size="small" type="primary">{{videoPath?'重新上传':'上传文件'}}</el-button>
        <!-- :limit="max>1?max:0" -->
    </el-upload>
    </div>
</template>
<script>
import { BASE_API, BASE_URL } from '@/config'

// max:最大值
// isperview:是否预览
// isoperate:是否可以操作
// maxSize:图片大小,默认1M
//	videoList
import settings from '@/settings';

export default {
    props: {
        maxSize: {
            default: '1073741824', //kb
            type: String
        },
        value: {
            default:'',
            type:String
        }
    },
    data() {
        return {
            mode: process.env.NODE_ENV,
            base_api: BASE_API,

            baseUrl: BASE_URL,

            videoUrl:'', //upload后返回的
            videoPath:'', //拼接的完整路径


            action: BASE_API + '/comm/upload'
        }
    },
    watch: {
        value: function(val) {
            let that = this;
            that.loader_video(val);


        },
        filesList: function() {
            // console.log('filesList  change')
        }
    },
    //渲染到页面的时候
    mounted() {
        let that = this;


        that.loader_video(that.value);
    },
    methods: {
        loader_video: function(val) {
            let that = this;

            that.videoUrl=val;
            if(val) that.videoPath=BASE_URL + val
            else that.upload_destroy();
        },
        video_success: function(a, b, c) {
            let that = this;

            console.log(a,b,c)

            let _arr = c;

            let url = a.url;

            that.videoUrl=url;
            that.videoPath=(BASE_URL + url);

            if (c[c.length - 1].status == 'success') {
                setTimeout(function() {
                    that.$loading().close();
                }, 1000)
            }

            if (!that.videoUrl) that.upload_destroy();

            this.$emit('success', that.videoUrl)

        },
        video_error:function(err){
        	let that=this;
        	that.$loading().close()
        },
        on_progress: function(event, file, fileList) {
            // console.log('on_progress')
        },
        before_upload: function(file) {

            let that = this;

            that.$loading({
                lock: true,
                text: '上传中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                customClass:'custom-loading'
            });

            console.log('size', file.size)

            const isSize = file.size < that.maxSize; //限制文件大小
            if (!isSize) {
                this.$loading().close();
                if (that.maxSize >= 1073741824) { //1024*1024*1024
                    this.$message.error('上传文件大小不能超过 ' + (that.maxSize / 1024 / 1024 / 1024) + 'G!');
                } else if (that.maxSize >= 1048576) { //1024*1024
                    this.$message.error('上传文件大小不能超过 ' + (that.maxSize / 1024 / 1024) + 'MB!');
                } else {
                    this.$message.error('上传文件大小不能超过 ' + (that.maxSize / 1024) + 'KB!');
                }

            }
            return isSize

        },
        upload_destroy: function() {
            let that = this;

            if (that.$refs.uploadVideo) that.$refs.uploadVideo.clearFiles()

        },
        files_change: function() {
            let that = this;

            if (!that.videoUrl) that.upload_destroy();

            that.$emit('success', that.videoUrl)
        },
    }
}
</script>
<style>
video{
    width:100%;
}

</style>