<template>
	<div>
      	<div v-if="columObj.selectType">
        	<div class="table_selection_card">
                已选 <span class="mcolor">{{row.length || 0}}</span> 项
                <el-button type="text" :disabled="row.length ==0" @click="close">清空</el-button>
          	</div>
            <div class="sh1"></div>
      	</div>
		<el-table ref="filterTable" size="medium" :data="tableData" :stripe="false"   :show-header="true"
			 v-loading="columObj.loading" :row-class-name="tableRowClassName"
			@row-click="rowClick" fit
              highlight-current-row
              :border="false"
			  :row-key="(row)=>{ return row.id}"
			  :height="tableHeight"
			  @select="handleSelectEmit"
              @select-all="handleSelectEmit"
			  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              v-bind="$attrs">
			  <!-- :header-row-class-name="headerRowClassName" -->
			  <!-- default-expand-all -->
			<!-- 选择框是否开启，selectable控制是否单行禁用 -->
			<!-- <el-table-column v-if="columObj.selection" type="selection" > -->
			<el-table-column  align="center" v-if="columObj.selection"  :reserve-selection="true" type="selection">
			</el-table-column>
			<el-table-column  label="序号" align="center" v-if="columObj.index" type="index">
			</el-table-column>
			<!-- 普通列 -->
			<el-table-column v-for="(column,columIndex) in columObj.columnData"  :prop="column.prop"
				:label="column.label" :width="column.width" :fixed="column.fixed" :align="column.align || 'center'"
				:sortable="column.sortable" :index="columIndex" show-overflow-tooltip
        v-bind="column" :key="column[rowKey] || columIndex"
        >
				<template slot-scope="{row,$index}">
					<!-- 单选 -->
					<span v-if="column.radio && column.editRow != $index"><el-radio class="radio" :label="row.id" v-model="radioRow" 
					@click.native.stop.prevent="getCurrentRow(row)"></el-radio></span>
					<!-- 默认展示 -->
					<span v-if="column.text && column.editRow != $index" :style="'color:'+column.textColor || '#606266'">{{row[column.prop] || '-'}}</span>
					<!-- 状态对象展示 -->
					<span v-if="column.status && row[column.prop]"><i :style="'backgroundColor:'+column.backColor(row,$index)" class="status"></i>{{row[column.prop]}}</span>
					<!-- 状态对象code展示 -->
					<span v-if="column.mssages && row[column.prop]"><i :style="'backgroundColor:'+column.backColor(row,$index)" class="status"></i>{{column.ownDefinedReturn(row,$index)}}</span>
					<!-- 自定义内容 -->
					<span v-if="column.ownDefined">{{column.ownDefinedReturn(row,$index)}}</span>
					<!-- tag颜色字体展示 -->
					<span v-if="column.tag">
						<el-tag
						:type="column.tagType(row,$index)">
						{{row[column.prop] || '-'}}
						</el-tag>
					</span>	
					<!-- 自定义颜色 -->
					<span v-if="column.color" style="display: inline-block;  padding: 0px 5px;border-radius: 2px " :style="'backgroundColor:'+column.backColor(row,$index)+';'+'color:'+column.colorType(row,$index)+';'+'border:'+'1px solid '+column.colorType(row,$index)">
						{{row[column.prop] || '-'}}
					</span>
					<!-- switch开关 -->
					<!-- <el-switch v-if="column.switch" v-model="row[column.prop]"
						:inactive-text="row[column.prop] ? column.openText:column.closeText"
						@change="switchChange(row,$index,column.prop)"></el-switch> -->
					<!-- 图片展示 -->
					<el-popover trigger="hover" placement="top" popper-class="popper">
						<img v-if="column.image" :src="viewUrl + row[column.prop]" />
						<el-image slot="reference" v-if="column.image" :src="viewUrl + row[column.prop]"></el-image>
					</el-popover>
					<!-- 可编辑input，仅在text默认展示类型才可编辑-->
					<el-input v-focus v-if="column.editRow == $index && column.text" v-model="row[column.prop]"
						@blur="editInputBlur(row,$index,column.prop,columIndex)"></el-input>
					<!-- 操作按钮 -->
					<span  v-for="(operations, index) in column.operation" :key="index">
						<template v-if="column.isOperation" >
							<el-button v-if="operations.isShow(row,operations,$index)" :icon="operations.icon" :type="operations.type"
							@click="rowOperation(row,$index,operations.operation)" :style="{color:operations.color}"
							size="medium">{{operations.label}}</el-button>
						</template>
					</span>
					<!-- 更多按钮 -->
					<el-dropdown v-if="column.isMore" @command="command($event, row)">
						<el-button @click.stop type="text">更多</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item  v-for="(moreData, index) in column.moreData" :key="index" :command="moreData.command">{{moreData.label}}</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>

				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<div v-if="pageObj.show" class="page_div" :style="{textAlign: pageObj.position || 'center'}">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:hide-on-single-page="false" :current-page="pageObj.pageData.page || pageObj.pageData.current" :pager-count="7"
				:page-sizes="[5,10, 15, 20, 30,50]" :page-size="pageObj.pageData.size" background
				layout="total,sizes,prev, pager, next" :total="pageObj.total">
			</el-pagination>
		</div>
	</div>
</template>
 
<script>
	export default {
		directives: {
			// 自定义指令,用于可编辑input自动获取焦点
			focus: {
				inserted: function(e) {
					e.querySelector('input').focus()
				}
			}
		},
		props: {
			tableData: {
				type: Array,
				default: [],
				required: true
		},
		tagHeight:{
			type:Number,
		},
		rowKey: {
			type: String, // 这个值是 key
			default: 'id'
		},
		columObj: {
			type: Object,
			required: true
		},
		//columObj.type(如果为""空，就不会加载多选框，或者index编号),lazy(是否支持懒加载)
		//columnData.columType(列类型,可选text(默认为普通文字模式),input(input可编辑框),switch(switch开关),image(图片),operation(操作按钮))
		//prop(参数),label(列名),width(宽度),align(对齐方式),sortable(是否支持排序)
		//如果为操作列,则需要填写需要的操作按钮,类型为Object。operation(操作类型),type(按钮样式,参考el—botton类型),label(按钮文字)icon(参考el-icon),color(字体颜色)
		pageObj: {
			type: Object,
			required: true
		}
		},
		data() {
			let readUploadFileUrl = this.$store.state.user.readUploadFileUrl;
			return {
				row: [],
				radioRow:null,
				screenHeight: window.innerHeight, //内容区域高度
				oneProductIsSelect:[],
				tableHeight:window.innerHeight  - this.tagHeight,
				selectKey: [],
				viewUrl: readUploadFileUrl,
			}
		},
    computed: {
		alertStatus() {
        return !!this.row?.length
      }
    },
	mounted: function() {
		// window.onresize:浏览器尺寸变化响应事件
		window.onresize = () => {
		return (() => {
		// window.innerHeight:浏览器的可用高度
		window.screenHeight = window.innerHeight
		this.screenHeight = window.screenHeight
		})()
		}
	},
	watch: {
		// 监听screenHeight从而改变table的高度
		screenHeight(val) {
			this.screenHeight = val
			this.tableHeight = this.screenHeight - this.tagHeight
		},
		tagHeight(val){
			this.tableHeight = this.screenHeight - val
		},
		selectKey(o,n){
			this.selectKey.forEach(item => { 
                      this.$nextTick( ()=>{
                        this.tableData.find(obj => { 
                          if(item == obj[this.rowKey]) {
                            this.$refs.filterTable.toggleRowSelection(obj,true)
                        }
                    })
                })
            })
		}
		},
		methods: {
			headerRowClassName({ row }) {
				let oneProductIsSelect = [];
				this.tableData.forEach((item) => {
					oneProductIsSelect.push(item.isSelect);
				});
				if (oneProductIsSelect.includes("")) {
					return "indeterminate";
				}
				return "";
			},
			// 单选
			getCurrentRow(row){
				this.radioRow = row.id
				this.$emit("getCurrentRow", row)
			},
			// // 选中的行id
			handleSelectEmit(selection) {
				this.row = selection || [];
				this.selectKey = selection?.map(el => el[this.rowKey])?.filter(el => el) || [];
				this.$emit('select-change', {
					ref:this.$refs.filterTable,
					row: this.row,
					selectKey: this.selectKey,
				})
			},
			// 清除所有选中列
			close() {
				this.$refs.filterTable?.clearSelection();
				this.handleSelectEmit([])
			},
			// 行操作
			rowOperation(row, $index, now) {
				this.$emit("rowOperation", row, $index, now)
			},
			// 折叠更多操作
			command(event, row) {
				this.$emit("command", event, row)
			},
			// switchChange调用
			switchChange(row, $index, prop) {
				this.$emit("switchChange", row, $index, prop);
			},
			// 帮助点击行，获取点击的下标
			tableRowClassName({row,rowIndex}) {
				if (row.isSelect === "") {
					return "indeterminate";
				}
				row.rowIndex = rowIndex;
			},
			// 点击行
			rowClick(row, column, event) {
				this.$emit("rowClick", row, column, event);
			},
			// 可编辑input失去焦点
			editInputBlur(row, $index, prop, columIndex) {
				this.$emit('editInputBlur', row, $index, prop, columIndex);
			},
			// 条数变化
			handleSizeChange(e) {
				this.$emit('handleSizeChange', e);
			},
			// 页码变化
			handleCurrentChange(e) {
				this.$emit('handleCurrentChange', e);
			}
		}
	}
</script>
<style scoped lang="scss">
	.status{
		display: inline-block;
		width: 8px;
		height: 8px;
		margin-right: 5px;
		border-radius: 50%;
	}
	.el-button {
		margin: 0 6px;
	}
	.page_div {
		padding: 15px 0;
	}
   .table_alert {
    border: 1px solid #2879FF;
    background-color: #ecf5ff !important;
    margin-bottom: 15px;

    .table_alert_title {
      color: #000000 !important;
    }

    .table_alert_title_num {
      color: #2879FF;
      padding: 0 5px;
    }

    .el-alert__icon, .el-alert__closebtn {
      color: #2879FF !important
    }
  }
  .indeterminate .el-checkbox__input .el-checkbox__inner {
  background-color: #6296FF !important;
  border-color: #6296FF !important;
  color: #fff !important;
}

.indeterminate .el-checkbox__input.is-checked .el-checkbox__inner::after {
  transform: scale(0.5);
}

.indeterminate .el-checkbox__input .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #dcdfe6;
}
.indeterminate .el-checkbox__input .el-checkbox__inner::after {
  border-color: #c0c4cc !important;
  background-color: #c0c4cc;
}
.product-show th .el-checkbox__inner {
  display: none !important;
}

.indeterminate .el-checkbox__input .el-checkbox__inner::after {
  content: "";
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  transform: scale(0.5);
  left: 0;
  right: 0;
  top: 5px;
  width: auto !important;
}
.product-show .el-checkbox__inner {
  display: block !important;
}

.product-show .el-checkbox {
  display: block !important;
}

</style>