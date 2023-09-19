<template>
  <div id="loading" v-show="visible">
    <div class="loader">
      <div class="loader-inner pacman">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "Loading",
  setup() {
    // 控制组件的状态
    let visible = ref(false);

    // 显示组件
    let showLoading = () => {
      visible.value = true;
    };
    // 隐藏组件
    let hideLoading = () => {
      visible.value = false;
    };

    return { visible, showLoading, hideLoading };
  },
});
</script>
<style scoped>
#loading {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
body {
  padding: 100px;
}

.loader {
  min-height: 100px;
}

@-webkit-keyframes rotate_pacman_half_up {
  0% {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg);
  }

  50% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }

  100% {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg);
  }
}

@keyframes rotate_pacman_half_up {
  0% {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg);
  }

  50% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }

  100% {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg);
  }
}

@-webkit-keyframes rotate_pacman_half_down {
  0% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }

  50% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
}

@keyframes rotate_pacman_half_down {
  0% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }

  50% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
}

@-webkit-keyframes pacman-balls {
  75% {
    opacity: 0.7;
  }

  100% {
    -webkit-transform: translate(-100px, -6.25px);
    transform: translate(-100px, -6.25px);
  }
}

@keyframes pacman-balls {
  75% {
    opacity: 0.7;
  }

  100% {
    -webkit-transform: translate(-100px, -6.25px);
    transform: translate(-100px, -6.25px);
  }
}

.pacman {
  position: relative;
}

.pacman > div:nth-child(2) {
  -webkit-animation: pacman-balls 1s 0s infinite linear;
  animation: pacman-balls 1s 0s infinite linear;
}

.pacman > div:nth-child(3) {
  -webkit-animation: pacman-balls 1s 0.33s infinite linear;
  animation: pacman-balls 1s 0.33s infinite linear;
}

.pacman > div:nth-child(4) {
  -webkit-animation: pacman-balls 1s 0.66s infinite linear;
  animation: pacman-balls 1s 0.66s infinite linear;
}

.pacman > div:nth-child(5) {
  -webkit-animation: pacman-balls 1s 0.99s infinite linear;
  animation: pacman-balls 1s 0.99s infinite linear;
}

.pacman > div:first-of-type {
  width: 0px;
  height: 0px;
  border-right: 25px solid transparent;
  border-top: 25px solid #409eff;
  border-left: 25px solid #409eff;
  border-bottom: 25px solid #409eff;
  border-radius: 25px;
  -webkit-animation: rotate_pacman_half_up 0.75s 0s infinite;
  animation: rotate_pacman_half_up 0.75s 0s infinite;
}

.pacman > div:nth-child(2) {
  width: 0px;
  height: 0px;
  border-right: 25px solid transparent;
  border-top: 25px solid #409eff;
  border-left: 25px solid #409eff;
  border-bottom: 25px solid #409eff;
  border-radius: 25px;
  -webkit-animation: rotate_pacman_half_down 0.75s 0s infinite;
  animation: rotate_pacman_half_down 0.75s 0s infinite;
  margin-top: -50px;
}

.pacman > div:nth-child(3),
.pacman > div:nth-child(4),
.pacman > div:nth-child(5) {
  background-color: #409eff;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  margin: 2px;
  width: 10px;
  height: 10px;
  position: absolute;
  -webkit-transform: translate(0, -6.25px);
  -ms-transform: translate(0, -6.25px);
  transform: translate(0, -6.25px);
  top: 25px;
  left: 100px;
}
</style>
