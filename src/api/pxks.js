import request from "./request";

export function tklist(data) {
    return request({
        url: "/itembank/question-bank/page",
        method: "get",
        params: data,
    });
}

export function tkadd(data) {
    return request({
        url: "/itembank/question-bank/save",
        method: "post",
        data,
    });
}

export function tktypelist(data) {
    return request({
        url: "/itembank/question-bank-type/page",
        method: "get",
        params: data,
    });
}

// 20230423 新的试卷分类
export function test_paper_type(data) {
    return request({
        url: "/system/dict/types/test_paper_type/items",
        method: "get",
        params: data,
    });
}

export function tkdel(data) {
    return request({
        url: `/itembank/question-bank/${data}`,
        method: "delete",
    });
}
// 删除试卷
export function deleteTestPager(data) {
    return request({
        url: `/itembank/test-paper/${data}`,
        method: "delete",
    });
}

// 删除试卷下题目
export function deleteTestPagerQuestion(data) {
    return request({
        url: `/itembank/theme-test-paper/delete`,
        method: "post",
        data
    });
}

// 保存备选至试卷
export function themeTestPagerAltSave(data) {
    return request({
        url: `/itembank/theme-test-paper-alternate/save`,
        method: "post",
        data
    });
}

export function sttypelist(data) {
    return request({
        url: "/itembank/theme-type/page",
        method: "get",
        params: data,
    });
}

export function themeadd(data) {
    return request({
        url: "/itembank/theme/save",
        method: "post",
        data,
    });
}

export function themePage(data) {
    return request({
        url: "/itembank/theme/page",
        method: "get",
        params: data,
    });
}

export function deltheme(data) {
    return request({
        url: `/itembank/theme/${data}`,
        method: "delete",
    });
}

// 试题详情
export function themedetail(id, url = '/itembank/theme/detail') {
    return request({
        url,
        method: "get",
        params: id,
    });
}

// 试题统计接口
export function countType(id) {
    return request({
        url: `/itembank/theme/count/themeType`,
        method: "get",
        params: id,
    });
}

// 试题修改
export function updatetheme(data) {
    return request({
        url: "/itembank/theme/update",
        method: "post",
        data,
    });
}

// 试卷管理列表
export function testpaper(data) {
    return request({
        url: "/itembank/test-paper/page",
        method: "get",
        params: data,
    });
}

// 试卷删除校验
export function testPaperCheck(data) {
    return request({
        url: "/itembank/test-paper/check",
        method: "get",
        params: data,
    });
}
// 题库删除校验
export function questionBankCheck(data) {
    return request({
        url: "/itembank/question-bank/check",
        method: "get",
        params: data,
    });
}

// 新增试卷
export function addtest(data) {
    return request({
        url: "/itembank/test-paper/save",
        method: "post",
        data,
    });
}

// 试卷删除
export function deltest(data) {
    return request({
        url: `/itembank/test-paper/${data}`,
        method: "delete",
    });
}

// 试卷设置
export function savetest(data) {
    return request({
        url: "/itembank/test-paper-set/save",
        method: "post",
        data,
    });
}


// 试卷顶部设置
export function savepapertop(data) {
    return request({
        url: "/itembank/test-paper/update",
        method: "post",
        data,
    });
}
export function savepapertopStatus(data) {
    return request({
        url: "/itembank/test-paper/update/status",
        method: "post",
        data,
    });
}

// 试卷题材列表
export function sjtclist(data) {
    return request({
        url: "/itembank/test-paper-theme/page",
        method: "get",
        params: data,
    });
}

// 试卷题材列表
export function getTestPagerInfo(params) {
    return request({
        url: "/itembank/test-paper/detail",
        method: "get",
        params,
    });
}
// 试卷下所有题目
export function getTestPagerQuestionList(params) {
    return request({
        url: "/itembank/theme-test-paper/list",
        method: "get",
        params,
    });
}
// 试卷下所有题目
export function testPagerUpdateStatus(data) {
    return request({
        url: "/itembank/test-paper/updateStatus",
        method: "post",
        data,
    });
}

// 新增试卷题材题
export function addsjtc(data) {
    return request({
        url: "/itembank/test-paper-theme/save",
        method: "post",
        data,
    });
}

// 试卷题材管理表删除
export function delsjtc(id) {
    return request({
        url: `/itembank/test-paper-theme/${id}`,
        method: "delete",
    });
}

// 试卷分数统计
export function sjtctj(id) {
    return request({
        url: "/itembank/test-paper-theme-score/countThemeType",
        method: "get",
        params: id,
    });
}

// 试卷各分新增
export function scoresave(data, saveType = 'save') {
    return request({
        url: `/itembank/test-paper-theme-score/${saveType}`,
        method: "post",
        data,
    });
}

export function test_paper_rule_detail(testPaperId) {
    return request({
        url: `/itembank/test_paper_rule/detail`,
        method: "get",
        params: {testPaperId},
    });
}

// 20230423 试卷保存
export function test_paper_rule(data) {
    return request({
        url: `/itembank/test_paper_rule/save`,
        method: "post",
        data,
    });
}


// 试卷总分更新
export function scoresupdate(data) {
    return request({
        url: "/itembank/test-paper/update",
        method: "post",
        data,
    });
}

// 获取分数列表
export function getScore(params) {
    return request({
        url: "/itembank/test-paper-theme-score/list",
        method: "get",
        params
    });
}

// 选择人群
export function getcrowd(data) {
    return request({
        url: '/itembank/test-paper/crowd',
        method: 'get',
        params: data
    })
}

// 题库更新试题信息
export function updatetest(data) {
    return request({
        url: '/itembank/theme/update',
        method: 'post',
        data
    })
}

// 试卷更新试题信息
export function testPaperThemeUpdate(data) {
    return request({
        url: '/itembank/test-paper-theme/update',
        method: 'post',
        data
    })
}

// 设置详情
export function settingdetail(id) {
    return request({
        url: `/itembank/test-paper/detail`,
        method: "get",
        params: id
    })
}

// 名称修改
export function xgname(data) {
    return request({
        url: '/itembank/question-bank/update',
        method: "post",
        data
    })
}

// 题库详情
export function tixqname(data) {
    return request({
        url: '/itembank/question-bank/detail',
        method: 'get',
        params: data
    })
}

// 答题记录统计
export function recordtotal(data) {
    return request({
        url: "/itembank/answer-theme-record/queryRecord",
        method: 'get',
        params: data
    });
}

export function ranking(data) {
    return request({
        url: "/itembank/answer-theme-record/ranking",
        method: 'get',
        params: data
    });
}

export function record(data) {
    return request({
        url: "/itembank/answer-theme-record/record",
        method: 'get',
        params: data
    });
}

export function themeAnalysis(data) {
    return request({
        url: "/itembank/answer-theme-record/themeAnalysis",
        method: "get",
        params: data,
    });
}

// 题库分类 20230423 之前
export function QuestionBankTypeList(params) {
    return request({
        url: "/itembank/question-bank-type/list",
        method: "get",
        params,
    });
}

// 题库分类 20230423 之后
export function question_bank_type(params) {
    return request({
        url: "/system/dict/types/question_bank_type/items",
        method: "get",
        params,
    });
}

export function questionBankList(params) {
    return request({
        url: "/itembank/question-bank/list",
        method: "get",
        params,
    });
}
export function themeQuestionDelete(data) {
    return request({
        url: "/itembank/theme-questionbank/delete",
        method: "post",
        data,
    });
}

export function onBatchSave(params) {
    return request({
        url: `/itembank/theme/batch/save`,
        method: "get",
        params
    });
}

export function otherQuestionSave(data) {
    return request({
        url: `/itembank/theme-questionbank-alternate/save`,
        method: "post",
        data
    });
}
// 查看备选题
export function otherQuestionList(params) {
    return request({
        url: `/itembank/theme-questionbank-alternate/page`,
        method: "get",
        params
    });
}

// 试卷查看备选题
export function otherTestPagerList(params) {
    return request({
        url: `/itembank/theme-test-paper-alternate/page`,
        method: "get",
        params
    });
}
// 删除备选题
export function otherQuestionDelete(data) {
    return request({
        url: `/itembank/theme-questionbank-alternate/delete`,
        method: "post",
        data
    });
}
// 试卷删除备选题
export function otherTestPagerDelete(data) {
    return request({
        url: `/itembank/theme-test-paper-alternate/delete`,
        method: "post",
        data
    });
}

// 试卷查看备选题
export function testPagerBatchSave(params) {
    return request({
        url: `/itembank/theme-test-paper/batch/save`,
        method: "get",
        params
    });
}

export function saveTestTopic(testPaperId, data) {
    if (!testPaperId) return false;
    return request({
        url: `/itembank/test-paper-theme/save/list/${testPaperId}`,
        method: "post",
        data
    });
}

// 培训首页搜索接口
export function indexSearch(data) {
    return request({
        url: "/itembank/user-grade/trainHomeTop",
        method: "post",
        data
    });
}

// 培训echarts图接口
export function echartsSearch(data) {
    return request({
        url: "/itembank/user-grade/trainHomeBase",
        method: "post",
        data
    });
}

export function exportFile(params) {
    return request({
        url: "/itembank/theme/excel/themeList",
        method: "get",
        params,

    });
}

export function importTheme(data) {
    return request({
        url: "/itembank/theme/import/theme",
        method: "post",
        data,
    }, {
        headers: {
            "Content-Type:": 'multipart/form-data'
        }
    });
}

export function exportTemplate() {
    return request({
        url: "/itembank/theme/excel/template",
        method: "get",
    });
}

export function randomSaveList2(id, data = []) {
    return request({
        url: `/itembank/test-paper-theme/randomSave/list/${id}`,
        method: "post",
        data
    });
}

export function work_role_page(params) {
    return request({
        url: `/user/work-role/page`,
        method: "get",
        params
    });
}

/**
 * 学习记录
 */

// 学习数据
export function learnStudyData(data) {
    return request({
        url: `/itembank/learning-record/studentData`,
        method: "post",
        data
    });
}

// 课程数据
export function learnStudyCourseData(params) {
    return request({
        url: `/itembank/learning-record/studentData/course`,
        method: "get",
        params
    });
}
// 课件数据
export function learnStudyCourseBookData(params) {
    return request({
        url: `/itembank/learning-record/studentData/course/courseware`,
        method: "get",
        params
    });
}
// 考试数据
export function learnStudyExamData(params) {
    return request({
        url: `/itembank/learning-record/studentData/exam`,
        method: "get",
        params
    });
}
// 练习数据
export function learnStudyExerciseData(params) {
    return request({
        url: `/itembank/learning-record/studentData/exercise`,
        method: "get",
        params
    });
}
// 课程数据分页
export function learnStudyRecordCourseData(params) {
    return request({
        url: `/itembank/learning-record/courseData`,
        method: "get",
        params
    });
}
// 课件分析
export function learnStudyRecordCourseBookData(params) {
    return request({
        url: `/itembank/learning-record/courseData/courseContent`,
        method: "get",
        params
    });
}
// 课件分析详情
export function learnStudyRecordCourseDeatilData(params) {
    return request({
        url: `/itembank/learning-record/courseData/courseContent/detail`,
        method: "get",
        params
    });
}
// 人员分析
export function learnStudyRecordCourseMemberData(params) {
    return request({
        url: `/itembank/learning-record/courseData/member`,
        method: "get",
        params
    });
}
// 人员分析详情
export function learnStudyRecordCourseMemberDetailData(params) {
    return request({
        url: `/itembank/learning-record/courseData/member/detail`,
        method: "get",
        params
    });
}
