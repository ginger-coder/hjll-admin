<template>
    <div>
     
    </div>
  </template>
  
  <script>

  export default {
    data() {
      return {
        dialogVisible: false,
        form: {
          name: "",
          requireInfo:"",
          isPhoto: "",
          pictureName:'',
          isResult:"",
          isRemark:""
        },
        photoIsShow:0,
        shuzi:0
      };
    },
    created() {},
    mounted() {
  
    },
    methods: {
      preserve(){
        asmethods(this.form).then(res=>{
          console.log(res);
        })
        // 222222
        this.form.name=""
        this.form.requireInfo=""
        this.form.isPhoto=""
        this.form.pictureName=""
        this.form.isResult=""
        this.form.isRemark=""
        this.dialogVisible=false
      },
      handleClose(done) {
        this.$confirm("确认关闭？")
          .then((_) => {
            done();
          })
          .catch((_) => {});
      },
      change(val) {
        console.log(val);
      },
      needphoto(val) {
        this.photoIsShow=val
      },
      needphoto2(val){
  this.shuzi=val
      }
    },
  };
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  