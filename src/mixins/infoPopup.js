import { deepClone } from "@/utils"
import utilMixin from "@/mixins/util"
import { BASE_URL } from '@/config'

export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        perOperate:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            isShow: false,
            info: {},
            id: '',
        }
    },
    created() {
        let that = this;

        window.addEventListener('resize', function() {
            that.$refs.infoBodyScroll && that.$refs.infoBodyScroll.update()
        })
    },
    mixins: [utilMixin],
    methods: {
        openPopup(info) {
            let that = this;
            info=info || {};
            if(info.value1) info.value1=BASE_URL+info.value1;
            if(info.pic) info.pic=BASE_URL+info.pic;
            if(info.video) info.video=BASE_URL+info.video;
            info.pics.map(item => {
                item=BASE_URL+item
            })

            that.isShow = true;

            that.info = deepClone(info || that.default)

            that.id = info.id || '';

            // 打开dialog后自定义操作
            that.openPopupAfter && that.openPopupAfter()
        },
        closePopup() {
            let that = this;
            that.isShow = false;

            that.info = {}
        }
    }
}