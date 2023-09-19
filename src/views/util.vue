<template>
  <div class="app-container">
    <el-scrollbar wrap-class="app-container-wrapper">
      <el-form>
        <el-form-item>
          <el-input class="input" placeholder="请输入内容" v-model.trim="input1">
            <template slot="prepend">金额</template>
          </el-input>
          <template>
            ¥ {{amountFormat(input1)}}
          </template>
        </el-form-item>
        <!-- <el-form-item>
          <el-input class="input" placeholder="请输入内容" v-model="input2">
            <template slot="prepend">日期</template>
          </el-input>
          <template>
            {{timToDate(input2)}} --/-- {{timToTime(input2)}}
          </template>
        </el-form-item> -->
        <el-form-item>
          <el-input class="input input-with-select" placeholder="请输入内容" v-model.trim="input3">
            <el-select v-model="input3Select" slot="prepend" placeholder="请选择">
              <el-option v-for="item in input3SelectOption" :label="item.label" :value="item.value" :key="'comm_'+item.value"></el-option>
            </el-select>
          </el-input>
          <template>
            {{filterDictLabel(dict[input3Select],input3) || input3}}
          </template>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>
<script>
import util from "@/mixins/util"
import dict from "@/utils/dict"

export default {
  components: {},
  data() {
    return {
      dict: dict,
      input3SelectOption: dict.comm,
      input1: '',
      input2: '',
      input3: '',
      input3Select: '',
    };
  },
  mixins: [util],
  created() {
    this.initer();
  },
  methods: {
    initer() {
      let that = this;
    },
  },
};

</script>
<style>
/*.el-select .el-input {*/
/*  width: 100px;*/
/*}*/

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
<style scoped>
.input {
  width: 248px;
}
</style>
