import Vue from 'vue'
//
// Vue.component('Component', {
//     render: function (createElement) {
//         return createElement('el-input', )
//     },
// })


export default {
    name: 'JsonForm',
    props: {
        schema: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            formValue: {}
        }
    },
    render(createElement, context) {
        const {schema = [], formItem} = this;

        return (
            <el-form>
                {
                    schema.map(el => {
                        const {prop, component, is, props = {}, formItem = {}} = el;

                        return <el-form-item prop={prop} props={formItem} key={prop}>
                            <component {...{is}} key={prop} props={props}>
                                {props.text}
                                {
                                    is === 'el-select' && el?.options?.map(({label, value, ...restOptionProps}) =>
                                        <el-option label={label} value={value} key={value} {...restOptionProps} />)
                                }
                            </component>
                        </el-form-item>
                    })
                }
            </el-form>
        )
    }
}