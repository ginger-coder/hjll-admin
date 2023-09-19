<template>
	<div class="app-container">
		<el-scrollbar wrap-class="app-container-wrapper">
			<el-form ref="searchs" :model="form" class="form_horizontal">
				<el-form-item label="模板名称：" prop="templateName">
					<el-input v-model="form.templateName"></el-input>
				</el-form-item>
				<el-form-item label="开启状态：" prop="status">
					<el-select v-model="form.status" placeholder="请选择">
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in status"
							:key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地区：" prop="area">
					<areaSelect ref="areaSelect" @change="changeArea($event)"></areaSelect>
				</el-form-item>
				<el-form-item label="运营商名称：" prop="operatorName">
					<el-input v-model="form.operatorName"></el-input>
				</el-form-item>
				<el-form-item label="类型：" prop="inspectionType">
					<el-select v-model="form.inspectionType" placeholder="请选择">
						<el-option :label="item.label" :value="item.label" v-for="(item, index) in inspection_type"
							:key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="基础费用范围：" prop="basePrice">
					<el-select v-model="form.basePrice" placeholder="请选择">
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in basePrice"
							:key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="巡检月份：" prop="inspectionTime">
					<el-select @change="changemonth" v-model="form.inspectionTime" multiple filterable allow-create
						default-first-option placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="气候：" prop="weather">
					<el-select v-model="form.weather" placeholder="请选择">
						<el-option :label="item.label" :value="item.label" v-for="(item, index) in weather"
							:key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地形：" prop="terrain">
					<el-select v-model="form.terrain" placeholder="请选择">
						<el-option :label="item.label" :value="item.label" v-for="(item, index) in terrain"
							:key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地域类型：" prop="areaType">
					<el-select v-model="form.areaType" placeholder="请选择">
						<el-option :label="item.label" :value="item" v-for="(item, index) in area_type"
							:key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="附加费范围：" prop="surcharge">
					<el-select v-model="form.surcharge" placeholder="请选择">
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in surcharge"
							:key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="设备类型：" prop="device_type">
					<el-select v-model="form.deviceType" placeholder="请选择">
						<el-option :label="item.label" :value="item" v-for="(item, index) in device_type"
							:key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">查询</el-button>
					<el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
				</el-form-item>
			</el-form>
			<div class="page_handle_group">
				<el-button type="primary" icon="el-icon-plus" v-hold-click @click="add()">新增</el-button>
				<el-button type="primary" v-hold-click>批量导出</el-button>
			</div>
			<template>
				<el-table ref="lists" :data="data">
					<!-- <el-table-column key="id" type="index" width="50" align="center" label="#" fixed>
						<template slot-scope="scope">
							{{ scope.$index + 1 + (currentPage - 1) * pageSize }}
						</template>
					</el-table-column> -->
					<el-table-column label="模板名称" width="120" prop="templateName" fixed>
						<template slot-scope="scope">
							{{ scope.row.templateName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="开启状态" prop="status">
						<template v-slot="{ row }">
							<div class="status">
								<el-switch v-model="row.status" :active-value="'1'" :inactive-value="'0'" />
							</div>
						</template>
					</el-table-column>
					<el-table-column label="运营商名称" width="120" prop="operatorName">
						<template slot-scope="scope">
							{{ scope.row.operatorName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="类型" prop="type" width="120">
						<template slot-scope="scope">
							{{ scope.row.type || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="地区" prop="area" width="160">
						<template slot-scope="scope">
							{{ scope.row.area || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="基础费用" prop="basePrice" width="120">
						<template slot-scope="scope">
							{{ scope.row.basePrice || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="巡检月份" prop="inspectionTime">
						<template slot-scope="scope">
							{{ scope.row.inspectionTime || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="气候" prop="weather" width="120">
						<template slot-scope="scope">
							{{ scope.row.weather || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="地形" prop="terrain" width="120">
						<template slot-scope="scope">
							{{ scope.row.terrain || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="设备类型" prop="deviceType" min-width="140" show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.deviceType || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="调节系数" prop="deviceTypeRatio" min-width="140" show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.deviceTypeRatio || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="地域类型" prop="areaType" min-width="140" show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.areaType || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="调节系数" prop="areaTypeRatio" min-width="140" show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.areaTypeRatio || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="附加费" prop="surcharge" min-width="140" show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.surcharge || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="160" fixed="right">
						<template v-slot="{ row }">
							<el-button type="text" v-hold-click @click.stop="doCommand('info', row)"> <span
									style="color:red">配置定价模板</span>
							</el-button>
							<el-button type="text" v-hold-click @click.stop="doCommand('del', row)"> 删除 </el-button>
						</template>
					</el-table-column>
				</el-table>
			 <div class="fy">
				 <el-pagination @size-change="handleSizeChange" 
                           @current-change="handleCurrentChange" 
                           :current-page="currentPage" 
                           :page-sizes="pageSizes" 
                           :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" 
                           :total="totalCount">
              </el-pagination>
			 </div>
			</template>
		</el-scrollbar>
	</div>
</template>
<script>
import { gzpricelist, gzdel, batch } from "@/api/price"
import areaSelect from "@/components/custom/areaSelect";
export default {
	components: {
		areaSelect
	},
	data() {
		return {
			weather: [],
			terrain: [],
			inspection_type: [],
			area_type: [],
			device_type: [],
			basePrice:[
				{
					label:'30-50',
					value:'30-50'
				},
				{
					label:'50-70',
					value:'50-70'
				},
				{
					label:'70-100',
					value:'70-100'
				},
				{
					label:'100以上',
					value:'100以上'
				}
			],
			surcharge:[
				{
					label:'1-3',
					value:'1-3'
				},
				{
					label:'3-5',
					value:'3-5'
				},
				{
					label:'5-10',
					value:'5-10'
				},
				{
					label:'10以上',
					value:'10以上'
				}
			],
			status: [
				{
					label: '正常',
					value: 1
				},
				{
					label: '停用',
					value: 2
				}
			],
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
			form: {
				templateName: '',
				weather: '',
				terrain: '',
				area: '',
				operatorName: '',
				inspectionTime: '',
				areaType: '',
				basePrice:''
			},
			 data:[],
            // 默认显示第几页
            currentPage:1,
            // 总条数，根据接口获取数据长度(注意：这里不能为空)
            totalCount:1,
            // 个数选择器（可修改）
            pageSizes:[5,10,20,30,40],
            // 默认每页显示的条数（可修改）
            PageSize:10,
		};
	},
	mounted() {
		this.gzpricelist({
			current:this.currentPage,
			size:this.PageSize,
		})
		this.batch()
	},
	methods: {
		async doCommand(command, row) {
			var that = this
			switch (command) {
				case "info":
					this.$router.push(`/orderPrice/addxj?id=${row.id}&title=${巡检定价模板配置}`);
					break;
				case "del":
                that.$confirm('确定删除该数据吗', "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
				.then(async () => {
					const data = await gzdel(row.id)
					this.gzpricelist({
						current:this.currentPage,
						size:this.PageSize,
					})
					this.$message({
          message: '删除成功',
          type: 'success'
        });
				}).catch(()=>{})

			}
		},
		async gzpricelist(datas) {
			const { data } = await gzpricelist(datas)
			this.data = data.records
			this.currentPage=data.current
			this.totalCount=data.total
		},
		add() {
			this.$router.push('/orderPrice/addxj')
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
			this.inspection_type = data.inspection_type;
			this.terrain = data.terrain;
			this.weather = data.weather;
			this.device_type = data.device_type;
			this.area_type = data.area_type;
		},
		changeArea(val) {
			this.form.area = val.province + '-' + val.city + '-' + val.area
		},
		changemonth() {
			console.log(11);
		},
		  handleSizeChange(val) {
            // 改变每页显示的条数 
            this.PageSize=val
            // 点击每页显示的条数时，显示第一页
			this.gzpricelist({current:this.currentPage,
			size:this.PageSize
			})
            // this.getData(val,1)
            // 注意：在改变每页显示的条数时，要将页码显示到第一页
            this.currentPage=1
        },
          // 显示第几页
        handleCurrentChange(val) {
            // 改变默认的页数
            this.currentPage=val
			this.gzpricelist({current:this.currentPage,
			size:this.PageSize
			})
            // 切换页码时，要获取每页显示的条数
            // this.getData(this.PageSize,(val)*(this.pageSize))
        },
		async do_search() {
			console.log(this.form);
			const { data } = await gzpricelist(this.form)
			console.log(data);
			this.data = data.records

		},
		search_reset() {
			this.form.templateName="",
			this.form.weather=""
			this.form.terrain=""
			this.form.area=""
			this.form.operatorName=""
			this.form.inspectionTime=""
			this.form.areaType=""
			this.form.basePrice=""
			this.form.deviceType=""
			this.form.surcharge=""
			this.form.area=""
			this.form.status=""
			if (this.$refs.areaSelect) {
				this.$refs.areaSelect.value1 = [];
			}
		}
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

	.btn {
		&-verify {
			background: #4993f7;
			border-radius: 4px;
			color: white;
			width: 45px;
			height: 22px;
			display: inline-block;
			text-align: center;
			margin-left: 0.3rem;
			font-size: 13px;

			&:hover {
				cursor: pointer;
			}
		}
	}
}
.fy {
	text-align: right;
}
</style>
