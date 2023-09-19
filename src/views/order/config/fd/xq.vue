<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="formInline"  class="demo-form-inline">
        <el-form-item label="记录项：">
        <el-input v-model="formInline.name" clearable  @clear="searchis" @keyup.enter.native="searchis"></el-input>
        </el-form-item>
        <el-form-item label="要求：">
          <el-input v-model="formInline.requireInfo" clearable @clear="searchis" @keyup.enter.native="searchis"></el-input>
        </el-form-item>
        <el-form-item label="必填：">
          <el-select v-model="formInline.isResult" placeholder="" clearable @clear="searchis" @keyup.enter.native="searchis">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拍照：" >
          <el-select v-model="formInline.isPhoto" placeholder="" clearable @clear="searchis" @keyup.enter.native="searchis">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数值：">
          <el-select v-model="formInline.isRemark" placeholder="" clearable @clear="searchis" @keyup.enter.native="searchis">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>  
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchis">查询</el-button>
          <el-button type="primary" @click="dialogVisibleMethods(1)"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-for="item in askdata" :key="item.index">
      <div class="listBox"  v-loading="loading">
        <div>记录项: {{ item.name }}</div>
        <div>要求: {{ item.requireInfo }}</div>
        <div>
          <el-checkbox v-model="checkeds">拍照</el-checkbox> {{ item.isPhoto }}
        </div>
        <div>
          <el-checkbox v-model="checkedse">记录数值 电压</el-checkbox
          >{{ item.isResult }}
        </div>
        <div>
          <el-checkbox v-model="checked">备注</el-checkbox>{{ item.isRemark }}
        </div>
        <div>
          <el-button class="btn1" @click="dialogVisibleMethods(item.id)">配置</el-button>
          <el-popconfirm
  title="这是一段内容确定删除吗？"
  @confirm="yess(item.id)"
>
<el-button class="btn2" @click="deleteListss(item.id)"  slot="reference">删除</el-button>
</el-popconfirm>
         
        </div>
      </div>
    </el-card>
    <!-- 弹框开始 -->
    <el-dialog
      :title="dialogTitle"
      :ref="children"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="记录项：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="要求：">
          <el-input v-model="form.requireInfo"></el-input>
        </el-form-item>
        <el-form-item label="需要拍照">
          <el-select
            v-model="form.isPhoto"
            placeholder="是否需要拍照"
            @visible-change="needphoto(form.isPhoto)"
          >
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="photoIsShow == 0">
          <el-form-item label="照片名">
            <el-input v-model="form.pictureName"></el-input>
          </el-form-item>
          <el-form-item label="示例照片">
            <upload-pics class="upload_pics logo" :max="1" :maxSize="'1024'" v-model="form.avatarUrl"
                       @success="to_set_pics($event, 'avatarUrl')"></upload-pics>
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>

        <el-form-item label="记录数值">
          <el-select
            v-model="form.isRemark"
            placeholder="是否记录数值"
            @visible-change="needphoto2(form.isRemark)"
          >
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="shuzi == 0">
          <el-form-item label="数值单位" class="shuzi">
            <!-- <el-input v-model="form.name" class="shuzi1"   placeholder="数值名"></el-input> -->
            <el-select
              v-model="form.dynamoValueReqList[0].name"
              placeholder="请选择数值"
              class="shuzi1"
              @visible-change="zidian"
              @change="zidian($event)"
            >
              <el-option v-for="item in dynamoValueReqList"  :label="item.label" :value="item.value"></el-option>
            </el-select>

            <el-select
              v-model="form.dynamoValueReqList[0].unit"
              placeholder="请选择单位"
              class="shuzi1"
            >
              <el-option v-for="item in dynamoValueReqList2" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="允许备注">
          <el-select v-model="form.isResult" placeholder="是否允许备注">
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="preserve" v-if="addsedit == 1"
          >保 存</el-button
        >
        <el-button type="primary" @click="preserve2" v-else>保 存</el-button>
        <el-button  @click="flotted">取消</el-button>
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
      </span>
    </el-dialog>
    <!-- 弹框结束 -->
  </div>
</template>

<script>
import { askfor, asmethods, disposition,search,deleteList,dictionaries } from "@/api/orderFdConfig";
// import { , disposition} from '@/api/orderFdConfig'
// import xjaskforinfor from '@/views/order/components/xjaskforinfor'
export default {
  data() {
    return {
      askdata: [],
      formInline: {
        name: "",
        requireInfo:"",
        isPhoto:"",
     
      },
      dialogstatus: 0,
      // 控制弹框是否显示
      dialogVisible: false,
      // 编辑弹框表单数据
      form: {
        name: "",
        requireInfo: "",
        isPhoto: "",
        pictureName: "",
        isResult:"",
        isRemark: "",
        id:"",
        dynamoValueReqList: [
    {
      name: "",
      unit: ""
    }

  ],
      },
      dynamoValueReqList:[],
      dynamoValueReqList2:[],
      id:0,
      photoIsShow: 0,
      shuzi: 0,
      dialogTitle: "",
      addsedit: 1,
      editis: 0,
      checkeds:false,
      checked:false,
      checkedse:false,
      loading:false,
      dictionariesList:[
        {
          name:"",
          unit:""
        }
      ]
    };
  },

  created() {},
  mounted() {
   this.getinfoList()
  },
  methods: {
    to_set_pics(files, key) {
      this.form[key] = files;
    },
    // 获取列表方法
    getinfoList(){
      this.loading=true
      askfor().then((res) => {
      this.askdata = res.data.records;
      this.loading=false
      console.log(res);
    });
    },
    dialogVisibleMethods(val) {
      this.dialogVisible = true;
      if (val == 1) {
        this.dialogTitle = "发电项新增";
        this.addsedit = 1;
      } else {
        this.dialogTitle = "发电项配置";
        this.addsedit = 2;
        this.form.id=val
      }
    },
  async preserve() {
    this.loading=true
     await asmethods(this.form).then((res) => {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.loading=false
      });
      this.getinfoList()
      this.form.name=""
        this.form.requireInfo=""
        this.form.isPhoto=""
        this.form.pictureName=""
        this.form.isResult=""
        this.form.isRemark=""
        this.form.dynamoValueReqList.name=""
        this.form.dynamoValueReqList.unit=""
        this.dialogVisible=false
    },
    needphoto(val) {
      this.photoIsShow = val;
    },
    needphoto2(val) {
      this.shuzi = val;
    },
  async  preserve2() {
      this.loading=true
    await  disposition(this.form).then(res=>{
        this.dialogVisible=false
        this.getinfoList()
        this.$message({
          message: '配置成功',
          type: 'success'
        });
       this.loading=false
      
      })
      this.form.name=""
        this.form.requireInfo=""
        this.form.isPhoto=""
        this.form.pictureName=""
        this.form.isResult=""
        this.form.isRemark=""
        this.form.dynamoValueReqList.name=""
        this.form.dynamoValueReqList.unit=""
    },
    searchis(){
      this.loading=true
      search(this.formInline).then(res=>{
        this.askdata=res.data.records
        this.loading=false
      })
    },
    yess(id){
      this.loading=true
          deleteList({ids:id}).then(res=>{
            this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.loading=false
      })
      this.getinfoList()
    },
    flotted(){
      this.form.name=""
        this.form.requireInfo=""
        this.form.isPhoto=""
        this.form.pictureName=""
        this.form.isResult=""
        this.form.isRemark=""
        this.form.dynamoValueReqList.name=""
        this.form.dynamoValueReqList.unit=""
        this.dialogVisible=false
        
    },
    // 字典查询
    zidian(e){
    
      dictionaries({groupCode:123456789}).then(res=>{
        this.dynamoValueReqList=res.map((el,index)=>{
         return {value:index,label:el.typeName}
        })
         console.log(e);
        this.dynamoValueReqList2=res[e].dictItemList.map(el=>{
          return {value:el.name,label:el.name}
        })
      })
     
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 20px;
}
.listBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn1 {
  color: #2879ff;
  border: none;
}
.btn2 {
  color: red;
  border: none;
}
.avatar {
  width: 200px;
  height: 200px;
  display: block;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #999;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s all;
}
.avatar-uploader-icon:hover {
  border-color: #6296FF;
}
.shuzi {
  display: flex;

  .shuzi1 {
    width: 202px;
    margin-right: 10px;
  }
  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
