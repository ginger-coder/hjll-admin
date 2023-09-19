<template>
  <div>
    <el-dialog title="配置维修要求"
               :visible.sync="isShow"
               class="el-dialog-unify el-dialog-medium" width="1284px" 
               destroy-on-close
               :lock-scroll="true"
               :before-close="dialogCancel">
      <!-- <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper"> -->
        <el-form class="el-form-dialog" ref="form" :model="form" :rules="rules">
          <el-form-item  label="维修要求：" prop="requireInfo">
            <el-input v-model="form.requireInfo" type="textarea" :rows="4" placeholder="'维修要求内容填写"></el-input>
          </el-form-item>
          <el-form-item  label="检查项：" prop="checkItems">
            <el-checkbox-group v-model="form.checkItems" @change="event=>checkBoxChange(event)">
              <div  v-for="item in allCheckItemsLists">
                <el-checkbox  :label="item.typeCode" :key="item.typeCode">
                  {{ item.typeName }}
                </el-checkbox>
                <div  class="checkBox" v-if="form.checkItems.indexOf(item.typeCode)>-1">
                  <div class="checkBoxItems" v-for="items in item.dictItemList">
                    <div class="title">{{ items.name }}</div>
                    <span><el-switch v-model="items.status" @change="event=>getSwitch(event,items)" :active-value="0" :inactive-value="1"></el-switch></span>
                    <span> <el-radio v-model="items.isFillIn" :label="0" @change="event=>getRadio(event,items)" :disabled="items.status==1">必填</el-radio></span>
                  </div>
                </div>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      <!-- </el-scrollbar> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
        <el-button @click="dialogCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formDailogMixin from "@/mixins/formDialog";
import {xmConfig,getItemByCode,getRequire} from "@/api/orderXjConfig";
import { itemsPage} from "@/api/device";

export default {
  props: {
    moduleType: {
      type: String,
      default: ''
    },
    pageFun: '',
  },
  mixins: [formDailogMixin],
  data() {
    return {
      allCheckItemsLists: [],
      itemsPageData:[],
      default: {
      },
      rules: {
        requireInfo: [
          {required: true, message: `请输入维修要求`, trigger: 'blur'}
        ],
        checkItems: [
          {required: true,type:Array, message: `请选择检查项`, trigger: 'blur'}
        ],
      },
      form: {
        checkItems:[]
      },
      checkData:[]
    }
  },

  watch: {},
  created() {
    this.workOrderTypeFun();

  },
  methods: {
    async workOrderTypeFun() {
      itemsPage({}).then(res=>{
        this.itemsPageData = res?.data?.list?.map(el => {
        return {
            ...el,
            label: el.name,
            value: Number(el.value)
          }
        }) || []
      })
    },
    checkBoxChange(e){
      console.log(e)
    },  
    getRadio(e,data){;
      data.isFillIn=0;
      this.$forceUpdate();
    },
    getSwitch(e,data){
      data.isFillIn=1;
    },
    getItemByCodeList: function () {
      var that = this
      getItemByCode({groupCode:102}, {}).then(res => {
        that.allCheckItemsLists = res;
        that.allCheckItemsLists.forEach(item=>{
           if(item.dictItemList){
              item.dictItemList.forEach(items=>{
                items.status=0;
              })
           }
        })
      });
    },
    getRequireData(requireList){
      getRequire({name:'getRequire'},{requireId:requireList},{
      }).then(res=>{
        if(res.code==0){
          this.checkData=res.data;
          let array=[];
          this.checkData.forEach(item=>{
            array.push(item.type);
          })
          this.$set(this.form, 'checkItems', Array.from(new Set(array)));
          this.allCheckItemsLists.forEach(item=>{
            if(this.form.checkItems.indexOf(item.typeCode)>-1){
              item.dictItemList.forEach(items=>{
                items.status=this.checkData.filter(item2 => item2.dictItemId=== items.id).length>0?this.checkData.filter(item2 => item2.dictItemId=== items.id)[0].status:1;
                items.isFillIn=this.checkData.filter(item2 => item2.dictItemId=== items.id).length>0?this.checkData.filter(item2 => item2.dictItemId=== items.id)[0].isFillIn:1;
              })
            }
          })
        }
      })
    },
    openDialogAfter() {
      this.getItemByCodeList()
      this.$set(this.form, 'checkItems', []);
      this.getRequireData(this.form.requireList)
    },
    dialogSubmit() {
      let array=[];
      this.allCheckItemsLists.forEach(item=>{
        if(this.form.checkItems.indexOf(item.typeCode)>-1){
          item.dictItemList.forEach(items=>{
            array.push({
              "type": items.typeCode, 
              "value": items.value, 
              "status": items.status, 
              "isFillIn": items.isFillIn 
            })
          })
        }
      })
      if(array.length==0){
        return this.$message.warning('检查项不能为空！')
      }
      let json={
        id:this.form.id,
        requireType:this.form.requireType,
        requireInfo:this.form.requireInfo,
        requireId:this.form.requireList,
        checkItems:array,
      }
      xmConfig({name:'updatePollingRequire',method:'post'},{},{
        ...json
      }).then(res=>{
        if(res.code==0){
          this.isShow=false;
          this.$message.success("配置成功");
          this.dialogCancelAfter();
        }
      })
      
      
    },
    dialogCancelAfter: function () {
      var that = this
      that.$emit('success')
    },
  },
};
</script>
<style lang="scss" scoped>
.checkBox{
  width: 95%;
  height: auto;
  background: #FAFAFA;
  border-radius: 3px;
  margin-left: 30px;
  padding: 10px 0;
  .checkBoxItems{
    width: calc(100% - 20px);
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    .title{
      width: 60%;
      color: #333;
      font-size: 14px;
    }
  }
}
</style>