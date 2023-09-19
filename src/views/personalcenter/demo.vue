<template>
  <div class="app-container column-2-container">
    <div class="app-container-left">
        <h3>修改个人资料</h3>
        <p @click="userchange=true">修改账号</p>
        <p >修改密码</p>
    </div>
    <div class="app-container-right">
     <div v-if="userchange">
        <h2>账号设置</h2>
      <p>用户名：<span>{{ name }}</span>  <el-link type="primary" @click="userchange=false">更换</el-link></p>
      <p>邮箱：<span>{{ email }}</span>  <el-link type="primary" >更换</el-link></p>
     </div>
     <!-- 更换用户名 -->
     <div v-else>
       <h2>更换用户名</h2>
       <el-form ref="form" :model="form" label-width="80px"  :rules="rules">
  <el-form-item prop="pwd">
    <el-input v-model="form.pwd"></el-input>
  </el-form-item>
   <el-form-item prop="username">
    <el-input v-model="form.username"></el-input>
  </el-form-item>
   <el-form-item>
    <el-button type="primary" @click="onSubmit">更换用户名</el-button>
    <el-button @click="userchange=true">取消</el-button>
  </el-form-item>
</el-form>
     </div>
     <!-- 修改邮箱 -->
     <div>
       <el-form :model="emails">
        <el-form-item prop="email">
          <el-input v-model="emails.email"></el-input>
        </el-form-item>
        <el-form-item>
    <el-button type="primary" @click="onSubmitemail">更换邮箱</el-button>

        </el-form-item>
      </el-form>
     </div>
     <div v-if="false">
       <h2>修改密码</h2>
        <el-form ref="formpwd" :model="formpwd" label-width="80px"  >
  <el-form-item>
    <el-input v-model="formpwd.pwd"></el-input>
  </el-form-item>
   <el-form-item>
    <el-input v-model="formpwd.password"></el-input>
  </el-form-item>
  <el-form-item>
    <el-input v-model="formpwd.confirmPassword"></el-input>
  </el-form-item>
   <el-form-item>
    <el-button type="primary" @click="onSubmitpwd">更换密码</el-button>
  </el-form-item>
</el-form>
     </div>
     <div>
       <h2>绑定邮箱</h2>
       
     </div>
    </div>
  </div>
</template>
<script>
import {personalcenter,verifypwd,namechange,updatepwd} from '@/api/personal'

export default {
  data(){
    return {
      userchange:true,
      // cguser:false,
      name:'',
      email:'',
      id:'',
      form:{
        username:'',
        id:''
      },
      formpwd:{
        id:'',
        pwd:'',
        password:'',
        confirmPassword:'',
      },
      emails:{
        email:'',
        id:''
      },
      rules:{
        pwd:[{ required: true, validator: this.validatepwd, trigger: "blur" }]
      }
    }
  },
 mounted(){
  this.personal()
 },
  methods:{
          async personal(){
        const {data} =await personalcenter()
        console.log(data);
        this.name=data.username
        this.email=data.email
        this.id=data.id
        this.form.id=data.id
        this.emails.id=data.id
        this.formpwd.id=data.id
    },
   onSubmit(){
    this.$refs.form.validate(async(valid) => {
      if(valid){
           const data =await namechange(this.form)
    console.log(data);
      }
    
    })
   
    },
            async validatepwd(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入密码'))
      } else {
        try {
         const {data}= await verifypwd({passWord:this.form.pwd,userId:this.form.id});
         if(data==false) {
          callback(new Error('密码错误'));
         }

        } catch (e) {
          // callback()
          callback(new Error('密码错误'));
        }
        // callback()
      }
    },
    // 修改邮箱
   async onSubmitemail () {
      const data =await namechange(this.emails)
      console.log(data);
    },
    async onSubmitpwd() {
      const data =await namechange({
        id:this.formpwd.id,
        password:this.formpwd.id,
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/containerColumn2.scss";
</style>