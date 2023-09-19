<template>
    <div class="wscn-http-container">
        <div class="wscn-http-cont">
            <div class="disp_flex ali_cen">
                <div class="disp_flex ali_cen ju_cen wscn-http-pic">
                    <img src="@/assets/404.png" alt="404">
                </div>
                <div class="wscn-http-tips">
                    <div class="wscn-http-tip-code">404</div>
                    <div class="wscn-http-tip-text">抱歉，您访问的页面不存在</div>
                    <el-link :href="href">
                        <el-button type="primary">返回首页</el-button>
                    </el-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
          href: process.env.NODE_ENV=='development'?'':location.origin
        };
    },
}
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.wscn-http-container {
    height: 100vh;

    .wscn-http-cont {
        transform: translate(-50%, -50%);
        position: absolute;
        top: 50%;
        left: 50%;

        .wscn-http-pic {
            width: 500px;
            height: 500px;

            img {
                height: 100%;
                width: 100%;
                object-fit: contain;
            }
        }

        .wscn-http-tips {
            width: 300px;
            padding: 30px 0;
            margin-left: 150px;
            opacity: 0;
            animation-name: slideUp;
            animation-duration: 0.5s;
            animation-fill-mode: forwards;

            .wscn-http-tip-code {
                font-size: 100px;
                color: #000;
            }

            .wscn-http-tip-text {
                font-size: 20px;
                line-height: 70px;
                color: #999;
                font-weight: bold;
                margin-bottom: 10px;
            }
        }
    }
}

@keyframes slideUp {
    0% {
        transform: translateY(60px);
        opacity: 0;
    }

    100% {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>