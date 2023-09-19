<template>
    <div>
     <el-card>
        <div slot="header" class="header">
    <span>全部信息</span>
    <div>
    <el-button @click="turndown(1)">拒绝</el-button>
    <el-button type="primary" @click="turndown(2)">通过</el-button>
    </div>
   
  </div>
        <div class="inforBox">
        <div class="infoeItemBox">
            <div>站址名称：<span>{{ inforData.name || '-'}}</span></div>
            <div>所属区域：<span>{{ inforData.county || '-'}}</span></div>
            <div>共享情况：<span>{{ inforData.operator || '-'}}</span></div>
            <div>站址地形：<span v-if="inforData.terrain==1">高山</span><span v-else-if="inforData.terrain==2">平原</span><span v-if="inforData.terrain==3">丘陵</span></div>
            <div>站址来源：<span v-if="inforData.source==1">自有站</span><span v-else-if="inforData.source==2">-</span></div>
            <div>经度：<span>{{ inforData.lng || '-'}}</span></div>

        </div>
        <div class="infoeItemBox">
            <div>站址详细地址：<span>{{ inforData.address || '-'}}</span></div>
            <div>产权方：<span>{{ inforData.usageScenario || '-'}}</span></div>
            <div>自使用运维ID:<span>{{ inforData.hnSiteCode || '-'}}</span></div>
            <div>站址细分类型：<span>{{ inforData.siteType || '-'}}</span></div>
            <div>站址保障等级：<span>{{ inforData.securityLevel || '-'}}</span></div>
            <div>上站难易程度：<span v-if="inforData.difficultyLevel==1">容易上站</span>
                <span v-else-if="inforData.difficultyLevel==2">无法上站</span>
                <span v-else-if="inforData.difficultyLevel==3">需要协调上站</span>
            </div>
        </div>
        <div class="infoeItemBox">
            <div>气候分区：<span v-if="inforData.climate==1">温暖</span><span v-else-if="inforData.climate==2">-</span></div>
            <div>纬度：<span>{{ inforData.lat || '-'}}</span></div>
            <div>站址状态：<span v-if="inforData.siteStatus==1">交维</span><span v-else-if="inforData.siteStatus==2">-</span></div>
            <div>上站困难说明：<span>{{ inforData.description || '-'}}</span></div>
        </div>
        </div>
    </el-card>
    </div>
</template>

<script>
import {shengeinfo,refus} from '@/api/device'
export default {
    data() {
        return {
       inforData:{},
       infoid:0,
        };
      
    },
    created() {

    },
    mounted() {
this.infoid=this.$route.query.param
shengeinfo({id:this.infoid}).then((res)=>{
    this.inforData=res.data
    console.log(res );
   this.activeStep=Number(res.data.status) 
})
    },
    methods: {
        turndown(el){
            
            refus({ids:[this.infoid],status:el}).then((res)=>{
                console.log(res);
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.header{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.inforBox{
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    .infoeItemBox{
       width: 300px;
       margin-right: 20px;
        div{
            margin-top: 24px;
            span{
                font-size: 14px;
font-family: PingFangSC-Regular, PingFang SC;
font-weight: 400;
color: rgba(0,0,0,0.65)
            }
        }
    }
}
.btmbox{
    margin-top: 20px;
}
</style>
