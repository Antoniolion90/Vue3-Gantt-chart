import gantt from "./gantt.vue";

gantt.version = "__VERSION__";
gantt.install = function (Vue) {
    Vue.component("v-gantt-chart", gantt);
};

if (typeof window !== "undefined" && window.Vue) {
    window.Vue.use(gantt);
}

export default gantt;
// export const vGanttChart = gantt;
