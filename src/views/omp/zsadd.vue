<template>
  <div class="app-container">
    <div style="height: 50px"></div>
    <el-form ref="form" :model="form" label-width="80px" :rules="formRules">
      <el-form-item
        label="证书名称:"
        label-width="100px"
        style="width: 50%; margin: 0 auto"
        prop="certificateName"
      >
        <el-input v-model="form.certificateName"></el-input>
      </el-form-item>
      <el-form-item style="width: 20%; margin: 50px auto">
        <el-button size="small" @click="infores">取消</el-button>
        <el-button size="small" type="primary" @click="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Certificatelistadd, Certificatelistcomplice } from "@/api/omptwo";
export default {
  data() {
    return {
      form: {
        id: "",
        certificateName: "",
      },
      formRules: {
        certificateName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getcomplice();
  },
  methods: {
    primary() {
      this.$refs.form.validate((val) => {
        if (val) {
          Certificatelistadd(this.form).then((res) => {
            this.$router.push({
              path: "/omp/ompCert",
            });
          });
        } else {
          this.$message.error("不能为空");
        }
      });
    },

    getcomplice() {
      if (this.$route.query.id) {
        Certificatelistcomplice({ id: this.$route.query.id }).then((res) => {
          this.form.certificateName = res.data.certificateName;
          this.form.id = this.$route.query.id;
        });
      }
    },
    infores() {
      this.form.certificateName = "";
      this.$router.push({
        path: "/omp/ompCert",
      });
    },
  },
};
</script>

<style>
</style>