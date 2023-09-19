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
				<el-form-item label="适用地区：" prop="area">
					<areaSelect ref="areaSelect" @change="changeArea($event)" ></areaSelect>
					<!-- :ischeckStrictly="true" -->
				</el-form-item>
				<el-form-item label="运营商名称：" prop="operatorName">
					<el-input v-model="form.companyName"></el-input>
				</el-form-item>
        <el-form-item label="基础时长：" prop="">
          <el-select v-model="form.baseDuration" placeholder="请选择">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in baseDuration"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="基础时长定价：" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in status"
                       :key="index"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="油价计费方式：" prop=""  :inline="true">
          <el-select v-model="form.oilCostType" placeholder="请选择">
            <el-option :label="item.label" :value="item.value" v-for="(item, index) in oilCostType"
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
					<el-table-column key="id" type="index" width="50" align="center" label="#" fixed>
						<template slot-scope="scope">
							{{ scope.$index + 1 + (currentPage - 1) * PageSize }}
						</template>
					</el-table-column>
					<el-table-column label="模板名称"  prop="templateName" fixed>
						<template slot-scope="scope">
							{{ scope.row.templateName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="运营商名称"  prop="operatorName">
						<template slot-scope="scope">
							{{ scope.row.companyName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="适用地区" prop="area" width="160">
						<template slot-scope="scope">
							{{ scope.row.area || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="基础时长" prop="baseDuration" >
						<template slot-scope="scope">
							{{ scope.row.baseDuration || "-" }}
						</template>
					</el-table-column>

					<el-table-column label="基础时长定价" prop="basePrice" >
						<template slot-scope="scope">
							{{ scope.row.basePrice || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="油价计费方式" prop="oilPrice" >
						<template slot-scope="scope">
							{{ scope.row.oilPrice || "-" }}
						</template>
					</el-table-column>
						<el-table-column label="开启状态" prop="status">
						<template v-slot="{ row }">
							<div class="status">
								<el-switch v-model="row.status" :active-value="1" :inactive-value="0"  @change="(val)=>changeStatus(row.id,val)"/>
							</div>
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
import { fdpricelist, fddel, batch,fdstatus } from "@/api/price"
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
			status: [
				{
					label: '正常',
					value: 1
				},
				{
					label: '停用',
					value: 0
				}
			],
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
			form: {
        oilCostType:'',
				templateName: '',
				weather: '',
				terrain: '',
				area: '',
        companyName: '',
				inspectionTime: '',
				areaType: '',
				basePrice:'',
        baseDuration:''
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
		this.fdpricelist({
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
					this.$router.push(`/orderPrice/addfd?id=${row.id}`);
					break;
				case "del":

          this.$confirm('确定删除该数据吗', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async()=>{
            const data = await fddel(row.id)
            this.fdpricelist({
              current:this.currentPage,
              size:this.PageSize,
            })
          })

                that.$confirm('确定删除该数据吗', "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(async () => {
						const data = await fddel(row.id)
						this.fdpricelist({
							current:this.currentPage,
							size:this.PageSize,
						})
					}).catch(()=>{})

			}
		},
		async fdpricelist(datas) {
			const { data } = await fdpricelist(datas)
			this.data = data.records
			this.currentPage=data.current
			this.totalCount=data.total
		},
		add() {
			this.$router.push('/orderPrice/addfd')
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
			this.form.area =val.area
		},
		changemonth() {
			console.log(11);
		},
		  handleSizeChange(val) {
            // 改变每页显示的条数
            this.PageSize=val
            // 点击每页显示的条数时，显示第一页
			this.fdpricelist({current:this.currentPage,
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
			this.fdpricelist({current:this.currentPage,
			size:this.PageSize
			})
            // 切换页码时，要获取每页显示的条数
            // this.getData(this.PageSize,(val)*(this.pageSize))
        },
				async changeStatus(id,val){
			console.log(id,val);
			const data =await fdstatus({id:id,status:val})
		},
		async do_search() {
			console.log(this.form);
			const { data } = await fdpricelist(this.form)
			console.log(data);
			this.data = data.records

		},
		search_reset() {
						if (this.$refs.areaSelect) {
				this.$refs.areaSelect.value1 = [];
			}
            this.form.status=''
      this.form.baseDuration=''
      this.form.oilCostType=''
      this.form.templateName=''
      this.form.area=''
			this.fdpricelist({
			current:1,
			size:10,
		})
		this.form.companyName=""
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
