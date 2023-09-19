
import { getBatch } from "@/api/system"
export default {
    data() {
        const checkAge = (rule, value, callback) => {
            if(value){
              if (!/(^[0-9]\d*$)/.test(value)) {
              callback(new Error('请输入数字值'))
              } else {
              if (value > 200) {
                callback(new Error('不能超过200'))
              } else {
                callback()
              }
              }
            }else{
                callback()
            }
          }
          const checkAgeMin = (rule, value, callback) => {
            if(value){
              if (!/(^[1-9]\d*$)/.test(value)) {
              callback(new Error('请输入数字值'))
              } else {
              if (value > 100) {
                callback(new Error('不能超过100'))
              } else {
                callback()
              }
              }
            }else{
                callback()
            }
          }  
        return {
            start:null,
            end:null,
            middleValue:null,
            numberlimit: { validator: checkAge, trigger: 'blur' },
            numberlimitMin: { validator: checkAgeMin, trigger: 'blur' },
            dictParams:[]
        }
    },
    mounted() {
        this.getDictData()
    },
    computed: {
        relustData(){
            return Number(this.start- this.end)
        }
    },
    methods: {
        // 基站运营商计算维保等日期到期时间
        computNum(start,mid,obj){
            if(start){
              let endTime = Number(start.slice(0, 4))+Number(mid)
              obj.rentEndTime = endTime+start.slice(4)
            }
        },
        // 设备铁塔维保时间计算
          computNum2(val){
            if(this.start && !isNaN(parseFloat(val))){
              let endTime = Number(this.start.slice(0, 4))+Number(val)
              this.end = endTime+this.start.slice(4)
            }else{
                this.end = null  
            }
          },
        //  输入年时候的变化
          yearChange(val){
            this.end = null
            this.middleValue = val
            this.computNum2(this.middleValue)
          },
        //   输入时间时候的变化
          timeChange(val){
            this.start = null
            this.start = val
            this.computNum2(this.middleValue)
          },
        //   输入年时候的变化  
          yearChange2(val,obj){
            if(obj.label=='维保期限（年）'){
              this.end = null
              this.middleValue = val
              this.computNum2(this.middleValue)
              this.ruleForm.releaseTime = this.end
            }
          },
        //   所属区域选择框
        changeArea({province, city, area}) {
            this.ruleForm.areaCode = area
        },
        getDictData(){
            // 资源模块相关组件给dictParams赋值 
            // 资源各个模块的下拉框统一由此接口接收菜单对象根据每个表单项目key进行添加
                getBatch(this.dictParams).then((res)=>{
                    if(res.success){
                        this.selectKey = res.data
                        this.selectKey.basic =  [
                            {
                                label:'是',
                                value:'1'
                            },
                            {
                                label:'否',
                                value:'0'
                            }
                        ]
                        this.selectKey.general = [
                            {
                                label:'能',
                                value:'1'
                            },
                            {
                                label:'不能',
                                value:'0'
                            }
                        ]
                        
                        this.selectKey.basicNum = [
                            {
                                label:1,
                                value:'1'
                            },
                            {
                                label:2,
                                value:'2'
                            },
                            {
                                label:3,
                                value:'3'
                            },
                            {
                                label:4,
                                value:'4'
                            },
                            {
                                label:5,
                                value:'5'
                            },
                            {
                                label:6,
                                value:'6'
                            },
                            {
                                label:7,
                                value:'7'
                            },
                            {
                                label:8,
                                value:'8'
                            },
                            {
                                label:9,
                                value:'9'
                            },
                            {
                                label:10,
                                value:'10'
                            }
                        ]
                        this.selectKey.voltageGateRestriction=[
                            {
                                label:'47',
                                value:'47'
                            },
                            {
                                label:'48',
                                value:'48'
                            },
                            {
                                label:'49',
                                value:'49'
                            },
                            {
                                label:'50',
                                value:'50'
                            },
                            {
                                label:'51',
                                value:'51'
                            },
                            {
                                label:'52',
                                value:'52'
                            },
                            {
                                label:'53',
                                value:'53'
                            },
                            {
                                label:'54',
                                value:'54'
                            },
                            {
                                label:'55',
                                value:'55'
                            }
                        ] 
                    }
                })
        }
    }
}