// 考试通用的定义
export const SCORE = 100, // 最高分数
    QUANTITY = 100, // 最大题数
    QuestionSettingRules = [
        {label: '不开启', value: 'BKQ-1'},
        {label: '随机抽取题数', value: 'SJC-2'},
        {label: '指定题型随机', value: 'ZDT-3'},
    ],
    topicOptions = ['a', 'b', 'c', 'd', 'e', 'f'],
    defineChooseMap = {1: "单选题", 2: "多选题", 3: "判断题"},
    statusMap = [
        {label: '开启', value: '0'},
        {label: '关闭', value: '1'}
    ]

export default {SCORE, QUANTITY, QuestionSettingRules, topicOptions, defineChooseMap, statusMap}
