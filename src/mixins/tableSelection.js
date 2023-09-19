
export default {
    data() {
        return {
            tableSelectionIds: [],
            tableAllSelection:[],
            selectIds:[]
        }
    },
    methods: {
        getRowKey(row) {
            return row.id;
        },
        // 表格复选框
        handleSelectionChange: function(val) {
            let that = this;

            let ids = [];
            val.map(function(item) {
                ids.push(item.id);
            });
            ids = [...new Set(ids)];

            let sels = [];

            ids.map(function(item) {
                sels.push(item);
            });
            that.tableSelectionIds = sels;
            that.selectIds = sels;
            that.filterTableSelection();
        },
        cell_click: function(row) {
            let that = this;

            that.$refs.lists.toggleRowSelection(row);
            that.filterTableSelection();
        },
        // 清空已选项
        handleSelectionClear: function() {
            let that = this;
            that.$refs.lists.clearSelection();
            that.selectIds = []
            that.filterTableSelection();

            that.handleSelectionClearAfter&&that.handleSelectionClearAfter()
        },
        // 获取table已选项
        filterTableSelection(){
            let that=this;

            let arr=[];
            if (that.$refs.lists) arr = that.$refs.lists.selection || [];
            
            that.selectIds = [...new Set(that.selectIds.concat(that.tableSelectionIds))]
            
            // console.log(that.selectIds);
            
            that.tableAllSelection=arr;
            
        },
    }
}