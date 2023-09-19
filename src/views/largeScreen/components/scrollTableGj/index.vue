<template>
  <div class="topRec_List">
    <div class="maquee" @mouseenter="closeScroll" @mouseleave="openScroll">

      <ul ref="ul">
          <li class="zwsj" v-if="realActiveAlarm.length==0">
              暂无数据
          </li>
        <li v-for="(item,i) in realActiveAlarm">
          <div>
              <img src="@/assets/images/deng1.png" alt="" v-if="item.alarmLeavel=='一级'">
              <img src="@/assets/images/deng3.png" alt="" v-else-if="item.alarmLeavel=='二级'">
              <img src="@/assets/images/deng2.png" alt="" v-else>
          </div>
          <div>
              <div class="name">{{item.hnDeviceName}}</div>
              <div class="time">{{item.alarmTime}}</div>
          </div>
          <div>
              <div class="jb" v-if="item.alarmLeavel=='一级'" style="color:rgb(255,80,97)">{{item.alarmLeavel}}-{{item.alarmDesc}}</div>
              <div class="jb" v-else-if="item.alarmLeavel=='二级'" style="color:rgb(255,134,26)">{{item.alarmLeavel}}-{{item.alarmDesc}}</div>
              <div class="jb" v-else style="color:rgb(34,203,255)">{{item.alarmLeavel}}-{{item.alarmDesc}}</div>
              <div class="dq">{{item.country?item.country:''}}{{item.baseStationName}}</div>
          </div>

            <div class="bj"></div>

        </li>
          <li v-for="(item,i) in realActiveAlarm">
              <div>
                  <img src="@/assets/images/deng1.png" alt="" v-if="item.alarmLeavel=='一级'">
                  <img src="@/assets/images/deng3.png" alt="" v-else-if="item.alarmLeavel=='二级'">
                  <img src="@/assets/images/deng2.png" alt="" v-else>
              </div>
              <div>
                  <div class="name">{{item.hnDeviceName}}</div>
                  <div class="time">{{item.alarmTime}}</div>
              </div>
              <div>
                  <div class="jb" v-if="item.alarmLeavel=='一级'" style="color:rgb(255,80,97)">{{item.alarmLeavel}}-{{item.alarmDesc}}</div>
                  <div class="jb" v-else-if="item.alarmLeavel=='二级'" style="color:rgb(255,134,26)">{{item.alarmLeavel}}-{{item.alarmDesc}}</div>
                  <div class="jb" v-else style="color:rgb(34,203,255)">{{item.alarmLeavel}}-{{item.alarmDesc}}</div>
                  <div class="dq">{{item.country?item.country:''}}{{item.baseStationName}}</div>
              </div>

              <div class="bj"></div>

          </li>
      </ul>

    </div>
  </div>
</template>
<script>
    export default {
        props: {
            realActiveAlarm: Array,
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
            closeScroll(){
                clearInterval(this.timer);
                this.timer = null;
            },
            openScroll(){
                let ul=this.$refs.ul;
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
      height: 20px;
      line-height: 20px;
      background: linear-gradient(360deg, rgba(0,181,255,0) 0%, rgba(0,123,255,0.54) 100%);
    }


  }

  .maquee {
    height: 100px;
    background: linear-gradient(0deg, rgb(127 130 131 / 10%) 0%, #007bff47 100%);
  }
.zwsj{
    height: 160px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

}
  ul {
    width: 100%;
    height: 180px;
    overflow-y: scroll;
    overflow-x: hidden;
      padding: 0;
      margin: 0;
    // -ms-overflow-style: none;
    // overflow: -moz-scrollbars-none;
    // &::-webkit-scrollbar { width: 0 !important; }
    li {
      padding-top: 5px;
      width: 100%;
      height: 35px;
      line-height: 17px;
      text-align: left;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      align-items: center;
      position: relative;
        box-sizing: content-box;
      .bj{
        position: absolute;
        width: 100% !important;
        height: 5px;
        background: url("~@/assets/images/bkStyle.png") 0 0 / cover no-repeat;
        top:0;
        left:0;
      }
      >div{
        display: flex;
          float:left;
        justify-items: center;
        align-items: center;
        flex-direction: column;
        >div{
          color: rgba(255, 255, 255, 0.7);
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
        }
      }
      >div:nth-child(1) {
        width: 10%;
          height: 100%;
        justify-content: center;
        color: rgba(255, 255, 255, 0.7);
        img{
          width: 16px;
            height: 16px;
        }
      }

      >div:nth-child(2) {
        width: 35%;
        color: rgba(255, 255, 255, 0.7);
          text-align: left;
      }

      >div:nth-child(3) {
        width: 55%;
          text-align: left;
        color: rgba(255, 255, 255, 0.7);
          padding-left: 30px;
            box-sizing:border-box;
          align-items: flex-start;
          .jb{
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: left;
          }
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
  height: 20px;
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
