<template>
  <div>
    <el-tabs  class="tabs" v-model="activeName"  @tab-click="handleClick">
      <el-tab-pane v-if="perms.includes('sys:mseeage:send')" label="发送" name="1">
      </el-tab-pane>
      <el-tab-pane label="接收" name="2">
      </el-tab-pane>
    </el-tabs>
    <searchForm :type="'1'" :activeName="activeName" @onSearch="onSearch" @onReset="onReset" :btnItems="'search,reset,export'"/>
    <div v-if="activeName == '1'" class="table-box">
          <div class="options">
              <span>基本列表</span>
              <div class="btns">
                  <el-button type="primary" @click="clickColumns(1)">创建消息</el-button>
                  <el-button type="primary" @click="clickColumns(2)">批量删除</el-button>
              </div>
          </div>
          <publicTable :tableData="tableData" ref="table1" :tagHeight="480" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
              @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
          </publicTable>
      </div>
      <div  v-if="activeName == '2'" class="table-box">
        <div class="options">
            <span>基本列表</span>
            <div class="btns">
                <el-button type="primary" @click="clickColumns(3)">标记已读</el-button>
                <el-button type="primary" @click="clickColumns(4)">批量删除</el-button>
            </div>
        </div>
        <publicTable :tableData="tableData2" ref="table2" :tagHeight="481" :columObj="columObj2" :pageObj="pageObj" @rowOperation="rowOperation"
            @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
        </publicTable>
      </div>
  </div>
</template>

<script>
  import publicTable from "@c/business/tables";
  import basic from "@/mixins/basic";
  import searchForm from "./components/filter"
  import { messagePage,messageSend,messageDellete,receivePage,updateReceive,founDelete } from "@/api/message"
export default {
  components: {
	  publicTable,
	  searchForm,
	},
	mixins: [basic],
  data() {
    return {
      activeName:'1',
      tableData:[],
      tableData2:[],
      selectIds:[],
      columObj: {
					// 选择框
					selection: true,
          loading:true,
          selectType:false,
					// 选择框根据条件是否可选
					selectable: (row, index) => {
						if (row.switchs) {
							return true;
						}
					},
          columnData: [
        {label: '消息标题', prop: 'title',text: true, editRow: undefined, align: 'center'},
        {label: '消息分类', prop: 'messageTypeName',text: true, editRow: undefined, align: 'center'},
        {label: '消息状态', prop: 'status',mssages: true,
            width: "",
            align: "center",
            backColor:(row,$index)=>{
                    if(row.status == 0){
                        return '#5674E5'
                    }else{
                        return '#52C41A'
                    }
                },
            ownDefinedReturn:(row, $index) => {
                if(row.status == 0){
                  return '待发送'
                }else{
                  return '已发送'
                }
            }
        },
        {label: '创建时间', prop: 'createTime',text: true, editRow: undefined, width: 160},
        {label: '发送时间时间', prop: 'sentTime',text: true, editRow: undefined, width: 160},
        {label: '操作', width: "300", isOperation: true,
        operation: [{
              operation: "details",
              type: "text",
              label: "详情",
              icon: "",
              color: '#5674E5',
              isShow: (row, $index) => {
                  return true
              }
          },
          {
              operation: "edit",
              type: "text",
              label: "编辑",
              icon: "",
              color: '#5674E5',
              isShow: (row, $index) => {
                if(row.status=='0'){
                  return true
                }else{
                  return false
                }
              }
          },
          {
              operation: "send",
              type: "text",
              label: "发送",
              icon: "",
              color: '#5674E5',
              isShow: (row, $index) => {
                if(row.status=='0'){
                  return true
                }else{
                  return false
                }
              }
          }, {
              operation: "delete",
              type: "text",
              label: "删除",
              icon: "",
              color: '#5674E5',
              isShow: (row, $index) => {
                  return true
              }
          },
        ]
        },],
      },
      columObj2: {
					// 选择框
					selection: true,
          loading:true,
          selectType:false,
					// 选择框根据条件是否可选
					selectable: (row, index) => {
						if (row.switchs) {
							return true;
						}
					},
          columnData: [
        {label: '消息标题', prop: 'title',text: true, editRow: undefined, align: 'center'},
        {label: '消息状态', prop: 'readStatus',mssages: true,
            width: "",
            align: "center",
            backColor:(row,$index)=>{
                    if(row.readStatus == 0){
                        return '#5674E5'
                    }else{
                        return '#52C41A'
                    }
                },
            ownDefinedReturn:(row, $index) => {
                if(row.readStatus == 0){
                  return '未读'
                }else{
                  return '已读'
                }
            }
          },
        {label: '消息分类', prop: 'messageTypeName',text: true, editRow: undefined, align: 'center'},
        {label: '接收时间', prop: 'createTime',text: true, editRow: undefined, width: 160},
        {label: '操作', width: "300", isOperation: true,
        operation: [{
              operation: "detailsHtml",
              type: "text",
              label: "详情",
              icon: "",
              color: '#5674E5',
              isShow: (row, $index) => {
                  return true
              }
          },
          {
                operation: "deleteTwo",
                type: "text",
                label: "删除",
                icon: "",
                color: '#5674E5',
                isShow: (row, $index) => {
                    return true
                }
            },
        ]
        },],
      },
      row:{},
      perms:[],
      pageObj: { //分页对象
            position: "right", //分页组件位置
            total: 0,
            show: true,
            pageData: {
              size:10,
              source:0,
              current:1,
					    }
					}
    };
  },
  created() {},
  mounted() {
    this.perms = this.$store.getters.user.perms;
    if(this.perms.includes('sys:mseeage:send')){
      this.activeName = '1'
    }else{
      this.activeName = '2'
    }
    this.getData()
  },
  methods: {
    handleClick(tab, event) {
        // if(this.$refs.searchRef){
        //     this.$refs.searchRef.time = ''
        //     this.$refs.searchRef.formData = {}
        // }
        if(this.activeName == '1'){
          this.$refs.table2?this.$refs.table2.close():null
        }else{
          this.$refs.table1?this.$refs.table1.close():null
        }
        this.pageObj.pageData.current = 1
        this.pageObj.pageData.size = 10
        this.onReset()
    },
    clickColumns(val){
      if(val==1){
        this.jump(`/newMessage/createmsg?flag=${'3'}`);
      }else if(val==2){
        if(this.selectIds.length!=0){
          // 请求删除接口
          messageDellete(this.selectIds).then((res)=>{
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
      }else if(val == 3){
        if(this.selectIds.length!=0){
          // 请求已读接口
          updateReceive({
            systemMessageIds:this.selectIds,
            userId:localStorage.getItem('adminUserId'),
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
      }else if(val == 4){
        // 请求删除接口
        founDelete({
          userId:localStorage.getItem('adminUserId'),
          source:0,
          systemMessageIds:this.selectIds
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
    // 操作栏按钮
    rowOperation(row, $index, now) {
      this.row = row
        if(now == 'details'){
          this.jump(`/newMessage/createmsg?id=${row.id}&flag=${'1'}`);
        }else if(now == 'delete'){
          this.$confirm('请确认是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 请求删除接口
            messageDellete(row.id).then((res)=>{
              if(res.code == 0){
                this.onReset()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
            })
          }).catch(() => {
                
          });
        }else if(now =='edit'){
          // 编辑
          this.jump(`/newMessage/createmsg?id=${row.id}&flag=${'2'}`);
        }else if(now == 'send'){
          this.$confirm('请确认是否发送该消息?发送后不可撤回', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 请求发送接口
            messageSend({
              systemMessageId:row.id,
              status:1,
          }).then((res)=>{
            if(res.code == 0){
              this.onReset()
              this.$message({
                type: 'success',
                message: '发送成功!'
              });
            }
          })
            
          }).catch(() => {
                
          });
        }else if(now == 'deleteTwo'){
          // 请求删除接口
        founDelete({
          userId:localStorage.getItem('adminUserId'),
          source:0,
          systemMessageIds:row.id
        }).then((res)=>{
              if(res.code == 0){
                this.onReset()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
            })
        }else{
          // 请求已读接口
          updateReceive({
            systemMessageIds:row.id,
            userId:localStorage.getItem('adminUserId'),
          }).then((res)=>{
            if(res.code == 0){
              
            }
          })
          // 纯文本详情
          this.jump(`/newMessage/createmsg?id=${row.id}&flag=${'1'}&showType=${'1'}`);
        }
        this.getData()
    },
    // 复选框选中添加id
    handleSelectionChange(row) {
        this.selectIds = row.selectKey
        this.selectIds = this.selectIds.join(',')
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
      this.pageObj.pageData = Object.assign(this.pageObj.pageData, val);
      this.getData();
	  },
	  // 重置请求参数请求数据
	  onReset() {
      this.pageObj.pageData = {
        size:10,
        source:0,
        current:1,
      }
      this.$refs.table1?this.$refs.table1.close():null
      this.$refs.table2?this.$refs.table2.close():null
      this.selectIds = []
		  this.getData();
	  },
    getData(){
      if(this.activeName == '1'){
        messagePage(this.pageObj.pageData).then((res)=>{
            if(res.code == 0){
                this.tableData = res.data.records || []
                this.columObj.loading = false
                this.pageObj.total = res.data.total
            }else{
                this.$message.error('请求报错')
            }
        })
      }else{
        this.pageObj.pageData.userId =  localStorage.getItem('adminUserId')
        receivePage(this.pageObj.pageData).then((res)=>{
            if(res.code == 0){
                this.tableData2 = res.data.records || []
                this.columObj2.loading = false
                this.pageObj.total = res.data.total
            }else{
                this.$message.error('请求报错')
            }
        })
      }
      
    }
  },
};
</script>

<style scoped>
.tabs{
  background: #fff ;
  padding: 15px 15px ;
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
