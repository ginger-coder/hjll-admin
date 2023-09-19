<template>
    
</template>

<script>
  import { queryMessagePCPop } from "@/api/message"

  const {VUE_APP_BASE_URL, VUE_APP_BASE_API} = process.env;
    export default {
        data() {
            return {
                webSocket: null,
                url: VUE_APP_BASE_URL,
                time:null,
                messageData:null,
                types: ''
            }
        },
        methods: {
            getmsg(){
                queryMessagePCPop({
                    messageType:2,
                    userType:2,
                    userId:localStorage.getItem('adminUserId')
                }).then((res)=>{
                    if(res.code == 0){
                        let flag = res.data.createTime
                        if(flag){
                            this.messageData = res.data
                            this.$notify({
                            title: '通知',
                            dangerouslyUseHTMLString:true,
                            title: "提示",
                            duration:5000,
                            message: `<p>${res.data.messageContent}<span style="color:#0066ff;cursor:pointer" id="messageTrack">请点击处理</span>！</p>`,
                            position: 'bottom-right'
                        });
                        }
                       
                    }
                })
            },
            // 建立连接
            initSocket() {
                // 有参数的情况下：
                let url = `ws:${this.url}/${this.types}`
                // 没有参数的情况:接口
                this.webSocket = new WebSocket(url)
                this.webSocket.onopen = this.webSocketOnOpen
                this.webSocket.onclose = this.webSocketOnClose
                this.webSocket.onmessage = this.webSocketOnMessage
                this.webSocket.onerror = this.webSocketOnError

            },
            // 建立连接成功后的状态
            webSocketOnOpen() {
                console.log('websocket连接成功');
            },
            // 获取到后台消息的事件，操作数据的代码在onmessage中书写
            webSocketOnMessage(res) {
                // res就是后台实时传过来的数据
                console.log(res);
                this.$notify({
                    title: '通知',
                    dangerouslyUseHTMLString:res?false:true,
                    title: "提示",
                    duration:5000,
                    message:'<p>巡检工单GD-jajfla,<span style="color:#0066ff;cursor:pointer">请点击处理</span>！</p>',
          position: 'bottom-right'
                });
                 //给后台发送数据
                this.webSocket.send("发送数据");
            },
            // 关闭连接
            webSocketOnClose() {
                this.webSocket.close()
                console.log('websocket连接已关闭');
            },
            //连接失败的事件
            webSocketOnError(res) {
                console.log('websocket连接失败');
                // 打印失败的数据
                console.log(res);
            },
            // 消息详情跳转
            skip(){
                // this.messageData
                console.log(111)
            }
        },
        mounted () {
            document.addEventListener('mouseup', (e) => {let _track = document.getElementById('messageTrack');if (_track) {if (_track.contains(e.target)) {this.skip();}}});
        },
        created() {
            this.time = setInterval(()=>{
                this.getmsg()
            },60000)
            // this.initSocket()
        },
        destroyed() {
            clearInterval(this.time)
            this.time = null
            // 页面销毁关闭连接
            this.webSocket.close()
        },
    }
</script>