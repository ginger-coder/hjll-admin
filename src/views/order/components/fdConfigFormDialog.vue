<template>
    <div>
      <el-dialog
        :title="(type != 'create' ? '编辑' : '添加') + '发电' + title"
        :visible.sync="isShow"
        fullscreen
        :lock-scroll="true"
        :before-close="dialogCancel"
      >
        <el-scrollbar ref="dialogScrollbar" wrap-class="dialog-wrapper">
          <el-form class="el-form-dialog" ref="form" :model="form" :rules="rules">
            <el-form-item class="" :label="title + '名称：'" prop="name">
              <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item class="" label="客户" prop="userName">
              <el-select
                v-model="form.companyId"
                placeholder="请输入关键词"
                @visible-change="onese"
              >
                <el-option
                  v-for="item in options"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="" label="适用地区" prop="application">
              <el-select
                v-model="form.area"
                placeholder="请输入关键词"
                @visible-change="optokd"
              >
                <el-option
                  v-for="item in optionswew"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="" label="基础时长" prop="timeopt">
              <el-select v-model="form.duration" placeholder="请输入关键词">
                <el-option
                  v-for="item in timeData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="" label="油价计费方式" prop="biling">
              <el-select v-model="form.oilPricingType" placeholder="请输入关键词">
                <el-option
                  v-for="item in oilData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="" label="固定油价" prop="fixed">
              <el-input v-model="form.oilPricing " placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item class="" label="发电类型" prop="power" >
              <el-select v-model="form.type" placeholder="请输入关键词" @visible-change="handelchange">
                <el-option
                  v-for="item in generateData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" v-hold-click @click="compileSubmit" 
          v-if="type != 'create'"
            >确 定</el-button
          >
          <el-button type="primary" v-hold-click @click="dialogSubmit"
         v-else
            >确 定</el-button
          >
       
          <el-button v-hold-click @click="dialogCancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  <script>
  import { deepClone } from "@/utils";
  
  import { validMobile, validEmail } from "@/utils/validate";
  import formDailogMixin from "@/mixins/formDialog";
  import { clientele, region,portAdd,oilPrice,preserve } from "@/api/orderFdConfig";
  export default {
    props: {
      moduleType: {
        type: String,
        default: "",
      },
      pageFun: "",
    },
    data() {
      // let phoneRule = (rule, value, callback) => {
      //   if (value) {
      //     if (!validMobile(value)) {
      //       callback(new Error("请输入正确的手机号"));
      //     } else {
      //       callback();
      //     }
      //   } else {
      //     callback(new Error("请输入手机号"));
      //   }
      // };
      return {
        default: {},
        rules: {
          // name: [{ required: true, message: `请输入名称`, tigger: "blur" }],
        },
        form: {
          name:"",
          companyId: null,
          area:"",
          duration: "",
          oilPricingType: "",
          oilPricing : "",
          type :'',
        },
        options: [],
        timeData: [
          {
            value: "1",
            label: "1",
          },
          {
            value: "2",
            label: "2",
          },
          {
            value: "3",
            label: "3",
          },
          {
            value: "4",
            label: "4",
          },
          {
            value: "5",
            label: "5",
          },
          {
            value: "6",
            label: "6",
          },
          {
            value: "7",
            label: "7",
          },
          {
            value: "8",
            label: "8",
          },
          {
            value: "9",
            label: "9",
          },
          {
            value: "10",
            label: "10",
          },
        ],
        oilData: [
          {
            value: "1",
            label: "固定价格",
          },
          {
            value: "2",
            label: "实际油价",
          },
        ],
        generateData: [
        ],
        optionswew: [],
        pptrorId: 0,
        proved:0,
  
      };
    },
    mixins: [formDailogMixin],
    watch: {},
    created() {
      let that = this;
    },
    mounted() {},
    methods: {
      openDialogAfter() {
        let that = this;
      },
      dialogSubmitCustom(post, next) {
        let that = this;
   
        post = post || {};
        next && next(post);
      },
      dialogCancelAfter: function () {
        var that = this;
        that.$emit("success");
      },
       onese() {
         clientele().then((res) => {
          this.options = res.data.records.map((el) => {
            return { value: el.operatorId, label: el.companyName };
          });
        });
      },
      optokd() {
        console.log(this.form.companyId);
        region({ operatorId: this.form.companyId }).then((res) => {
          this.optionswew=res.data.map(el=>{
            console.log(el,2223);
            return {value:el.provinceCode-el.cityCode,label:el.name}
          })
        });
      },
      dialogSubmit(){
  
        portAdd(this.form).then((res)=>{
          this.$forceUpdate()
          this.dialogCancelAfter()
        })
        this.isShow=false
      },
      handelchange(){
        oilPrice({typeCode:'dynamo_type'}).then((res)=>{
          console.log(res);
         this.generateData=res.data.list.map(el=>{
            console.log(el);
          return {value:el.id,label:el.name}
           })
        })
      },
      compileSubmit(){
        preserve(this.form).then((res)=>{
          this.isShow=false
          this.dialogCancelAfter()
        })
      }
    },
  };
  </script>
  <style lang="scss" scoped></style>
  