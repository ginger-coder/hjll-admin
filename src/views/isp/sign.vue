<template>
	<div class="conainer">
		<div class="sign-process">
			<el-steps :active="activeProcess" align-center>
				<el-step title="上传文件"></el-step>
				<el-step title="设置签约属性"></el-step>
				<el-step title="指定签章位置"></el-step>
			</el-steps>
		</div>
		<router-view></router-view>
		<div class="sign-footer" v-if="file.historySignList.length">
			<div class="desc">
				<ul v-for="(item, index) in file.historySignList" :key="index">
					<li>{{ item.createTime }}</li>
					<li>{{ item.agreementNo }}</li>
					<li>{{ item.agreementSignStatus }}</li>
					<li v-if="item.remark">原因：{{ item.remark }}</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
// import { getProtocolDetail } from '@/api/isp';
import { mapState } from 'vuex';

export default {
	name: 'sign',
	components: {},
	data() {
		return {
			id: '',
			fileList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
			activeProcess: 1,
			prcessList: {
				'/isp/ispSign/card': 1,
				'/isp/ispSign/time': 2,
				'/isp/ispSign/file': 3,
			},
			historySignList: [],
		};
	},
	async created() {
		const { id } = this.$route.query;
		this.id = id;
	},
	watch: {
		$route: {
			handler: function (route) {
				this.activeProcess = this.prcessList[route.path] || 1;
				if (route.query.signatureId) {
					this.getPDFInfo(route.query.signatureId);
				} else {
                    this.$store.dispatch('file/clearFile');
                }
			},
			immediate: true,
		},
	},
	mounted() {},
	computed: mapState(['file']),
	methods: {
		getPDFInfo(id) {
			this.$store.dispatch('file/getFileInfo', id);
		},
		handleNext() {
			if (this.activeProcess == 1) {
				this.$router.push({
					path: '/isp/ispSign/time',
					query: {
						id: this.id,
					},
				});
			}
			if (this.activeProcess == 2) {
				this.$router.push({
					path: '/isp/ispSign/file',
					query: {
						id: this.id,
					},
				});
			}
			if (this.activeProcess == 3) {
				// 保存
			}
		},
		handlePreview() {},
		handleRemove() {},
		beforeRemove() {},
		handleExceed() {},
	},
};
</script>
<style lang="scss" scoped>
.conainer {
	min-height: 100%;
	background-color: #fff;
	padding: 20px;
	box-sizing: border-box;
	.sign-footer {
		text-align: center;
		.desc {
			border-radius: 2px;
			border: 1px solid #f5f5f5;
			padding: 16px;
			width: 800px;
			margin: 0 auto;
			ul {
				display: flex;
				li {
					list-style: none;
					padding: 0;
					margin: 0;
					margin-right: 20px;
				}
			}
		}
	}
}
</style>
