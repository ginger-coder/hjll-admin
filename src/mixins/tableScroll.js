import variables from "@/styles/variables.scss"
export default {
    created(){
        let that=this;

        that.$nextTick(() => {
            let tables=document.querySelectorAll('.el-table--scrollable-x')
            for (let i=0;i<tables.length;i++){
                let item=tables[i];
                // if(item.querySelector('.el-table__body-wrapper')) item.querySelector('.el-table__body-wrapper').style.overflowX='hidden'
            }
        })
    },
    methods: {
        tableShowSummaryFilter(ref, list) {
            let that = this;
            // return;

            let dom = that.$refs[ref]

            if (!dom) return;
            // console.log(dom)
            let bodyWrapper = dom.$refs.bodyWrapper
            let fixedWrapper = dom.$refs.fixedWrapper
            let rightFixedWrapper = dom.$refs.rightFixedWrapper
            let footerWrapper = dom.$refs.footerWrapper
            let domMaxHeight = dom.$el.style.maxHeight.replace('px', '')
            // console.log('dom.maxHeight',domMaxHeight)
            // if((fixedWrapper||rightFixedWrapper)&&footerWrapper){
            // 	// console.log('???')
            // 	if(dom.$el.querySelector('.el-table--scrollable-x .el-table__body-wrapper')) dom.$el.querySelector('.el-table--scrollable-x .el-table__body-wrapper').style.overflowX='hidden'
            // } else {
            //     if(dom.$el.querySelector('.el-table--scrollable-x .el-table__body-wrapper')) dom.$el.querySelector('.el-table--scrollable-x .el-table__body-wrapper').style.overflowX='auto'
            // }
            setTimeout(() => {
                let headerWrapperHeight=0;
                if(dom.$refs.headerWrapper){
                    headerWrapperHeight = getComputedStyle(dom.$refs.headerWrapper).height.replace('px', '')
                    that.tableHeadFootHeight = Number(headerWrapperHeight);
                }
                // console.log('dom.headerWrapper.height',headerWrapperHeight)
                let footerWrapperHeight = 0;
                if (footerWrapper) {
                    footerWrapperHeight = getComputedStyle(dom.$refs.footerWrapper).height.replace('px', '')
                    if (footerWrapperHeight > 0) that.tableHeadFootHeight += Number(footerWrapperHeight);
                }
          //       if(that.getTableMaxHeight) that.getTableMaxHeight();
          //       if (!footerWrapper) return;
          //       if (bodyWrapper) {
          //           // console.log('dom.footerWrapper.height',footerWrapperHeight)
          //           let bodyMaxHeight = Number(domMaxHeight) - Number(headerWrapperHeight) - Number(footerWrapperHeight)
          //           // console.log('bodyMaxHeight',bodyMaxHeight)
          //           let length = list.length;
          //           if (length == 0) return;
          //           let row = dom.$refs.bodyWrapper.querySelector('table').querySelector('tbody').querySelectorAll('.el-table__row')[length - 1]
          //           let paddingBottom = getComputedStyle(row.querySelectorAll('td')[0])['padding-bottom'].replace('px', '');
          //           let paddingBottom2 = `${Number(paddingBottom)+Number(variables.scrollBarWidth.replace('px',''))}px`

          //           if (fixedWrapper) {
          //               for (let i=0;i<length;i++){
          //                   let rowb=dom.$refs.fixedBodyWrapper.querySelector('table').querySelector('tbody').querySelectorAll('.el-table__row')[i];
          //                   let rowtd = rowb.querySelectorAll('td')
          //                   for (let j = 0; j < rowtd.length; j++) {
          //                       rowtd[j].style.paddingBottom = (i==length-1)?paddingBottom2:''
          //                   } 
          //               }
                        
          //               // dom.$refs.fixedBodyWrapper.style.background=`red`
          //               dom.$refs.fixedBodyWrapper.style.maxHeight = `${bodyMaxHeight}px`
          //           }
          //           if (rightFixedWrapper) {
          //               for (let i=0;i<length;i++){
          //                   let rowb=dom.$refs.rightFixedBodyWrapper.querySelector('table').querySelector('tbody').querySelectorAll('.el-table__row')[i];
          //                   let rowtd = rowb.querySelectorAll('td')
          //                   for (let j = 0; j < rowtd.length; j++) {
          //                       rowtd[j].style.paddingBottom = (i==length-1)?paddingBottom2:''
          //                   } 
          //               }
          //               // dom.$refs.rightFixedBodyWrapper.style.background=`red`
          //               dom.$refs.rightFixedBodyWrapper.style.maxHeight = `${bodyMaxHeight}px`
          //           }
          //       }
        		// if(dom.$el.querySelector('.el-table--scrollable-x .el-table__body-wrapper')) dom.$el.querySelector('.el-table--scrollable-x .el-table__body-wrapper').style.overflowX='auto'
            })
        },
    }
}