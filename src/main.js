import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

// import createReport from 'docx-templates';
// Object.definePrototype(Vue.prototype, '$createReport', {
//   value: createReport
//   // get() { return createReport}
// });

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app');

