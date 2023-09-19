<template>
	<div class="course-container">
		<ul class="topic topic-scroll">
			<li v-for="(item, index) in oList" :key="index">
				<div class="themeName disp_flex ju_bet ali_cen">
					<div class="test-title-left">第{{ index + 1 }}节</div>
					<div class="test-title-right">
						<el-button icon="el-icon-delete" :disabled="item.disabled" circle @click="delItem(index)"></el-button>
						<el-button icon="el-icon-top" :disabled="item.disabled" circle @click="onSortCourse(index, 'top')"></el-button>
						<el-button icon="el-icon-bottom" :disabled="item.disabled" circle @click="onSortCourse(index, 'bottom')"></el-button>
					</div>
				</div>
				<!-- 小节名称，默认展示课件名称 -->
				<div class="content">
					<el-form label-width="100px">
						<el-form-item label="小节名称：">
							<el-input
								v-model="item.courseContentName"
								placeholder="小节名称，默认展示课件名称"
                                :disabled="item.disabled"
							></el-input>
						</el-form-item>
						<el-form-item label="课件：">
							<span style="margin-right: 15px">{{
								item.coursewareName || '请选择课件'
							}}</span>
							<el-button type="text" :disabled="item.disabled" @click="onSelectBook(item)"
								>选择</el-button
							>
						</el-form-item>
					</el-form>
					<!-- <el-divider></el-divider>
					<el-form label-width="100px">
						<el-form-item label="已关联练习：">
							<span style="margin-right: 15px">练习名称</span>
							<el-button type="text">更换</el-button>
							<el-button type="text">删除</el-button>
						</el-form-item>
						<el-form-item label="考试要求：">
							<span style="margin-right: 15px">
								<el-switch> </el-switch>
							</span>
							<span>完成练习才能开始下一节</span>
						</el-form-item>
						<el-form-item label="题数要求：">
							<el-radio-group>
								<el-radio :label="0">无限制</el-radio>
								<el-radio :label="1">
									<el-input
										style="margin-right: 10px; width: 50px"
									></el-input>
									<span>题以上</span>
								</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-form>
					<el-divider></el-divider>
					<el-form label-width="100px">
						<el-form-item label="已关联考试：">
							<span style="margin-right: 15px">考试名称</span>
							<el-button type="text">更换</el-button>
							<el-button type="text">删除</el-button>
						</el-form-item>
						<el-form-item label="考试要求：">
							<span style="margin-right: 15px">
								<el-switch> </el-switch>
							</span>
							<span>完成练习才能开始下一节</span>
						</el-form-item>
						<el-form-item label="分数要求：">
							<el-radio-group>
								<el-radio :label="0">无限制</el-radio>
								<el-radio :label="1">
									<el-input
										style="margin-right: 10px; width: 50px"
									></el-input>
									<span>分以上</span>
								</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-form> -->
				</div>
			</li>
		</ul>
		<div class="course_add" @click="addCourseItem">+ 添加小节</div>
		<courseBookDialog
			:visible.sync="bookDialogModal"
			@save="onSelectBookSave"
		/>
	</div>
</template>
<script>
import _ from 'lodash';
import courseBookDialog from '@/components/courseBookDialog';
const courseItem = {
	courseContentName: '',
	coursewareId: '',
	coursewareName: '',
    disabled: false,
};
export default {
	components: {
		courseBookDialog,
	},
	props: {
		list: {
			type: Array,
			default: () => {
				return [];
			},
		},
	},
	computed: {
		
	},
	watch: {
		list: {
			handler: function (val, oldVal) {
				this.oList = val.length ? _.cloneDeep(val) : [];
			},
			deep: true,
		},
		oList: {
			handler: function (val, oldVal) {
                const newSortList = _.cloneDeep(val).map((el, index) => {
                    el.sort = index;
                    return el;
                })
				this.$emit('change', newSortList);
			},
			deep: true,
		},
	},
	filters: {},
	data() {
		return {
			oList: [],
			activeItem: null,
			bookDialogModal: false,
            courseWareValue: ''
		};
	},
	methods: {
		onSelectBookSave(data) {
			this.activeItem.coursewareName = data.coursewareName;
			this.activeItem.coursewareId = data.id;
		},
		onSelectBook(item) {
			this.bookDialogModal = true;
			this.activeItem = item;
		},
		addCourseItem() {
			const item = _.cloneDeep(courseItem);
			this.oList.push(item);
		},
        onSortCourse(index, type = '') {
            if(!type) return false;
            if(type == 'bottom') {
                if(this.oList.length - 1 == index) return;
                const b_next = _.cloneDeep(this.oList[index + 1]);
                const b_index = _.cloneDeep(this.oList[index]);
                this.$set(this.oList, index + 1,  b_index);
                this.$set(this.oList, index,  b_next);
            }
            if(type == 'top') {
                if(index == 0) return;
                const b_prev = _.cloneDeep(this.oList[index - 1]);
                const b_index = _.cloneDeep(this.oList[index]);
                this.$set(this.oList, index - 1,  b_index);
                this.$set(this.oList, index,  b_prev);
            }

        },
		// 页面有操作时触发，过滤空数据
		onChange() {

        },
        delItem(index) {
            this.oList.splice(index, 1);
            // 重新排序
            this.formatCourseList();
        },
        formatCourseList() {
            this.oList = this.oList.map((el ,index) => {
                el.sort = index;
                return el;
            })
        }
	},
	mounted() {},
};
</script>
<style lang="scss" scoped>
@import '../topic.scss';
.content {
	padding-top: 20px !important;
}
.course-container {
	.topic {
		margin-bottom: 20px !important;
	}
	.course_add {
		text-align: center;
		cursor: pointer;
		line-height: 32px;
		height: 32px;
		background: #ffffff;
		border-radius: 2px;
		border: 1px dashed #d9d9d9;
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}
}
</style>
