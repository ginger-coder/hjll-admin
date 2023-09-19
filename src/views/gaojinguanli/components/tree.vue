<template>
    <el-tree
        ref="tree"
        class="tree-box"
        :data="treeData"
        @check-change="handleCheckChange"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
        :props="defaultProps"/>
</template>

<script>
import { getTree} from '@/api/caution'
export default {
    name:'tree',
    data() {
        return {
            treeData: [],
            tags:[],
            checked:null,
            tenantUserId:'',
            defaultProps: {
                children: 'children',
                label: 'label'
            }
    }
    },
    created() {
        this.getTreeData()
    },
    mounted() {
    
    },
    methods: {
        handleCheckChange (data, checked) {
            // this.tags.push(data.id)
            // //获取所有选中的节点id
            // this.tenantUserId = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
            // this.checked = checked
            // // 该节点未选中的时候
            // for (var i = 0; i <= this.tags.length; i++) {
            //     if (this.checked == false) {
            //         this.tags.splice(this.tags.indexOf(this.i), 1)
            //     }
            // }
            // this.$emit('handleCheckChange', this.tenantUserId)
            // 获取选中的子节点
            let checkedKeys = this.$refs.tree.getCheckedKeys();
            this.$emit('handleCheckChange', checkedKeys)
        },
        // 请求树结构接口
        getTreeData(){
            getTree({}).then((res)=>{
                if(res.code==0){
                    this.treeData = res.data
                }else{
                    this.$message.error('请求接口报错');
                }
                
            }) 
        }
    }
};
</script>

<style scoped lang="scss">
.tree-box{
    padding: 10px;
    height: 100%;
    width: 200px;
    min-height: 200px;
}
</style>
