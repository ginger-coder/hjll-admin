<template>
  <div style="height: 100%">
    <div class="header_box disp_flex ju_bet ali_cen">
      <div>
        <div class="title">{{ title }}</div>
        <div class="titleTips">{{ titleTips }}</div>
      </div>
      <div class="back_box">
        <el-button v-hold-click type="" @click="back">返回</el-button>
      </div>
    </div>
    <div class="scrllbar form_box">
      <h2>角色名称:{{ info.name }}</h2>
      <div class="detail">
        <template v-for="(item,index) in column">
          <div class="cell" v-if="item.key" :key="index">
            <div>{{ item.name }}:</div>
            <div>{{ info[item.key] }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script>
import basic from "@/mixins/basic";

import {detail} from "@/api/workRole";
import {parseTime} from "@/utils";

export default {
  components: {},
  data() {
    return {
      title: "角色详情",
      titleTips: "",
      info: {},
      column: [
        {name: '角色代号', key: 'code'},
        {name: '开启状态', key: 'zt'},
        {name: '创建时间', key: 'createTime'},
        {name: '该角色关联的运维人员数量', key: 'peopleNum'},
        {name: '备注', key: ''}
      ]
    };
  },
  mixins: [basic],
  async created() {
    const {id} = this.$route.query;
    const {code, data} = await detail({id});
    console.error('info', data, id);
    if (code ==  0) {
      data['zt'] = `${data.status}` === '1' ? '开启' : '关闭';
      this.info = data;
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    parse_time(date, fmt = 'yyyy-MM-dd HH:mm:ss') {
      return parseTime(date, fmt);
    },
    getLabelName(list, key) {
      return (list || []).map(item => item[key]).join(",") || '-';
    },

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
}

.header_box {
  background: #ffffff;
  margin: -20px;
  padding: 20px;

  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .back_box {
  }
}

.form_box {
  background-color: #ffffff;
  //height: calc(100% - 80px);
  margin-top: 40px;
  border-radius: 4px;
  padding: 10px 30px;

  .detail {
    display: flex;

    .cell {
      display: flex;
      width: max-content;

      div:first-child{
        margin-right: 1rem;
      }

      div:last-child{
        margin-right: 3rem;
      }
    }
  }
}

.footer {
  height: 80px;
}
</style>
