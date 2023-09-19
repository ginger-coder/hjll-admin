<template>
  <div>
  <el-tabs tab-position="left" style="height: 500px;" v-model="activeName">
    <el-tab-pane label="修改个人资料" name="first"><div>
        <h2>账号设置</h2>
      <p class="setting"><span>用户名：{{ name }}</span>  <el-link type="primary" @click="changeusername">更换</el-link></p>
      <p class="setting"><span>邮箱：{{ email }}</span>  <el-link type="primary" @click="changeuseremail" >更换</el-link></p>
     </div></el-tab-pane>
    <el-tab-pane label="修改账号" name="second" disabled>
      <!-- 更换用户名 -->
           <div v-show="hiddenname">
       <h2>更换用户名</h2>
       <el-form ref="form" :model="form"  :rules="rules">
  <el-form-item prop="pwd">
    <el-input v-model="form.pwd" placeholder="请输入密码做校验"></el-input>
  </el-form-item>
   <el-form-item prop="username">
    <el-input v-model="form.username" placeholder="输入新用户名"></el-input>
  </el-form-item>
   <el-form-item>
    <el-button type="primary" @click="onSubmit">更换用户名</el-button>
    <el-button @click="activeName='first'">取消</el-button>
  </el-form-item>
</el-form>
     </div>
     <!-- 更换邮箱 -->
          <div v-show="hiddenemail">
            <h2>绑定/修改邮箱</h2>
       <el-form :model="emails" ref="emails" >
        <el-form-item prop="email">
          <el-input v-model="emails.email" size="medium"></el-input>
        </el-form-item>
        	<!-- <el-form-item>
						<el-input v-model="emails.email" placeholder="邮箱" />
					</el-form-item>
					<el-form-item>
						<div class="disp_flex">
							<el-input v-model.trim="emails.code" tabindex="3" placeholder="输入验证码" />
							<el-button v-hold-click style="margin-left: 20px" @click="getCode">获取验证码</el-button>
						</div>
					</el-form-item> -->
        <el-form-item>
    <el-button type="primary" @click="onSubmitemail">更换邮箱</el-button>

        </el-form-item>
      </el-form>
     </div>
    </el-tab-pane>
    <el-tab-pane label="修改密码" name="three">
      <h2>修改密码</h2>
        <el-form ref="formpwd" :model="formpwd"  :rules="rulespwd">
  <el-form-item prop="pwd">
    <el-input v-model="formpwd.pwd" placeholder="输入原密码"></el-input>
  </el-form-item>
   <el-form-item prop="password">
    <el-input v-model="formpwd.password" placeholder="8-16位新密码,数字与字母的组合,区分大小写"></el-input>
  </el-form-item>
  <el-form-item prop="confirmPassword">
    <el-input v-model="formpwd.confirmPassword" placeholder="确认密码"></el-input>
  </el-form-item>
   <el-form-item >
    <el-button type="primary" @click="onSubmitpwd">更换密码</el-button>
  </el-form-item>
</el-form>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import {personalcenter,verifypwd,namechange,} from '@/api/personal'
import { getEmailCode } from "@/api/auth";

export default {
  data() {
      return {
        hiddenname:true,
        hiddenemail:true,
      activeName: 'first',
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
        id:'',
        code:''
      },
      rules:{
        pwd:[{ required: true, validator: this.validatepwd, trigger: "blur" }]
      },
      rulespwd:{
        pwd:[{ required: true, validator: this.validatepwd, trigger: "blur" }],
        password:[ { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,    //正则校验不用字符串
            message: "请填写正确的密码", trigger: "blur"
          }
      ],
    confirmPassword:[
      { required: true, validator: this.validatepwds, trigger: "blur" }
      
    ]
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
    changeusername(){
      this.activeName='second'
      this.hiddenname=true
      this.hiddenemail=false
    },
    changeuseremail(){
      this.activeName='second'
      this.hiddenemail=true
      this.hiddenname=false

    },
    // 校验密码
                async validatepwd(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入密码'))
      } else {
        try {
         const {data}= await verifypwd({passWord:this.form.pwd ||this.formpwd.pwd,userId:this.form.id});
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
    // 密码一致性验证
    validatepwds(rule,value,callback){
       if (value === '' || value === undefined) {
        callback(new Error('请输入密码'))
      } else if(this.formpwd.password!=this.formpwd.confirmPassword){
        callback(new Error('密码不一致'))
      }
      else {

      }
    },
    // 修改用户名
     onSubmit(){
    this.$refs.form.validate(async(valid) => {
      if(valid){
           const data =await namechange(this.form)
    console.log(data);
      }
    
    })
   
    },
        // 修改邮箱
   async onSubmitemail () {
     this.$refs.emails.validate(async(valid)=>{
       if(valid){
         const data =await namechange(this.emails)
      console.log(data);
       }
     })
     
    },
    // 修改密码
    async onSubmitpwd() {
    this.$refs.formpwd.validate(async(valid) => {
      if(valid){
         const data =await namechange({
        id:this.formpwd.id,
        password:this.formpwd.id,
      })
      }
    })
     
    },
    // 获取邮箱验证码
   async getCode() {
      const data =await getEmailCode({ method: "post" }, {}, { sendTo: this.emails.email })
      console.log(data);
    }
    }
}
</script>

<style lang="scss" scoped>
.setting {
  width:300px;
  display: flex;
  justify-content: space-between;
}
</style>