<template>
  <div style="height: 100%">
    <div class="header_box disp_flex ju_bet ali_cen">
      <div>
        <div class="title">{{ title }}</div>
        <div class="titleTips">{{ titleTips }}</div>
      </div>
      <div class="back_box">
        <el-button v-hold-click type="primary" @click="save">保存</el-button>
        <el-button v-hold-click type="" @click="back">返回</el-button>
      </div>
    </div>
    <div class="disp_flex moudleBox">
      <div class="moudleItem">
        <span>巡检模块名称:</span>
        <span>{{ rowData.name }}</span>
      </div>
      <div class="moudleItem">
        <span>巡检类型:</span>
        <span>{{ rowData.orderSecondTypeName }}</span>
      </div>
      <div class="moudleItem">
        <span>巡检周期:</span>
        <span>{{ rowData.periodName }}</span>
      </div>
      <div class="moudleItem">
        <span>站点类型:</span>
        <span>{{ rowData.siteTypeName }}</span>
      </div>
    </div>
    <div class="form_box scrllbar">
      <div style="padding: 20px 20px 0 20px;">
        <!-- <template v-if="form.itemVOList && form.itemVOList.length>0">
          <div v-for="(item,index) in form.itemVOList" :key="item.itemId">
            <div class="card_item disp_flex ju_bet ali_cen">
              <div style="max-width:140px;margin-right: 20px;" class="flex">{{ item.itemName }}</div>
              <div class="flex"><span class="el-info">适用</span>{{ item.itemRoleName }}<span class="el-info">类专业</span>
              </div>
              <div style="max-width:100px;margin-right:20px"><span
                  class="el-info">按</span>{{ item.itemPeriodName }}<span class="el-info">巡检</span></div>
              <div class="flex"><span v-if="item.pollingObjectName" class="el-info">{{ item.pollingObjectName }}—</span><span
                  class="el-info" v-if="item.pollingDeviceName">{{ item.pollingDeviceName }}</span></div>
              <div class="">
                <el-button size="small" v-hold-click type="danger" @click="removeList(index)">删除</el-button>
              </div>
            </div>
            <div class="sh1" style="background: #f2f2f2"></div>
          </div>
        </template>
        <div v-else class="empty_box card_item">
          暂无数据
        </div> -->
        <div  style="padding-bottom: 20px;font-size: 16px;font-weight: bold;">已选巡检项目</div>
        <template v-if="form.itemVOList && form.itemVOList.length>0">
          <m-table height="100%" :columns="columns"  :data="form.itemVOList" :loading.sync="loading" :key="form.itemVOList.length" ref="table" :hideOnSinglePage="false">
            <el-table-column slot="index" label="序号">
              <template slot-scope="scope">
              {{ scope.$index+1+($refs.table.current-1)*$refs.table.size }}
              </template>
            </el-table-column>
            <el-table-column  label="操作" align="center" slot="Action" width="120" fixed="right">
              <template slot-scope='scope'>
                <el-button size="small" v-hold-click type="danger" @click="removeList(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </m-table>
        </template>
      </div>
      <div class="sh1" style="background: #f2f2f2"></div>
      <div class="sh1" style="background: #f2f2f2"></div>
      <div class="table_box card_item">
        <div style="font-size:16px;font-weight:bold;margin:-20px 0 20px">添加巡检项目</div>
        <el-form ref="payload" :model="payload" class="form_horizontal" style="margin-bottom:10px">
          <el-form-item label="巡检项目：" prop="name">
            <el-input placeholder="请输入" clearable v-model="payload.name" ></el-input>
          </el-form-item>
          <el-form-item label="站点类型：" prop="relatedSiteType2">
            <el-select v-model="payload.relatedSiteType2" clearable @change="relatedSiteChange">
              <el-option v-for="item in stationTypeData" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  style="float:right;">
            <el-button type="primary" v-hold-click @click="submitForm('payload')">查询</el-button>
            <el-button  v-hold-click @click="resetForm('payload')">重置</el-button>
          </el-form-item>
        </el-form>
        <m-table height="100%" :columns="columns"  :request="getPollingItemPage" :payload="payload" :loading.sync="loading" ref="table2">
          <el-table-column slot="index" label="序号">
            <template slot-scope="scope">
            {{ scope.$index+1+($refs.table2.current-1)*$refs.table2.size }}
            </template>
          </el-table-column>
          <el-table-column  label="操作" align="center" slot="Action" width="120" fixed="right">
            <template slot-scope='scope'>
              <el-button type="text" v-hold-click @click.stop="topAdd(scope.row)"> 添加</el-button>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {parseTime} from "@/utils";
import {getPollingItemDetail, updatePollingModule,getPollingItemPage,getPollingType} from "@/api/orderXjConfig";
import mTable from '@c/business/table'
import { getBatchSystem } from "@/api/system"
export default {
  components: {mTable},
  data() {
    return {
      title: "配置巡检模块",
      titleTips: "",

      // pageFun: xmConfig,

      id: '',
      apiKey: "id",
      payload: {
        orderDetailsType:'',
        period:'',
        relatedSiteType:''
      },
      form: {
        itemVOList: []
      },
      orderTypeList:[],
      rules: {},
      columns: [
				{label: '序号', slot:'index', width: 60},
				{label: '巡检项目', prop: 'name'},
				{label: '巡检类型', prop: 'orderSecondTypeName'},
        {label: '巡检周期', prop: 'periodName'},
        {label: '站点类型', prop: 'siteTypeName'},
        {label: '巡检要求', prop: 'requireInfo'},
				{label: '创建时间', prop: 'createTime'},
				{label: '操作', slot: 'Action'}
			],
      rowData:{},
      stationTypeData:[]
    };
  },
  mixins: [basic],
  created() {
    const {id, row,orderDetailsType} = this.$route.query;
    this.id = id;
    this.rowData = JSON.parse(row);
    this.payload.orderDetailsType = orderDetailsType;
    this.payload.period = this.rowData.period;
    this.payload.relatedSiteType = this.rowData.relatedSiteType;
    this.loader_info();
    this.getPollingTypeList();
    this.getBatchList();
  },
  mounted() {
  },
  methods: {
    // 巡检类型
    getPollingTypeList(){
      getPollingType({},{orderTypeCode:'XJ-TYPE-789'}).then(res=>{
        this.orderTypeList=res;
      })
    },
    getRouterValue(key) {
      return this.$route.query?.[key]
    },
    getBatchList(){
      getBatchSystem(['stationType','period']).then((res)=>{
            if(res.success){
              this.stationTypeData = res.data.stationType;
            }
        })
    },
    back() {
      this.$router.push({
            path:"/xj/mk",
            query:{defaultCurrent:this.getRouterValue('defaultCurrent'),defaultSize:this.getRouterValue('defaultSize'),searchs:this.getRouterValue('searchs')}
      });
    },
    getPollingItemPage,
    loader_info: function () {
      var that = this
      getPollingItemDetail({id: that.id}, {})
          .then((res) => {
            that.form = res.data || []
            that.form.itemVOList = res.data.itemVOList || []
          })
    },
    relatedSiteChange(val){
      this.payload.relatedSiteType2 = val;
      this.payload.relatedSiteType = val;
    },
    save: function () {
      var that = this
      let _post = that.form
      if (_post.itemVOList && _post.itemVOList.length) {
        _post.itemList = _post.itemVOList.map(item => item.id).filter(id => id).join(",")
      } else {
        _post.itemList = null;
        _post.itemVOList=null;
      }
      _post.id=this.id;
      updatePollingModule({}, {}, _post).then((res) => {
        that.$message({
          type: "success",
          message: res.msg,
        });
        that.back();
      });
    },
    topAdd: function (row) {
      var that = this

      // let _json = {
      //   itemName: row.name,
      //   itemRoleName: row.umsRoleName,
      //   itemPeriodName: row.pollingPeriodName,
      //   pollingObjectName: row.deviceTypeName,
      //   pollingDeviceName: row.deviceName,
      //   itemId: row.id
      // }
      let _json =row;
      if (that.form.itemVOList && that.form.itemVOList.length == 0) {
        that.form.itemVOList.push(_json)
        return
      }
      if (that.form.itemVOList && that.form.itemVOList.length && row.id) {
        let _index = that.form.itemVOList.findIndex(item => item.id === row.id)
        if (_index < 0) {
          that.form.itemVOList.push(_json)
        } else {
          this.$message({
            message: '该项目已存在，请勿重复添加',
            type: 'warning'
          })
        }
      }
    },
    removeList: function (index) {
      var that = this
      that.$delete(that.form.itemVOList, index)
    },
    resetForm(formName) {
      this.payload = {};
      this.$refs[formName].resetFields();
      this.payload.orderDetailsType = this.rowData.orderDetailsType;
      this.payload.period = this.rowData.period;
      this.payload.relatedSiteType = this.rowData.relatedSiteType;
      this.$nextTick(() => {
        this.$refs.table2.resetInit();
      })
    },
    submitForm(formName) {
      this.payload.orderDetailsType = this.rowData.orderDetailsType;
      this.payload.period = this.rowData.period;
      this.payload.relatedSiteType = this.rowData.relatedSiteType;
      if(this.payload.relatedSiteType2){
        this.payload.relatedSiteType = this.payload.relatedSiteType2;
      }
      this.$refs[formName].validate((valid) => {
        this.$refs.table2?.resetInit();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
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
.moudleBox{
  width: 100%;
  padding: 20px;
  background: #ffffff;
  margin-top: 50px;
  .moudleItem{
    width: 25%;
  }
}

.header_box {
  background: #ffffff;
  margin: -20px;
  padding: 20px;

  .title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }
}

.form_box {
  background-color: #ffffff;
  margin-top: 40px;
  border-radius: 4px;
  height: 100%;
  .card_item {
    padding: 20px;
    font-size: 14px;
  }
}

.empty_box {
  text-align: center;
  color: #949599;
  font-size: 16px;
  font-weight: bold;
}

.table_box {
  margin-top: 20px;
  height: 80%;
}

</style>
