<template>
  <div :id="uid" :style="newstyle"></div>
</template>
<script>
  import * as echarts from "echarts";
  export default {
    props: {
      newstyle: {
        type: Object,
        default: () => ({
          width: "100%",
          height: "100%",
        }),
      },
      myOption: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        uid:null,
      };
    },
    created() {

    },
    mounted() {
      var that=this;
      var myChart = echarts.init(document.getElementById(that.uid));
      // 在template中可以直接取props中的值，但是在script中不行，因为script是在挂载之前执行的
      myChart.setOption(that.myOption, {
        notMerge: true, //不和之前的option合并
      });
      // 监听页面的大小
      window.addEventListener("resize", () => {
        myChart.resize();
      });

    },
    beforeMount() {
      this.uid = `echarts-uid-${parseInt(Math.random() * 1000000)}`;
    },
    methods: {
      Skip(){
        clearTimeout(this.timer);
        this.timer = null;
        clearTimeout(this.JumpOutTimer);
        this.JumpOutTimer = null;
      }
    }
  };
</script>

<style lang="scss" scoped></style>
