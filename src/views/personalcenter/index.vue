<template>
    <div class="app-container column-2-container">
       <div class="left">
           <p class="centercss">
           <img :src="url" alt="" class="img">
           </p>
           <h2 class="centercss">中国通信维护共享平台</h2>
           <p class="centercss" style="margin-bottom:24px">{{ nickname }}</p>
           <p class="indent"> <i class="el-icon-user" style="margin-right:8px"></i>{{ name }}</p>
           <p class="indent"> <i class="el-icon-message"  style="margin-right:8px"></i> {{ email }}</p>
           <p class="indent">
           <i class="el-icon-location-outline" style="margin-right:8px"></i><span>山西-太原</span>
           </p>
           <el-button @click="setting">设置</el-button>
           <el-button>退出登录</el-button>
       </div>
       <div class="right">
           <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="提醒(0)" name="first">
        <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>中午12:00</span>
  </div>
  <h6>系统维护通知</h6>
  <p>
你好，中国通信维护共享平台将于凌晨3:00-4:00进行维护，届时系统将无法登录，请知悉。你好，中国通信维护共享平台将于凌晨3:00-4:00进行维护，届时系统将无法登录，请知悉。</p>
</el-card>
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>中午12:00</span>
  </div>
  <h6>系统维护通知</h6>
  <p>
你好，中国通信维护共享平台将于凌晨3:00-4:00进行维护，届时系统将无法登录，请知悉。你好，中国通信维护共享平台将于凌晨3:00-4:00进行维护，届时系统将无法登录，请知悉。</p>
</el-card>
    </el-tab-pane>
    <el-tab-pane label="通知(0)" name="second">通知(0)</el-tab-pane>
  </el-tabs>
       </div>
    </div>
</template>
<script>
import {personalcenter} from '@/api/personal'
export default {
    mounted(){
        this.personal()
    },
    data(){
        return {
            url:'',
            name:'',
            email:'',
            nickname:'',
            activeName: 'first'
        }
    },
   methods:{
       async personal(){
        const {data} =await personalcenter()
        console.log(data);
        this.url=data.avatar
        this.name=data.username
        this.email=data.email
        this.nickname=data.nickname
    },
     handleClick(tab, event) {
        console.log(tab, event);
      },
      setting() {
          this.$router.push('/personal/setting')
      }
   }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.left {
    // background: cyan;
    height:646px;
    float: left;
    width:30%;
    border-radius: 20px;
    margin-right:20px;
    padding-top: 38px;
    }
    .right {
        // background:skyblue;
        height:600px;
        float: right;
        width:68%;
        border-radius: 20px;
    }
    .img {
        border-radius: 50%;
    }
    .centercss {
        text-align: center;
    }
    .indent {
        text-indent: 12px;
    }
      .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
</style>