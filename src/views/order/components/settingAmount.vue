<template>
    <div>
      <el-dialog title="配置金额"
                 :visible.sync="isShow"
                 class="el-dialog-unify el-dialog-medium" width="1284px" 
                 destroy-on-close
                 :lock-scroll="true"
                 :before-close="dialogCancel">
        <!-- <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper"> -->
          <el-form class="el-form-dialog" ref="form" :model="form" :rules="rules">
            <el-form-item class="" label="计费方式：" prop="priceType">
              <el-select filterable clearable v-model="form.priceType" > 
                <el-option v-for="item in orderTypeLists"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item class="" label="单价：" prop="itemPrice">
              <el-input v-model="form.itemPrice" :placeholder="'请输入单价'" onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"></el-input>
            </el-form-item>
            <el-form-item class="" label="量化：" prop="amount">
              <el-input v-model="form.amount" :placeholder="'请输入量化'" onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"></el-input>
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
  import {deepClone} from "@/utils"
  
  import {validMobile, validEmail} from "@/utils/validate"
  import formDailogMixin from "@/mixins/formDialog";
  import {xmConfig} from "@/api/orderXjConfig";
  
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
      let phoneRule = (rule, value, callback) => {
        if (value) {
          if (!validMobile(value)) {
            callback(new Error("请输入正确的手机号"));
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入手机号"));
        }
      };
      return {
        rules: {
          itemPrice: [
            {required: true, message: `请输入单价`, trigger: 'blur'}
          ],
          amount: [
            {required: true, message: `请输入量化`, trigger: 'blur'}
          ],
          priceType: [
            {required: true, message: `请选择计费方式`, trigger: 'change'}
          ],
        },
        form: {},
        orderTypeLists: [
          {label:'按量计费',value:1},
          {label:'按时计费',value:2},
        ],
      }
    },
  
    created() {
  
    },
    methods: {
      openDialogAfter() {
      },
      dialogSubmitCustom(post, next) {
        post = post || {};
        if(post.id){
            xmConfig({name:'updateItem',method:'post'},{},{
          ...post
        }).then(res=>{
            if(res.code==0){
              this.isShow=false;
              this.$message.success("修改成功");
              this.dialogCancelAfter();
            }
          })
        }
        
        
      },
      dialogCancelAfter: function () {
        var that = this
        that.$emit('success')
      },
    },
  };
  </script>
  <style lang="scss" scoped>
  </style>