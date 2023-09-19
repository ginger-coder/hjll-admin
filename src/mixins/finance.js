
export default {
    data() {
        // 充值金额校验
        const checkAge = (rule, value, callback) => {
          const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
          if (!reg.test(value)) {
            if (value && !reg.test(value)) {
              callback(new Error('请输入正确的金额，最多两位小数'));
            }else{
              callback();
            }
          } else {
            callback();
          }
          }
        //   银行卡号校验
          const validateBank = function(rule,value,callback) {
            const reg = /^([1-9]{1})(\d{15}|\d{18})$/;
            if (!reg.test(value)) {
              if (value && !reg.test(value)) {
                callback(new Error('请输入正确的银行卡号'));
              } else {
                callback();
              }
            } else {
              callback();
            }
        }
        function isvalidPhone(phone) {
            const reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/
            return reg.test(phone)
          }
        // 手机号
        const validPhone = (rule, value, callback) => {
            if (!value) {
              callback(new Error('请输入电话号码'))
            } else if (!isvalidPhone(value)) { //判断用户输入的值是否符合规则
              callback(new Error('请输入正确的11位手机号码'))
            } else {
              callback()
            }
          }
        return {
            phonelimit:{validator: validPhone, trigger: 'blur'},
            banklimit:{validator: validateBank, trigger: 'blur'},
            numberlimit: { validator: checkAge, trigger: 'blur' },
            rules:{
              settlementWalletId:[{ required: true, message: "钱包选择", trigger: "change" }],
              walletId:[{ required: true, message: "钱包选择", trigger: "change" }],
              invoiceType:[{ required: true, message: "发票类型", trigger: "change" }],
              invoiceCategory:[{ required: true, message: "发票类目", trigger: "change" }],
              examinePersonId:[{ required: true, message: "审核人员", trigger: "change" }],
		          invoicingAmount:[{ required: true, message: "开票金额", trigger: "blur" }],
              rechargeMoney:[{ required: true, message: "充值金额", trigger: "blur" }],
            }
        }
    },
    mounted() {
      
    },
    computed: {
        
    },
    methods: {
          fmoney(s,n){
            if(s == '' || s == null || s == undefined | isNaN(Number(s))){
                return s
            }
            s = Number(s) ? Number(s) : s
            n = ((n || n == 0) && n > -1 && n <= 20) ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g,"")).toFixed(n) + "" ;
            var l = s.split(".")[0].split("").reverse();
            var r = s.split(".")[1];
            var t = "";
            for(var i = 0;i < l.length;i++){
                t += l[i] + ((i+1)%3 ==0 && (i + 1) != l.length ? "," : "");
            }
            if(n>0){
                r ='.' + r
            }else if(n == 0){
                r=''
            }
            let returnT = t.split("").reverse().join("") + r;
            //负数处理
            if(returnT[0] == '-' && returnT[1] == ','){
                returnT = '-' + returnT.substring(2)
            }
            return returnT;
        },
        toThousandsNoZero(num) {    
          return num ? ( (isNaN(parseFloat(num.toString().replace(/,/g, ""))) ? 1 : parseFloat(num.toString().replace(/,/g, "")))).toFixed(2).toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
            return $1 + "";
          }) : "";
        },
        projectAmounts(){
          if(isNaN(parseFloat( this.formData.rechargeMoney))){
            this.formData.rechargeMoney= 0.00;
          }else{
            this.formData.rechargeMoney=this.toThousandsNoZero(this.formData.rechargeMoney);
          }
        },
        projectAmounts2(){
          if(parseFloat(this.sum)<0){
            this.$message.warning('输入金额不可大于可开票金额！')
            this.formData.invoicingAmount= 0.00;
          }
          if(isNaN(parseFloat( this.formData.invoicingAmount))){
            this.formData.invoicingAmount= 0.00;
          }else{
            this.formData.invoicingAmount=this.toThousandsNoZero(this.formData.invoicingAmount);
          }
        },
        // 充值开票记录
        invoiceHistory(){
            this.jump(`/finance/billingRecord`);
        },
        // 充值记录
        upHistory(){
            this.jump(`/finance/rechargeRecord`);
        },
        // 开票申请
        addInvoice(){
            this.jump(`/finance/billings`);
        },
        // 充值申请
        addUp(){
            this.jump(`/finance/recharge`);
        },
    }
}