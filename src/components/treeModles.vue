<template>
    <div class="container" v-if="loading">
        <div class="disp_flex content">
          <div class="editBtn" v-if="editState">
              <el-button type="text" @click="editBtn" >编辑</el-button>
          </div>
          <el-table
              :data="checkTableData"
              style="width: 100%;max-height: 350px;overflow-y: auto;" :border="none" :class="height?'table':''">
              <el-table-column
                    prop="index"
                    label="序号"
                    width="180">
                    <template slot-scope="scope">
                      {{ scope.$index + 1 }}
                    </template>
              </el-table-column>
              <el-table-column
                    prop="name"
                    label="作业内容">
                    <template  slot-scope="scope">
                      <el-tree
                        :data="scope.row.checkedData"
                        node-key="id"
                        :default-checked-keys="scope.row.checkedArr"
                        :props="defaultProps"
                        :expand-on-click-node="false">
                        <span class="custom-tree-node" slot-scope="{ node, data }" >
                          <span v-if="node.label.length<50">{{ node.label }}</span>
                          <span v-else>{{ node.label.substr(0,46)+'...' }}</span>
                          <span v-if="editState">
                            <el-button
                              type="text"
                              size="mini"
                              style="color:red"
                              @click="() => remove(node, data,scope.$index)">
                              取消
                            </el-button>
                          </span>
                        </span>
                      </el-tree>
                    </template>
              </el-table-column>
          </el-table>
        </div>
        <el-drawer
            :visible.sync="drawer"
            append-to-body
            :modal-append-to-body="true"
            style="position: absolute"
            width="100%"
            size="50%"
            z-index="100">
            <!-- <div class="treeHeader">
              <div><span slot="title">作业模块列表</span>
              <el-input v-model="orderModuleName" placeholder="请输入" style="width: 200px;margin-left: 20px;"></el-input></div>
              <el-button type="primary" @click="rightBtn" >搜索</el-button>
            </div> -->
            <div class="treeContent">
              <el-table
                :data="tableData"
                style="width: 100%;height: 700px;overflow: auto;">
                <!-- <el-table-column
                  prop="index"
                  label="序号"
                  width="180">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column> -->
                <el-table-column
                  prop="name"
                  label="模块名称">
                  <template  slot-scope="scope">
                    <el-tree
                      :data="[treeData[scope.$index]]"
                      show-checkbox
                      node-key="id"
                      default-expand-all
                      :default-checked-keys="scope.row.checkedArr"
                      :default-expanded-keys="defaultExpandKeys"
                      @check="(checkedNodes,e)=>handleNodeClick(checkedNodes,e,scope.$index)"
                      :props="defaultProps">
                    </el-tree>
                  </template>
                </el-table-column>
                <el-table-column
                  label="已选项目数量"
                  width="180">
                  <template  slot-scope="scope">
                    {{ (scope.row.isAllState?scope.row.checkedArr.length-1:scope.row.checkedArr.length)+'/'+(treeData[scope.$index].itemVOList?treeData[scope.$index].itemVOList.length:'') }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
        </el-drawer>
    </div>
  </template>  
  <script>
    export default {
      data() {
        return {
          drawer:false,
          tableData: [], //右侧弹窗的数据
          checkTableData:[],//左侧选中的数据
          defaultProps: {
            children: 'itemVOList',
            label: 'name'
          },
          orderModuleName:"",
          treeData:[],
          loading:false,
          defaultExpandKeys:[]
        }
      },
      props:['editState','moduleList','height'],
      watch: {
        moduleList: {
          immediate: true,
          handler(value) {
            let array=[];
            let arrayItem=[];
            this.treeData=value;
            this.treeData.forEach(item=>{
              arrayItem.push({
                id: item.id,
                name: item.name,
                checkedData:item.checkedData||[],
                checkedArr:item.checkedArr||[],
                isAllState:false
              })
            });
            this.tableData=arrayItem;
            this.tableData.forEach(element => {
              if(element.checkedData.length>0){
                array.push(element)
              }
            });
            this.loading=true;
            this.checkTableData=array;
          }
        },
      },
      created(){
          // let array=[];
          // let arrayItem=[];
          // this.treeData.forEach(item=>{
          //   arrayItem.push({
          //     id: item.id,
          //     name: item.label,
          //     checkedData:[],
          //     checkedArr:[],
          //     isAllState:false
          //   })
          // });
          // this.tableData=arrayItem;
          // this.tableData.forEach(element => {
          //   if(element.checkedData.length>0){
          //     array.push(element)
          //   }
          // });
          // this.checkTableData=array;
      },
      methods:{
        editBtn(){
            this.drawer=true;
        },
        rightBtn(){
          this.$emit('getOrderModuleName',this.orderModuleName);
        },
        remove(node, data,num) {
          const children = this.checkTableData[num].checkedData[0].itemVOList;
          if(children){
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
          }
          if(children){
            if(data.children||children.length==0){
              let elementIndex = this.tableData.findIndex(item => item.id == this.checkTableData[num].id);
              let element = this.tableData[elementIndex] || {};
              this.$set( this.tableData, elementIndex, {
                ...element,
                checkedArr: [],
                checkTableData: [],
                isAllState: false
              })
              this.checkTableData=this.checkTableData.filter(item => item.id !== this.checkTableData[num].id);
            }else{
              this.checkTableData[num].checkedData.itemVOList= children;
              this.checkTableData[num].checkedArr=this.checkTableData[num].checkedArr.filter(item => item != data.id).filter(item => item != this.checkTableData[num].id);
              let elementIndex = this.tableData.findIndex(item => item.id == this.checkTableData[num].id);
              let element = this.tableData[elementIndex] || {};
              this.$set( this.tableData, elementIndex, {
                ...element,
                checkedArr: this.checkTableData[num].checkedArr,
                isAllState: false
              })
              
            }
          }else{
            let elementIndex = this.tableData.findIndex(item => item.id == this.checkTableData[num].id);
            let element = this.tableData[elementIndex] || {};
            this.$set( this.tableData, elementIndex, {
              ...element,
              checkedArr: [],
              checkTableData: [],
              isAllState: false
            })
            this.checkTableData=this.checkTableData.filter(item => item.id !== this.checkTableData[num].id);
          }
            
          this.$emit('getCheckTableData',this.checkTableData);
        },
        handleNodeClick(checkedNodes,e,index){
          if(e.halfCheckedKeys.length==0&&e.checkedKeys.length>0){
            this.tableData[index].checkedArr=e.checkedKeys;
            this.tableData[index].checkedData=[e.checkedNodes[0]];
            this.tableData[index].isAllState=true;
          }else{
            this.tableData[index].checkedArr=e.checkedKeys;
            if(e.halfCheckedNodes.length>0){
              this.tableData[index].checkedData=[{name:e.halfCheckedNodes[0].name,id:e.halfCheckedNodes[0].id,itemVOList:e.checkedNodes}];
            }else{
              this.tableData[index].checkedData=[];
            }
            this.tableData[index].isAllState=false;
          }

          this.checkTableData = this.tableData.map(element => {
            if(element.checkedData.length){
             return JSON.parse(JSON.stringify(element));
            }
            return undefined;
          }).filter(el => el)
          this.$emit('getCheckTableData',this.checkTableData);
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
      .el-table::before{
        height: 0!important;
      }
    }
  }
</style>