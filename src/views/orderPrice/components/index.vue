 <!-- <el-form-item label="地形">
        <el-table
          :data="tableData"
          border
          style="width: 1000px"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column label="温和" style="height: 100px">
            <template slot-scope="{ row }">
              <el-form-item
                key="123"
                label="123"
                prop="pricingRatio.0.ratio"
                :rules="{
                  required: true,
                  message: '请输入年龄',
                  trigger: 'blur',
                }"
              >
                <div style="height: 100px">
                  <el-input v-model="formData.pricingRatio[0].ratio"></el-input>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="寒冷">
            <template>
              <div class="inputDeep">
                <el-input v-model="formData.pricingRatio[1].ratio"></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item> -->
            if (this.id) {
        console.log(11);
      }
      console.log(this.$refs, "this.$refs.formData");
      this.$refs.formData.validate();