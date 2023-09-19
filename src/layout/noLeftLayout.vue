<template>
    <!-- device级别高于layoutType -->
    <div :class="classObj" class="app-wrapper">
        <!-- 综合布局 -->
        <template>
            <topNavbar/>
            <!-- <div :class="{hasTagsView:needTagsView}" class="main-container"> -->
                <!-- <div class="layout-header" :class="{'fixed-header':fixedHeader}"> -->
                <!-- </div> -->
                <!-- <org-user-main /> -->
            <!-- </div> -->
            <router-view/>
        </template>
    </div>
</template>
<script>
    import {topNavbar} from './components'
    import ResizeMixin from './mixin/ResizeHandler'

    export default {
        data() {
            return {
            }
        },
        components: {
            topNavbar,
        },
        mixins: [ResizeMixin],
        computed: {
            layoutType() {
                return this.$store.state.settings.layout
            },
            sidebar() {
                return this.$store.state.app.sidebar
            },
            device() {
                return this.$store.state.app.device
            },
            fixedHeader() {
                return this.$store.state.settings.fixedHeader
            },
            needTagsView() {
                console.log(this.$store.state.settings.tagsView);
                return this.$store.state.settings.tagsView
            },
            classObj() {
                return {
                    ['theme_LB']: true,
                    openSidebar: this.sidebar.opened,
                    withoutAnimation: false,
                    hasTagsView: this.needTagsView,
                    fixedHeader: this.fixedHeader,
                    ['horizontal-sidebar']: true
                }
            }
        },
        watch: {
            'device': {
                handler() {
                    if (this.device == 'mobile') this.$store.dispatch('app/changeHamburger', true)
                }
            },
            'classObj': {
                handler() {
                    this.bodyAddClassName()
                },
                deep: true
            }
        },
        created() {
            this.bodyAddClassName()
        },
        methods: {
            bodyAddClassName() {
                let that = this;

                let className = document.querySelector('body').className.split(' ')
                className.map(item => {
                    if (item.search('theme_') == 0) {
                        document.querySelector('body').className = className.filter(class1 => item != class1)
                    }
                })
                document.querySelector('body').classList.add('theme_' + that.$store.state.settings.sTheme)
            },
            handleClickOutside() {
                this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
            },

        }
    }
</script>
<style lang="scss" scoped>
    @import "~@/styles/mixin.scss";
    @import "~@/styles/variables.scss";

    .app-wrapper {
        @include scrollbar;
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;

        &.mobile.openSidebar {
            position: fixed;
            top: 0;
        }
    }

    .drawer-bg {
        background: #000;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 1000;
    }

    .layout-header {
        box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9;
        transition: width 0.28s;
    }

    .comprehensive-sidebar:not(.mobile) .layout-header.fixed-header,
    .horizontal-sidebar:not(.mobile) .layout-header.fixed-header {
        top: $topBarHeight;
    }

    .hideSidebar .layout-header {
        width: calc(100% - 54px)
    }

    .mobile .layout-header {
        width: 100%;
    }
</style>