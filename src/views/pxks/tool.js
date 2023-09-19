import {topicOptions, defineChooseMap} from './config'

export function createImg(img) {
    if (!img) return [];
    const {VUE_APP_BASE_UPLOAD} = process.env
    return img.split(',')?.filter(src => src)?.map(el => `${VUE_APP_BASE_UPLOAD}/${el}`) || []
}


export function createQuesImg(img) {
    if (!img) return [];
    return img.split(',')?.filter(src => src);
}

function filterLevel(questionsDifficultyName) {
    if (questionsDifficultyName == '简单') {
        return 1;
    }
    if (questionsDifficultyName == '中等') {
        return 2;
    }
    if (questionsDifficultyName == '困难') {
        return 3;
    }
}

export function FilteredData(arr) {
    if (!arr?.length) return [];

    return arr?.map(el => {
        const {a, b, c, d, e, f, analysis, analysisImage, themeNameUrl, themeName, themeTypeId} = el;
        // const options = topicOptions.map(el => )
        return {
            ...el,
            level: filterLevel(el.questionsDifficultyName),
            choosechange: false,
            questionTypes: (this.chooseMap || defineChooseMap)?.[themeTypeId] || '',
            topic: { // 题目的文字和图片
                text: themeName,
                img: createQuesImg(themeNameUrl),
                checked: false
            },
            // 选项的文字和图片
            options: topicOptions.map(elm => {
                // const keyName = elm.toLowerCase() // 默认是大写,接口返回了小写
                const img = el[`${elm}image`];
                const text = el[elm];
                if (img || text) {
                    return {
                        text,
                        img: createQuesImg(img),
                        value: elm.toUpperCase()
                    }
                }
                return undefined
            }).filter(el => el),
            // 解析的文字和图片
            analysis: {
                text: analysis,
                img: this.createImg(analysisImage)
            }
        }
    })
}

export default {createImg, FilteredData}
