<template>
  <!--动效显示-->
  <div class="flasheffectoutbox">
    <div class="wrap">
      <div class="line2 line"></div>
      <div class="line3 line"></div>
      <div class="line4 line"></div>
      <div class="line5 line"></div>
      <div class="line6 line"></div>

      <!--主动效-->
      <div class="maineffectoutbox circleeffectclass main">
        <a href="#" target="_blank" @click="changeEnterprise">
          <p class="effectposition"></p>
          <span class="effectposition"></span>
          <img class="effectposition maindataeffect" src="@/assets/images/maindataeffect.png" />
          <div class="effectposition acrossremindeffectout">
            <div class="acrossremindeffectin"></div>
          </div>
          <img class="effectposition maindataspecialeffect cloud-wrap-image"
            src="@/assets/images/maindataspecialeffect.png" />
          <div class="effectposition cloud-wrap">
            <img class="cloud" src="/favicon.ico" />
          </div>
        </a>
      </div>
      <!--卫星动效-->
      <div class="circleeffectclass aroundfunctioneffect seal">
        <img class="effectposition arounddataeffect02 circle-turn" src="@/assets/images/aroundeffect.png" />
        <div class="effectposition acrossremindeffectout acrossremindeffectoutard">
          <div class="acrossremindeffectin acrossremindeffectinard"></div>
        </div>
        <img class="effectposition sign" src="@/assets/images/xingzhengshenpi.png" />
      </div>

      <div class="circleeffectclass aroundfunctioneffect phone">
        <img class="effectposition arounddataeffect01 circle-turn" src="@/assets/images/aroundeffect.png" />
        <div class="effectposition acrossremindeffectout acrossremindeffectoutard">
          <div class="acrossremindeffectin acrossremindeffectinard"></div>
        </div>
        <img class="effectposition sign" src="@/assets/images/baixingpaiAPP.png" />
      </div>

      <div class="circleeffectclass aroundfunctioneffect transport">
        <img class="effectposition arounddataeffect02 circle-turn" src="@/assets/images/aroundeffect.png" />
        <div class="effectposition acrossremindeffectout acrossremindeffectoutard">
          <div class="acrossremindeffectin acrossremindeffectinard"></div>
        </div>
        <img class="effectposition sign" src="@/assets/images/zhatuyunshu.png" />
      </div>

      <div class="circleeffectclass aroundfunctioneffect telephone">
        <img class="effectposition arounddataeffect01 circle-turn" src="@/assets/images/aroundeffect.png" />
        <div class="effectposition acrossremindeffectout acrossremindeffectoutard">
          <div class="acrossremindeffectin acrossremindeffectinard"></div>
        </div>
        <img class="effectposition sign" src="@/assets/images/12319rexian.png" />
      </div>

      <div class="circleeffectclass aroundfunctioneffect badge">
        <img class="effectposition arounddataeffect03 circle-turn" src="@/assets/images/aroundeffect.png" />
        <div class="effectposition acrossremindeffectout acrossremindeffectoutard">
          <div class="acrossremindeffectin acrossremindeffectinard"></div>
        </div>
        <img class="effectposition sign" src="@/assets/images/zonghezhifa.png" />
      </div>

      <div class="circleeffectclass decarround01 circle-left">
        <div class="acrossremindeffectin decarroundin01"></div>
      </div>
      <div class="circleeffectclass decarround01 big-circle-right">
        <div class="acrossremindeffectin decarroundin01"></div>
      </div>
      <div class="circleeffectclass decarround02 small-circle-right">
        <div class="acrossremindeffectin decarroundin02"></div>
      </div>
    </div>
  </div>
</template>
<script >

const changeEnterprise = () => {
  let type =1; //调用函数即可
  if (type) {
    window.location.href = type;
  } else {
    if (process.env.NODE_ENV === "development") {
      window.location.href = "http://localhost:8888/";
      // 开发环境  因为我这里写了配置跨域的重定路径所以是api
      // 只有开发环境才会使用代理跨域，其他环境都是直接访问真实的服务器
    } else if (process.env.NODE_ENV === "production") {
      window.location.href = "https://hg.itrustnow.com";
      // 正式环境 真正的上线网址 不是跨域别名路径,在network不显示
    } else if (process.env.NODE_ENV === "test") {
      // 测试环境
      window.location.href = "https://testhg.itrustnow.com";
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 147px;
  position: relative;
}

.main .acrossremindeffectout {
  width: 35px;
  height: 35px;
  margin: 2px 0 0 -2px;
}

.main .acrossremindeffectin {
  width: 35px;
  height: 35px;
}

.seal {
  left: 61px;
  top: 26px;
}

.phone {
  left: 45px;
  bottom: 12px;
}

.transport {
  right: 102px;
  bottom: 0px;
}

.telephone {
  right: 55px;
  bottom: 37px;
}

.badge {
  right: 72px;
  top: 10px;
}

.circle-turn {
  width: 33px;
  height: 33px;
}

.sign {
  width: 34px;
  height: 34px;
}

.cloud-wrap-image {
  width: 40px;
  height: 40px;
  left: -4px;
  top: -4px;
}

.cloud-wrap {
  width: 17px;
  height: 16.7px;
  left: 7.5px;
  top: 7.5px;
  background-color: #fff;
  border-radius: 50%;
  box-sizing: content-box;
  text-align: center;
  line-height: 16px;
  overflow: hidden;
}

.cloud {
  width: 13px;
  height: 13px;
  margin: 2px 0 0;
}

/*动效栏*/
.flasheffectoutbox {
  width: 100%;
  height: 147px;
  margin: auto;
  background-image: url("~@/assets/images/chain_bg.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 182px;
  position: relative;
  top: -11.5px;
}

.circleeffectclass {
  border-radius: 50%;
  border: rgba(0, 168, 255, 0.6) 1px solid;
  position: absolute;
}

.effectposition {
  position: absolute;
}

.acrossremindeffectout {
  background-color: rgba(0, 126, 255, 0.05);
  border-radius: 50%;
}

.acrossremindeffectoutho {
  background-color: rgba(0, 126, 255, 0.15);
}

.acrossremindeffectin {
  background-color: rgba(0, 126, 255, 0.3);
  border-radius: 50%;
  margin: auto;
}

.acrossremindeffectinho {
  background-color: rgba(0, 126, 255, 0.45);
}

.line {
  position: absolute;
  transform-origin: left;
  animation-iteration-count: infinite;
}

.line2 {
  left: 80px;
  top: 45px;
  width: 0;
  height: 3px;
  transform: rotate(29deg);
  animation: mm2 4s;
  animation-delay: 2s;
  animation-iteration-count: infinite;
  background-image: url("~@/assets/images/linght_ef.png");
  background-repeat: no-repeat;
  background-position: 100%;
}

.line3 {
  left: 75px;
  top: 106px;
  width: 0;
  height: 3px;
  transform: rotate(326deg);
  animation: mm 5s;
  animation-delay: 4s;
  animation-iteration-count: infinite;
  background-image: url("~@/assets/images/linght_ef.png");
  background-repeat: no-repeat;
  background-position: 100%;
}

.line4 {
  left: 179px;
  top: 26px;
  width: 0;
  height: 3px;
  transform: rotate(144deg);
  animation: mm4 3s;
  animation-delay: 3s;
  animation-iteration-count: infinite;
  background-image: url("~@/assets/images/linght_ef.png");
  background-repeat: no-repeat;
  background-position: 100%;
}

.line5 {
  left: 180px;
  top: 86px;
  width: 0;
  height: 3px;
  transform: rotate(189deg);
  animation: mm5 5s;
  animation-delay: 1s;
  animation-iteration-count: infinite;
  background-image: url("~@/assets/images/linght_ef.png");
  background-repeat: no-repeat;
  background-position: 100%;
}

.line6 {
  left: 144px;
  top: 122px;
  width: 0;
  height: 3px;
  transform: rotate(244deg);
  animation: mm6 4s;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  background-image: url("~@/assets/images/linght_ef.png");
  background-repeat: no-repeat;
  background-position: 100%;
}

@keyframes mm {
  0% {
    width: 0;
  }

  100% {
    width: 60px;
  }
}

@keyframes mm2 {
  0% {
    width: 0;
  }

  100% {
    width: 60px;
  }
}

@keyframes mm4 {
  0% {
    width: 0;
  }

  100% {
    width: 70px;
  }
}

@keyframes mm5 {
  0% {
    width: 0;
  }

  100% {
    width: 66px;
  }
}

@keyframes mm6 {
  0% {
    width: 0;
  }

  100% {
    width: 60px;
  }
}

/*主动效*/
.maineffectoutbox {
  border: rgba(0, 168, 255, 0.6) 3px solid;
  width: 40px;
  height: 40px;
  top: 52px;
  left: 109px;

  p,
  span {
    position: absolute;
    top: 14.2px;
    left: 14.2px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    transform: scale(0);
  }

  :hover {

    p,
    span {
      transform: scale(9);
      box-shadow: 0px 0px 1px #009fd9;
    }
  }
}

.maindataeffect {
  width: 36px;
  height: 36px;
  margin: -1px 0 0 -1px;
  animation: scrolleffect 6.5s infinite linear;
}

.maindataspecialeffectct {
  animation: maindataspecialeffect 0.6s forwards;
}

@keyframes scrolleffect {

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes maindataspecialeffect {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/*卫星动效*/
.aroundfunctioneffect {
  width: 35px;
  height: 35px;
}

.acrossremindeffectoutard {
  width: 28px;
  height: 28px;
  margin: 3px 0 0 3px;
}

.acrossremindeffectinard {
  width: 28px;
  height: 28px;
}

.arounddataeffect01 {
  animation: scrolleffectarround01 linear infinite 4s forwards;
}

.arounddataeffect02 {
  animation: scrolleffectarround01 linear infinite 3.8s forwards;
}

.arounddataeffect03 {
  animation: scrolleffectarround01 linear infinite 4.2s forwards;
}

@keyframes scrolleffectarround01 {

  25% {
    transform: rotate(-90deg);
  }

  50% {
    transform: rotate(-180deg);
  }

  75% {
    transform: rotate(-270deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}

/*修饰卫星*/
.decarround01 {
  width: 27px;
  height: 27px;
  cursor: auto;
}

.decarroundin01 {
  width: 23px;
  height: 23px;
  margin: 1px;
  background-color: rgba(0, 126, 255, 0.8);
}

.decarroundin01:hover {
  background-color: rgba(0, 126, 255, 0.9);
}

.circle-left {
  top: 56px;
  left: 10px;
}

.decarround02 {
  width: 22px;
  height: 22px;
  cursor: auto;
}

.decarroundin02 {
  width: 18px;
  height: 18px;
  margin: 1px;
  background-color: rgba(0, 126, 255, 0.7);
}

.decarroundin02:hover {
  background-color: rgba(0, 126, 255, 0.8);
}

.big-circle-right {
  top: 47px;
  right: 32px;
}

.small-circle-right {
  top: 12px;
  right: 15px;
}
</style>
