<template>
  <div>
    <h2 class="main">{{ title }}</h2>
    <div class="content">
      <el-form
        :model="formData"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
        ref="formData"
      >
        <el-form-item label="技能名称：" prop="name">
          <el-input :disabled="flag" v-model="formData.name" style="width: 400px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="技能代号：" prop="code">
          <el-input
            v-model="formData.code"
            style="width: 400px"
            :disabled="disabled"
          ></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button v-if="!flag" type="primary" @click="submitForm"
            >提交</el-button
          ></el-form-item
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveskill, updateskill, skillcode } from "@/api/createskill";
export default {
  data() {
    return {
      title: "创建技能",
      formData: {
        name: "",
        code: "",
      },
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        code: [
          { required: true, validator: this.validateCode, trigger: "blur" },
        ],
      },
      disabled: true,
      flag:false,
    };
  },
  created() {
    this.updata();
  },
  methods: {
    updata() {
      if (this.$route.query.allData) {
        let formObj = decodeURIComponent(this.$route.query.allData);
        var editdata = JSON.parse(formObj);
        this.title = "编辑技能";
        this.formData.id = editdata.id;
        this.formData.code = editdata.code;
        this.formData.name = editdata.name;
        this.formData["id"] = editdata.id;
        if( this.title == "编辑技能"){
            this.disabled = false
        }
        if(this.$route.query.flag){
          this.flag = true
        }else{
          this.title = "技能详情";
          this.flag = false
        }
      }
    },
    submitForm() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          if (this.formData.id) {
            try {
              const data = await updateskill(this.formData);
            } catch (error) {}
          } else {
            try {
              const data = await saveskill(this.formData);
            } catch (error) {}
          }
          this.$router.push("/omp/ompSkill");
        }
      });
    },
    async validateCode(rule, value, callback) {
      if (value === "" || value === undefined) {
        callback(new Error("请输入技能代号"));
      } else {
        try {
          await skillcode({ code: this.formData.code });
        } catch (e) {
          // callback()
          callback(new Error("系统中存在此代号"));
        } 
        // callback()
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  background: #fff;
  height: 100px;
  line-height: 100px;
  margin: -20px -20px 20px -20px;
  padding-left: 20px;
  font-size: 16px;
  font-weight: 500;
}

.content {
  background: #fff;
  padding: 100px 0px 100px 250px;
}
</style>