
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import { createPinia } from 'pinia';
import 'element-plus/dist/index.css'

import 'animate.css';
import '@/styles/global.css';

import IconBalanceHistory from './views/images/svg/IconBalanceHistory.vue';

const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('IconBalanceHistory',IconBalanceHistory);

app.use(ElementPlus, {
  locale: zhCn,
});
app.use(pinia)
app.use(router)
app.mount('#app')
