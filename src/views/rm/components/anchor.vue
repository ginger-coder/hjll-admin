<template>
    <div class="centent" v-if="list.length!=0">
         <ul class="list" v-for="(item,index) in list" :key="index" @click="changeAnchor(item)">
            <li :class="{active:index+1==active}"><span>{{item.name || null}}</span></li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default:[],
        }
    },
    name:'Anchor',
    data() {
        return {
            active:null,
            scroll: '',
        };
    },
    watch: {
        scroll: function () {
            this.loadSroll()
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        loadSroll(){
            // var sections = document.getElementsByClassName('section');
        },
        changeAnchor(val){
            this.active = val.id
            document.getElementById(val.id).scrollIntoView({ behavior: "smooth", block: 'start'})
            this.$emit('changeAnchor', val)
        }
    }
};
</script>

<style scoped>
.centent{
    position: fixed;
    top:20%;
    right: 3%;
    background: #FAFAFA;
    text-align: center;
    z-index: 100;
    border:1px solid #FAFAFA;
}
li{
    list-style-type: none;
}
.active{
    color: #5674E5; 
}
.list{
    text-align: center;
    font-size: 14px;
    margin: 0 10px;
    padding: 0;
    cursor: pointer;
    color: #333;
    line-height: 40px;
    border-bottom: 1px solid #ddd;
}
.list span{
    display: inline-block;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    padding: 5px 5px;
}
.list:last-child{
    border-bottom: none;
}
</style>
