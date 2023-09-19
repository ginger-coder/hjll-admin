<template>
	<div class="formPage create" ref="rmInfo">
		<div class="header_box disp_flex ju_bet ali_cen">
			<div>
				<div class="title">{{ title }}</div>
			</div>
			<div class="back_box">
                <el-button v-hold-click type="primary" v-if="textFlag=='3'" @click="create('formData')">仅创建消息</el-button>
                <el-button v-hold-click type="primary" v-if="textFlag=='2'" @click="edit">修改</el-button>
                <el-button v-hold-click type="primary" v-if="textFlag!='1'" @click="send">{{statusText.send}}</el-button>
                <el-button v-hold-click type="" @click="back">{{statusText.option}}</el-button>
            </div>
		</div>
		<div v-if="showType!=1" class="form_box scrllbar">
			<el-form :model="formData" class="formRef" :rules="rules" ref="formRef">
                <el-form-item  placeholder="请选择" label="消息分类：" prop="messageTypeCode">
                    <el-select :disabled="flag" v-model="formData.messageTypeCode" clearable>
                    <el-option
                        v-for="(t, i) in selectKey.classify"
                        :key="i"
                        :label="t.label"
                        :value="t.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item  label="消息标题：" prop="title">
                    <el-input  maxlength="100" :disabled="flag" v-model="formData.title" placeholder="请输入"></el-input>
                </el-form-item>
                <br>
                <el-form-item  style="margin-bottom: 0;" label="消息正文：" prop="content">
                </el-form-item>
                <quill-editor 
                    class="ql-editor"
                    v-model="content" 
                    ref="myQuillEditor" 
                    :options="editorOption" 
                    @blur="onEditorBlur($event)" 
                    @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                    </quill-editor>
                <el-form-item  style="margin-top: 20px;" label="接收人群：" prop="memberId">
                </el-form-item>
                <br/>    
                <el-form-item  style="margin-top: 20px;" label="选择C端用户： " prop="memberIds">
                    <span>{{selectIds.length}}</span> 人
                    <el-button  v-if="!flag" type="primary" class="change" @click="change('选择C端用户',3)">选择</el-button>
                </el-form-item>
                <br/>
                <el-form-item  style="margin-top: 20px;" label="选择企业用户：" prop="companyUserIds">
                    <span>{{selectIds2.length}}</span>人
                    <el-button  v-if="!flag" type="primary" class="change" @click="change('选择企业用户',4)">选择</el-button>
                </el-form-item>
                <br/>   
                <el-form-item  style="margin-top: 20px;" label="选择内部用户：" prop="userIds">
                    <span>{{selectIds3.length}}</span>人
                    <el-button  v-if="!flag" type="primary" class="change" @click="change('选择内部用户',5)">选择</el-button>
                </el-form-item>       
            </el-form>
		</div>
    <div v-else class="form_box scrllbar">
      <div class="htmlText">
          <div class="htmlTitle">{{formData.title}}</div>
          <p class="htmlTime">{{formData.createTime}}</p>
          <p v-html="content"></p>
      </div>
    </div>
        <!-- 管理参与人 -->
		<!-- <examPeopleDialog
			:visible.sync="examPeopleDialogModal"
			@save="onUpdateExamPeople"
            :active="activeAnswerPeople"
		/> -->
    <!--选择人员-->
    <el-dialog
        :title="myTitle"
        destroy-on-close
        class="el-dialog-unify el-dialog-medium"
        width="1284px"
        :visible="visible"
        :before-close="handleClose">
        <searchForm  :type='type'  @onSearch="onSearch" @onReset="onReset" :btnItems="'search,reset'"/>
        <Tree v-if="type==5" @handleCheckChange="handleCheckChange"/>
        <publicTable
          :class="[type==5 ?'tables':'']" ref="table"
          :tableData="tableData" :rowKey="rowkey" :tagHeight="535" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
          @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"  @select-change="handleSelectionChange">
      </publicTable>
      <p class="tips"><i class="el-icon-question"></i>仅选中的人会收到消息</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import publicTable from "@c/business/tables";
import examPeopleDialog from '@/components/examPeopleDialog.vue';
import { parseTime,dateFormat } from "@/utils";
import {quillEditor, Quill } from 'vue-quill-editor'
import Tree from "./components/tree"
import searchForm from "./components/filter"
import { messageDetail,messageSave,messageUpdate,messageSend,messageItem,getRoList,getInterior } from "@/api/message"
import { getEnterprise } from "@/api/system"
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
	components: {
        searchForm,
        Tree,
        examPeopleDialog,
        publicTable,
		quillEditor,
	},
	data() {
		return {
            tableData:[],
            selectIds:[],
            selectIds2:[],
            selectIds3:[],
            rowkey:'userId',
            examPeopleDialogModal:false,
            activeAnswerPeople:[],
            flag:false,
            myTitle:'',
            name:'',
            company:'',
            type:3,
            interior:'',
            columObj: {
					// 选择框
					selection: true,
                    loading:true,
                    index:true,
                    selectType:true,
					// 选择框根据条件是否可选
					selectable: (row, index) => {
						if (row.switchs) {
							return true;
						}
					},
          columnData: [
                {label: '姓名', prop: 'nickName',text: true, editRow: undefined, align: 'center'},
                {label: '公司（部门）', prop: 'company',text: true, editRow: undefined, align: 'center'},
                {label: '区域', prop: 'areaFullName',text: true, editRow: undefined, align: 'center'},
                {label: '角色', prop: 'workRoleName',text: true, editRow: undefined, },
                {label: '签约情况', prop: 'sign',text: true, editRow: undefined,},
                {label: '评分', prop: 'score',text: true, editRow: undefined, },
                ],
            },
            pageObj: { //分页对象
                position: "right", //分页组件位置
                total: 0,
                show: true,
                pageData: {
                      current:1,
                      size:10,
                }
			},
            content: null,
            editorOption: {
              modules: {
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  ["blockquote", "code-block"], // 引用  代码块
                  [{ header: 1 }, { header: 2 }], // 1、2 级标题
                  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
                  [{ script: "sub" }, { script: "super" }], // 上标/下标
                  [{ indent: "-1" }, { indent: "+1" }], // 缩进
                  // [{'direction': 'rtl'}],                         // 文本方向
                  [{ size: ["small", false, "large", "huge"] }], // 字体大小
                  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                  [{ font: [] }], // 字体种类
                  [{ align: [] }], // 对齐方式
                  ["clean"], // 清除文本格式
                  ["link", "image"] // 链接、图片、视频
                ], //工具菜单栏配置
              },
              placeholder: '请输入内容', //提示
              readyOnly: true, //是否只读
              theme: 'snow', //主题 snow/bubble
              syntax: true, //语法检测
            },
			title: "",
			id: "",
      selectKey:{
        classify:[]
      },
			dateFormat,
      formData:{
          messageTypeCode:'',
          title:'',
          status:0,
          source:0,
          memberIds:[],
          companyUserIds:[],
          userIds:[],
          content:''
      },
      statusText:{
        createText:'仅创建消息',
        send:'创建并发送消息',
        option:'取消'
      },
      rules:{
        messageTypeCode:[{ required: true, message: "消息分类", trigger: "change" }],
        title:[{ required: true, message: "标题", trigger: "change" }],
        content:[{ required: true, message: "消息正文", trigger: "change" }],
        memberId:[{ required: true, message: "接收人群", trigger: "change" }],
      },
      visible:false,
      textFlag:null,
      showType:null,
      params:{},
			detailData:{},
      deptId:null,
      row:[],
			pageFun:null,
		};
	},
	mixins: [basic],
	created() {
		
	},
	mounted() {
    this.getItem()
    const { id,flag,showType} = this.$route.query;
		this.id = id;
    this.textFlag = flag
    this.showType = showType
      if(flag=='1'){
          this.title = '消息详情'
          this.statusText.option = '关闭'
          this.flag = true
          this.editorOption.readyOnly = true
          this.getDetail()
      }else if(flag=='2'){
          this.statusText.createText = '修改'
          this.statusText.send = '发送'
          this.title = '修改消息'
          this.getDetail()
      }else{
        this.title = '创建消息'
        this.statusText.createText = '仅创建消息'
        this.statusText.send = '创建并发送消息'
      }
	},
    computed: {
        editor() {
        return this.$refs.myTextEditor.quillEditor;
        }
    },
	methods: {
    onUpdateExamPeople(){

    },
      handleCheckChange(val){
        this.deptId = val
      },
      sure(){
        if(this.type == '3'){
          this.formData.memberIds = this.selectIds
        }else if(this.type == '4'){
          this.formData.companyUserIds = this.selectIds2
        }else{
          this.formData.userIds = this.selectIds3
        }
        this.visible = false
      },
        // 下拉分类
      getItem(){
          messageItem({typeCode:'system_message_type'}).then((res)=>{
            if(res.code == 0){
              let rulest = res.data.list
                  let dataNew = []
                rulest.map(item => {
                    let obj = {
                        value: item.id,
                        label: item.name,
                    }
                    dataNew.push(obj);
                });
                this.selectKey.classify = dataNew
            }
          })
        },
        // 失去焦点
        onEditorBlur(editor) {},
          // 获得焦点
        onEditorFocus(editor) {
          if(this.flag){
            editor.enable(false);
          }
        },
        // 开始
        onEditorReady(editor) {},
        // 值发生变化
        onEditorChange(editor) {
            this.content = editor.html;
            this.formData.content = editor.html;
        },
        // 获取表格数据
        onSearch(val) {
          delete val.roleList
          this.pageObj.pageData = Object.assign(this.pageObj.pageData, val);
          this.pageObj.pageData.deptId = this.deptId
          this.getData();
        },
        // 重置请求参数请求数据
        onReset() {
          this.pageObj.pageData = {
            current:1,
            size:10
          }
          this.formData.memberIds = []
          this.formData.userIds = []
          this.formData.companyUserIds = []
          if(this.type == '3'){
            this.selectIds = []
          }else if(this.type == '4'){
            this.selectIds2 = []
          }else{
            this.selectIds3 = []
          }
          this.$refs.table.close()
          this.getData();
        },
        // 操作栏按钮
        rowOperation(row, $index, now) {
        
        },
        // 复选框选中添加id
        handleSelectionChange(row) {
          this.row = row.row
          if(row.row.length!=0){
            if(this.type == '3'){
              this.selectIds = row.selectKey
            }else if(this.type == '4'){
              this.selectIds2 = row.selectKey
            }else{
              this.selectIds3 = row.selectKey
            }
          }
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
        handleClose(){
          this.visible = false
          // if(this.type == '3'){
          //     this.selectIds = []
          //   }else if(this.type == '4'){
          //     this.selectIds2 = []
          //   }else if(this.type == '5'){
          //     this.selectIds3 = []
          //   }
          // this.$refs.table.close()
          // if(this.textFlag!='2'){
          //   this.selectIds = []
          //   this.name = ''
          // }
          // this.formData.memberIds = []
          // this.tableData = []
          // this.pageObj.total = 0
          // this.pageObj.pageData = {
          //   current:1,
          //   size:10
          // }
        },
        change(val,num){
          setTimeout(()=>{
            this.$refs.table.selectKey =[]
              if(this.type == '3'){
                this.$refs.table.selectKey = this.selectIds
              }else if(this.type == '4'){
                this.$refs.table.selectKey = this.selectIds2
              }else{
                this.$refs.table.selectKey = this.selectIds3
              }
          },100)
          // this.examPeopleDialogModal = true
          this.visible = true
          this.myTitle = val
          if(num == '5'){
            this.rowkey = 'id'
          }else{
            this.rowkey = 'userId'
          }
          this.type = num
          this.getData()
        },
        send(){
          if(this.textFlag == '3'){
            this.formData.status = 1
            this.create()
          }else{
            messageSend({
              systemMessageId:this.id,
              status:1,
            }).then((res)=>{
              if(res.code == 0){
                this.$message.success('发送成功')
                this.$router.go(-1);
              }
            })
            
          }
        },
        edit(){
          let params = {
              id: this.id, 
              title: this.formData.title, 
              source:0,
              messageTypeCode: this.formData.messageTypeCode, 
              content: this.content, 
              memberIds:this.selectIds,
              companyUserIds:this.selectIds2,
              userIds:this.selectIds3
            }
            messageUpdate(params).then((res)=>{
              if(res.code == 0){
                this.$message.success('修改成功')
                this.$router.go(-1);
              }
            })
        },
        create(){
            if(!this.formData.messageTypeCode){
                this.$message.warning('请选择消息分类')
                return
            }
            if(!this.formData.title){
                this.$message.warning('请填写标题')
                return
            }
            if(!this.formData.content){
                this.$message.warning('请填写消息正文')
                return
            }
            if(this.formData.memberIds.length==0 && this.formData.companyUserIds.length==0 && this.formData.userIds.length==0){
                this.$message.warning('请选择接收人群')
                return
            }
            messageSave(this.formData).then((res)=>{
              if(res.code == 0){
                this.$message.success('请求成功')
                this.$router.go(-1);
              }
            })
        },
        getDetail(){
          messageDetail({systemMessageId:this.id}).then((res)=>{
            if(res.code == 0){
              this.formData = res.data
              this.selectIds = res.data.memberIds || []
              this.formData.memberIds = res.data.memberIds || []
              this.selectIds2 = res.data.companyUserIds || []
              this.formData.companyUserIds = res.data.companyUserIds || []
              this.selectIds3 = res.data.userIds || []
              this.formData.userIds = res.data.userIds || []
              this.content = res.data.content
            }
          })
        },
        getData(){
          if(this.type=='3'){
            this.columObj.columnData = [
                {label: '姓名', prop: 'nickName',text: true, editRow: undefined, align: 'center'},
                {label: '公司（部门）', prop: 'company',text: true, editRow: undefined, align: 'center'},
                {label: '区域', prop: 'areaFullName',text: true, editRow: undefined, align: 'center'},
                {label: '角色', prop: 'workRoleName',text: true, editRow: undefined, },
                {label: '签约情况', prop: 'sign',text: true, editRow: undefined,},
                {label: '评分', prop: 'score',text: true, editRow: undefined, },
            ]
            getRoList(this.pageObj.pageData).then((res)=>{
                    if(res.code == 0){
                        this.tableData = res.data.records || []
                        this.columObj.loading = false
                        this.pageObj.total = res.data.total
                    }else{
                        this.$message.error('请求报错')
                    }
                })
          }else if(this.type=='4'){
            this.pageObj.pageData.agreementSignStatus = 3
            this.pageObj.pageData.authStatus = 1
            this.columObj.columnData = [
                {label: '企业编号', prop: 'entCode',text: true, editRow: undefined, align: 'center'},
                {label: '注册手机号', prop: 'regMobile',text: true, editRow: undefined, align: 'center'},
                {label: '注册时间', prop: 'regTime',text: true, editRow: undefined, align: 'center'},
                {label: '企业名称', prop: 'entName',text: true, editRow: undefined, },
                {label: '工商注册号', prop: 'entQualificationNum',text: true, editRow: undefined,},
            ]
            getEnterprise(this.pageObj.pageData).then((res)=>{
                    if(res.code == 0){
                        this.tableData = res.data.records || []
                        this.columObj.loading = false
                        this.pageObj.total = res.data.total
                    }else{
                        this.$message.error('请求报错')
                    }
                })
          }else{
            this.columObj.columnData = [
                {label: '姓名', prop: 'nickname',text: true, editRow: undefined, align: 'center'},
                {label: '工号', prop: 'jobNumber',text: true, editRow: undefined, align: 'center'},
                {label: '部门', prop: 'deptName',text: true, editRow: undefined, align: 'center'},
                {label: '手机号', prop: 'mobile',text: true, editRow: undefined, },
                {label: '类型', prop: 'userType',text: true, editRow: undefined,},
                {label: '角色', prop: 'roleNames',text: true, editRow: undefined,},
                {label: '入职日期', prop: 'entryTime',text: true, editRow: undefined,},
            ]
            this.pageObj.pageData.userTypeCode = 'user_type'
            getInterior(this.pageObj.pageData).then((res)=>{
                    if(res.code == 0){
                        this.tableData = res.data.records || []
                        this.columObj.loading = false
                        this.pageObj.total = res.data.total
                    }else{
                        this.$message.error('请求报错')
                    }
                })
          }
          
        },
		back() {
			this.$router.go(-1);
		},
	},
};
</script>
<style>
.ql-snow .ql-tooltip[data-mode=link]::before {
   content: "请输入链接地址:" !important;
 }
 .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
     border-right: 0px !important;
     content: '保存' !important;
     padding-right: 0px !important;
 }
 
 .ql-snow .ql-tooltip[data-mode=video]::before {
     content: "请输入视频地址:" !important;
 }
 
 .ql-snow .ql-picker.ql-size .ql-picker-label::before,
 .ql-snow .ql-picker.ql-size .ql-picker-item::before {
   content: '14px' !important;
 }
 .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
 .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
   content: '12px' !important;
 }
 .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
 .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
   content: '18px' !important;
 }
 .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
 .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
   content: '32px' !important;
 }
 
 .ql-snow .ql-picker.ql-header .ql-picker-label::before,
 .ql-snow .ql-picker.ql-header .ql-picker-item::before {
   content: '文本' !important;
 }
 .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
 .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
   content: '标题1' !important;
 }
 .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
 .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
   content: '标题2' !important;
 }
 .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
 .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
   content: '标题3' !important;
 }
 .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
 .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
   content: '标题4' !important;
 }
 .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
 .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
   content: '标题5' !important;
 }
 .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
 .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
   content: '标题6' !important;
 }
 
 .ql-snow .ql-picker.ql-font .ql-picker-label::before,
 .ql-snow .ql-picker.ql-font .ql-picker-item::before {
   content: '标准字体' !important;
 }
 .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
 .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
   content: '衬线字体' !important;
 }
 .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
 .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
   content: '等宽字体' !important;
 }
</style>
<style lang="scss">
.feedbackDrawerBox {
	.el-drawer__body {
		padding: 20px;
	}
}
</style>
<style lang="scss" scoped>
.tables{
  display: inline-block;
  width: 80%;
  vertical-align: top;
}
.app-container {
	font-size: 0;
	position: relative;

	::v-deep {
		.el-table {
			&::before {
				content: none;
			}
		}
	}
}
.header_box {
	background: #ffffff;
	margin: -20px;
	padding: 20px;
	.title {
		font-size: 16px;
		font-weight: 500;
		margin-bottom: 10px;
	}
	.back_box {
	}
}
.form_box{
	margin-top: 40px;
	padding:20px;
	background: #ffffff;
	.el-form-item{
		width: 33.3%;
		min-width: 360px;
		display: inline-block;
		vertical-align: top;
	}
	::v-deep{
		.f18{
			.el-form-item__label{
				font-size: 18px;
			}
		}
		.el-collapse{
			border-top: unset;
			border-bottom: unset;
		}
		.el-collapse-item:last-child{
			margin-bottom: unset;
		}
	}
	.nameForm{
		&.el-form-item{
			width: 100%;
			margin-bottom:unset
		}
	}
}
.formRef{
    width: 80%;
    margin: 0 auto;
}
.tips{
    margin-top: -40px;
    color: #aaa;
}
::v-deep .ql-editor{
    min-height: 300px;
    margin: 0 auto;
    padding:0;
}
.htmlText{
  width: 90%;
  height: 100%;
  min-height: 500px;
  margin: 0 auto;
}
.htmlText .htmlTitle{
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
.htmlText .htmlTime{
  text-align: right;
}
</style>
