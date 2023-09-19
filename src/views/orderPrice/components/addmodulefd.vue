<template>
    <div style="margin-left: 200px;">
        <el-form :model="formData" label-width="100px" class="demo-ruleForm" ref="formData">

            <el-form-item label="模板名称：" prop="templateName"  :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
                <el-input v-model="formData.templateName" style="width: 1000px"></el-input>
            </el-form-item>
            <el-form-item label="运营商名称：" prop="operatorName"  :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
                <el-select v-model="formData.companyId" placeholder="请选择" style="width: 1000px">
                    <el-option :label="item.companyName" :value="item.id" v-for="(item, index) in operatorName"
                        :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="适用地区：" prop="area"  :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
                <areaSelect ref="areaSelect" @change="changeArea($event, 'form')" style="width: 1000px"></areaSelect>
            </el-form-item>
            <el-form-item label="气候："  :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
                <el-table :data="tableData" border style="width: 1000px"
                    :header-cell-style="{ 'text-align': 'center' }">
                    <el-table-column label="温和">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[0].ratio"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="寒冷">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[1].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="地形：" prop="terrain">
                <el-table style="width: 1000px" :data="tableData" border
                    :header-cell-style="{ 'text-align': 'center' }">
                    <el-table-column prop="name" label="平原">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[2].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="丘陵">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[3].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="高原">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[4].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="山地">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[5].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="机房等级：" prop="terrain">
                <el-table style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }" :data="tableData"
                    border>
                    <el-table-column prop="name" label="A级">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[6].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="B级">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[7].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="C级">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[8].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="D级">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[9].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="机房功率区间：" prop="terrain">
                <el-table style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }" :data="tableData"
                    border>
                    <el-table-column prop="name" label="10KW-30KW">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[38].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="30KW-50KW">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[39].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="50KW-100KW">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[40].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="100KW以上">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[41].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="油机功率：" prop="terrain">
                <el-table style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }" :data="tableData"
                    border>
                    <el-table-column prop="name" label="10KW-30KW">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[30].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="30KW-50KW">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[31].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="50KW-100KW">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[32].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="100KW以上">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[33].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="需要人数：" prop="terrain">
                <el-table style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }" :data="tableData"
                    border>
                    <el-table-column prop="name" label="2">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[34].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="3">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[35].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="4">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[36].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="5">
                        <template slot-scope="{ row }">
                            <div class="inputDeep">
                                <el-input v-model="formData.pricingRatio[37].ratio"></el-input>

                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="基础定价：" prop="basePrice"  :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
                <el-input v-model="formData.basePrice" style="width: 1000px"></el-input>
            </el-form-item> 
            <el-form-item label="超出每小时单价：" prop="exceedHourPrice"  :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
                <el-input v-model="formData.exceedHourPrice" style="width: 1000px"></el-input>
            </el-form-item>
            <!-- <el-form-item label="面积区间：" prop="terrain">
        <el-table :data="tableData" style="width: 1000px" border :header-cell-style="{ 'text-align': 'center' }">
          <el-table-column prop="name" label="1-5平方米">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[10].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="5-10平方米">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[11].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="10+平方米">
            <template slot-scope="{ row }">
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[12].ratio"></el-input>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item> -->
            <!-- <el-form-item label="设备类型：" prop="terrain">
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
        </el-table>
      </el-form-item> -->
            <el-form-item label="地域类型：" prop="terrain">
                <el-table style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }" :data="tableData"
                    border>
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
            <el-form-item label="基础时长：" prop=""  :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
                <el-select v-model="formData.baseDuration" placeholder="请选择" style="width: 1000px">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in baseDuration"
                        :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="巡检月份：" prop="terrain">
                <el-table style="width: 1000px" :header-cell-style="{ 'text-align': 'center' }" :data="tableData"
                    border>
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
                        <el-form-item label="油价计费方式：" prop=""  :inline="true"  :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur',
                }">
                <el-select v-model="formData.oilCostType" placeholder="请选择" style="width: 480px;margin-right: 40px;" @change="oilprice">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in oilCostType"
                        :key="index"></el-option>
                </el-select>
                <el-input v-model="formData.oilPrice" style="width: 480px" :disabled="priceboolean"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="cancel" type="danger">取消保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import areaSelect from "@/components/custom/areaSelect";
import { fdpricexq, batch, yyslist, fdadd, xjxg } from "@/api/price";

export default {
    components: {
        areaSelect,
    },
    data() {
        return {
            tableData: [{

            }],
            priceboolean:true,
            baseDuration: [
                {
                    labeel: 1,
                    value: 1,
                },
                 {
                    labeel: 2,
                    value: 2,
                },
                 {
                    labeel: 3,
                    value: 3,
                },
                 {
                    labeel: 4,
                    value: 4,
                }
                , {
                    labeel: 5,
                    value: 5,
                }
                ,
                 {
                    labeel: 6,
                    value: 6,
                }, {
                    labeel: 7,
                    value: 7,
                },
                 {
                    labeel: 8,
                    value: 8,
                },
                 {
                    labeel: 9,
                    value: 9,
                }, {
                    labeel: 10,
                    value: 10,
                }
            ],
            oilCostType:[
                {
                    label:'固定单价',
                    value:'固定单价',
                },
                {
                    label:'实际油价',
                    value:'实际油价',
                }
            ],
            id: '',
            operatorName: [],
            inspection_type: [],
            formData: {
                templateName: '',
                area: '',
                companyId: '',
                regionCode: '',
                basePrice: '',
                baseDuration:'',
                exceedHourPrice: '',
                oilPrice:'',
                oilCostType:'',
                pricingRatio: [
                    {
                        ratioType: "weather",
                        ratioName: "温和",
                        ratioValue: "0",
                        ratio: 10
                    },
                    {
                        ratioType: "weather",
                        ratioName: "寒冷",
                        ratioValue: "1",
                        ratio: 1
                    },
                    {
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
                    },
                    {
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
                    },
                    {

                    },
                    {

                    },
                    {

                    },
                    {

                    },
                    {

                    },
                    {
                    },
                    {
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
                    },
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
                    {
                        ratioType: "oil_engine_power",
                        ratioName: "10kW-30kW",
                        ratioValue: "0",
                        ratio: 1
                    },
                    {
                        ratioType: "oil_engine_power",
                        ratioName: "30kW-50kW",
                        ratioValue: "1",
                        ratio: 1
                    },
                    {
                        ratioType: "oil_engine_power",
                        ratioName: "50kW-100kW",
                        ratioValue: "2",
                        ratio: 1
                    },
                    {
                        ratioType: "oil_engine_power",
                        ratioName: "100KW以上",
                        ratioValue: "3",
                        ratio: 1
                    },
                    {
                        ratioType: "people_num",
                        ratioName: "2",
                        ratioValue: "0",
                        ratio: 1
                    },
                    {
                        ratioType: "people_num",
                        ratioName: "3",
                        ratioValue: "1",
                        ratio: 1
                    },
                    {
                        ratioType: "people_num",
                        ratioName: "4",
                        ratioValue: "2",
                        ratio: 1
                    },
                    {
                        ratioType: "people_num",
                        ratioName: "5",
                        ratioValue: "3",
                        ratio: 1
                    },
                    {
                        ratioType: "machine_room_power_interval",
                        ratioName: "10kW-30kW",
                        ratioValue: "0",
                        ratio: 1
                    },
                    {
                        ratioType: "machine_room_power_interval",
                        ratioName: "30kW-50kW",
                        ratioValue: "1",
                        ratio: 1
                    },
                    {
                        ratioType: "machine_room_power_interval",
                        ratioName: "50kW-100kW",
                        ratioValue: "2",
                        ratio: 1
                    },
                    {
                        ratioType: "machine_room_power_interval",
                        ratioName: "100KW以上",
                        ratioValue: "3",
                        ratio: 1
                    },

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
                "people_num",
                "oil_engine_power",
                "machine_room_power_interval"
            ];
            const { data } = await batch(params);
            this.inspection_type = data.inspection_type;
        },
        changeArea(val) {
            this.formData.regionCode = val.area
            this.formData.area = (this.$refs.areaSelect.$refs.cascader.getCheckedNodes()?.[0]
                ?.pathLabels).join('/');
        },
        async submitForm() {
                  this.$refs.formData.validate( async (valid) => {
				if (valid) {
                     if (this.id) {
                console.log(11);
            }
            console.log(this.formData);
            const data = await fdadd(this.formData)
            this.$router.push('/orderPrice/fd')

                }})
           
        },
        oilprice(){
            if(this.formData.oilCostType=='实际油价') {
                this.priceboolean=true
            }else {
                this.priceboolean=false
            }
        },
        cancel() { 
            this.$router.push('/orderPrice/fd')

        },
        async getdetails() {
            const { id } = this.$route.query;
            this.id = id;
            if (id) {
                const { data } = await fdpricexq(id)
                console.log(data);
                this.formData.templateName = data.templateName


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
