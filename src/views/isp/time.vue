<template>
	<div class="sign-content">
		<el-form
			:model="fromData"
			ref="dynamicValidateForm"
			label-width="120px"
            class="timeForm"
		>
			<el-form-item
				prop="fileTime"
				label="签署截止日期："
				:rules="[
					{
						required: true,
						message: '请输入签署截止日期',
						trigger: ['blur', 'change'],
					},
				]"
			>
				<el-date-picker
					v-model="fromData.fileTime"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择截止日期"
				>
				</el-date-picker>
			</el-form-item>
		</el-form>
		<div class="card-footer">
			<el-button class="submit-btn" size="medium" @click="handlePrev"
				>上一步</el-button
			>
			<el-button
				class="submit-btn"
				type="primary"
				size="medium"
				@click="handleNext"
				>下一步</el-button
			>
		</div>
		<el-divider></el-divider>
	</div>
</template>
<script>
import { enterpriseInitiateProtocol } from '@/api/isp';

export default {
	name: 'card',
	components: {},
	data() {
		return {
			id: '',
			signatureId: '',
			entName:'',
			signatory:'',
			entQualificationNum: '',
            signEndTime: '',
			fromData: {
				fileTime: '',
			},
		};
	},
	async created() {
		const { id,signatureId,entQualificationNum,signatory,entName, signEndTime } = this.$route.query;
		this.id = id;
		this.entName = entName;
		this.signatory = signatory;
		this.signatureId = signatureId;
		this.entQualificationNum = entQualificationNum;
        this.fromData.fileTime = signEndTime || '';
	},
	mounted() {},
	methods: {
		handleNext() {
			this.$refs.dynamicValidateForm.validate((valid) => {
				if (valid) {
					let newFormData=new FormData()
					newFormData.append('id',this.signatureId);
					newFormData.append('step',2);
					newFormData.append('signEndTime',this.fromData.fileTime);
					newFormData.append('entQualificationNum',this.entQualificationNum);
					enterpriseInitiateProtocol(newFormData).then((res) => {
						if(res.code==0){
							this.$router.push({
								path: '/isp/ispSign/file',
								query: {
									id: this.id,
									signatureId: this.signatureId,
									entQualificationNum:this.entQualificationNum,
									signatory:this.signatory,
									entName:this.entName,
								},
							});
						}
							
					}).catch((err) => {
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		handlePrev() {
			this.$router.go(-1);
		},
	},
};
</script>
<style lang="scss" scoped>
.sign-content {
    padding-top: 50px;
    .timeForm {
        margin: 0 auto;
        width: 400px;
        margin-bottom: 200px;
    }
	.card-footer {
		text-align: center;
		padding: 20px;
	}
}
</style>
