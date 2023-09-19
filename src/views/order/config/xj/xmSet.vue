<template>
  <div style="height: 100%">
    <div class="header_box disp_flex ju_bet ali_cen">
      <div>
        <div class="title">{{ title }}</div>
        <div class="titleTips">{{ titleTips }}</div>
      </div>
      <div class="back_box">
        <el-button v-hold-click type="primary" @click="save">保存</el-button>
        <el-button v-hold-click type="" @click="back">返回</el-button>
      </div>
    </div>

    <div class="form_box scrllbar">
      <div>
        <template v-if="form.requireList2 && form.requireList2.length>0">
          <el-form :model="form" ref="form">
            <div v-for="(item,index) in form.requireList2" :key="item.id">
              <div class="card_item disp_flex   ju_bet">

                <div class="card_item_box item_name">
                  <div class="card_item_box_header">选择故障类型</div>
                  <el-form-item :prop='`requireList2.${index}.faultId`'
                                :rules="{required: true, message: '请选择故障类型'}">
                    <el-select v-model="item.faultId" placeholder="请选择故障类型">
                      <el-option v-for="item in itemsPageData"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value"/>
                    </el-select>
                  </el-form-item>
                  <!--                <div class="card_item_box_header">{{ item.deviceFaultName }}</div>-->
                  <!--                <div class="el-info">{{ item.deviceTypeName }}</div>-->
                </div>
                <div class="card_item_box item_input">
                  <div class="card_item_box_header">巡检要求</div>
                  <el-form-item :prop="`requireList2.${index}.requireInfo`"
                                :rules="{required: true, message: '请输入巡检要求'}">
                    <el-input v-model="item.requireInfo" placeholder="请输入巡检要求" type="textarea" autosize></el-input>
                  </el-form-item>
                </div>
                <div class="card_item_box item_img">
                  <div class="card_item_box_header">是否需要拍照</div>
                  <div class="disp_flex ali_cen">
                    <el-switch style="margin-right:6px" v-model="item.showImg" :active-value="0"
                               :inactive-value="1"></el-switch>
                    <el-checkbox :true-label="0" :false-label="1" v-model="item.isImg">必填</el-checkbox>
                  </div>
                </div>
                <div class="card_item_box item_remake">
                  <div class="card_item_box_header">是否填写巡检描述</div>
                  <div class="disp_flex ali_cen">
                    <el-switch style="margin-right:6px" v-model="item.showFallIn" :active-value="0"
                               :inactive-value="1"></el-switch>
                    <el-checkbox :true-label="0" :false-label="1" v-model="item.isFallIn">必填</el-checkbox>
                  </div>
                </div>
                <div class="card_item_box item_summary">
                  <div class="card_item_box_header">是否填写备注</div>
                  <div class="disp_flex ali_cen">
                    <el-switch style="margin-right:6px" v-model="item.showRemark" :active-value="0"
                               :inactive-value="1"></el-switch>
                    <el-checkbox :true-label="0" :false-label="1" v-model="item.isRemark">必填</el-checkbox>
                  </div>
                </div>
                <div class="" v-if="form.requireList2.length > 1">
                  <el-button size="small" v-hold-click type="danger" @click="removeList(index)">删除</el-button>
                </div>
              </div>
              <div class="sh1" style="background: #f2f2f2"></div>
            </div>
          </el-form>

        </template>
        <div v-else class="empty_box card_item">
          暂无数据
        </div>
      </div>
      <template v-if="yhLists.length">
        <div class="sh1" style="background: #f2f2f2"></div>
        <div class="card_item">
          <div>隐患检查</div>
          <div class="card_item_tag">
            <el-tag v-for="item in yhLists" :key="item.id" size="small" type="info" @click="topAdd(item)">
              {{ item.faultName }}
            </el-tag>
          </div>
        </div>
      </template>
      <template v-if="szLists.length">
        <div class="sh1" style="background: #f2f2f2"></div>
        <div class="card_item">
          <div>数值校对</div>
          <div class="card_item_tag">
            <el-tag v-for="item in szLists" :key="item.id" size="small" type="info" @click="topAdd(item)">
              {{ item.faultName }}
            </el-tag>
          </div>
        </div>
      </template>
      <template v-if="slLists.length">
        <div class="sh1" style="background: #f2f2f2"></div>
        <div class="card_item">
          <div>数量核对</div>
          <div class="card_item_tag">
            <el-tag v-for="item in slLists" :key="item.id" size="small" type="info" @click="topAdd(item)">
              {{ item.faultName }}
            </el-tag>
          </div>
        </div>
      </template>
      <template v-if="nrLists.length">
        <div class="sh1" style="background: #f2f2f2"></div>
        <div class="card_item">
          <div>内容核对</div>
          <div class="card_item_tag">
            <el-tag v-for="item in nrLists" :key="item.id" size="small" type="info" @click="topAdd(item)">
              {{ item.faultName }}
            </el-tag>
          </div>
        </div>
      </template>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script>
// import {parseTime} from "@/utils";
import {xmConfig, xmyqConfig} from "@/api/orderXjConfig";
import {allDeviceFault, itemsPage} from "@/api/device";

export default {
  components: {},
  data() {
    return {
      title: "配置巡检要求",
      titleTips: "",


      id: '',

      form: {
        requireList2: [
          {
            faultId: undefined,
            isFallIn: 0,
            isImg: 0,
            isRemark: 1,
            itemId: 141,
            requireInfo: "",
            showFallIn: 0,
            showImg: 0,
            showRemark: 0,
          }
        ]
      },
      rules: {},

      yhLists: [],
      szLists: [],
      slLists: [],
      nrLists: [],
      typeDetailsIds: undefined,
      itemsPageData: []
    };
  },
  mixins: [],
  created() {
    const {id, typeDetailsIds, itemName} = this.$route.query;
    this.id = id;
    this.typeDetailsIds = typeDetailsIds;
    if (itemName) {
      this.title = itemName;
    }
    if (id) {
      this.loader_info();
    }
    this.itemsPageFun();
  },
  mounted() {
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    async itemsPageFun() {
      const res = await itemsPage()
      console.log(res.data, 'res?.data');
      this.itemsPageData = res?.data?.list?.map(el => {
        return {
          ...el,
          label: el.name,
          value: Number(el.value)
        }
      }) || []
    },
    loader_info: function () {
      var that = this
      xmConfig({method: "get", name: "detail"}, {id: that.id, typeDetailsIds: that.typeDetailsIds})
          .then((res) => {
            const {requireList2 = [], ...rest} = res.data || {};
            that.form = {...that.form, ...rest};
            if (requireList2?.length) {
              that.form.requireList2 = res.data.requireList2?.map(el => {
                return {
                  ...el,
                  // faultId: undefined
                }
              })
            }

            let {pollingDevice, pollingObject} = res.data
            // that.loader_set(pollingObject, pollingDevice)
          })
    },
    loader_set: function (deviceTypeId, deviceId) {
      var that = this
      that.yhLists = []
      that.szLists = []
      that.slLists = []
      that.nrLists = []

      allDeviceFault({method: 'post'}, {deviceTypeId, deviceId}).then((res) => {
        if (res && res.length) {
          res.map(item => {
            // 1 隐患检查
            // 2 数值校对
            // 3 数量核对
            // 4 内容核对
            switch (item.faultType) {
              case 1:
                item.faultTypeName = '隐患检查'
                that.yhLists.push(item)
                break;
              case 2:
                item.faultTypeName = '数值校对'
                that.szLists.push(item)
                break;
              case 3:
                item.faultTypeName = '数量核对'
                that.slLists.push(item)
                break;
              case 4:
                item.faultTypeName = '内容核对'
                that.nrLists.push(item)
                break;
            }
          })
        }
      })
    },

    save: function () {
      const that = this;
      let _post = that.form
      let _postJson = []
      let json = {};


      this.$refs.form.validate((valid) => {

        if (!valid) return false;
        _post.requireList2.forEach(item => {
          const {faultId} = item;
          if (faultId) {
            json = {
              itemId: that.form.id,
              id: item.id,
              faultId,
              showImg: item.showImg,
              isImg: item.isImg,
              showFallIn: item.showFallIn,
              isFallIn: item.isFallIn,
              showRemark: item.showRemark,
              isRemark: item.isRemark,
              requireInfo: item.requireInfo,
            }
            _postJson.push(json)
          }
        })
        if (!_postJson?.length) {
          this.$message.warning('数据异常')
          return false
        }
        xmyqConfig({method: 'post'}, {}, {itemId: that.form.id, list: _postJson}).then((res) => {
          var post = that.form
          post.requireList = res.data
          xmConfig({method: "post", name: "updateItem"}, {}, post).then((res) => {
            that.$message({
              type: "success",
              message: res.msg,
            });
            that.back();
          });
        })
      })


    },
    topAdd: function (row) {
      var that = this

      let _json = {
        faultId: row.id,
        deviceFaultName: row.faultName,
        deviceTypeName: row.faultTypeName,
        showImg: 0,
        isImg: 0,
        showFallIn: 0,
        isFallIn: 0,
        showRemark: 0,
        isRemark: 1,
        requireInfo: ''
      }
      const {requireList2 = [] } = this.form
      if (requireList2?.length === 0) {
        that.form.requireList2.push(_json)
        return
      }
      if (that.form.requireList2 && that.form.requireList2.length && row.id) {
        let _index = that.form.requireList2.findIndex(item => item.faultId === row.id)
        if (_index < 0) {
          that.form.requireList2.push(_json)
        } else {
          this.$message({
            message: '该选项已存在，请勿重复添加',
            type: 'warning'
          })
        }
      }
    },
    removeList: function (index) {
      var that = this
      that.$delete(that.form.requireList2, index)
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
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }
}

.form_box {
  background-color: #ffffff;
  margin-top: 40px;
  border-radius: 4px;

  .card_item {
    padding: 20px;
    font-size: 14px;

    .card_item_box {
      width: calc((100% - 100px) / 5);
      margin-right: 20px;

      .card_item_box_header {
        margin-bottom: 6px;
      }
    }

    .card_item_tag {
      // display: ;
      .el-tag {
        margin-top: 10px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
}

.empty_box {
  text-align: center;
  color: #949599;
  font-size: 16px;
  font-weight: bold;
}

.table_box {
  margin-top: 20px;
}

</style>
