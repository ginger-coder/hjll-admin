<template>
  <div class="component-container">
    <el-drawer ref="drawer-contract" :modal='false' :with-header="false" custom-class="info_drawer"
               :visible.sync="isShow" size="500px" direction="rtl">
      <div class="disp_flex ali_cen info_drawer_head">
        <div class="flex info_drawer_head_title">{{ title }}详情</div>
        <el-button size="small" plain @click="closePopup">关 闭</el-button>
        <el-button v-if="perOperate" type="primary" size="small" plain @click="operationEvent('edit')">编 辑</el-button>
        <!-- 更多操作 -->
        <!-- <el-button size="small" icon="el-icon-more"></el-button> -->
      </div>
      <el-divider></el-divider>
      <el-scrollbar ref="infoBodyScroll" class="drawer-info-scrollbar" wrap-class="drawer-scrollbar-wrap">
        <div class="info_drawer_body">
          <el-form class="el-form-info" label-width="82px" label-position="left">
            <!-- <el-form-item label-width="0">
                <el-image style="width:100%;" :src="info.avatar" :preview-src-list="[info.avatar]">
                </el-image>
            </el-form-item> -->
            <el-form-item label="账号">
              {{ info.account }}
            </el-form-item>
            <el-form-item label="手机号">
              {{ info.phone || '-' }}
            </el-form-item>
            <el-form-item label="邮箱">
              {{ info.email || '-' }}
            </el-form-item>
            <el-form-item v-if="org" label="部门">
              {{ info.orgName || '-' }}
            </el-form-item>
            <el-form-item v-if="org" label="职位">
              {{ info.job || '-' }}
            </el-form-item>
            <el-form-item label="角色">
              {{ info.roleName || '-' }}
            </el-form-item>
            <el-form-item label="备注">
              {{ info.summary || '-' }}
            </el-form-item>
            <el-form-item label="状态">
              {{ info.stateName || '-' }}
            </el-form-item>
            <el-form-item label="创建时间">
              {{ info.createTime }}
            </el-form-item>
            <el-form-item label="更新时间">
              {{ info.updateTime }}
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>
<script>
import {deepClone} from "@/utils"

import infoPopupMixin from "@/mixins/infoPopup";

export default {
  components: {},
  props: {
    org: {
      type: Boolean,
      default: false
    },
    perOperate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mixins: [infoPopupMixin],

  methods: {
    operationEvent(type) {
      let that = this;

      that.$emit('operation', type, that.info.id)
    }
  },
}
</script>
<style lang="scss" scoped>
</style>
