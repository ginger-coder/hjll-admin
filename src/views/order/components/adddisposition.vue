<template>
  <el-dialog title="创建巡检模板" :visible="showdialog" width="40%">
  <el-form :model="form" class="addmodule">
    <el-form-item label="模板名称" :label-width="formLabelWidth">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="适用专业" :label-width="formLabelWidth">
      <el-select v-model="form.region" placeholder="请选择适用专业（多选，对应运维人员角色）">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="巡检周期" :label-width="formLabelWidth">
      <el-select v-model="form.region" placeholder="请选择巡检周期（月度，双月，季度，半年，一年）">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
     <el-button @click="showdialoging" style="margin-left:100px">取 消</el-button>
    <el-button type="primary"  @click="showdialoging" style="width:150px">确 定</el-button>
  </el-form>
   
</el-dialog>
</template>

<script>
export default {
    props:{
        showdialog:{
            required:true
        }
    },
    data() {
      return {
        form: {
          name: '',
          region: '',
        },
        formLabelWidth: '120px'
      };
    },
    methods:{
        showdialoging(){
            this.$emit('update:showdialog', false)
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .addmodule {
    height:350px
}
::v-deep .el-input__inner {
    width:340px
}
</style>