<template>
  <div class="app-container">
    <div style="height: 50px;"></div>
    <el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="关联证书:" style="width: 50%;margin: 0 auto;">
    <el-select
    style="width: 100%;"
    v-model="value"
    multiple
    filterable
    allow-create
    default-first-option
    @visible-change="tablelist"
    placeholder="请选择文章标签">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  </el-form-item>
   <el-form-item style="width: 20%; margin: 50px auto;">
    <el-button size="small" @click="defafasadsa">取消</el-button>
    <el-button size="small" type="primary" @click="primary">保存</el-button>
   </el-form-item>
</el-form>
  </div>
</template>

<script>
import { ordercreatelist,statusaddeas,zscreated } from "@/api/omptwo";
export default {
    data(){
        return {
        options: [],
        value: [],
        form:{}
        }
    },
    mounted(){
        this.getlist()
    },
    methods:{
        getlist(){

          zscreated({roleId:this.$route.query.id}).then(res=>{
            this.value = res.data.map(el=>{
              return el.id
            })
          })
           this.tablelist()
        },
        tablelist(){
            console.log('11111');
            ordercreatelist().then(res=>{
              this.options = res.data.map(res=>{
                    return {
                        value: res.id,
                         label: res.certificateName
                    }
                 })
            })
        },
        primary(){
            statusaddeas({roleId:this.$route.query.id,certificateIds:this.value}).then(res=>{
              this.$router.push({
              path: "/omp/ompRole",
            });
            })
        },
        defafasadsa(){
          this.value = ""
          this.$router.push({
              path: "/omp/ompRole",
            });
        }
    }
}
</script>

<style>

</style>