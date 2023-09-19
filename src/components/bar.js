import * as echarts from 'echarts';

const option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'none'
        }
    },
    xAxis: {
        axisLabel: {interval: 0},
        axisLine: {
            lineStyle: {
                color: 'E9E9E9',
                width: 1 // x轴线的宽度
            }
        },
        axisTick: {
            alignWithLabel: true
        },
        data: [],
    },
    grid: {
        left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true
    },
    yAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#999'
        }
    },
    series: [
        {
            type: 'bar',
            barWidth: 20,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#8CA4FD'},
                    {offset: 0.8, color: '#4F6CD8'},
                    {offset: 1, color: '#4F6CD8'}
                ]),
                barBorderRadius: [10, 10, 0, 0]
            },
            data: []
        }
    ]
};
export {option}
