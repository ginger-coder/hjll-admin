import {filterTime} from "@/utils/comSelect";

const date = (now) => {
    const res = [];
    const base = new Date().setHours(10, 0, 0, 0);
    if (!now) {
        now = new Date(base + 7 * 60 * 60 * 1000 + 1800 * 1000)
    }

    if (now instanceof Date) {
        while (now >= new Date(base)) {
            const h = now.getHours();
            const m = now.getMinutes();
            const hour = h < 10 ? '0' + h : h;
            const minute = m < 30 ? '00' : m;
            res.unshift(hour + ':' + minute);
            now = new Date(now - 30 * 60 * 1000)
        }
    }
    return res.splice(0, 48)
}
const option = {
    tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffffAA',
        shadowBlur: 20,
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffsetX: 10,
        shadowOffsetY: 20,
        borderRadius: 4,
        borderWidth: 0,
        textStyle: {
            color: '#666',
            fontSize: 14
        },
        formatter: (params) => {
            let str = filterTime(new Date(), 'yyyy-MM-DD') + " " + params[0].name + "</br>";
            params.forEach(item => {
                str += item.marker + " " + item.seriesName + ":  " + item.value + "</br>"
            })
            return str
        }
    },
    color: ['#46B1EA', '#4F6CD8'],
    legend: {
        data: ['交易额', '工单量'],
        itemHeight: 0,
    },
    grid: {
        left: '3%', right: '4%', bottom: '3%', containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {interval: 0},
        axisLine: {
            lineStyle: {
                color: 'E9E9E9',
                width: 1 // x轴线的宽度
            }
        },
        data: date(),
    },
    yAxis: {
        type: 'value',
        axisLine: {
            show: false
        },
        axisTick: {
            "show": false
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: ['#E9E9E9'],
                width: 1,
                type: 'dashed'
            }
        }
    },
    series: [{
        name: '交易额',
        type: 'line',
        smooth: true,
        data: [],
        focusNodeAdjacency: true,
        symbolSize: 0,
        lineStyle: {
            width: 2, // 线条粗细
            shadowOffsetY: 10, // 阴影线条的偏移量
            shadowColor: '#46B1EA33' // 阴影线条的颜色
        }
    }, {
        name: '工单量',
        type: 'line',
        smooth: true,
        data: [],
        focusNodeAdjacency: true,
        symbolSize: 0,
        lineStyle: {
            width: 2, // 线条粗细
            shadowOffsetY: 10, // 阴影线条的偏移量
            shadowColor: '#4F6CD833' // 阴影线条的颜色
        }
    }]
};

export {option}
