export function setRem() {
  // console.log('setRem')
  // 基准大小
  const baseSize = 100;
  const baseScale = baseSize / 1920; // 1920的设计图
  let widthScale = window.innerWidth; // 当前窗口的宽度
  const heightScale = window.innerHeight; // 当前窗口的高度
  // 尺寸换算
  const comparedHeight = (widthScale * 1080) / 1920;
  // console.log('heightScale',heightScale)
  // console.log('comparedHeight',comparedHeight)
  // if (heightScale < comparedHeight) {
  //   widthScale = (heightScale * 1920) / 1080;
  // }
  // if (comparedHeight < heightScale) {
  //   heightScale = (widthScale * 1080) / 1920;
  // }
  // 计算实际的rem值,得到该宽度下的相应font-size值,并赋予给html的font-size,
  const rem = widthScale * baseScale;
  if(document.querySelector('.dashboard-body')) {
    document.documentElement.style.fontSize = `${rem}px`;
  } else {
    document.documentElement.removeAttribute("style");
  }  
}


export function htmlSetClass() {
  // console.log('htmlSetClass')
  document.querySelector('html').classList.add('dashboard-body')
}

