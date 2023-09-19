<template>
    <el-tree
        ref="tree"
        class="tree-box"
        :data="treeData"
        node-key="id"
        @node-click="handleCheckChange"
        :current-node-key="node"
        highlight-current
        default-expand-all
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
        :filter-node-method="filterNode"
        :props="defaultProps"/>
</template>

<script>
import { getDept} from '@/api/message'
export default {
    name:'tree',
    data() {
        return {
            filterText:'',
            node:'',
            treeData: [],
            tags:[],
            checked:null,
            tenantUserId:'',
            defaultProps: {
                children: 'childArea',
                label: 'name'
            }
    }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
        this.getTreeData()
    },
    mounted() {
      
    },
    methods: {
        refresh(){
          // this.getTreeData()
          this.$emit('refresh', null)
          
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        handleCheckChange (e, node) {
          if(e.label !== undefined){
            //此处为条件成立后的代码
          }
          //或者只能点击最后一级
          if(node.childNodes.length == 0){
            //除了最后一级其他节点disabled都为true,不可点击
            this.node = e.id
          }
          this.$emit('handleCheckChange', this.node)
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
            // let checkedKeys = this.$refs.tree.getCheckedKeys();
            // this.$emit('handleCheckChange', checkedKeys)
        },
        // 请求树结构接口
        getTreeData(){
            getDept({
                status:1,
                keywords:'海久'
            }).then((res)=>{
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
    display: inline-block;
    padding: 10px;
    height: 100%;
    width: 200px;
    padding: 10px;
    height: 100%;
    width: 200px;
    min-height: 200px;
}
  .select-tree {
    background-color: #fff;
    .el-icon-refresh-right {
      cursor: pointer;
      font-size: 20px;
    }
    .selected-ipt {
      ::v-deep {
        .el-input-group__append {
          background-color: transparent;
          border: none;
        }
      }
    }


  }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
    background-color: #5674E5;
  }
</style>
