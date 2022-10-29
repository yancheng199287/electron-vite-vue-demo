import {createApp} from 'vue'
import App from './App.vue'
import './samples/node-api'

import mitt from "mitt"


import ElementPlus from 'element-plus';
import * as ElementIconVue from '@element-plus/icons-vue';

import store from './store'

import ConfirmDeleteComponent from './components/global/ConfirmDeleteComponent'


const app = createApp(App)

// 使用事件总线
app.config.globalProperties.$mitt = mitt()

// 使用element 组件
app.use(ElementPlus)

// 添加所有的ICON
for (const name in ElementIconVue) {
    app.component(name, (ElementIconVue as any)[name])
}

// 使用 pina 插件
app.use(store)

// 全局删除确认组件框
app.use(ConfirmDeleteComponent)

// 挂载
app.mount('#app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    })
