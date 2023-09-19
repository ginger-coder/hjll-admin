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
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="姓名：" prop="nickName">
          {{ form.nickName || '-' }}
        </el-form-item>
        <el-form-item label="工作地区：" prop="keyword">
          <span class="">{{ form.workAreaName || '-' }}</span>
        </el-form-item>
        <el-form-item label="角色：" prop="role">
          {{form.role.join(',')}}
        </el-form-item>
        <el-form-item label="技能：" prop="skill">
          {{form.skill.join(',')}}
        </el-form-item>
        <el-form-item label="相关技能证书：" prop="certificate">
          <template v-if="form.cert && form.cert.length">
            <div v-for="item in form.cert" :key="item.key" class="disp_flex al_cen ">
              <div v-if="item.key==1" style="width:100px">电工证</div>
              <div v-if="item.key==2" style="width:100px">高压操作证</div>
              <div>
                <imagesBox v-if="item.value && item.value.length" :width="80" :height="80" :value="item.value"></imagesBox>
                <span v-else class="content gray">-</span>
              </div>
            </div>
          </template>
          <span v-else class="content gray">-</span>
        </el-form-item>
        <el-form-item label="合同扫描件：" prop="contract">
						<imagesBox v-if="form.contract" :width="80" :height="80" :value="form.contract"></imagesBox>
          <span v-else class="content gray">-</span>
        </el-form-item>
        <el-form-item label="签约时间：" prop="signTime">
          <span class="">{{
              parse_time(new Date(form.signTime).getTime(), "{y}-{m}-{d} {h}:{i}:{s}") || "-"
            }}</span>
        </el-form-item>
        <div class="btns">
          <div>
            <!-- <el-button v-hold-click @click="" style="min-width: 180px"
                       @click="jump(`/omp/ompSignCreate${id ? `?id=${id}` : ''}`)">修改
            </el-button> -->
            <div v-if="statusese==2">
              <el-button v-hold-click type="primary" @click="" style="min-width: 180px" @click="$router.go(-1)">返回
            </el-button>
            <el-button v-hold-click type="primary" @click="" style="min-width: 180px" @click="infoures">审核
            </el-button>
            </div>
            <div v-else-if="statusese==1">
              <el-button v-hold-click type="primary" @click="" style="min-width: 180px" @click="$router.go(-1)">返回
            </el-button>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="footer"></div>
    <el-dialog
  title="签约审核"
  :visible.sync="centerDialogVisible"
  width="40%"
  center>
  <span>备注</span>
  <div class="inputDemo">
    <el-input v-model="inputContent" placeholder="备注内容" class="beizhuinput"></el-input>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">拒绝</el-button>
    <el-button type="primary" @click="contest">同意</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
import basic from "@/mixins/basic";

import uploadPics from "@/components/custom/uploadPics";
import uploadFiles from "@/components/custom/uploadFile";
// import {info} from "@/api/omp";
import {getUmsInfo,aggress} from "@/api/ompSign";
import {parseTime} from "@/utils";
import {  BASE_UPLOAD } from "@/config";
import imagesBox from "@/components/custom/imagesBox";

export default {
  components: {
    uploadPics,
    uploadFiles,		
    imagesBox,
  },
  data() {
    return {
			baseUpload: BASE_UPLOAD,
      id: '',
      moduleTitle: "账号",
      apiKey: "adminId",

      title: "",
      titleTips: "",
      form: {
        role:[],
        skill:[],
        cert: []
      },
      rules: {},
      statusese:0,
      centerDialogVisible: false,
      inputContent: ''
    };
  },
  mounted(){
 
  },
  mixins: [basic],
  async created() {
    var that = this
    const {id} = this.$route.query;
    this.id = id;
    this.title = `签约详情`;
    if (`${id}`.length > 0 && id) {

      let _form=new FormData()
			_form.append('userId',id)
      let _data = await getUmsInfo(_form) || {};
      let {umsMember} = _data || {}
        let _info = umsMember
        _info.cert = JSON.parse(_data.umsMember.certificate) || []
        
        _info.contract = _info.contract ? [_info.contract] : ''
        _info.role = []
        _info.skill = []
          if ( _data.roleInfoList &&  _data.roleInfoList.length) {
            _data.roleInfoList.map(i=>{
              _info.role.push(Object.values(i)[0])
            });
          }
        if ( _data.skillInfoList &&  _data.skillInfoList.length) {
          _data.skillInfoList.map(i=>{
            _info.skill.push(Object.values(i)[0])
          });
        }
        
        that.$set(that,'form',_info)
      
    }
  },
  mounted(){
    let status = this.$route.query.status
    this.statusese=status
    console.log(this.statusese,'329483');
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    parse_time(date, fmt) {
      return parseTime(date, fmt);
    },
    getLabelName(list, key) {
      return (list || []).map(item => item[key]).join(",") || '-';
    },
    view(url = '') {
      url && window.open(`${this.baseUpload+url}`)
    },
    infoures(){
      this.centerDialogVisible=true
    },
    contest(){
      const {id} = this.form;
      aggress({id:id,sign:'1'}).then((res)=>{
        if(res.success){
          this.$message({
          message: '审核通过',
          type: 'success'
          });
          this.centerDialogVisible=false
        
           this.statusese=1
         
        }else{
          this.$message({
          message: '请求失败',       
          });
          this.centerDialogVisible=false
        }
    
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.inputDemo el-input{
    border: none !important;
}
.beizhuinput{
  // width: 552px;
  height: 146px;
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #ABBDFF;
}
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

  .el-form {
    width: 50%;
    min-height: 800px;
    margin: 0 auto;
    padding-top: 40px;
  }

  .divider {
    height: 1px;
    background-image: linear-gradient(to right, #d1d2d9 0%, #d1d2d9 50%, transparent 0%);
    background-size: 14px 1px;
    background-repeat: repeat-x;
  }

  .cert-add {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 38px;
    border: 1px dashed #8f959e;
    background: #eaecf1;
    border-radius: 5px;

    &:hover {
      cursor: pointer;
      background: #dadbe0;
    }
  }

  .content {
    margin-right: 1rem;
  }

  .link {
    color: rgb(73, 147, 247);
    font-weight: 400;


    &:hover {
      cursor: pointer;
    }
  }

  .gray {
    color: rgb(192, 192, 192);
  }

  .ali_cen {
    display: flex;
    justify-content: space-between;

    .btn {
      &-remove {
        justify-content: center;
        display: flex;
        align-items: center;
        background: #4993f7;
        border-radius: 4px;
        color: white;
        width: 45px;
        height: 22px;
        text-align: center;
        margin-left: .3rem;
        font-size: 13px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .btns {
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
      flex: 1;
      display: flex;
      justify-content: center;
    }
  }
}

.footer {
  height: 80px;
}
</style>
