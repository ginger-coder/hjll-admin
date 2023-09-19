<template>
  <div style="margin-left: 200px;">
    <el-form :model="formData" label-width="130px" class="demo-ruleForm" ref="formData">

      <el-form-item label="模板名称：" prop="templateName" :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
        <el-input v-model="formData.templateName" style="width: 1000px"></el-input>
      </el-form-item>
      <el-form-item label="运营商名称："  :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
        <el-select v-model="formData.companyId" placeholder="请选择" style="width: 1000px">
          <el-option :label="item.companyName" :value="item.id" v-for="(item, index) in operatorName"
            :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用地区：" prop="area" 
                >
        <areaSelect ref="areaSelect" @change="changeArea($event, 'form')" style="width: 1000px"></areaSelect>
      </el-form-item>
      <el-form-item label="巡检类型：" prop="type" :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'change',
                }">
        <el-select v-model="formData.type" placeholder="请选择" style="width: 1000px">
          <el-option :label="item.label" :value="item.label" v-for="(item, index) in inspection_type"
            :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="气候：">
        <el-table :data="tableData" border style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }">
          <el-table-column label="温和">
            <template  slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="weather[0].ratio"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="寒冷">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="weather[1].ratio"></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="地形：" prop="terrain">
        <el-table style="width: 1000px" :data="tableData" border :header-cell-style="{ 'text-align': 'center' }">
          <el-table-column prop="name" label="平原">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="terrain[0].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="丘陵">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="terrain[1].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="高原">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="terrain[2].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="山地">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="terrain[3].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="机房等级：" prop="terrain" v-if="formData.type=='机房巡检'">
        <el-table style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }" :data="tableData" border>
          <el-table-column prop="name" label="A级">
            <template slot-scope="{ row }">
              <div class="inputDeep" >
                <el-input v-model="machine_room_grade[0].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="B级">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="machine_room_grade[1].ratio"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="C级">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="machine_room_grade[2].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="D级">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="machine_room_grade[3].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="基础费用：" prop="basePrice" :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
        <el-input v-model="formData.basePrice" style="width: 1000px"></el-input>
      </el-form-item>
      <el-form-item label="面积区间：" prop="terrain"  v-if="formData.type=='机房巡检'">
        <el-table :data="tableData" style="width: 1000px" border :header-cell-style="{ 'text-align': 'center' }">
          <el-table-column prop="name" label="1-5平方米">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="area_size_interval[0].ratio"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="5-10平方米">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="area_size_interval[1].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="10+平方米">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="area_size_interval[2].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="设备类型：" prop="terrain"  v-if="formData.type=='机房巡检'">
        <el-table style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }" :data="tableData" border>
          <el-table-column prop="name" label="标准宏站">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[13].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="一体化机柜">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[14].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="拉远站">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[15].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="机房站">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[15].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="隧道室分站">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[15].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="楼宇室分站">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[15].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="微站">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[15].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="塔站">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[15].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="室分站">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[15].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="宏站远供站">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[15].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="拉远远供站">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[15].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="资源塔型：" prop="terrain"  v-if="formData.type=='铁塔巡检'">
        <el-table style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }" :data="tableData" border>
          <el-table-column prop="name" label="地面支撑杆">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[13].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
           <el-table-column prop="name" label="三管塔">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[13].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
           <el-table-column prop="name" label="H杆塔">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[13].ratio"></el-input>
              </div>
            </template>
          </el-table-column>
           <el-table-column prop="name" label="楼面抱杆">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[13].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
           <el-table-column prop="name" label="单管塔">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[13].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
           <el-table-column prop="name" label="角钢塔">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[13].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
           <el-table-column prop="name" label="楼面增高架">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[13].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="地域类型：" prop="terrain">
        <el-table style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }" :data="tableData" border>
          <el-table-column prop="name" label="市区">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[16].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="除市区外其他区域">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[17].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="巡检月份：" prop="terrain">
        <el-table style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }" :data="tableData" border>
          <el-table-column prop="name" label="1月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[18].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="2月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[19].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="3月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[20].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="4月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[21].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="5月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[22].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="6月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[23].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="7月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[24].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="8月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[25].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="9月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[26].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="10月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[27].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="11月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[28].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="12月">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[29].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="附加费：" prop="surcharge" :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
        <el-input v-model="formData.surcharge" style="width: 1000px"></el-input>
      </el-form-item>
      <h3 style="margin-left:600px">最终定价范围: <span>{{  }}</span>~ <span>{{  }}</span>元</h3>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancel" type="danger">取消保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import areaSelect from "@/components/custom/areaSelect";
import { xjpricexq, batch, yyslist, xjadd,xjxg, defaultprice } from "@/api/price";

export default {
  components: {
    areaSelect,
  },
  data() {
    return {
      tableData: [{

      }],
      id:'',
      weather:[  {
            ratioType: "weather",
            ratioName: "温和",
            ratioValue: "0",
            ratio:1
          },
          {
            ratioType: "weather",
            ratioName: "寒冷",
            ratioValue: "1",
            ratio: 1
          },],
          terrain:[ {
            ratioType: "terrain",
            ratioName: "平原",
            ratioValue: "0",
            ratio: 1
          },
          {
            ratioType: "terrain",
            ratioName: "丘陵",
            ratioValue: "1",
            ratio: 1
          },
          {
            ratioType: "terrain",
            ratioName: "高原",
            ratioValue: "2",
            ratio: 1
          },
          {
            ratioType: "terrain",
            ratioName: "山地",
            ratioValue: "3",
            ratio: 1
          },],
          machine_room_grade:[{
            ratioType: "machine_room_grade",
            ratioName: "A级",
            ratioValue: "0",
            ratio: 1
          },
          {
            ratioType: "machine_room_grade",
            ratioName: "B级",
            ratioValue: "1",
            ratio: 1
          },
          {
            ratioType: "machine_room_grade",
            ratioName: "C级",
            ratioValue: "2",
            ratio: 1
          },
          {
            ratioType: "machine_room_grade",
            ratioName: "D级",
            ratioValue: "3",
            ratio: 1
          },],
          area_size_interval:[
   {
            ratioType: "area_size_interval",
            ratioName: "1-5",
            ratioValue: "0",
            ratio: 1
          },
          {
            ratioType: "area_size_interval",
            ratioName: "5-10",
            ratioValue: "1",
            ratio: 1
          },
          {
            ratioType: "area_size_interval",
            ratioName: "10+",
            ratioValue: "2",
            ratio: 1
          },
          ],
          device_type:[
              {
            ratioType: "device_type",
            ratioName: "标准宏站",
            ratioValue: "0",
            ratio: 1
          },
          {
            ratioType: "device_type",
            ratioName: "一体化机柜",
            ratioValue: "1",
            ratio: 1
          },
          {
            ratioType: "device_type",
            ratioName: "射频拉远站",
            ratioValue: "2",
            ratio: 1
          },
          ],
          area_type:[ {
            ratioType: "area_type",
            ratioName: "市区",
            ratioValue: "0",
            ratio: 1
          },
          {
            ratioType: "area_type",
            ratioName: "除市区以外其他区域",
            ratioValue: "1",
            ratio: 1
          },],
          inspection_time:[
              {
            ratioType: "inspection_time",
            ratioName: "1月",
            ratioValue: "0",
            ratio: 1
          },
          {
            ratioType: "inspection_time",
            ratioName: "2月",
            ratioValue: "1",
            ratio: 1
          },
          {
            ratioType: "inspection_time",
            ratioName: "3月",
            ratioValue: "2",
            ratio: 1
          },
          {
            ratioType: "inspection_time",
            ratioName: "4月",
            ratioValue: "3",
            ratio: 1
          },
          {
            ratioType: "inspection_time",
            ratioName: "5月",
            ratioValue: "4",
            ratio: 1
          },
          {
            ratioType: "inspection_time",
            ratioName: "6月",
            ratioValue: "5",
            ratio: 1
          },
          {
            ratioType: "inspection_time",
            ratioName: "7月",
            ratioValue: "6",
            ratio: 1
          },
          {
            ratioType: "inspection_time",
            ratioName: "8月",
            ratioValue: "7",
            ratio: 1
          },
          {
            ratioType: "inspection_time",
            ratioName: "9月",
            ratioValue: "8",
            ratio: 1
          },
          {
            ratioType: "inspection_time",
            ratioName: "10月",
            ratioValue: "9",
            ratio: 1
          },
          {
            ratioType: "inspection_time",
            ratioName: "11月",
            ratioValue: "10",
            ratio: 1
          },
          {
            ratioType: "inspection_time",
            ratioName: "12月",
            ratioValue: "11",
            ratio: 1
          },
          ],
      operatorName: [],
      inspection_type: [],
      formData: {
        templateName: '',
        type: '',
        area: '',
        tower_mold:[],
        surcharge: '',
        companyId: '',
        regionCode: '',
        basePrice: '',
        pricingRatio: [
        ]
      }
    }
  },
  mounted() {
    this.yyslist()
    this.batch()
    this.getdetails()
  },
  methods: {
    async yyslist() {
      const { data } = await yyslist()
      this.operatorName = data
    },
    async batch() {
      const params = [
        "weather",
        "terrain",
        "device_type",
        "area_type",
        "inspection_time",
        "inspection_type",
        "area_size_interval",
        "machine_room_grade",
        "tower_mold"
      ];
      const { data } = await batch(params);
      this.inspection_type = data.inspection_type;
      this.tower_mold=data.tower_mold
      console.log(this.tower_mold);
    },
   async changeArea(val) {
      const {data} =await defaultprice({companyId:this.formData.companyId,regionCode:val.area})
      console.log(data);
      this.formData.regionCode = val.area
      this.formData.area = (this.$refs.areaSelect.$refs.cascader.getCheckedNodes()?.[0]
        ?.pathLabels).join('/');
    },
    async submitForm() {
      this.$refs.formData.validate( async (valid) => {
				if (valid) {

      if(this.id){
            console.log(this.formData);
    this.formData['id']=this.id
    const datas =await xjxg(this.formData)
      }else {
      const data = await xjadd(this.formData)

      }
      // if(this.formData.type=="铁塔巡检") {
      // }
      this.$router.push('/orderPrice/xj')
        }});



    },
    cancel() {
      //
      this.$router.push('/orderPrice/xj')

    },
    async getdetails(){
          const { id } = this.$route.query;
    this.id = id;
        if (id) {
      const {data} = await xjpricexq(id)
    console.log(data);
    this.formData.templateName=data.templateName
    this.formData.pricingRatio[0].ratio=data.weather[0].ratio
    this.formData.pricingRatio[1].ratio=data.weather[1].ratio

  }
    }
  }
}
</script>

<style scoped >
/* 利用穿透，设置input边框隐藏 */
.inputDeep>>>.el-input__inner {
  border: 0;
}

/* 如果你的 el-input type 设置成textarea ，就要用这个了 */
.inputDeep>>>.el-textarea__inner {
  border: 0;
  resize: none;
  /* 这个是去掉 textarea 下面拉伸的那个标志，如下图 */
}
</style>
