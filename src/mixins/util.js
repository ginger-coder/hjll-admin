import { BASE_API, BASE_URL } from '@/config'
import { param2Obj, parseTime, amount_format, fileDownload } from "@/utils";

export default {
    computed: {
        // 金额格式化
        amountFormat() {
            return (val) => {
                return amount_format(val)
            }
        },
        timToTime() {
            return (val) => {
                let date = '';
                if (val) date = parseTime(val, '{y}-{m}-{d} {h}:{i}:{s}')
                return date
            }
        },
        timToDate() {
            return (val) => {
                let date = '';
                if (val) date = parseTime(val, '{y}-{m}-{d}')
                return date
            }
        },
        // dict处理
        filterDictLabel() {
            return (list, val) => {
                let label = '';
                list = list || [];

                if (val === '' || val === undefined || val === null || val === NaN) label = '';
                else if (list.length > 0) {
                    let find = list.find(row => row.value === val) || {}
                    label = find.label || find.name || ''
                }

                return label;
            }
        },
        percentFloat() {
            return (val) => {
                let num = '-';
                if (val) num = val;
                return num
            }
        },
        // url获取参数
        urlParam2Obj() {
            return (val) => {
                return param2Obj(val)
            }
        }

    },
    methods: {
        filterCascaderData(data) {
            data = data || [];
            let that = this;
            let arr = [];

            data.map(item => {
                if (item.rootId) {
                    let parent = data.find(row => row.value == item.rootId) || {}
                    if (parent && parent.value) {
                        parent.children = parent.children || [];
                        parent.children.push(item)
                        that.$delete(data, item)
                    } else {
                        arr.push(item)
                    }
                } else {
                    arr.push(item)
                }
            })

            return arr;
        },
        // tree结构 find  ids
        treeDataFindRoots(treeData, id) {
            let that = this;

            let temp = []
            treeData = treeData || []
            if (!id) return temp

            let rootData = [];

            let forFn = (tree) => {
                for (let i in tree) {
                    let item = tree[i];
                    rootData.push({ label: item['name'], value: item['id'], id: item['id'], rootId: item['parentId'] });
                    if (item.children) {
                        forFn(item.children);
                    }
                }
            }
            forFn(treeData);
            
            temp = that.dataFindRoots(rootData, id)
            return temp
        },
        // array结构 find  ids
        dataFindRoots(data, id) {
            data = data || []

            let temp = []
            if (!id) return temp

            let forFn = (id) => {
                let find = data.find(item => item.id == id);
                if (find) {
                    temp.unshift(find.id)
                    if (find.rootId) forFn(find.rootId)
                }
            }
            forFn(id)
            return temp
        },
    }
}