<template>
	<div class="al-continer">
		<el-card shadow="hover" class="exam-desc-title" :loading="loading">
			<el-row>
                <!-- examName: '',
                endTime: '',
                startTime: '',
                answerCount: 0,
                finishCount: 0,
                notFinishCount: 0, -->
				<el-col :span="10">
					<div class="exam-title">{{examInfo.examName}}</div>
					<div class="exam-time">{{examTime}}</div>
				</el-col>
				<el-col :span="14">
					<div class="people-container">
						<div class="item">
							<div class="title">应参与人数</div>
							<div class="desc">{{examInfo.answerCount}}</div>
						</div>
						<div class="item">
							<div class="title">已参与人数</div>
							<div class="desc">{{examInfo.finishCount}}</div>
						</div>
						<div class="item">
							<div class="title">未参与人数</div>
							<div class="desc">{{examInfo.notFinishCount}}</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</el-card>
		<el-tabs class="anal-tabs" type="border-card">
			<el-tab-pane label="排行榜">
				<analysisSort :examId="examId" />
			</el-tab-pane>
			<el-tab-pane label="试题分析">
				<analysisExam :examId="examId" />
			</el-tab-pane>
			<el-tab-pane label="未参与人员">
				<analysisJoin :examId="examId" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import analysisSort from './analysis/sort.vue';
import analysisExam from './analysis/exam.vue';
import analysisJoin from './analysis/join.vue';
import { getExamDetail } from '@/api/exam';
export default {
	name: 'examAnalysis',
	components: {
		analysisSort,
		analysisExam,
		analysisJoin,
	},
	data() {
		return {
            loading: false,
			examId: '',
            examInfo: {
                examName: '',
                endTime: '',
                startTime: '',
                answerCount: 0,
                finishCount: 0,
                notFinishCount: 0,
            }
		};
	},
	watch: {
		$route: {
			handler: function (val, oldVal) {
				this.examId = +val.query.id;
                this.initExamData(this.examId);
			},
			// 深度观察监听
			immediate: true,
		},
	},
    /**计算属性*/
	computed: {
        examTime() {
            if(this.examInfo.startTime && this.examInfo.endTime) {
                return this.examInfo.startTime + '~' + this.examInfo.endTime;
            } else {
                return '-';
            }
        }
    },
    mounted() {
        
    },
	methods: {
		initExamData(examId) {
            this.loading = true;
			getExamDetail({
				examId,
			}).then((res) => {
				if (res.data) {
					this.examInfo.examName = res.data.examName;
					this.examInfo.endTime = res.data.endTime;
					this.examInfo.startTime = res.data.startTime;
					this.examInfo.answerCount = res.data.answerCount;
					this.examInfo.finishCount = res.data.finishCount;
					this.examInfo.notFinishCount = res.data.notFinishCount;

				}
			})
            .finally(() => {
                this.loading = false;
            })
		},
	},
	created() {},
};
</script>

<style lang="scss" scoped>
.al-continer {
	height: 100%;
	display: flex;
	flex-direction: column;
	.anal-tabs {
		flex: 1;
		display: flex;
		flex-direction: column;
		::v-deep {
			.el-tabs__content {
				flex: 1;
				.el-tab-pane {
					height: 100%;
				}
			}
		}
	}
}
.exam-desc-title {
	margin-bottom: 30px;
	.exam {
		&-title {
			font-size: 16px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.85);
			margin-bottom: 12px;
		}
		&-time {
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.65);
		}
	}
	.people-container {
		display: flex;
		align-items: center;
		justify-content: space-around;
		.item {
			display: flex;
			flex-direction: column;
			justify-items: center;
			justify-content: center;
			.title {
				margin-bottom: 12px;
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.45);
			}
			.desc {
				text-align: center;
				font-size: 20px;
				font-family: HelveticaNeue;
				color: rgba(0, 0, 0, 0.85);
			}
		}
	}
}
</style>
