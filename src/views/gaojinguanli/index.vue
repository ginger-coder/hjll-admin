<template>
    <div class="tab-bar">
        <Tree @handleCheckChange="handleCheckChange"/>
        <div class="table-box">
            <searchForm  @onSearch="onSearch" @onReset="onReset" :btnItems="'search,reset'"/>
            <div class="el-drawer_mTable">
                <div class="options">
                    <span>基本列表</span>
                    <div class="btns">
                        <!-- <el-button>选择显示列</el-button>
                        <el-button>导出</el-button> -->
                        <!-- <el-button @click="clickColumns(2)">确认全部告警</el-button> -->
                        <el-button @click="clickColumns(3)">确认告警</el-button>
                        <el-button @click="clickColumns(4)">消除告警</el-button>
                    </div>
                </div>
                <publicTable :tableData="tableData" :tagHeight="315" :columObj="columObj" :pageObj="pageObj" @rowOperation="rowOperation"
                    @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" @select-change="handleSelectionChange">
                </publicTable>
            </div>
        </div>
    </div>
</template>

<script>
import publicTable from "@c/business/tables";
import "element-ui/lib/theme-chalk/display.css";
import Tree from "./components/tree"
import searchForm from "./components/filter"
import basic from "@/mixins/basic";
import tableSelection from "@/mixins/tableSelection";
import areaSelect from "@/components/custom/areaSelect";
import { getCautionPage,getDetail,confirmAlarm,clearAlarm,conversionAlarm} from '@/api/caution'
export default {
    components: {
        publicTable,
        Tree,
        searchForm,
        areaSelect
    },
    mixins: [basic,tableSelection],
    data() {
        return {
            columObj: {
					// 选择框
					selection: true,
                    loading:true,
                    selectType:true,
					// 选择框根据条件是否可选
					selectable: (row, index) => {
						if (row.switchs) {
							return true;
						}
					},
					//column列,columType(列类型,可选text(默认为普通文字模式),input(input可编辑框),switch(switch开关),image(图片),operation(操作按钮))
					//prop(参数),label(列名),width(宽度),align(对齐方式),sortable(是否支持排序)
					columnData: [
                //         {
                //         prop: "siteName",
                //         text: true,
                //         editRow: undefined,
                //         label: "站点名称",
                //         width: "200",
                //         align: "center",
                // },
                {
                        prop: "alarmLevelName",
                        text: true,
                        fixed:true,
                        editRow: undefined,
                        label: "级别",
                        width: "",
                        align: "center",
                },
                {
                prop: "alarmTime",
                label: "告警时间",
                text: true,
                editRow: undefined,
                width: "200",
                align: "center",
                },
                {
                prop: "pollingPeriod",
                label: "告警时长",
                text: true,
                editRow: undefined,
                width: "80",
                align: "center",
                },
                {
                prop: "alarmValue",
                label: "告警值",
                text: true,
                editRow: undefined,
                width: "100",
                align: "center",
                },
                {
                prop: "lscId",
                label: "地市",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "areaName",
                label: "区域",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "stationName",
                label: "机房/局站",
                text: true,
                editRow: undefined,
                width: "100",
                align: "center",
                },
                {
                prop: "stationType",
                label: "局站类型",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "deviceName",
                label: "设备名称",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "deviceType",
                label: "设备类型",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "meteName",
                label: "监控量",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "alarmDesc",
                label: "告警描述",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "clearTime",
                label: "消除时间",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "confirmPeople",
                label: "确认人",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "confirmTime",
                label: "确认时间",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                }, 
                {
                prop: "confirmRemark",
                label: "确认说明",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "logicalType",
                label: "告警逻辑分类",
                text: true,
                editRow: undefined,
                width: "120",
                align: "center",
                },
                {
                prop: "subLogicalType",
                label: "告警逻辑子类",
                text: true,
                editRow: undefined,
                width: "120",
                align: "center",
                },
                {
                prop: "alarmName",
                label: "告警标准名",
                text: true,
                editRow: undefined,
                width: "120",
                align: "center",
                },
                {
                prop: "rawMeteCode",
                label: "告警编码ID",
                text: true,
                editRow: undefined,
                width: "120",
                align: "center",
                },
                {
                prop: "shieldingType",
                label: "屏蔽类型",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "",
                label: "反转次数",
                text: true,
                editRow: undefined,
                width: "",
                align: "center",
                },
                {
                prop: "alarmState",
                label: "告警工单状态",
                text: true,
                editRow: undefined,
                width: "120",
                align: "center",
                },
                {
                prop: "alarmNo",
                label: "告警流水号",
                text: true,
                editRow: undefined,
                width: "120",
                align: "center",
                },
                {
                prop: "updateTime",
                label: "告警接收时间",
                text: true,
                editRow: undefined,
                width: "120",
                align: "center",
                },
                    //如果为操作列,则需要填写需要的操作按钮,类型为Object。operation(操作类型),type(按钮样式,参考el—botton类型),label(按钮文字)icon(参考el-icon),color(字体颜色)
                    {
                        isOperation: true,
                        label: "操作",
                        width: "300",
                        fixed:'right',
                        operation: [{
                            operation: "confirm",
                            type: "text",
                            label: "确认告警",
                            icon: "",
                            color: '#5674E5',
                            isShow: (row, $index) => {
                                if(row?.alarmLevelName){
                                    return true
                                }else{
                                    return false
                                }
                            }
                        }, {
                            operation: "details",
                            type: "text",
                            label: "实时详情",
                            icon: "",
                            color: '#5674E5',
                            isShow: (row, $index) => {
                                if(row?.alarmLevelName){
                                    return true
                                }else{
                                    return false
                                }
                            }
                        }, {
                            operation: "remark",
                            type: "text",
                            label: "告警备注",
                            icon: "",
                            color: '#5674E5',
                            isShow: (row, $index) => {
                                if(row?.alarmLevelName){
                                    return true
                                }else{
                                    return false
                                }
                            }
                        },
                        {
                            operation: "conversion",
                            type: "text",
                            label: "转为工单",
                            icon: "",
                            color: '#5674E5',
                            isShow: (row, $index) => {
                                if(row?.alarmLevelName){
                                    return true
                                }else{
                                    return false
                                }
                            }
                        }]
                    },
				],
            },
            pageObj: { //分页对象
					position: "right", //分页组件位置
					total: 0,
                    show:false,
					pageData: {
                        alarmLevel:[],
                        alarmStatus:'',
                        startDate:'',
                        radio_clear:'',
                        closeDate:'',
						// page: 1,
						// size: 10,
                        areaId:'',
					}
				},
            tableData:[], 
            selectIds:[]
        };
    },
    created() {
        this.getData()
    },
   
    methods: {
        // 获取数据
        getData(){
            getCautionPage(this.pageObj.pageData).then((res)=>{
                if(res.code == 0){
                    let value = []
                    for(var key in res.data){
                        value.push(res.data[ key ])
                    }
                    let arr = [].concat(...value)
                    this.tableData = arr || []
                    this.columObj.loading = false
                    // this.pageObj.total = res.data.total
                    // this.pageObj.page = res.data.current
                    // this.pageObj.size = res.data.size
                }
            })
        },
        // 操作栏按钮
        rowOperation(row, $index, now) {
            if(now == 'confirm'){
                this.$message.warning('暂未开通')
                return
                confirmAlarm({
                    confirmStatus:'1',
                    idList:[row.id]
                }).then((res)=>{
                    if(res.code == 0){
                        this.$message.success('确认成功')
                    }
                })
            }else if(now == 'conversion'){
                conversionAlarm(
                    row.siteId
                ).then((res)=>{
                if(res.code == 0){
                    this.$message.success('告警转工单成功')
                }
            })
            } 
            else{
                this.$message.warning('暂未开通')
            }
            
        },
        // 复选框选中添加id
        handleSelectionChange(row) {
            this.selectIds = row.selectKey
        },
        //页码变化
        handleCurrentChange(e) {
            this.pageObj.page = e;
        },
        //条数变化
        handleSizeChange(e) {
            this.pageObj.size = e;
            this.pageObj.page = 1;
        },
        // 确认告警
        confirMarea(){
            this.$message.warning('暂未开通')
                return
            confirmAlarm({
                    confirmStatus:'1',
                    idList:this.selectIds
                }).then((res)=>{
                if(res.code == 0){
                    this.$message.success('确认成功')
                }
            })
        },
        // 取消告警
        cancelMarea(){
            this.$message.warning('暂未开通')
                return
            clearAlarm(
                    this.selectIds.join(',')
                ).then((res)=>{
                if(res.code == 0){
                    this.$message.success('消除成功')
                }
            })
        },
        // 选择列
        clickColumns(val){
            if(this.selectIds.length!=0){
                switch(val){
                    case 1:
                        this.$message.error('暂未开通')
                    break;
                    case 2:
                        this.confirMarea()
                    break;
                    case 3:
                        this.confirMarea()
                    break;
                    case 4:
                        this.cancelMarea()
                    break;

                }
            }else{
                this.$message.error('请先选择列表内容')
            }
        },
        // 取地区id组
        handleCheckChange(arr){
            this.pageObj.pageData.areaId = arr.join(',')
        },
        // 获取表格数据
        onSearch (val) {
            delete val.time
            this.pageObj.pageData = Object.assign(this.pageObj.pageData , val)
            console.log(this.pageObj.pageData)
            this.getData()
        },
        // 重置请求参数请求数据
        onReset(){
            this.getData()
        }
    }
};
</script>

<style lang="scss" scoped>
 @import "../datamap/index.scss";
</style>
<style scoped lang="scss">

.tab-bar{
    width: 100%;
    display: flex;
}
.table-box{
    width: 85%;
    height: 100%;
    margin-left: 30px;
}
.options{
    width: 100%;
    display: flex;
    padding: 5px 10px;
    background: #fff;
}
.options span{
    flex: 1;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
}
.options .btns{
    justify-content: flex-end;
}
.el-drawer_mTable{
    background: #fff;
    padding: 10px;
}
</style>
