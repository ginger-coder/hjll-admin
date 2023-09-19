<template>
  <div>
    <h2 class="main">{{ title }}</h2>
    <div class="content">
      <el-form
        :model="formData"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
        ref="formData"
      >
        <p>基础配置</p>
        <el-form-item label="模板名称：" prop="templateName">
          <el-input
            v-model="formData.templateName"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="运营商名称：" prop="operatorName">
          <el-input
            v-model="formData.operatorName"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="巡检项：" prop="inspectionType">
          <el-select
            v-model="formData.inspectionType"
            placeholder="请选择"
            style="width: 400px"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in inspection_type"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <p>站址信息</p>
        <el-form-item label="地区：" prop="area">
          <areaSelect
            ref="areaSelect"
            @change="changeArea($event, 'form')"
            style="width: 400px"
          ></areaSelect>
        </el-form-item>
        <el-form-item label="气候：" prop="weather">
          <el-select
            v-model="formData.weather"
            placeholder="请选择"
            style="width: 400px"
          >
            <el-option
              :label="item.label"
              :value="item"
              v-for="(item, index) in weather"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地形：" prop="terrain">
          <el-select
            v-model="formData.terrain"
            placeholder="请选择"
            style="width: 400px"
          >
            <el-option
              :label="item.label"
              :value="item"
              v-for="(item, index) in terrain"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型：" prop="deviceType">
          <el-select
            v-model="formData.deviceType"
            placeholder="请选择"
            style="width: 400px"
          >
            <el-option
              :label="item.label"
              :value="item"
              v-for="(item, index) in device_type"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地域类型：" prop="areaType">
          <el-select
            v-model="formData.areaType"
            placeholder="请选择"
            style="width: 400px"
          >
            <el-option
              :label="item.label"
              :value="item"
              v-for="(item, index) in area_type"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <p>巡检信息</p>
        <el-form-item label="巡检月份：" prop="inspectionTime">
          <el-select
            v-model="formData.inspectionTime"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择"
            style="width: 400px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="基础费用：" prop="basePrice">
          <el-input
            v-model="formData.basePrice"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="附加费：" prop="surcharge">
          <el-input
            v-model="formData.surcharge"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { gzpricexq, batch, gzadd,gzxg } from "@/api/price";
import areaSelect from "@/components/custom/areaSelect";

export default {
  components: {
    areaSelect,
  },
  data() {
    return {
      id: "",
      title: "创建巡检定价模板",
      inspection_type: [],
      terrain: [],
      area_size_interval: [],
      area_type: [],
      device_type: [],
      machine_room_grade: [],
      weather: [],
      formData: {
        area:{},
        templateName: "",
        operatorName: "",
        inspectionType: "",
        weather: "",
        areaType: {},
        deviceType: "",
        inspectionTime: "",
        terrain: "",
        basePrice: "",
        surcharge: "",
      },
      rules: {
        templateName: [{ required: true, message: '请输入', trigger: "blur" }],
        operatorName: [{ required: true, message: '请输入', trigger: "blur" }],
        inspectionType: [{ required: true, message: '请输入', trigger: "blur" }],
        weather: [{ required: true, message: '请输入', trigger: "blur" }],
        areaType: [{ required: true, message: '请输入', trigger: "blur" }],
        area: [{ required: true, message: '请输入', trigger: "blur" }],
        deviceType: [{ required: true, message: '请输入', trigger: "blur" }],
        inspectionTime: [{ required: true, message: '请输入', trigger: "blur" }],
        terrain: [{ required: true, message: '请输入', trigger: "blur" }],
        basePrice: [{ required: true, message: '请输入', trigger: "blur" }],
        surcharge: [{ required: true, message: '请输入', trigger: "blur" }],
        templateName: [{ required: true, message: '请输入', trigger: "blur" }],
        templateName: [{ required: true, message: '请输入', trigger: "blur" }],
      },
      options: [
        {
          value: "1",
          label: "1月",
        },
        {
          value: "2",
          label: "2月",
        },
        {
          value: "3",
          label: "3月",
        },
        {
          value: "4",
          label: "4月",
        },
        {
          value: "5",
          label: "5月",
        },
        {
          value: "6",
          label: "6月",
        },
        {
          value: "7",
          label: "7月",
        },
        {
          value: "8",
          label: "8月",
        },
        {
          value: "9",
          label: "9月",
        },
        {
          value: "10",
          label: "10月",
        },
        {
          value: "11",
          label: "11月",
        },
        {
          value: "12",
          label: "12月",
        },
      ],
    };
  },
  async created() {
    const { id } = this.$route.query;
    this.id = id;
    if (id) {
      const {data} = await gzpricexq(id);
      console.log(data);
      //  this.formData.area=data.area
        this.formData.templateName=data.templateName
        this.formData.operatorName=data.operatorName
        this.formData.inspectionType=data.inspectionType
        this.formData.weather=data.weather
        this.formData.areaType=data.areaType
        this.formData.deviceType=data.deviceType
        // this.formData.inspectionTime=data.inspectionTime
        this.formData.terrain=data.terrain
        this.formData.basePrice=data.basePrice
        this.formData.surcharge=data.surcharge
    }
    this.batch();
  },
  methods: {
    submitForm() {
      this.$refs.formData.validate(async(valid)=>{
			if(valid){
          this.formData.weather['typeCode'] = "weather"
      this.formData.terrain['typeCode'] = "terrain"
      this.formData.deviceType['typeCode'] = "device_type"
      this.formData.areaType['typeCode'] = "area_type"
      const datas = this.formData.inspectionTime
        .map((item) => {
          return item.value + "";
        })
        .join();
      const dataslabel = this.formData.inspectionTime
        .map((item) => {
          return item.label + "";
        })
        .join();
      // this.formData.inspection_time=[]
      //  this.formData.inspection_time['label']=dataslabel
      //  this.formData.inspection_time['value']=datas
      //  this.formData.inspection_time['typeCode']="inspection_time"

      // console.log(this.formData);
      let obj = {
        ...this.formData,
      };
      // const obj =Object.assign(this.formData)
      obj.inspectionTime = '';
      
      obj.inspectionTime = datas+'';
      console.log(obj);
      if(this.$route.query.id){
      const {data} =await gzxg(obj)

      }else {
      const {data} =await gzadd(obj)

      }
      this.$router.push('/orderPrice/gz')
      }})
    
    },
    async batch() {
      const params = [
        "area",
        "weather",
        "terrain",
        "device_type",
        "area_type",
        "inspection_time",
        "inspection_type",
        "machine_room_grade",
        "machine_room_power_interval",
        "oil_engine_power",
        "people_num",
        "base_duration",
        "oil_cost_type",
        "area_size_interval",
      ];
      const { data } = await batch(params);
      console.log(data);
      this.inspection_type = data.inspection_type;
      this.terrain = data.terrain;
      this.weather = data.weather;
      this.device_type = data.device_type;
      this.area_type = data.area_type;
    },
    cancel() {
   this.formData.area=''
        this.formData.templateName=''
        this.formData.operatorName=''
        this.formData.inspectionType=''
        this.formData.weather=''
        this.formData.areaType=''
        this.formData.deviceType=''
        this.formData.inspectionTime=''
        this.formData.terrain=''
        this.formData.basePrice=''
        this.formData.surcharge=''
         this.$refs.formData.resetFields();
    },
    changeArea(val) {
 this.formData.area['value']=val.area
     this.formData.area['label']= ( this.$refs.areaSelect.$refs.cascader.getCheckedNodes()?.[0]
            ?.pathLabels).join('/');
 this.formData.area['typeCode']="area"
//  console.log(this.formData.area);

        ;
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  background: #fff;
  height: 100px;
  line-height: 100px;
  margin: -20px -20px 20px -20px;
  padding-left: 20px;
  font-size: 16px;
  font-weight: 500;
}

.content {
  background: #fff;
  padding: 100px 0px 100px 250px;
}
</style>
