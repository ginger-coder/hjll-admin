<template>
  <div>
    <el-card class="top">
       
      <el-form :inline="true" :model="searchs" class="demo-form-inline" ref="searchs">
        <el-form-item label="站址名称">
          <el-input v-model="searchs.name" clearable placeholder="请输入站址名称"  @keyup.enter.native="doSearch"></el-input>
        </el-form-item>
        <!-- <el-form-item label="审核通过时间">
          <el-select v-model="formInline.region" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
            <el-form-item label="所属区域：" prop="dist">
					<areaSelect ref="areaSelect" @change="changeArea($event, 'searchs')" :ischeckStrictly="true"></areaSelect>
	        </el-form-item>
    <el-button icon="el-icon-search" type="primary" v-hold-click @click="doSearch">筛选</el-button>
          <el-button icon="el-icon-refresh" v-hold-click @click="searchReset">重置</el-button>
        </el-form-item>
      </el-form>
    
    </el-card>
                       <!-- 已选 -->
                       <template>
            <div class="table_selection_card">
                已选 <span class="mcolor">{{listData.length}}</span> 项
                <el-button type="text" :disabled="listData.length==0" @click="handleSelectionClear">清空</el-button>
            </div>
            <div class="sh1"></div>
        </template>
    <el-card  class="jiben">
   <div slot="header" class="header">
  <div class="title">基本信息</div>
  <div>
   <el-button type="text" @click="open">批量通过审核</el-button>
    </div>
   </div>
        <el-table
      :data="tableData"
      v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    @selection-change="handleSelectionChange"
    ref="table"
      style="width: 100%">
      <el-table-column key="selection" type="selection" align="center" fixed></el-table-column>
    </el-table-column>
      <el-table-column
        prop="name"
        label="站址名称"
        width="">
        <template slot-scope="scope">
            <div class="cell-ellipsis">
                {{ scope.row.name || "-" }}
            </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="area"
        label="所属区域"
        width="">
        <template slot-scope="scope">
              {{ scope.row.area || "-" }}
        </template>
      </el-table-column>  <el-table-column
        prop="address"
        label="站址详细地址"
        min-width="80"
        width="120"
        >
        <template slot-scope="scope">
            <div class="cell-ellipsis">
                {{ scope.row.address || "-" }}
            </div>
             
        </template>
      </el-table-column>  <el-table-column
        prop="operator"
        label="共享情况"
        width="">
        <template slot-scope="scope">
              {{ scope.row.operator || "-" }}
        </template>
      </el-table-column>  <el-table-column
        prop="siteTypeName"
        label="站址细分类型"
        width="">
        <template slot-scope="scope">
              {{ scope.row.siteTypeName || "-" }}
        </template>
      </el-table-column>  <el-table-column
        prop="lat"
        label="经度"
        width="">
        <template slot-scope="scope">
              {{ scope.row.lat || "-" }}
        </template>
      </el-table-column>  <el-table-column
        prop="lng"
        label="纬度"
        width="">
        <template slot-scope="scope">
              {{ scope.row.lng || "-" }}
        </template>
      </el-table-column>  <el-table-column
        prop="securityLevelName"
        label="站址保障等级"
        width="">
        <template slot-scope="scope">
              {{ scope.row.securityLevelName || "-" }}
        </template>
      </el-table-column>  <el-table-column
        prop="siteExamineStatus"
        label="状态"
        width="">
        <template slot-scope="scope">
              {{ scope.row.siteExamineStatus || "-" }}
        </template>
      </el-table-column>  <el-table-column
        prop="ExamineUpdateTime"
        label="审核通过时间"
        width="">
        <template slot-scope="scope">
              {{ scope.row.ExamineUpdateTime || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        width="150"
        fixed="right"
        >
        <template class="czbtnBox" v-slot="{ row }" >
            <el-button class="btnss" @click="docoment(row.siteExamineId)">详情</el-button>
           <el-button class="btnss" @click="docoment(row.siteExamineId)">审核</el-button>
    
        </template>
      </el-table-column>
    </el-table>
    </el-card>
    <div  class="paging_fixed_bottom">
			<div class="pagign_box disp_flex ju_bet ali_cen">
				<div></div>
				<el-pagination background :total="total" :page-size="pageSize" :pager-count="pagerCount" :current-page="currentPage" layout="total,prev, pager, next,sizes, jumper" :page-sizes="pageSizes" @current-change="paging_change" @size-change="size_change"></el-pagination>
			</div>
		</div>
  </div>
</template>

<script>
import { shenge,refus } from "@/api/device";
import areaSelect from "@/components/custom/areaSelect";
import {ispPage,page } from "@/api/isp";
export default {
components:{
    areaSelect
},

  data() {
    return {
        searchs: {
            name:'',
            province:'',
            city:'',
            county:''
        },
        tableData: [],
        loading:false,
        listData:[],
      currentPage: 1,
      pageSize: 10,
      total: 100,
      pagerCount:5,
      page:1,
      size:10,
      pageSizes:[10,20,30,40,50],
    };
  },

  created() {},
  mounted() {
this.getTableList()
  },
  methods: {
    paging_change(currentPage) {
      this.loading=true
      shenge({current:currentPage,size:10}).then(res=>{
        this.tableData=res.data.records,
        this.loading=false
    })
    },
    size_change(){

    },
    handleSelectionClear(){
    this.$refs.table.clearSelection();
    },
    getTableList(){
      this.loading=true
      shenge({current:1,size:10}).then(res=>{
        this.tableData=res.data.records
        this.total=res.data.total
        this.loading=false
    })
    },
    // toggleSelection(rows) {
    //     console.log(rows);
    //   },
      handleSelectionChange(val) {
        this.listData=val.map(el=>{
         return el.siteExamineId
        })
      },
    
    changeArea(val, type) {
			let that = this;
			let { province, city, area } = val;
			that.searchs.province = province;
			that.searchs.city = city;
			that.searchs.county = area;
             that.doSearch()
			
		},
        doSearch(){
            let that = this
            that.loading=true
            shenge(this.searchs).then(res=>{
                that.tableData=res.data.records
                that.loading=false
            })
        },
    onSubmit() {
        console.log('submit!');
      },
      docoment(row){
        console.log(row);
this.$router.push({path:'/rm/sheinfo',query: {param: row}})
      },
      searchReset(){
        let that = this
        that.searchs.name=""
        that.searchs.province=""
        that.searchs.city=""
        that.searchs.county=""
        // this.getTableList()
      },
      open() {
        console.log(this.listData);
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          refus({ids:this.listData,status:1}).then(res=>{
            if(res.code==0){
              this.$message({
            type: 'success',
            message: '删除成功!'
          });
            }
          })
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
  },
};
</script>

<style lang="scss" scoped>
.top{
  margin-bottom: 10px;
}
.cell-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.jiben{
    max-height: calc(100vh - 270px);
  overflow-y: auto;
  .header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title{

font-size: 16px;
font-family: PingFangSC-Medium, PingFang SC;
font-weight: 500;
color: rgba(0,0,0,0.85);
line-height: 24px;
    }
  }
}
.czbtnBox{
    display: flex;
}
.btnss{
    color: #5674E5;
    width: 60px;
    padding-left: 15px;
    margin-left: 0;
    border: none;
}
</style>
