<template>
  <div class="workOrder">
    <searchForm  :type="'2'" @onSearch="onSearch" @onReset="onReset" :btnItems="'search,reset,export'"/>
    <div class="table-box">
      <div class="options">
          <span>基本列表</span>
          <div class="btns">
              <el-button type="primary" @click="clickColumns(1)">标记已读</el-button>
              <el-button type="primary" @click="clickColumns(2)">批量删除</el-button>
              <!-- <el-button
      plain
      @click="open2">
      右下角
    </el-button> -->
          </div>
      </div>
      <publicTable :tableData="tableData" ref="table" :tagHeight="380" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
          @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
      </publicTable>
    </div>
    
       <!--详情-->
       <el-dialog
        title="消息详情"
        destroy-on-close
        class="el-dialog-unify el-dialog-medium"
        width="1284px"
        v-if="visible"
        :visible="visible"
        :before-close="handleClose">
        <div class="details">
          <p>消息内容：<span></span></p>
          <p>站点名称：<span></span></p>
          <p>所属区域：<span></span></p>
          <p>紧急程度：<span></span></p>
          <p>通知时间：<span></span></p>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import publicTable from "@c/business/tables";
  import basic from "@/mixins/basic";
  import searchForm from "./components/filter"
  import { orderMessagePage,msgMarkAsRead,msgDel } from "@/api/message"
export default {
  components: {
	  publicTable,
	  searchForm,
	},
	mixins: [basic],
  data() {
    return {
      tableData:[],
      columObj: {
					// 选择框
					selection: true,
          loading:true,
          index:true,
          selectType:false,
					// 选择框根据条件是否可选
					selectable: (row, index) => {
						if (row.switchs) {
							return true;
						}
					},
          columnData: [
        {label: '消息状态 ', prop: 'readStatus',text: true, editRow: undefined, align: 'center'},
        {label: '消息内容', prop: 'messageContent',text: true, editRow: undefined, align: 'center'},
        {label: '消息类型 ', prop: 'dataCategory',text: true, editRow: undefined, align: 'center'},
        {label: '消息时间', prop: 'createTime',text: true, editRow: undefined, width: 160},
        {label: '操作', width: "300", fixed:'right',isOperation: true,
        operation: [{
              operation: "delete",
              type: "text",
              label: "删除",
              icon: "",
              color: '#5674E5',
              isShow: (row, $index) => {
                  return true
              }
          }, {
              operation: "details",
              type: "text",
              label: "去处理",
              icon: "",
              color: '#5674E5',
              isShow: (row, $index) => {
                  return true
              }
          },
        ]
        },],
      }, 
      flag:false,
      visible:false,
      row:{},   
      pageObj: { //分页对象
            position: "right", //分页组件位置
            total: 0,
            show: true,
            pageData: {
              size:10,
              queryMsgType:2,
              sendOrRecive:1,
              userType:1,
              userId:localStorage.getItem('adminUserId'),
              current:1,
					    }
					}
    };
  },
  created() {},
  mounted() {
    this.getData()
  },
  methods: {
    open2() {
        this.$notify({
          title: '通知',
          dangerouslyUseHTMLString: true,
          title: "提示",
          duration:5000,
          message:
            '<p>巡检工单GD-jajfla,<span style="color:#0066ff;cursor:pointer">请点击处理</span>！</p>',
          position: 'bottom-right'
        });
      },
    clickColumns(val){
      
      if(val==1){
        if(this.selectIds.length!=0){
          // 标记已读
          msgMarkAsRead({
            msgIds:this.selectIds,
            sendUserType:1,
            userId:localStorage.getItem('adminUserId')
          }).then((res)=>{
                  if(res.code == 0){
                    this.onReset()
                    this.$message({
                      type: 'success',
                      message: '标记已读成功!'
                    });
                  }
                })
        }else{
          this.$message.warning('请先选择列表内容')
        }    
        
           
      }else{
        if(this.selectIds.length!=0){
          // 请求删除接口
          msgDel(
            this.selectIds
          ).then((res)=>{
                if(res.code == 0){
                  this.onReset()
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }
              })
        }else{
          this.$message.warning('请先选择列表内容')
        }
      }
    },
    handleClose(){
      this.visible = false
    },
    // 操作栏按钮
    rowOperation(row, $index, now) {
      this.row = {}
      if(now == 'details'){
        // this.visible = true
        // this.row = row
        this.$router.push({
            path:"/order/ordeReceiptDetails",
            query:{
            	id:dataId
            }
        })
      }else if(now == 'delete'){
        // 请求删除接口
        msgDel({
          msgIds:[row.id]
        }).then((res)=>{
              if(res.code == 0){
                this.onReset()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
            })
      }
    },
    // 复选框选中添加id
    handleSelectionChange(row) {
        this.selectIds = row.selectKey
        this.pageObj.pageData.exportIds = this.selectIds.join(',')
    },
    //页码变化
    handleCurrentChange(e) {
      this.pageObj.pageData.current = e;
      this.columObj.loading = true
      this.getData()
    },
    //条数变化
    handleSizeChange(e) {
      this.pageObj.pageData.size = e;
      this.pageObj.pageData.current = 1;
      this.columObj.loading = true
      this.getData()
    },
    // 获取表格数据
	  onSearch(val) {
      delete val.time;
      this.pageObj.pageData = Object.assign(this.pageObj.pageData, val);
      this.getData();
	  },
	  // 重置请求参数请求数据
	  onReset() {
      this.pageObj.pageData = {
        size:10,
        queryMsgType:2,
        sendOrRecive:1,
        userType:1,
        userId:localStorage.getItem('adminUserId'),
        current:1,
      }
		  this.getData();
	  },
    getData(){
      this.selectIds = []
      this.$refs.table.close()
      orderMessagePage(this.pageObj.pageData).then((res)=>{
            if(res.code === 0){
                this.tableData = res.data.records || []
                this.columObj.loading = false
                this.pageObj.total = res.data.total
            }else{
                this.$message.error('请求报错')
            }
        })
    }
  },
};
</script>
<style scoped>
.details{
  width: 400px;
  margin: 0 auto;
}
.details p{
  line-height: 50px;
}
.table-box{
    background: #fff;
    padding: 15px;
}
.options{
    width: 100%;
    display: flex;
    padding: 5px 10px;
    background: #fff;
}
.options span{
    flex: 1;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
}
.options .btns{
    justify-content: flex-end;
}
</style>
