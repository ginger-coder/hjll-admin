<template>
  <div class="search-form-box">
    <el-form
      :model="formData"
      ref="formRef"
      :inline="true"
    >
     <!-- <el-form-item label="告警类型：">
            <el-select  v-model="formData.deviceType" clearable >
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="告警级别：">
            <el-select  v-model="alarmLevel" clearable multiple @change="levelChange">
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <!-- 提交按钮 -->
      <div class="btn-box">
        <el-button
          v-if="btnItems.includes('export')"
          type="primary"
          class="btn-export"
          @click="onExport"
        >导出</el-button>
        <el-button
          v-if="btnItems.includes('reset')"
          type="default"
          class="btn-reset"
          @click="onReset"
        >重置</el-button>
        <el-button
          v-if="btnItems.includes('search')"
          type="primary"
          class="btn-search"
          @click="onSearch"
        >查询</el-button>
        <span @click="change()" class="up-down" >{{text}}
          <i v-if="text=='展开'" class="el-icon-arrow-up"/><i v-else class="el-icon-arrow-down"/></span>
      </div>
    <div v-if="text=='收起'">
        <el-form-item label="告警确认：">
            <el-select ref="orderType" v-model="formData.alarmStatus" clearable >
                <el-option v-for="item in conOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="告警消除：" >
            <el-select  v-model="formData.radio_clear" clearable >
                <el-option v-for="item in eliOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <!-- <br>
        <el-form-item label="告警显示：">
            <el-select  v-model="formData.show" clearable >
                <el-option v-for="item in showOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="选择时间：">
            <el-date-picker
            v-model="time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
            >
            </el-date-picker>
        </el-form-item>
    </div>
    </el-form>

    
  </div>
</template>

<script>
import {parseTime} from '@/utils/index'
export default {
  props: {
    // 提交按钮项，多个用逗号分隔（search, export, reset）
    btnItems: {
      type: String,
      default () {
        return 'search'
      }
    }
  },

  data () {
    return {
        text:'展开',
        typeOptions:[
            {
                label:'所有',
                value:1
            },
        ],
        levelOptions:[
            {
                label:'无告警',
                value:0
            },
            {
                label:'一级',
                value:1
            },
            {
                label:'二级',
                value:2
            },
            {
                label:'三级',
                value:3
            },
            {
                label:'四级',
                value:4
            },
        ],
        conOptions:[
            {
                label:'开始',
                value:0
            },
            {
                label:'确认',
                value:1
            },
            {
                label:'结束',
                value:2
            },
        ],
        eliOptions:[
            {
                label:'未消除',
                value:1
            },
            {
                label:'已消除',
                value:2
            },
        ],
        showOptions:[
            {
                label:'显示主次警告',
                value:1
            },
            {
                label:'只显示主警告',
                value:2
            },
        ],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        time:null,
        alarmLevel:[],
        formData: {
          time:'',
          alarmLevel:'',
          alarmStatus:'',
          startDate:'',
          radio_clear:'',
          closeDate:''
        }
    }
  },

  created () {
   
  },
  methods: {
    change(event){
        this.text=='展开'?this.text='收起':this.text='展开'
    },
    levelChange(val){
      if(val){
        this.formData.alarmLevel = val.join(',')
      }else{
        this.formData.startDate = ''
      }
    },
    changeTime(val){
      if(val){
        this.formData.startDate = parseTime(val[0])
        this.formData.closeDate = parseTime(val[1])
      }else{
        this.formData.startDate = ''
        this.formData.closeDate = ''
      }
    },
    // 校验
    onValidate (callback) {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          // console.log(this.formData)
          callback()
        }
      })
    },
    // 搜索
    onSearch () {
        this.$emit('onSearch', this.formData)
    },
    // 导出
    onExport () {
      this.onValidate(() => {
        this.$emit('onExport', this.formData)
      })
    },
    onReset () {
      this.formData = {}
      this.$refs.formRef.resetFields()
      this.$emit('onReset', this.formData)
    },
  },
}
</script>

<style scoped lang="scss">
.search-form-box{
    background: #fff;
    padding: 15px;
    margin-bottom: 20px;
}
.btn-box{
    display: inline-block;
}
.up-down{
    display: inline-block;
    margin-left: 20px;
    cursor: pointer;
    color: #5674E5;
    font-size: 14px;
}
.up-down i{
  margin-left: 5px;
}
.search-form-box .el-select{
    width: 275px;
    margin-right: 20px;
}
</style>