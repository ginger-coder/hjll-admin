<template>
    <div class="avatar-box" :style="avatarStyle">
        <template v-if="path">
            <img :src="path" alt="">
        </template>
        <template>
            {{str}}
        </template>
    </div>
</template>
<script>
import pinyin from 'js-pinyin'
import variables from '@/styles/variables.scss'
export default {
    props: {
        path:{
            default:'',
            type:String
        },
        // color:{
        //     default:variables.mcolor,
        //     type:String
        // },
        text: {
            default: '',
            type: String
        },
        scale: {
            default: 1,
            type: Number
        }
    },
    data(){
        return {
            color:variables.mcolor,
            colorLists:[ '#14C9C9', '#784AFA', '#FF7D00', '#7BC616', '#3370ff'],
            keyword:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        }
    },
    computed: {
        str() {
            return this.text.substr(this.text.length - 2)
        },
        avatarStyle(){

            let firstWord = pinyin.getCamelChars(this.text.substr(0,1))
            if (firstWord) {
                let index = this.keyword.findIndex(function(item){
                    return item  === firstWord
                })
                if (index !=-1) {
                    this.color = this.colorLists[index % 5]           
                }
            }
        	return {
        		transform:`scale(${this.scale})`,
                marginLeft:`-${(32*(1-this.scale))/2}px`,
        		marginRight:`-${(32*(1-this.scale))/2}px`,
                backgroundColor: this.path?'transparent':this.color
        	}
        }
    }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";


.avatar-box {
    display:inline-block;
    background-color: $mcolor;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    color: #fff;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 500;
    overflow:hidden;

    img{
        width:100%;
        height:100%;
        vertical-align: top;
    }
}
</style>