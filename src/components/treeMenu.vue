<template>
	<div class="custom-tree-container">
		<div class="block">
			<div class="header">
				<div style="text-align: left; width: 30%">页面/菜单权限</div>
				<div style="text-align: left; width: 70%">操作权限</div>
			</div>
			<el-tree
				:data="treeOriginData"
				show-checkbox
				node-key="value"
				class="pf-tree"
				ref="tree"
				:props="props"
				@check="getTree"
				:default-checked-keys="checkArray"
				@node-expand="nodeChange"
				:expand-on-click-node="false"
			>
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span v-if="node.data.type !== 4">{{ node.label }}</span>
					<span v-else class="menuBtn"></span>
					<span v-if="node.data.type == 1" class="checkbox-all">
						<el-checkbox-group v-model="checkOutArray">
							<el-checkbox
								v-for="item in node.data.children"
								:label="item.value"
								:key="item.value"
								@change="
									(event) => checkBoxChange(event, item.value)
								"
								>{{ item.label }}</el-checkbox
							>
						</el-checkbox-group>
					</span>
				</span>
			</el-tree>
			<!--<el-table :data="data" row-key="value"  ref="outputTab">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column type="index" width="80" align="center" label="序号" ></el-table-column>
            <el-table-column prop="label" align="center" label="页面/菜单权限" width="300" >
              <template slot-scope="scope" v-if="scope.row.type!==4">
                  {{ scope.row.label }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作权限"  >
              <template slot-scope="scope" v-if="scope.row.type==1">
                <el-checkbox-group v-model="checkOutArray">
                    <el-checkbox v-for="item in scope.row.list"  :label="item.value" :key="item.value" @change="event=>checkData(event,item.value)">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column> 
          </el-table>-->
		</div>
	</div>
</template>
<script>
// import $ from 'jquery';
let id = 1000;
export default {
	props: {
		data: {
			default: [],
			type: Array,
		},
		treeOriginData: {
			default: [],
			type: Array,
		},
		checkArray: {
			default: [],
			type: Array,
		},
	},
	data() {
		return {
			checkOutArray: [],
			checkALLArray: [],
			props: {
				children: 'children',
				label: 'label', //  类型可以为boolean/function(data,node)
			},
		};
	},
	watch: {
		checkArray: {
			handler(val, olVal) {
				console.log('val', val);
                if(!val.length) {
                    if (this.$refs?.tree) {
                        this.$nextTick(() => {
                            this.$refs.tree.setCheckedKeys([]);
                        });
                    }
                }
				this.checkOutArray = val;
			},
			deep: true,
			immediate: true,
		},
	},
	methods: {
		//获取数据并选中
		handleSelectChange(selection) {
			this.tableradio = selection.map((e) => e.id);
			if (selection.length > 1) {
				this.$refs.outputTab.clearSelection();
				this.$refs.outputTab.toggleRowSelection(selection.pop());
			}
		},
		//数据回显
		getRowClass(rowIndex) {
			if (rowIndex) {
				let id = parseInt(rowIndex);
				this.outputList.forEach((x) => {
					if (x.id == id) {
						this.$nextTick(() => {
							this.$refs.outputTab.toggleRowSelection(x);
						});
					}
				});
			}
		},
		append(data) {
			const newChild = { id: id++, label: 'testtest', children: [] };
			if (!data.children) {
				this.$set(data, 'children', []);
			}
			data.children.push(newChild);
		},

		remove(node, data) {
			const parent = node.parent;
			const children = parent.data.children || parent.data;
			const index = children.findIndex((d) => d.value === data.value);
			children.splice(index, 1);
		},
		handleCheckedCitiesChange(val) {
			console.log(val);
		},
		checkBoxChange(e, val) {
			if (e) {
				this.checkOutArray.push(val);
				this.checkALLArray.push(val);
				this.$refs.tree.setCheckedKeys(this.checkOutArray);
				this.$emit('getCheckOutArray', this.checkOutArray);
				this.$emit('getCheckALLArray', this.checkALLArray);
			} else {
				this.checkOutArray.splice(this.checkOutArray.indexOf(val), 1);
				this.checkALLArray.splice(this.checkALLArray.indexOf(val), 1);
				this.$refs.tree.setCheckedKeys(this.checkOutArray);
				this.$emit('getCheckOutArray', this.checkOutArray);
				this.$emit('getCheckALLArray', this.checkALLArray);
			}
		},
		getTree(checkedNodes, e) {
			this.checkALLArray = [...e.checkedKeys, ...e.halfCheckedKeys];
			this.checkOutArray = e.checkedKeys;
			this.$emit('getCheckOutArray', this.checkOutArray);
			this.$emit('getCheckALLArray', this.checkALLArray);
		},
		nodeChange() {
			this.$nextTick(() => {
				$('.checkbox-all')
					.parent()
					.parent()
					.find('.el-tree-node__expand-icon')
					.css('opacity', 0);
				// $('.is-leaf').parent().css('display','none');
				$('.menuBtn').parent().parent().css('display', 'none');
				this.$forceUpdate();
			});
		},
		checkData(e, val) {
			console.log(e, val);
		},
	},
	mounted() {
		$('.menuBtn').parent().parent().css('display', 'none');
		$('.checkbox-all')
			.parent()
			.parent()
			.find('.el-tree-node__expand-icon')
			.css('opacity', 0);
	},
};
</script>
<style scoped lang="scss">
.custom-tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 8px;
}
.checkbox-all {
	min-width: 500px;
	width: 70%;
}
::v-deep .el-tree {
	.el-tree-node {
		// .is-leaf + .el-checkbox .el-checkbox__inner {
		//     display: none;
		// }
		.is-leaf + .el-tree-node .is-expanded {
			display: none;
			height: 0;
		}
	}
	.el-tree-node__content {
		height: auto !important;
		min-height: 26px;
	}
}
.el-checkbox-group {
	display: flex;
	flex-flow: wrap;
}
.header {
	width: 100%;
	height: 44px;
	background: #fafafa;
	box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.05);
	border-radius: 3px 3px 0px 0px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
