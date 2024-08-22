import { createApp } from "vue";
import App from "./App.vue";
import store from './store/index.js'

import vGanttChart from "@/components/v-gantt/index";
import "@/style/index.sass";

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

createApp(App)
    .use(ElementPlus)
    .use(store)
    .use(vGanttChart)
    .mount('#app')