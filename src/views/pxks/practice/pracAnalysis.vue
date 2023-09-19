<template>
	<div class="al-continer">
		<el-card shadow="hover" class="exam-desc-title">
			<el-row>
				<el-col :span="10">
					<div class="exam-title">{{exerInfo.exerciseName}}</div>
					<div class="exam-time">{{exerTime}}</div>
				</el-col>
				<el-col :span="14">
					<div class="people-container">
						<div class="item">
							<div class="title">应参与人数</div>
							<div class="desc">{{exerInfo.answerCount}}</div>
						</div>
						<div class="item">
							<div class="title">已参与人数</div>
							<div class="desc">{{exerInfo.finishCount}}</div>
						</div>
						<div class="item">
							<div class="title">未参与人数</div>
							<div class="desc">{{exerInfo.notFinishCount}}</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</el-card>
		<el-tabs class="anal-tabs" type="border-card">
			<el-tab-pane label="试题分析">
				<analysisExam :exerciseId="exerciseId" />
			</el-tab-pane>
			<el-tab-pane label="已答人员名单">
				<analysisJoin
					:exerciseId="exerciseId"
					:request="answeredPerson"
					:isJoin="1"
				/>
			</el-tab-pane>
			<el-tab-pane label="未答人员名单">
				<analysisJoin
					:exerciseId="exerciseId"
					:request="noAnsweredPerson"
					:isJoin="0"
				/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import analysisExam from './analysis/exam.vue';
import analysisJoin from './analysis/join.vue';
import { answeredPerson, noAnsweredPerson, getExerciseInfo } from '@/api/exer';
export default {
	name: 'examAnalysis',
	components: {
		analysisExam,
		analysisJoin,
	},
	data() {
		return {
			exerciseId: '',
            exerInfo: {
                exerciseName: '',
                endTime: '',
                startTime: '',
                answerCount: 0,
                finishCount: 0,
                notFinishCount: 0,
            },
		};
	},
	watch: {
		$route: {
			handler: function (val, oldVal) {
				this.exerciseId = +val.query.id;
                this.initExamData(this.exerciseId);
			},
			// 深度观察监听
			immediate: true,
		},
	},
    computed: {
        exerTime() {
            if(this.exerInfo.startTime && this.exerInfo.endTime) {
                return this.exerInfo.startTime + '~' + this.exerInfo.endTime;
            } else {
                return '-';
            }
        }
    },
	methods: {
		answeredPerson,
		noAnsweredPerson,
		initExamData(exerciseId) {
			getExerciseInfo({
				exerciseId,
			}).then((res) => {
				if (res.data) {
                    this.exerInfo.exerciseName = res.data.exerciseName;
					this.exerInfo.endTime = res.data.endTime;
					this.exerInfo.startTime = res.data.startTime;
					this.exerInfo.answerCount = res.data.answerCount;
					this.exerInfo.finishCount = res.data.finishCount;
					this.exerInfo.notFinishCount = res.data.notFinishCount;
				}
			});
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
