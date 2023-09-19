<template>
  <div>
    <el-card>
      <el-form :model="sizeForm" class="demo-form-inline" :inline="true">
        <el-form-item label="地区：" prop="dist">
          <areaSelect
            ref="areaSelect"
            @change="changeArea($event, 'searchs')"
            :ischeckStrictly="true"
          ></areaSelect>
        </el-form-item>
        <el-form-item label="时间范围:">
          <el-col :span="10">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="sizeForm.startTime"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="10">
            <el-date-picker
              placeholder="选择日期"
              type="date"
              v-model="sizeForm.endTime"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterData">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="BigCenterBox">
      <div class="SmallCenterBox">
        <div class="listBox">
          <div class="oneListBox">考试人数</div>
          <div class="twoListBox">数据时间 : {{ cardData.dataTime }}</div>
          <div class="bomListBox">
            <div class="threeListBox">
              <div>数值</div>
              <div>
                <span class="fount">{{ cardData.examNumber }}</span
                >次
              </div>
            </div>
            <div class="fourListBox">
              <div>周增加</div>
              <div>
                <span class="fount founts">{{
                  cardData.examNumberWeekAdd
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 2 -->
        <div class="listBox">
          <div class="oneListBox">考试次数</div>
          <div class="twoListBox">数据时间 ： {{ cardData.dataTime }}</div>
          <div class="bomListBox">
            <div class="threeListBox">
              <div>数值</div>
              <div>
                <span class="fount">{{ cardData.examCount }}</span
                >次
              </div>
            </div>
            <div class="fourListBox">
              <div>周增加</div>
              <div>
                <span class="fount founts">{{
                  cardData.examCountWeekAdd
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="listBox">
          <div class="oneListBox">练习人数</div>
          <div class="twoListBox">数据时间 ： {{ cardData.dataTime }}</div>
          <div class="bomListBox">
            <div class="threeListBox">
              <div>数值</div>
              <div>
                <span class="fount">{{ cardData.practiceNumber }}</span
                >人
              </div>
            </div>
            <div class="fourListBox">
              <div>周增加</div>
              <div>
                <span class="fount founts">{{
                  cardData.practiceNumberWeekAdd
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="SmallCenterBox">
        <div class="listBox">
          <div class="oneListBox">练习次数</div>
          <div class="twoListBox">数据时间 ： {{ cardData.dataTime }}</div>
          <div class="bomListBox">
            <div class="threeListBox">
              <div>数值</div>
              <div>
                <span class="fount">{{ cardData.practiceCount }}</span
                >次
              </div>
            </div>
            <div class="fourListBox">
              <div>周增加</div>
              <div>
                <span class="fount founts">{{
                  cardData.practiceCountWeekAdd
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="listBox">
          <div class="oneListBox">学习人数</div>
          <div class="twoListBox">数据时间:--</div>
          <div class="bomListBox">
            <div class="threeListBox">
              <div>数值</div>
              <div><span class="fount">--</span>人</div>
            </div>
            <div class="fourListBox">
              <div>周增加</div>
              <div><span class="fount founts">--%</span></div>
            </div>
          </div>
        </div>
        <div class="listBox">
          <div class="oneListBox">学习次数</div>
          <div class="twoListBox">数据时间 : --</div>
          <div class="bomListBox">
            <div class="threeListBox">
              <div>数值</div>
              <div><span class="fount">--</span>次</div>
            </div>
            <div class="fourListBox">
              <div>周增加</div>
              <div><span class="fount founts">--%</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-card class="qshiBox">
      <h2>培训趋势分析</h2>
      <el-form :model="peixunqs" :inline="true">
        <el-form-item label="地区1：" prop="dist">
          <areaSelect
            ref="areaSelect"
            @change="changeArea2($event, 'searchs')"
            :ischeckStrictly="true"
          ></areaSelect>
        </el-form-item>
        <!-- <el-form-item label="地区2：" prop="dist">
          <areaSelect
            ref="areaSelect"
            @change="changeArea3($event, 'searchs')"
            :ischeckStrictly="true"
          ></areaSelect>
        </el-form-item> -->
        <el-form-item label="时间范围:">
          <el-select clearable v-model="peixunqs.sign" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="shaiiii">筛选</el-button>
        </el-form-item>
      </el-form>
      <div class="echartBox">
        <div class="checkbox">
          <span class="">所属类目：</span>
          <el-checkbox-group
            v-model="checkList"
            @change="ElCheckboxGroup"
            :max="2"
          >
            <el-checkbox label="examNumbers">考试人数</el-checkbox>
            <el-checkbox label="examCounts">考试次数</el-checkbox>
            <el-checkbox label="practiceNumbers">练习人数</el-checkbox>
            <el-checkbox label="practiceCounts">练习次数</el-checkbox>
            <el-checkbox label="学习人数" disabled></el-checkbox>
            <el-checkbox label="学习次数" disabled></el-checkbox>
          </el-checkbox-group>
        </div>
        <div ref="chart" style="width: 100%; height: 500px"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { indexSearch, echartsSearch } from "@/api/pxks";
import areaSelect from "@/components/custom/areaSelect";
export default {
  components: { areaSelect },
  data() {
    return {
      options: [
        {
          value: "1",
          label: "近一周",
        },
        {
          value: "2",
          label: "近一个月",
        },
        {
          value: "3",
          label: "近一年",
        },
      ],

      sizeForm: {
        startTime:null,
        endTime:null,
      },
      peixunqs: {
        sign: "",
      },
      cardData: {},
      checkList: [],
      date: [],
      datastatus: {
        examCounts: [],
        examNumbers: [],
        practiceCounts: [],
        practiceNumbers: [],
      },
      cheOne: "",
      series: [
        {
          name: "考试次数",
          key: "examCounts",
          data: [],
          smooth: true,
          areaStyle: {
            opacity: 0.5,
            color: ["#637FE9"],
          },
          type: "line",
          itemStyle: {
            normal: {
              color: "#637FE9",
              lineStyle: {
                color: "#637FE9",
              },
            },
          },
        },
        {
          name: "考试人数",
          key: "examNumbers",
          data: [],

          smooth: true,
          type: "line",
          itemStyle: {
            normal: {
              color: "#52BAF0",
              lineStyle: {
                color: "#52BAF0",
              },
            },
          },
          areaStyle: {
            opacity: 0.5,
            color: ["#52BAF0"],
          },
        },
        {
          name: "练习次数",
          key: "practiceCounts",
          data: [],

          smooth: true,
          areaStyle: {
            opacity: 0.5,
            color: ["#b2d235"],
          },
          type: "line",
          itemStyle: {
            normal: {
              color: "#b2d235",
              lineStyle: {
                color: "#b2d235",
              },
            },
          },
        },
        {
          name: "练习人数",
          key: "practiceNumbers",
          data: [],
          smooth: true,
          areaStyle: {
            opacity: 0.5,
            color: ["#f26522"],
          },
          type: "line",
          itemStyle: {
            normal: {
              color: "#f26522",
              lineStyle: {
                color: "#f26522",
              },
            },
          },
        },
        {
          name: "学习人数",
          data: [],
          smooth: true,
          areaStyle: {
            opacity: 0.5,
            color: ["#c88400"],
          },
          type: "line",
          itemStyle: {
            normal: {
              color: "#c88400",
              lineStyle: {
                color: "#c88400",
              },
            },
          },
        },
        {
          name: "学习次数",
          data: [],
          smooth: true,
          areaStyle: {
            opacity: 0.5,
            color: ["#00a6ac"],
          },
          type: "line",
          itemStyle: {
            normal: {
              color: "#00a6ac",
              lineStyle: {
                color: "#00a6ac",
              },
            },
          },
        },
      ],
    };
  },
  created() {},
  mounted() {
    this.getEchartData();
    this.filterData();
    this.shaiiii();
  },
  methods: {
    getEchartData() {
      const chart = this.$refs.chart;
      let one = this.checkList[0];
      let two = this.checkList[1];
      if (chart) {
        const myChart = this.$echarts.init(chart);
        const option = {
          legend: {
            bottom: "0%",
            left: "center",
            data: this.checkList,
          },

          xAxis: {
            type: "category",
            boundaryGap: false,
            data: this.date,
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: "value",
            axisLine: {
              show: false,
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985",
              },
            },
          },
          series: this.series,
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      }
    },
    changeArea(val, type) {
      let that = this;
      console.log(val);
      let { province, city, area } = val;
      that.sizeForm.province = province;
      that.sizeForm.city = city;
      that.sizeForm.area = area;
    },
    changeArea2(val) {
      let that = this
      let { province, city, area } = val;
      that.peixunqs.province = province;
      that.peixunqs.city = city;
      that.peixunqs.area = area;
    },
    filterData() {
      indexSearch(this.sizeForm).then((res) => {
        console.log(res);
        this.cardData = res.data;
      });
    },
    ElCheckboxGroup() {
      const { datastatus, checkList } = this;
      const series = this.series;
      // const seriesKey = series.map((el) => el.key);
      // checkList.forEach((el) => {

      //   const index = seriesKey.indexOf(el);

      //   if (index > -1) {
      //     series[index].data = datastatus[el] || [];
      //   }
      // });

      this.series = series.map((el) => {
        const key = el?.key;
        console.log(checkList.includes(key), key, datastatus);

        return {
          ...el,
          data: checkList.includes(key) ? datastatus[key] : [],
        };
      });

      this.getEchartData();
      // console.log(this.checkList);
      // let array = this.checkList;
      // for (let i = 0; i < array.length; ++i) {
      //   console.log(array[i], 666);
      //   if (array[i] == "考试人数") {
      //     this.datastatus.examNumbers = [];
      //     this.datastatus.practiceCounts = [];
      //     this.datastatus.practiceNumbers = [];
      //   } else if (array[i] == "考试次数") {
      //     this.datastatus.examCounts = [];
      //     this.datastatus.practiceCounts = [];
      //     this.datastatus.practiceNumbers = [];
      //   } else if (array[i] == "练习人数") {
      //     this.datastatus.examCounts = [];
      //     this.datastatus.practiceCounts = [];
      //     this.datastatus.practiceNumbers = [];
      //   }
      // }
      this.getEchartData();
    },
    shaiiii() {
      let that = this;
      const { series } = this;
      echartsSearch(this.peixunqs).then((res) => {
        console.log(res);
        console.log(res.data);
        that.date = res.data.dates;
        const {
          dates,
          examCounts,
          examNumbers,
          practiceCounts,
          practiceNumbers,
        } = res?.data || {};
        this.date = dates;
        series[0].data = examCounts;
        series[1].data = examNumbers;
        series[2].data = practiceCounts;
        series[3].data = practiceNumbers;
        this.series = [...series];
        this.getEchartData();
        that.datastatus.examCounts = res.data.examCounts;
        that.datastatus.examNumbers = res.data.examNumbers;
        that.datastatus.practiceCounts = res.data.practiceCounts;
        that.datastatus.practiceNumbers = res.data.practiceNumbers;
      });
      this.getEchartData();
    },
  },
};
</script>

<style scoped>
.line {
  margin-left: 16px;
}
.BigCenterBox {
  margin-top: 24px;
  background-color: #fff;
  padding: 20px 30px 32px;
}
.SmallCenterBox {
  display: flex;
  justify-content: space-between;
}
.listBox {
  width: 28%;
  height: 180px;
  padding: 20px 32px 24px;
  margin-top: 20px;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
}
.echarts {
  width: 100%;
  height: 400px;
  background-color: red;
}
.qshiBox {
  margin-top: 24px;
}
.oneListBox {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
}
.twoListBox {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
  margin-top: 8px;
}
.threeListBox {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 20px;
}
.fourListBox {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 20px;
  margin-left: 40%;
}
.bomListBox {
  display: flex;
  margin-top: 16px;
}
.fount {
  font-size: 24px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
  line-height: 32px;
}
.founts {
  color: MediumSpringGreen;
}
.checkbox {
  display: flex;
  margin-top: 15px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
}
.echartBox {
  border-top: 1px solid #e9e9e9;
}
</style>
