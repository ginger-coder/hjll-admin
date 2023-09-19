<template>
    <ul class="nowTime" ref="nowTime">
        <li></li>
        <li></li>
      </ul>
</template>

<script>
    export default {
        props: {
            queryRecentlyWorkOrder: Array,
        },
        data() {
            return {
                timer:null,
            };
        },
        created() {

        },
        mounted() {
            var that=this;
            this.getNowFormatDate();

        },
        methods: {
            getNowFormatDate(){
                let NowTime = this.$refs.nowTime
                let date = new Date();
                let year= date.getFullYear();
                let month= date.getMonth() + 1;
                let strDate= date.getDate();
                let Hour= date.getHours(); // 获取当前小时数(0-23)
                let Minute= date.getMinutes(); // 获取当前分钟数(0-59)
                let Second = date.getSeconds(); // 获取当前秒数(0-59)
                let show_day = new Array(
                    "星期日",
                    "星期一",
                    "星期二",
                    "星期三",
                    "星期四",
                    "星期五",
                    "星期六"
                );
                let day = date.getDay();
                if (Hour < 10) {
                    Hour = "0" + Hour;
                }
                if (Minute < 10) {
                    Minute = "0" + Minute;
                }
                if (Second < 10) {
                    Second = "0" + Second;
                }
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                let currentdate =
                    "<div><p style='text-align:left;background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#fff), to(#5ec0d2));-webkit-background-clip: text;-webkit-text-fill-color: transparent;'>" +
                    year +
                    "年" +
                    month +
                    "月" +
                    strDate +
                    "号</p><p style='text-align:left'>" +
                    show_day[day] +
                    "</p></div>";
                let HMS = Hour + ":" + Minute + ":" + Second;
                let temp_time = year + "-" + month + "-" + strDate + " " + HMS;
                NowTime.children[0].innerHTML = HMS;
                NowTime.children[1].innerHTML = currentdate;
                setTimeout(this.getNowFormatDate, 1000); //每隔1秒重新调用一次该函数
            }
        }
    };
</script>

<style lang="scss" scoped>
 .nowTime {
      position: absolute;
      left: 10px;
      top: 23px;
      font-size: 0;

      li {
        display: inline-block;
        width: 73px;
        height: 21px;
        font-size: 16px;
        color: #fff;
        float: left;
        background-image: -webkit-gradient(linear,
            0 0,
            0 bottom,
            from(#fff),
            to(#5ec0d2));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      li:nth-child(2) {
        font-size: 9px;
        background-image: -webkit-gradient(linear,
            0 0,
            0 bottom,
            from(#fff),
            to(#5ec0d2));

        p {
          text-align: left;
        }
      }
    }

</style>
