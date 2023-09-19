<template>
  <div class="right">
   <el-upload
      accept=".xlsx, .xls"
      :file-list="fileList"
      :action="actionUrl"
      :data="info"
      :before-upload="beforeUploadFile"
      :on-exceed="exceedFile"
      :on-success="uploadSuccess"
      :show-file-list="isShowFile"
       multiple
      :limit="limitNum"
        >
       	<el-button type="primary" icon="el-icon-plus">批量Excel导入</el-button>

   </el-upload>
</div>
</template>

<script>
import { BASE_API, BASE_URL, BASE_UPLOAD } from "@/config";

export default {
    data() {
  return {
    actionUrl: BASE_API + '/basestation/tSite/importSiteInfo',  //自己上传文件的地址
    info: {
      templateId: this.$route.query.id   //上传的额外参数
    },
    fileList: [],    //文件列表
    limitNum: 5,     //选择文件个数
    isShowFile: false
  }
},
methods:{
    //文件上传之前的钩子
 beforeUploadFile(file) {
   var FileExt = file.name.replace(/.+\./, "");
   if (["xls", "xlsx"].indexOf(FileExt.toLowerCase()) === -1) {
      this.$message({
        type: "warning",
        message: "请上传后缀名为xls、xlsx的附件！"
      });
      return false;
   }
 },
 //文件超出个数时的钩子
 exceedFile(files, fileList) {
   console.log("文件超出个数：", files);
   this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length +
          fileList.length} 个`);
 },
 // 文件上传成功的钩子
 uploadSuccess(response, file, fileList) {
     console.log(11);
   if(response.code != 200) {
     return this.$message.error(response.msg);
   }else {
    //上传成功之后在这里写逻辑，比如：重新调用查询列表接口
     return this.$message.success(response.msg);
   }
 }
}
}
</script>

<style>

</style>