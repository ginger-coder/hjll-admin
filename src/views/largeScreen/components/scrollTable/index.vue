<template>
  <div class="topRec_List">
    <dl>
      <dd>工单编号</dd>
      <dd>类型</dd>
      <dd>区域</dd>
      <dd>日期</dd>
    </dl>
    <div class="maquee" @mouseenter="closeScroll" @mouseleave="openScroll">
      <ul ref="ul2">
        <li class="zwsj" v-if="queryRecentlyWorkOrder.length==0">
          暂无数据
        </li>
        <li v-for="(item,i) in queryRecentlyWorkOrder" v-else>
          <div>{{initStart(item.serialNumber)}}</div>
          <div>{{item.orderTypeName}}</div>
          <div>{{item.areaAddress}}</div>
          <div>{{item.createTime.substring(0,10)}}</div>
        </li>
        <!-- <li v-for="(item,i) in queryRecentlyWorkOrder">
            <div>{{initStart(item.serialNumber)}}</div>
          <div>{{item.orderTypeName}}</div>
          <div>{{item.areaAddress}}</div>
          <div>{{item.createTime.substring(0,10)}}</div>
        </li> -->
      </ul>

    </div>
  </div>
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
      this.openScroll();

    },
    methods: {
      initStart(str){
        let a=str.substr(0,8)+'****'+str.substr(str.split('').length-4,str.split('').length);
        return a
      },
      closeScroll(){
        clearInterval(this.timer);
        this.timer = null;
      },
      openScroll(){
        let ul=this.$refs.ul2;
        this.timer = setInterval(() => {
          if (Math.ceil(ul.scrollTop + ul.clientHeight) >= ul.scrollHeight) {
            ul.scrollTop=0;
          } else {
            ul.scrollTop=ul.scrollTop + 1;
          }
        }, 60);
      }
    }
  };
</script>

<style lang="scss" scoped>
.topRec_List {
  dl,
  .maquee {
    width: 100%;
    margin: 0 auto;
    color: #f0ece2;
  }

  dl {
    display: flex;

    dd {
      text-align: left;
      color: rgba(255,255,255,0.55);
      font-size: 14px;
      height: 25px;
      line-height: 25px;
      background: linear-gradient(360deg, rgba(0,181,255,0) 0%, rgba(0,123,255,0.54) 100%);
      margin: 0 !important;
    }

    dd:nth-child(1) {
      width: 35%;
      padding-left: 12px;
        text-align: center;
    }

    dd:nth-child(2) {
        text-align: center;
        width: 10%;
    }

    dd:nth-child(3) {
      width: 30%;
        text-align: center;
    }
    dd:nth-child(4) {
      width: 25%;
        text-align: center;
    }
  }

  .maquee {
    height: 130px;
    background: linear-gradient(0deg, rgb(127 130 131 / 10%) 0%, #007bff47 100%);
  }
  .zwsj{
    height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

  }
  ul {
    width: 100%;
    height: 130px;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 0;
    margin: 0;
    // -ms-overflow-style: none;
    // overflow: -moz-scrollbars-none;
    // &::-webkit-scrollbar { width: 0 !important; }
    li {
      border-bottom: 1px solid #7a7a7a;
      width: 100%;
      height: 25px;
      line-height: 25px;
      text-align: left;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      display: flex;

      div {
        color: rgba(255, 255, 255, 0.7);
      }

      div:nth-child(1) {
          width: 35%;
        padding-left: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
          text-align: center;
      }

      div:nth-child(2) {
          width: 10%;
          text-align: center;
      }

      div:nth-child(3) {
        width: 30%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
      }
      div:nth-child(4) {
        width: 25%;
          text-align: center;
      }
    }
  }
}

/* 滚动条 */
::-webkit-scrollbar {
  z-index: 50;
  width: 3px;
  height: 3px;
  border: none;
  outline: none;
}
* {
  cursor: pointer;
}
::-webkit-scrollbar-track {
  background-color: rgba(206, 14, 14, 0);
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  background-color: #1bb4f9;
  transition: all 0.2s;
  height: 25px;
}

:hover::-webkit-scrollbar-thumb {
  transition: all 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to top, #00d9a2, #007af8);
}

::-webkit-scrollbar-button {
  display: none;
}

::-webkit-scrollbar-corner {
  display: none;
}
</style>
