<template>
    <div class="container">
        <div class="disp_flex content">
          <div class="editBtn" v-if="editState">
              <el-button type="text" @click="chooseBtn" >隐患选择</el-button>
          </div>
          <el-table
              :data="checkTableData2" 
              style="width: 100%;max-height: 350px;overflow-y: auto;" :class="height?'table':''">
              <el-table-column
                    prop="hiddenId"
                    label="隐患 ID"
                    width="180">
              </el-table-column>
              <el-table-column
                    prop="description"
                    label="隐患描述">
              </el-table-column>
              <el-table-column
                    prop="name"
                    label="方案设置" width="100">
                    <template slot-scope="scope">
                      <el-button type="text" v-hold-click @click.stop="setting(scope.row,scope.$index+1)" > 编辑 </el-button>
                    </template>
              </el-table-column>
          </el-table>
        </div>
        <el-dialog title="隐患选择" :visible.sync="dialogTableVisible" class="el-dialog-unify el-dialog-medium" width="1284px" top="8vh">
            <div>
                <el-form inline
                        :model="form"
                        label-width="100px"
                        class="form m-form" ref="form">
                    <div class="flex">
                    <el-form-item label="隐患等级:">
                        <el-select filterable clearable v-model="form.level">
                        <el-option v-for="item in levelTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发现途径:">
                        <el-select filterable clearable v-model="form.source">
                        <el-option v-for="item in sourceTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核时间:">
                        <el-date-picker
                            v-model="createTime"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :clearable="false"
                            @change="changeTime($event, 'form')"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    </div>
                    <el-form-item>
                    <div class="disp_flex" style="margin-left: 20px;">
                        <el-button type="primary" native-type="submit" @click="submitForm">搜索</el-button>
                        <el-button  v-hold-click native-type="submit" @click="resetForm">重置</el-button>
                    </div>
                    </el-form-item>
                </el-form>
            </div> 
            <div style="height:300px">
                <div style="margin:20px 0">已选择：</div>
                <m-table height="100%" :columns="columns" :data="checkTableData"  ref="multipleTable"   :select="select" @select-change="handleSelect2">
                    <el-table-column slot="index" label="序号">
                        <template slot-scope="scope">
                        {{ scope.$index+1 }}
                        </template>
                    </el-table-column>
                    <el-table-column slot="pictureInfoList" label="隐患照片">
                        <template slot-scope="scope" v-if="scope.row.pictureInfoList">
                          <el-image 
                            class="images"
                            v-if="scope.row.pictureInfoList.length>0"
                            :src="viewUrl+scope.row.pictureInfoList[0]" :preview-src-list="scope.row.pictureInfoList.map(item3 =>{return (viewUrl+item3)})">
                          </el-image>
                        </template>
                    </el-table-column>
                </m-table>
            </div>
            <div style="height:500px">
                <m-table height="100%" :columns="columns" :request="getHiddenTableData2"  :payload="form" :loading.sync="loading" ref="table" @done="done"  :select="select"
                  @select-change="handleSelect">
                    <el-table-column slot="index" label="序号">
                        <template slot-scope="scope">
                        {{ scope.$index+1+($refs.table.current-1)*$refs.table.size }}
                        </template>
                    </el-table-column>
                    <el-table-column slot="pictureInfoList" label="隐患照片">
                        <template slot-scope="scope" v-if="scope.row.pictureInfoList">
                          <el-image 
                            class="images"
                            v-if="scope.row.pictureInfoList.length>0"
                            :src="viewUrl+scope.row.pictureInfoList[0]" :preview-src-list="scope.row.pictureInfoList.map(item3 =>{return (viewUrl+item3)})">
                          </el-image>
                        </template>
                    </el-table-column>
                </m-table>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="rightBtn">确 定</el-button>
              <el-button @click="dialogTableVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="维修方案设置" :visible.sync="dialogVisible"  width="65%" top="8vh">
          <div class="maintenance_content">
              <div class="maintenance_content_left">
                  <div class="maintenance_items">
                    <span class="items_label">隐患 ID：</span>
                    <span>{{ maintenance.hiddenId }}</span>
                  </div>
                  <div class="maintenance_items">
                    <span class="items_label">隐患设备名称：</span>
                    <span>{{ maintenance.device}}</span>
                  </div>
                  <div class="maintenance_items">
                    <span class="items_label">隐患描述：</span>
                    <span>{{ maintenance.description }}</span>
                  </div>
                  <div class="maintenance_items">
                    <span class="items_label">隐患等级：</span>
                    <span>{{ maintenance.levelName }}</span>
                  </div>
                  <div class="maintenance_items">
                    <span class="items_label">拍照：</span>
                    <span v-if="maintenance.pictureInfoList">
                      <el-image 
                        class="images"
                        v-for="item3 in maintenance.pictureInfoList" fit="cover"
                        :src="viewUrl+item3" :preview-src-list="[viewUrl+item3]">
                      </el-image>
                    </span>
                  </div>
              </div>
              <div class="maintenance_content_right">
                  <div class="title">建议维修方案</div>
                  <el-form ref="dataForm" :model="dataForm" >
                    <el-form-item label="维修项目选择">
                      <el-cascader
                        v-model="dataForm.moduleIdAndItemId"
                        :options="xmDataList" :props="props" @change="e=>moduleChange(e,maintenance)"></el-cascader>
                    </el-form-item>
                    <el-form-item label="备注">
                      <el-input type="textarea" v-model="dataForm.remark" class="textarea" rows="4" maxlength="200" @input="e=>remarkChange(e,maintenance)"></el-input>
                    </el-form-item>
                  </el-form>
              </div>
          </div>
          <div class="pages">
            <i class="el-icon-arrow-left el-icon" @click="arrowLeftBtn"></i>
            <span class="el-text">{{ currentIndex +'/'+checkTableData2.length }}</span>
            <i class="el-icon-arrow-right el-icon" @click="arrowRightBtn"></i>
          </div>
           <span slot="footer" class="dialog-footer" v-if="currentIndex==checkTableData2.length">
              <el-button type="primary" @click="completeBtn">完成</el-button>
            </span>
        </el-dialog>
    </div>
  </template>  
  <script>
    import {getHiddenTableData2} from "../api";
    import mTable from "@c/business/table";
    import {  BASE_UPLOAD } from "@/config";
    export default {
        components: {
            mTable
        },
        data() {
            return {
              select: true,
              dialogTableVisible:false,
              dialogVisible:false,
              tableData: [],
              checkTableData: [],
              checkTableData2: [],
              loading:false,
              multipleSelection:[],
              levelTypeList:[{
                      label:'一级',
                      value:1
                      },{
                      label:'二级',
                      value:2
                      },{
                      label:'三级',
                      value:3
                      },{
                      label:'四级',
                      value:4
                      // },{
                      // label:'五级',
                      // value:5
                      // },{
                      // label:'六级',
                      // value:6
                      // },{
                      // label:'七级',
                      // value:7
                      // },{
                      // label:'八级',
                      // value:8
                      // },{
                      // label:'九级',
                      // value:9
                      // },{
                      // label:'十级',
                      // value:10
              }],
              sourceTypeList:[{
                  label:'巡检发现',
                  value:1
                  },{
                  label:'自主上报',
                  value:2
              }],
              form:{},
              columns: [
                  {label: '序号', slot: 'index', width: 60},
                  {label: '隐患ID', prop: 'hiddenId'},
                  {label: '隐患描述', prop: 'description'},
                  {label: '隐患设备名称', prop: 'device',width:140},
                  {label: '隐患等级', prop: 'levelName'},
                  {label: '隐患照片', slot: 'pictureInfoList'},
                  {label: '隐患分类', prop: 'orderTypeName'},
                  {label: '发现途径', prop: 'sourceName'},
                  {label: '所属基站', prop: 'siteName'},
                  {label: '基站所属区域', prop: 'areaName',width:140},
                  {label: '审核时间', prop: 'warehousingTime'},
              ],
              createTime:[],
              maintenance:{},
              dataForm:{
                moduleIdAndItemId:[]
              },
              currentIndex:1,
              props:{
                'label':'name',
                'value':'id',
                'children':'itemVOList',
              },
              checkArray:[],
              viewUrl: BASE_UPLOAD,
            }

        },
      props:['editState','height','siteInfoId','orderSecondTypeCode','xmDataList','checkedHiddenData1','checkedHiddenData2'],
      watch: {
        siteInfoId: {
          immediate: true,
          handler(value) {
            if(this.orderSecondTypeCode&&this.siteInfoId){
                this.form.type=this.orderSecondTypeCode,
                this.form.siteInfoId=this.siteInfoId
                this.$refs.table?.resetInit();
            }
          }
        },
        orderSecondTypeCode: {
          immediate: true,
          handler(value) {
            if(this.orderSecondTypeCode&&this.siteInfoId){
                this.form.type=this.orderSecondTypeCode,
                this.form.siteInfoId=this.siteInfoId
                this.$refs.table?.resetInit();
            }
          }
        },
        checkedHiddenData1:{
          immediate: true,
          handler(value) {
              this.checkTableData2=value;
          }
        },
        checkedHiddenData2:{
          immediate: true,
          handler(value) {
             this.checkArray=value;
          }
        },
        xmDataList:{
          immediate: true,
          handler(value) {
              if(value){
                value.forEach(item1=>{
                  item1.disabled=false;
                  item1.itemVOList.forEach(item2=>{
                    item2.disabled=false;
                  })
                })
              }
          }
        }
      },
      created(){
        this.loading=true;
      },
      methods:{
        chooseBtn(){
          if(this.form.siteInfoId==''||this.form.siteInfoId==undefined){
            this.$message({
              type: "warning",
              message:'请选择站点名称',
            });
            return false;
          }
          this.dialogTableVisible=true;
          this.refreshData();
        },
        done(){
          this.refreshData();
        },
        refreshData(){
            let array=[];
            setTimeout(() => {
              if(this.checkArray.length>0){
                this.$refs.table._data.dataSource.forEach(row => {
                  if(this.checkArray.indexOf(row.id)>-1){
                    array.push(row)
                  }  
                })
                this.checkTableData=[...array,...this.checkTableData];
                var obj = {};
                this.checkTableData = this.checkTableData.reduce((cur,next) => {
                    obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                    return cur;
                },[]) //设置cur默认类型为数组，并且初始值为空的数组
                this.$nextTick( ()=>{
                  this.$refs.table?.getTableRef().clearSelection()
                  this.checkTableData.forEach(row => {
                      this.$refs.multipleTable?.getTableRef().toggleRowSelection(row,true)
                      this.$refs.table?.getTableRef().toggleRowSelection(row,true)
                  })
                })
              }
            }, 1000);
        },
        getHiddenTableData2,
        submitForm() {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    console.log('Form validation failed');
                    return false;
                }else{
                    if(this.createTime.length>0){
                        this.form.startTime=this.createTime[0];
                        this.form.endTime=this.createTime[1];
                    }else{
                        this.form.startTime='';
                        this.form.endTime='';
                    }
                    this.$refs.table?.resetInit();
                }
            });
        },
        resetForm() {
            this.form = {};
            this.createTime = [];
            this.$refs.form.resetFields();
            this.$nextTick(() => {
              this.form.type=this.orderSecondTypeCode,
              this.form.siteInfoId=this.siteInfoId
              this.$refs.table.resetInit();
            })
        },
        handleSelect(rows = {}) {
            this.checkArray = rows?.selectKey || [] // JSON.stringify(rows?.selectKey || []);
            this.checkTableData = rows?.row || [] // JSON.stringify(rows?.selectKey || []);
            this.$nextTick( ()=>{
                rows?.row.forEach(row => {
                    this.$refs.multipleTable?.getTableRef().toggleRowSelection(row,true)
                })
            });
        },
        handleSelect2(rows = {}) {
            this.checkArray = rows?.selectKey || [] // JSON.stringify(rows?.selectKey || []);
            this.checkTableData = rows?.row || [] // JSON.stringify(rows?.selectKey || []);
            this.$nextTick( ()=>{
                this.$refs.table?.getTableRef().clearSelection()
                rows?.row.forEach(row => {
                    this.$refs.multipleTable?.getTableRef().toggleRowSelection(row,true)
                    this.$refs.table?.getTableRef().toggleRowSelection(row,true)
                })
            });
        },
        changeTime(val, type){
          let that = this;
          that.createTime=val;
          if(val==null){
            delete that[type].startTime;
            delete that[type].endTime;
          }else{
            that[type].startTime = val[0];
            that[type].endTime = val[1];
          }
        },
        rightBtn(){
          this.checkTableData2=this.checkTableData;
          this.dialogTableVisible=false;
          this.$emit('getCheckTableData2',this.checkTableData2)
        },
        completeBtn(){
          this.dialogVisible=false;
          this.$emit('getCheckTableData2',this.checkTableData2)
        },
        setting(data,index){
          this.maintenance=data;
          this.dataForm.moduleIdAndItemId=data.moduleIdAndItemId;
          // this.dataForm.remark=data.remark;
          this.currentIndex=index;
          let checkItemId=[]
          this.checkTableData2.forEach(item=>{
              if(item.itemId&&item.itemId!=this.maintenance.itemId){
                checkItemId.push(item.itemId)
              }
          })
          this.xmDataList.forEach(item1=>{
            item1.disabled=false;
            item1.itemVOList.forEach(item2=>{
              if(checkItemId.indexOf(item2.id)>-1){
                item2.disabled=true;
              }else{
                item2.disabled=false;
              }
              
            })
          })
          this.dialogVisible=true;
        },
        arrowLeftBtn(){
          if(this.currentIndex==1){return false}
          this.currentIndex=this.currentIndex-1;
          this.maintenance=this.checkTableData2[this.currentIndex-1];
          this.dataForm.moduleIdAndItemId=[]
          this.dataForm.remark=''
          if(this.maintenance?.moduleIdAndItemId){
            this.dataForm.moduleIdAndItemId=this.maintenance.moduleIdAndItemId
          }
          if(this.maintenance?.remark){
            this.dataForm.remark=this.maintenance.remark
          }
          let checkItemId=[]
          this.checkTableData2.forEach(item=>{
              if(item.itemId&&item.itemId!=this.maintenance.itemId){
                checkItemId.push(item.itemId)
              }
          })
          this.xmDataList.forEach(item1=>{
            item1.disabled=false;
            item1.itemVOList.forEach(item2=>{
              if(checkItemId.indexOf(item2.id)>-1){
                item2.disabled=true;
              }else{
                item2.disabled=false;
              }
              
            })
          })
        },
        arrowRightBtn(){
          if(this.currentIndex==this.checkTableData2.length){return false}
          this.currentIndex=this.currentIndex+1;
          this.maintenance=this.checkTableData2[this.currentIndex-1];
          this.dataForm.moduleIdAndItemId=[]
          this.dataForm.remark=''
          if(this.maintenance?.moduleIdAndItemId){
            this.dataForm.moduleIdAndItemId=this.maintenance.moduleIdAndItemId
          }
          if(this.maintenance?.remark){
            this.dataForm.remark=this.maintenance.remark
          }
          let checkItemId=[]
          this.checkTableData2.forEach(item=>{
              if(item.itemId&&item.itemId!=this.maintenance.itemId){
                checkItemId.push(item.itemId)
              }
          })
          this.xmDataList.forEach(item1=>{
            item1.disabled=false;
            item1.itemVOList.forEach(item2=>{
              if(checkItemId.indexOf(item2.id)>-1){
                item2.disabled=true;
              }else{
                item2.disabled=false;
              }
              
            })
          })
        },
        moduleChange(e,data){
          data.moduleIdAndItemId=e;
          if(e.length>0){
            data.moduleId=e[0];
            data.itemId=e[1];
            let item1=this.xmDataList.filter(el=>el.id==e[0])[0].itemVOList;
            let item2=item1.filter(el=>el.id==e[1])[0];
            data.priceSum=item2.priceSum;
          }else{
            data.moduleId='';
            data.itemId='';
          }
        },
        remarkChange(e,data){
          data.remark=e;
          this.dataForm.remark=e;
          this.$forceUpdate();
        },
      }
    }
</script>
<style scoped lang="scss">
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .editBtn{
    margin-bottom: 20px;
    width: 110px;
    text-align: right;
    margin-right: 20px;
  }
  .treeContent{
    padding: 20px 30px;
  }
  .treeHeader{
    padding: 0px 30px;
    margin: 20px auto;
    display: flex;
    justify-content: space-between;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .container{
    width: 90%;
    .content{
      width: 100%;
      .table{
        margin-top: -50px;
      }
    }
  }
  .maintenance_content{
    width: 100%;
    height: auto;
    display: flex;
    .maintenance_content_left, .maintenance_content_right{
      width: 50%;
      height: auto;
      .maintenance_items{
        margin: 10px 0;
        display: flex;
        .images{
          width: 100px;
          height: 100px;
          margin-left: 10px;
        }
        .items_label{
          display: inline-block;
          width: 100px;
        }
      }
      .title{
        margin: 20px 0;
      }
      .textarea{
        textarea{
          resize: none;
        }
      }
    }
  }
  .pages{
    text-align: center;
    padding: 20px;
    .el-icon{
      font-size: 16px;
      margin: 0 5px;
      cursor: pointer;
    }
    .el-text{
      font-size: 16px;
      margin: 0 5px;
    }
  }
</style>