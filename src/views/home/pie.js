import * as echarts from "echarts";

const option = {
    index: 1,
    tooltip: {
        trigger: 'item'
    },
    color: [
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: '#8CA4FD'
            },
            {
                offset: 0.4,
                color: '#4F6CD8'
            },
            {
                offset: 1,
                color: '#8CA4FD'
            },
        ]),
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: '#7DD2FF'
            },
            {
                offset: 0.4,
                color: '#3CA8E2'
            },
            {
                offset: 1,
                color: '#7DD2FF'
            },
        ]),
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: '#5EE7F3'
            },
            {
                offset: 0.4,
                color: '#35BECB'
            },
            {
                offset: 1,
                color: '#5EE7F3'
            },
        ]),
    ],
    legend: {
        top: '35%',
        left: '55%',
        orient: 'vertical',
        icon: 'circle',
        itemWidth: 8, // 设置宽度
        itemHeight: 8, // 设置高度
        itemGap: 15,
        formatter: (name) => {
            const o = Number.parseFloat(option.series[0].data.filter(item => name === item.name)[0].order) || 0
            const tO = option.series[0].data.map(i => Number.parseFloat(i.order)).reduce((a, b) => a + b);

            const m = Number.parseFloat(option.series[0].data.filter(item => name === item.name)[0].money) || 0
            const tM = option.series[0].data.map(i => i.money).reduce((a, b) => a + b);
            // console.error(option.series[0].data);
            return (option.index === 1 ? [
                '{a|' + name + '}',
                '{b|' + (tM === 0 ? 0 : (m / tM * 100).toFixed(2)) + '%}',
                '{c|¥ ' + m + '}'
            ] : [
                '{a|' + name + '}',
                '{b|' + (tO === 0 ? 0 : (o / tO * 100).toFixed(2)) + '%}',
                '{c|' + o + '}'
            ]).join('');
        },
        textStyle: {
            //图例的样式
            rich: {
                a: {
                    fontSize: 14,
                    width: 60,
                    color: '#0000008A'
                },
                b: {
                    fontSize: 14,
                    width: 70,
                    color: '#0000003A'
                },
                c: {
                    fontSize: 14,
                    color: '#0000008A',
                }
            }
        }
    },
    series: [
        {
            type: 'pie',
            center: ['25%', '50%'],
            radius: ['55%', '70%'],
            avoidLabelOverlap: false,
            labelLine: {
                show: false
            },
            data: [
                {value: 0, name: '巡检'},
                {value: 0, name: '发电'},
                {value: 0, name: '故障'}
            ].map((item, i) => {
                item.label = {
                    show: !!item.value,
                    position: 'outside',
                    padding: [0, -13, 0, -13],
                    formatter: '{d}%',
                    color: ['#4F6CD8', '#3CA8E2', '#5EE7F3'][i]
                }
                return item
            })
        },
        {
            name: '',
            type: 'gauge',
            radius: '30%',
            center: ['25%', '50%'],
            pointer: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            detail: {
                valueAnimation: false,
                width: '60%',
                offsetCenter: [0, '40%'],
                fontSize: 22,
                fontWeight: 'normal',
                formatter: (value) => {
                    let status = option.index === 1
                    const total = option.series[0].data.reduce((prv, cur) => {
                        const val = status ? +(cur?.money) || 0 : +(cur?.order) || 0
                        return prv += val
                    }, 0)
                    return `${status ? '¥': ''} ${Intl.NumberFormat('en-US').format(total)}`;
                },
                color: 'rgba(0,0,0,0.85)'
            },
            data: [
                {
                    value: 0,
                    name: '交易额',
                    title: {
                        show: true,
                        color: 'rgba(255,255,255,0.45)',
                        offsetCenter: [0, '10%'],
                        fontSize: 14,
                        fontWeight: 'normal'
                    }
                }
            ]
        },
    ]
};

export {option}
